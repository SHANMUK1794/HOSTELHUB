import * as payrollService from "./payroll.service.js";
import * as payrollRepo from "./payroll.repository.js";
import { getConfig } from "../../../utils/businessConfig.js";
import { sendPayrollMessage } from "../../../utils/whatsapp.js";

export const addPayroll = async (req, res) => {
  try {
    const data = await payrollService.addPayroll(req.body, req.tenantId);
    
    // 👉 WHATSAPP HOOK: Salary Slip Generation
    try {
      const tenantSettings = await getConfig(req.tenantId);
      // Assumes your payload/returned data contains these fields.
      // Make sure 'MobileNo' is being saved and returned in the payroll record!
      if (data && (data.MobileNo || data.ContactNo)) {
        await sendPayrollMessage(
          data.MobileNo || data.ContactNo,
          data.EmployeeName || data.Name || "Employee",
          data.Month || "Current Month",
          (data.Salary || 0).toString(),
          (data.Advance || 0).toString(),
          (data.Deduction || 0).toString(),
          (data.LeaveDays || 0).toString(),
          (data.NetSalary || 0).toString(),
          tenantSettings
        );
      }
    } catch (waErr) {
      console.log("WhatsApp Error (Payroll):", waErr.message);
    }

    res
      .status(200)
      .json({ success: true, message: "Payroll added successfully", data });
  } catch (error) {
    res
      .status(error.message.includes("fill") ? 400 : 500)
      .json({ success: false, error: error.message });
  }
};

export const getEmpDetails = async (req, res) => {
  try {
    const data = await payrollService.calculateAttendance(req.body, req.tenantId);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPayrolls = async (req, res) => {
  try {
    const data = await payrollService.getAllPayrolls(req.user, req.query, req.tenantId);
    res
      .status(200)
      .json({
        success: true,
        message: "Payrolls retrieved successfully",
        data,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePayroll = async (req, res) => {
  try {
    const data = await payrollService.updatePayroll(req.params.id, req.body, req.tenantId);
    res
      .status(200)
      .json({ success: true, message: "Payroll updated successfully", data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export const deletePayroll = async (req, res) => {
  try {
    const expense = await payrollRepo.findById({ _id: req.params.id, tenantId: req.tenantId });
    if (!expense) {
      return res.status(404).json({ success: false, message: "Payroll record not found" });
    }

    expense.isdeleted = true;
    expense.deletedinfo = {
      deleteddate: new Date(),
      deleteby: req.user?._id || null, 
      module: "Payroll"                
    };

    await expense.save();

    res.status(200).json({ 
      success: true, 
      message: "Payroll record successfully moved to Recycle Bin" 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const exportPayrollExcel = async (req, res) => {
  try {
    const buffer = await payrollService.exportExcel(req.user, req.query, req.tenantId);
    const fileName = `Payroll_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.end(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};