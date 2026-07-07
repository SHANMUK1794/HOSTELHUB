import * as ComplaintRepository from "./complaint.repository.js";
import rooms from "../roomAndResidents/Room&Residence.model.js";
import register from "../register/register.model.js";
import notification from "../notification/notification.model.js";
import {
  sendWhatsappMessagecompliants,
  sendWhatsappMessagecompliantsResolved,
} from "../../utils/whatsapp.js";
import { buildCombinedFilter, buildBranchFilter } from "../../utils/filter.js";
import { getConfig } from "../../utils/businessConfig.js";
// Helper function
const parseDate = (input) => {
  if (input.includes("/")) {
    const [dd, mm, yyyy] = input.split("/");
    return new Date(`${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`);
  }
  return new Date(input);
};

// ==========================================
// STANDARD OPERATIONS
// ==========================================

export const processNewComplaint = async (user, bodyData, tenantId) => {
  const { role, _id: creatorId } = user;
  const branchName =
    role === "Admin" || role === "Staff"
      ? bodyData.branchName?.trim()
      : user.branchName;
  const { room_no, floor, date, issue, issue_description } = bodyData;
  const isKitchenBranch = branchName?.toLowerCase() === "kitchen branch";
const tenantSettings = await getConfig(tenantId);
if (!isKitchenBranch) {
    const students = await register.find({
      tenantId,
      RoomNo: room_no.trim(),
      branchName,
    });
    for (const student of students) {
      const numberToSend = student.SameAsWhatsapp
        ? student.MobileNo
        : student.Whatsapp;
      if (numberToSend) {
        try {
          await sendWhatsappMessagecompliants(
            numberToSend,
            student.Name,
            issue_description.trim(),
            room_no.trim(),
            branchName,
            tenantSettings // 👉 Added config
          );
        } catch (err) {
          console.warn(`WhatsApp failed for ${student.Name}:`, err.message);
        }
      }
    }
  }

  const fixedRecipients = [
    { name: "sir", number: "9500025986" },
    { name: "sir", number: "9791064094" },
  ];
  for (const recipient of fixedRecipients) {
    try {
      await sendWhatsappMessagecompliants(
        recipient.number,
        recipient.name,
        issue_description.trim(),
        isKitchenBranch ? "Kitchen" : room_no?.trim(),
        branchName,
        tenantSettings // 👉 Added config
      );
    } catch (err) {
      console.warn(`WhatsApp failed for ${recipient.name}:`, err.message);
    }
  }

  return result;
};

export const fetchAllComplaints = async (user, queryParams, tenantId) => {
  const filter = buildCombinedFilter(user, queryParams);
  const finalFilter = { ...filter, tenantId, isdeleted: false };
  return await ComplaintRepository.find(finalFilter);
};

export const modifyComplaint = async (user, complaintId, updateData, tenantId) => {
  const { role, _id: userId } = user;
  const branchName =
    role === "Admin" || role === "Staff"
      ? updateData.branchName?.trim()
      : user.branchName;

  if (!updateData || !complaintId)
    throw new Error("Invalid request or complaint ID");

  const currentComplaint = await ComplaintRepository.findById({ _id: complaintId, tenantId });
  if (!currentComplaint) throw new Error("Complaint not found");

  if (
    role.toLowerCase() === "warden" &&
    currentComplaint.branchName !== user.branchName
  ) {
    throw new Error(
      "Access Denied: Cannot modify complaints of other branches",
    );
  }

  const isKitchenBranch = branchName?.toLowerCase() === "kitchen branch";

  if (updateData.date) {
    const inputDate = new Date(updateData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
    if (inputDate > today) throw new Error("Future dates are not allowed");
  }

  if (!isKitchenBranch && updateData.room_no) {
    const roomNoToCheck = updateData.room_no.trim();
    const validRoom = await rooms.findOne({
      tenantId,
      branchName,
      RoomNo: roomNoToCheck,
    });
    if (!validRoom)
      throw new Error(
        `Room ${roomNoToCheck} not found in branch ${branchName}`,
      );
  }

  if (isKitchenBranch) updateData.room_no = null;

  const updatedComplaint = await ComplaintRepository.updateById(
    { _id: complaintId, tenantId },
    updateData,
  );

  if (updateData.status) {
    await notification.create({
      tenantId,
      userId,
      branchName,
      type: "Complaint",
      message: isKitchenBranch
        ? `🍳 Complaint status updated to ${updateData.status} in Kitchen Branch`
        : `🛠 Complaint status updated to ${updateData.status} in Room ${updatedComplaint.room_no}`,
      route: `/complaints/${updatedComplaint._id}`,
      date: new Date(),
      adminSeen: false,
      wardenSeen: false,
    });
  }

  if (updateData.status === "Solved") {
    // 👉 NEW: Fetch tenant settings
    const tenantSettings = await getConfig(tenantId);
    const fixedRecipients = tenantSettings.complaintResolvedRecipients || [];
       // this is hard coded i make it dynamic above if needed remove the
       //  comment and use the dynamic one
    // const fixedRecipients = [
    //   { name: "sir", number: "9500025986" },
    //   { name: "sir", number: "9791064094" },
    // ];
    const issueDescription =
      updatedComplaint.issue_description?.trim() || "No description";
    const roomNumber = isKitchenBranch
      ? "Kitchen"
      : updatedComplaint.room_no?.trim();

    for (const recipient of fixedRecipients) {
      try {
        await sendWhatsappMessagecompliantsResolved(
          recipient.number,
          recipient.name,
          issueDescription,
          roomNumber,
          branchName,
          tenantSettings // 👉 Added config
        );
      } catch (err) {
        console.warn(`WhatsApp failed for ${recipient.name}:`, err.message);
      }
    }
  }

  return updatedComplaint;
};

// ==========================================
// RECYCLE BIN OPERATIONS
// ==========================================

export const trashComplaint = async (user, complaintId, tenantId) => {
  if (!complaintId) throw new Error("Invalid complaint id");

  const record = await ComplaintRepository.findById({ _id: complaintId, tenantId });
  if (!record) throw new Error("Complaint not found");

  if (
    user.role.toLowerCase() === "warden" &&
    record.branchName !== user.branchName
  ) {
    throw new Error(
      "Access denied: Cannot delete complaint from another branch",
    );
  }

  if (record.isdeleted) throw new Error("Complaint already moved to trash");

  record.isdeleted = true;
  record.deletedinfo = {
    deleteddate: new Date(),
    deleteby: user._id,
    module: "complaint",
  };

  return await ComplaintRepository.saveDocument(record);
};

export const destroyComplaint = async (complaintId, tenantId) => {
  const record = await ComplaintRepository.findById({ _id: complaintId, tenantId });
  if (!record) throw new Error("Complaint not found");
  if (!record.isdeleted)
    throw new Error("Move to trash first before deleting permanently.");

  await ComplaintRepository.deleteById({ _id: complaintId, tenantId });
  return true;
};

export const destroyAllTrash = async (tenantId) => {
  const result = await ComplaintRepository.deleteMany({ tenantId, isdeleted: true });
  return result.deletedCount;
};

export const restoreComplaint = async (complaintId, tenantId) => {
  const record = await ComplaintRepository.findById({ _id: complaintId, tenantId });
  if (!record) throw new Error("Complaint not found");
  if (!record.isdeleted) throw new Error("Complaint already active");

  const exists = await ComplaintRepository.findOne({
    tenantId,
    room_no: record.room_no,
    branchName: record.branchName,
    isdeleted: false,
  });

  if (exists)
    throw new Error(
      `Cannot recover. Complaint for room '${record.room_no}' already exists in ${record.branchName}.`,
    );

  record.isdeleted = false;
  record.deletedinfo.deleteddate = null;
  record.deletedinfo.deleteby = null;

  return await ComplaintRepository.saveDocument(record);
};

export const fetchTrash = async (user, queryBodyParams, tenantId) => {
  const branchName =
    user.role === "Warden" ? user.branchName : queryBodyParams.branchName;
  const branchFilter = buildBranchFilter(user, branchName);
  const finalFilter = { ...branchFilter, tenantId, isdeleted: true };

  return await ComplaintRepository.find(finalFilter);
};
