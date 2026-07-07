import * as achievementRepository from "./achievement.repository.js";
import cloudinary from "../../config/cloudinaryConfig.js";
import { buildBranchFilter } from "../../utils/filter.js";

/* --- Add Achievement (Fixed: Removed Cloudinary file logic) --- */
export const addAchievement = async (body, tenantId) => {
  const { date, roomno, floorno, name, branchName, position } = body;

  let formattedDate;
  if (date.includes("/")) {
    const [dd, mm, yyyy] = date.split("/");
    formattedDate = new Date(`${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`);
  } else {
    formattedDate = new Date(date);
  }

  if (isNaN(formattedDate)) {
    throw new Error("Invalid date format");
  }

  const achievement = await achievementRepository.create({
    date: formattedDate,
    roomno,
    floorno,
    name,
    branchName,
    position,
    tenantId,
    // Photo is left out here. It will default to null in the database.
  });

  return achievement;
};

// Add this new function to upload just the image
export const uploadSingleImage = async (file, branchName) => {
  if (!file) throw new Error("No image file provided");

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: `achievements/${branchName || "Common"}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      )
      .end(file.buffer);
  });
};

/* --- Update Achievement (Handles the Drag & Drop Image safely) --- */
/* --- Update Achievement (Now correctly accepts the Photo URL) --- */
export const updateAchievement = async (id, body, file, user, tenantId) => {
  const achievement = await achievementRepository.findById({ _id: id, tenantId });

  if (!achievement) throw new Error("Achievement not found");

  const { role } = user;

  // Security check
  if (role === "Warden" && achievement.branchName !== user.branchName) {
    throw new Error("Wardens can only update achievements from their own branch.");
  }

  // Safety fallback for old data missing floorno
  if (!achievement.floorno && !body.floorno) {
    achievement.floorno = "N/A";
  }

  // UPDATE FIELDS: This is where it maps the incoming data to the database object.
  if (body.date) achievement.date = body.date;
  if (body.roomno) achievement.roomno = body.roomno;
  if (body.floorno) achievement.floorno = body.floorno;
  if (body.name) achievement.name = body.name;
  if (body.position) achievement.position = body.position;
  
  // THE MISSING LINK: Now it knows to save the Cloudinary URL to the database!
  if (body.photo) achievement.photo = body.photo; 

  if (body.branchName && role === "Admin") {
    achievement.branchName = body.branchName;
  }

  // Save via your existing repository
  return await achievementRepository.save(achievement);
};

export const getAchievements = async (user, query, params, tenantId) => {
  const { role } = user;
  let branchName;

  if (role === "Admin") {
    branchName = params.branchName || query.branchName;
  } else {
    branchName = user.branchName;
  }

  return await achievementRepository.find({ branchName, isdeleted: false, tenantId });
};

export const deleteAchievement = async (id, employeeId, tenantId) => {
  const record = await achievementRepository.findById({ _id: id, tenantId });
  if (!record) throw new Error("Achievement not found");

  if (record.isdeleted) throw new Error("Already deleted");

  record.isdeleted = true;
  record.deletedinfo = {
    deleteddate: new Date(),
    deleteby: employeeId,
    module: "achievement",
  };

  return await achievementRepository.save(record);
};

export const permanentDeleteAchievement = async (id, tenantId) => {
  const record = await achievementRepository.findById({ _id: id, tenantId });
  if (!record) throw new Error("Achievement not found");

  if (!record.isdeleted) {
    throw new Error("Move to trash first before deleting permanently.");
  }

  return await achievementRepository.findByIdAndDelete({ _id: id, tenantId });
};

export const permanentDeleteAllAchievements = async (tenantId) => {
  return await achievementRepository.deleteMany({ isdeleted: true, tenantId });
};

export const recoverAchievement = async (id, tenantId) => {
  const record = await achievementRepository.findById({ _id: id, tenantId });
  if (!record) throw new Error("Achievement not found");

  if (!record.isdeleted) throw new Error("Achievement already active");

  record.isdeleted = false;
  record.deletedinfo.deleteddate = null;
  record.deletedinfo.deleteby = null;

  return await achievementRepository.save(record);
};

export const getDeletedAchievements = async (user, body, query, tenantId) => {
  const { role } = user;
  let branchName;

  if (role === "Warden") {
    branchName = user.branchName;
  } else {
    branchName = body.branchName || query.branchName;
  }

  const branchFilter = buildBranchFilter(user, branchName);
  const finalFilter = { ...branchFilter, isdeleted: true, tenantId };

  return await achievementRepository.find(finalFilter);
};
