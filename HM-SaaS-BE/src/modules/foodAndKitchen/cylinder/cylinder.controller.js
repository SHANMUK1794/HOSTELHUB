import {
  createCylinderService,
  getAllCylindersService,
  updateCylinderService,
  deleteCylinderService,
} from "./cylinder.service.js";
import excelJS from "exceljs";

export const createCylinder = async (req, res) => {
  try {
    const data = await createCylinderService(req.body);

    res.status(201).json({
      success: true,
      message: "Cylinder created successfully.",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCylinders = async (req, res) => {
  try {
    const result = await getAllCylindersService(req.query);

    res.status(200).json({
      success: true,
      message: "Cylinders fetched successfully.",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCylinder = async (req, res) => {
  try {
    const data = await updateCylinderService(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Cylinder updated successfully.",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCylinder = async (req, res) => {
  try {
    await deleteCylinderService(req.params.id, req.user?._id);

    res.status(200).json({
      success: true,
      message: "Cylinder deleted successfully.",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const exportCylinders = async (req, res) => {
  try {
    // 1. Fetch filtered data using your existing service
    const { data: cylinders } = await getAllCylindersService(req.query);

    // 2. Create a new Excel workbook and sheet
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Gas Cylinders");

    // 3. Define columns matching your Figma table
    worksheet.columns = [
      { header: "Booking Date", key: "date", width: 15 },
      { header: "Received Date", key: "deliverydate", width: 15 },
      { header: "Install Date", key: "installeddate", width: 15 },
      { header: "Empty Date", key: "emptydate", width: 15 },
      { header: "Capacity", key: "capacity", width: 10 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Amount", key: "amount", width: 10 },
      { header: "Usage (Days)", key: "usage", width: 15 },
    ];

    // 4. Add data rows
    cylinders.forEach((cyl) => {
      worksheet.addRow({
        date: cyl.date ? new Date(cyl.date).toLocaleDateString("en-GB") : "-",
        deliverydate: cyl.deliverydate ? new Date(cyl.deliverydate).toLocaleDateString("en-GB") : "-",
        installeddate: cyl.installeddate ? new Date(cyl.installeddate).toLocaleDateString("en-GB") : "-",
        emptydate: cyl.emptydate ? new Date(cyl.emptydate).toLocaleDateString("en-GB") : "-",
        capacity: cyl.capacity || "-",
        quantity: cyl.quantity || 0,
        amount: cyl.amount || 0,
        usage: cyl.usage || "-",
      });
    });

    // 5. Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE65F2B" } }; // Matches your orange UI
    });

    // 6. Set response headers to trigger a file download in React
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Gas_Cylinders_${req.query.month}_${req.query.year}.xlsx`
    );

    // 7. Write the file to the response stream
    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ success: false, message: "Failed to export data" });
  }
};