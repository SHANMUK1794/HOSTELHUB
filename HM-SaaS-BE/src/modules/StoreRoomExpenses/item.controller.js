import * as service from "./item.service.js";

export const addItem = async (req, res) => {
  try {
    const data = await service.addItemService(req.body, req.tenantId);
    res
      .status(200)
      .json({ success: true, message: "Item added successfully", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const data = await service.getAllItemsService(req.query, req.tenantId);
    res
      .status(200)
      .json({ success: true, message: "Items retrieved successfully", data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const data = await service.updateItemService(req.params.id, req.body, req.tenantId);
    res
      .status(200)
      .json({ success: true, message: "Item updated successfully", data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    await service.deleteItemService(req.params.id, req.user?._id, req.tenantId);
    res
      .status(200)
      .json({
        success: true,
        message: "Item deleted successfully and stock updated",
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const exportExcel = async (req, res) => {
  try {
    const workbook = await service.exportSummaryService(req.query, req.tenantId);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=StoreRoom_Purchase.xlsx`,
    );
    const buffer = await workbook.xlsx.writeBuffer();
    res.end(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
