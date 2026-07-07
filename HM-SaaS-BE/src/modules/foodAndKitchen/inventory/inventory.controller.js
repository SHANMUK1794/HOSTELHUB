import * as service from "./inventory.service.js";

/* ================= ADD ITEM ================= */
export const addItem = async (req, res) => {
  try {
    const data = await service.addItemService(req.body, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "Item usage recorded successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= GET INVENTORY TABLE ================= */
export const getItems = async (req, res) => {
  try {
    const { year, month } = req.query;

    const result = await service.getItemsService(year, month, req.tenantId);

    return res.status(200).json({
      success: true,
      year: result.year,
      month: result.month,
      data: result.data, // ✅ frontend expects this
    });
  } catch (error) {
    console.error("GET ITEMS ERROR:", error); // ✅ added log
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= GET HISTORY ================= */
export const getAllItems = async (req, res) => {
  try {
    const { year, month } = req.query;

    // ⚠ FIX: correct order (year, month)
    const items = await service.getAllItemsService(year, month, req.tenantId);

    return res.status(200).json({
      success: true,
      message: items.length ? "Items fetched successfully" : "No items Found",
      items:items, 
    });
  } catch (error) {
    console.error("GET HISTORY ERROR:", error); 
    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};


/* ================= UPDATE ITEM ================= */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await service.updateItemService(id, req.body, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "Kitchen usage record updated successfully.",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= DELETE HISTORY ================= */
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    await service.deleteItemService(id, req.user, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "Kitchen usage record moved to trash and inventory updated.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= DELETE INVENTORY ================= */
export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    await service.deleteInventoryService(id, req.tenantId);

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= EXPORT EXCEL ================= */
export const exportInventory = async (req, res) => {
  try {
    const { year, month } = req.query;

    const { buffer, fileName } =
      await service.exportInventoryService(year, month, req.tenantId);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );

    return res.end(buffer);
  } catch (error) {
    console.error("EXPORT ERROR:", error); // ✅ added log
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};