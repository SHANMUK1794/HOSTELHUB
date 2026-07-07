import * as deleteService from "./delete.service.js";

export const getRecentDeleted = async (req, res) => {
  try {
    const data = await deleteService.getRecentDeletedService(
      req.user,
      req.query.branchName,
      req.query.module,
      req.tenantId
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Recent deleted items fetched successfully",
        data,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

export const recoverDeleted = async (req, res) => {
  try {
    const data = await deleteService.recoverDeletedService(
      req.query.id,
      req.query.module,
      req.tenantId
    );
    res
      .status(200)
      .json({
        success: true,
        message: `${req.query.module} recovered successfully`,
        data,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const permanentDelete = async (req, res) => {
  try {
    await deleteService.permanentDeleteService(req.query.id, req.query.module, req.tenantId);
    res
      .status(200)
      .json({
        success: true,
        message: `${req.query.module} permanently deleted`,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAllTrashUniversal = async (req, res) => {
  try {
    const deleted = await deleteService.deleteAllTrashService(
      req.user,
      req.query.branchName,
      null,
      req.tenantId
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Trash cleared successfully for selected branch",
        deleted,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};

export const deleteAllTrashByModule = async (req, res) => {
  try {
    const results = await deleteService.deleteAllTrashService(
      req.user,
      req.query.branchName,
      req.query.module,
      req.tenantId
    );
    res
      .status(200)
      .json({
        success: true,
        message: `Deleted trash items from ${req.query.module}`,
        deleted: results,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
};
