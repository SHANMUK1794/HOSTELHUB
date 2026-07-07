import certificateService from "./certificate.service.js";

export const addCertificate = async (req, res) => {
  try {
    const result = await certificateService.addCertificate(req.body, req.user, req.tenantId);
    res
      .status(200)
      .json({ success: true, message: "Certificate added", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCertificates = async (req, res) => {
  try {
    const branchName = req.params.branchName || req.query.branchName;
    const data = await certificateService.getAll(branchName, req.tenantId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const result = await certificateService.updateCertificate(
      req.params.id,
      req.body,
      req.tenantId
    );
    res
      .status(200)
      .json({ success: true, message: "Updated successfully", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    await certificateService.softDelete(req.params.id, req.user?._id, req.tenantId);
    res.status(200).json({ success: true, message: "Moved to trash" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const permanentDeleteCertificate = async (req, res) => {
  try {
    await certificateService.permanentDelete(req.params.id, req.tenantId);
    res.status(200).json({
      success: true,
      message: "Deleted permanently",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const permanentDeleteAllCertificates = async (req, res) => {
  try {
    const deletedCount = await certificateService.permanentDeleteAll(req.tenantId);
    res
      .status(200)
      .json({ success: true, message: `Deleted ${deletedCount} certificates permanently` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getDeletedCertificates = async (req, res) => {
  try {
    const branchName = req.params.branchName || req.query.branchName;
    const deletedCertificates = await certificateService.getDeleted(branchName, req.tenantId);
    if (deletedCertificates.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Deleted Certificates Found",
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Deleted Certificates Retrieved Successfully",
      data: deletedCertificates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const recoverCertificate = async (req, res) => {
  try {
    const result = await certificateService.recover(req.params.id, req.tenantId);
    res
      .status(200)
      .json({ success: true, message: "Recovered successfully", data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
