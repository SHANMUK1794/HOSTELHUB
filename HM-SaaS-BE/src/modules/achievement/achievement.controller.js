import multer from "multer";
import * as achievementService from "./achievement.service.js";

// Multer setup for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Increased to 10MB to match frontend validation
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, JPG, or WEBP image files are allowed."));
    }
  },
}).single("photo");

/* --- Add Achievement --- */
export const addAchievement = async(req, res) => {
    // 1. Destructure directly from req.body (Express will parse the JSON)
    const { date, floorno, roomno, name, branchName, position } = req.body;
    
    // 2. Validation Check
    if (!date || !name || !branchName || !position || !floorno || !roomno ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    try {
      const achievement = await achievementService.addAchievement(req.body, req.tenantId);
      res.status(201).json({
        message: "Achievement added successfully",
        achievement,
        success:true
      });
    } catch (error) {
      if (error.message === "Invalid date format") {
        return res.status(400).json({ success: false, message: error.message });
      }
      res.status(500).json({ error: error.message });
    }
};


/* --- Update Achievement --- */

export const updateAchievement = async (req, res) => {
  // BUG FIX 1: Removed the upload(req, res) wrapper. The route handles it now!
  try {
    const id = req.params.id && req.params.id !== 'undefined' ? req.params.id : req.body._id;

    if (!id) {
        return res.status(400).json({ error: "Achievement ID is required for updating." });
    }

    // Now req.file is safely passed from the route straight into the service
    const achievement = await achievementService.updateAchievement(id, req.body, req.file, req.user, req.tenantId);
    res.status(200).json({ message: "Achievement updated", achievement });
    
  } catch (error) {
    if (error.message === "Achievement not found") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes("Wardens can only update")) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};
/* --- Get Achievements --- */
export const getAchievements = async (req, res) => {
  try {
    const achievements = await achievementService.getAchievements(req.user, req.query, req.params, req.tenantId);
    if (achievements.length === 0) {
      return res.status(200).json({ success: false, message: "No Users Found", data: achievements });
    }
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file provided" });
    }

    // Return the local server path instead of calling Cloudinary
    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({ success: true, imageUrl });
  } catch (error) {
    console.error("Image Upload Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* --- Soft Delete Achievement --- */
export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user?._id;

    const record = await achievementService.deleteAchievement(id, employeeId, req.tenantId);
    res.status(200).json({
      success: true,
      message: "Achievement moved to Trash successfully",
      data: record,
    });
  } catch (error) {
    if (error.message === "Achievement not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === "Already deleted") {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/* --- Permanent Delete One Achievement --- */
export const permanentDeleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    await achievementService.permanentDeleteAchievement(id, req.tenantId);
    res.status(200).json({
      success: true,
      message: "Achievement permanently deleted"
    });
  } catch (error) {
    if (error.message === "Achievement not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes("Move to trash first")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* --- Delete All Permanently --- */
export const permanentDeleteAllAchievements = async (req, res) => {
  try {
    const result = await achievementService.permanentDeleteAllAchievements(req.tenantId);
    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} achievements permanently`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* --- Recover Achievement --- */
export const recoverAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await achievementService.recoverAchievement(id, req.tenantId);
    res.status(200).json({
      success: true,
      message: "Achievement recovered successfully",
      data: record,
    });
  } catch (error) {
    if (error.message === "Achievement not found") {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes("already active")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/* --- Get Deleted Achievements --- */
export const getDeletedAchievements = async (req, res) => {
  try {
    const deletedRecords = await achievementService.getDeletedAchievements(req.user, req.body, req.query, req.tenantId);
    if (deletedRecords.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Deleted Achievements Found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted Achievements Retrieved Successfully",
      data: deletedRecords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
