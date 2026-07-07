import * as ComplaintService from "./complaint.service.js";
import { getConfig } from "../../utils/businessConfig.js";
import { 
  sendWhatsappMessagecompliants, 
  sendWhatsappMessagecompliantsResolved 
} from "../../utils/whatsapp.js";

// ==========================================
// STANDARD OPERATIONS
// ==========================================

export const addComplaint = async (req, res) => {
  try {
    const result = await ComplaintService.processNewComplaint(req.user, req.body, req.tenantId);
    
    // 👉 WHATSAPP HOOK: New Complaint
    try {
      const tenantSettings = await getConfig(req.tenantId);
      if (result && result.MobileNo) {
        await sendWhatsappMessagecompliants(
          result.MobileNo,
          result.Name || result.ResidentName,
          result.description || result.ComplaintType || "New Complaint",
          result.RoomNo,
          result.FloorNo || "-",
          tenantSettings
        );
      }
    } catch (waErr) {
      console.log("WhatsApp Error (Add Complaint):", waErr.message);
    }

    return res.status(200).json({ success: true, message: "Complaint added successfully", data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const result = await ComplaintService.fetchAllComplaints(req.user, req.query, req.tenantId);
    if (!result || result.length === 0) {
      return res.status(200).json({ success: true, message: "No complaints found", data: [] });
    }
    return res.status(200).json({ success: true, message: "Complaints retrieved successfully", data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const result = await ComplaintService.modifyComplaint(req.user, req.params.id, req.body, req.tenantId);
    
    // 👉 WHATSAPP HOOK: Complaint Resolved
    // Only fire if the status was changed to 'Resolved'
    if (req.body.status === "Resolved" || req.body.Status === "Resolved") {
      try {
        const tenantSettings = await getConfig(req.tenantId);
        if (result && result.MobileNo) {
          await sendWhatsappMessagecompliantsResolved(
            result.MobileNo,
            result.Name || result.ResidentName,
            result.description || result.ComplaintType || "Resolved",
            result.RoomNo,
            result.branchName || "Hostel",
            tenantSettings
          );
        }
      } catch (waErr) {
        console.log("WhatsApp Error (Resolve Complaint):", waErr.message);
      }
    }

    return res.status(200).json({ success: true, message: "Complaint updated successfully", data: result });
  } catch (error) {
    const status = error.message.includes("Access Denied") ? 403 : (error.message.includes("not found") ? 404 : 400);
    return res.status(status).json({ success: false, message: error.message });
  }
};

// ==========================================
// RECYCLE BIN OPERATIONS
// ==========================================

export const deleteComplaint = async (req, res) => {
  try {
    const result = await ComplaintService.trashComplaint(req.user, req.params.id, req.tenantId);
    return res.status(200).json({ success: true, message: "Complaint moved to trash successfully", data: result });
  } catch (error) {
    const status = error.message.includes("Access denied") ? 403 : (error.message.includes("not found") ? 404 : 400);
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const permanentDeleteComplaint = async (req, res) => {
  try {
    await ComplaintService.destroyComplaint(req.params.id, req.tenantId);
    return res.status(200).json({ success: true, message: "Complaint permanently deleted" });
  } catch (error) {
    return res.status(error.message.includes("not found") ? 404 : 400).json({ success: false, message: error.message });
  }
};

export const permanentDeleteAllComplaints = async (req, res) => {
  try {
    const deletedCount = await ComplaintService.destroyAllTrash(req.tenantId);
    return res.status(200).json({ success: true, message: `Deleted ${deletedCount} complaints permanently` });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const recoverComplaint = async (req, res) => {
  try {
    const result = await ComplaintService.restoreComplaint(req.params.id, req.tenantId);
    return res.status(200).json({ success: true, message: "Complaint recovered successfully", data: result });
  } catch (error) {
    return res.status(error.message.includes("not found") ? 404 : 400).json({ success: false, message: error.message });
  }
};

export const getDeletedComplaints = async (req, res) => {
  try {
    const queryBodyParams = { ...req.body, ...req.query };
    const result = await ComplaintService.fetchTrash(req.user, queryBodyParams, req.tenantId);
    return res.status(200).json({ success: true, message: "Deleted Complaints Retrieved Successfully", data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};