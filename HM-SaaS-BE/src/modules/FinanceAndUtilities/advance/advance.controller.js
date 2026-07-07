import AdvanceService from "./advance.service.js";

class AdvanceController {
  async createAdvance(req, res) {
    try {
      const { phonenumber, amount, payment_method, branchName } = req.body;
      if (!phonenumber || !amount || !payment_method || !branchName) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const result = await AdvanceService.createAdvance(req.body, req.tenantId);
      return res.status(200).json({
        success: true,
        message: "Advance recorded successfully",
        employee: {
          name: result.employee.staff_name || result.employee.Name,
          phone: result.employee.Mobile,
          current_advance: result.employee.Advance,
        },
        advance: {
          total_advance: result.existingAdvance.advance,
          balance: result.existingAdvance.balance,
        },
        dueTracker: result.dueTracker,
      });
    } catch (error) {
      return res
        .status(error.message === "Employee not found" ? 404 : 500)
        .json({
          success: false,
          message: error.message,
        });
    }
  }

  async updateAdvance(req, res) {
    try {
      const result = await AdvanceService.updateAdvance(
        req.params.advanceId,
        req.body,
        req.tenantId
      );
      res.status(200).json({
        message: "Advance updated successfully",
        advance: {
          id: result.advance._id,
          previous_amount: result.oldAmount,
          new_amount: result.advance.advance,
          balance: result.advance.balance,
        },
        dueTracker: result.dueTracker,
        employee: {
          name: result.employee.staff_name,
          current_advance: result.employee.Advance,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async deleteAdvance(req, res) {
    try {
      // 👉 PASSED req.user FOR DELETION HISTORY CONTEXT LOGS
      const result = await AdvanceService.deleteAdvance(req.params.advanceId, req.user, req.tenantId);
      res.status(200).json({
        message: "Advance safely moved to Recycle Bin",
        deleted_amount: result.amountToDelete,
        remaining_balance: result.employee.Advance,
        employee: {
          name: result.employee.staff_name,
          phone: result.employee.Mobile,
          current_advance: result.employee.Advance,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAdvanceDetails(req, res) {
    try {
      const advances = await AdvanceService.getAllAdvances(
        req.query.branchName,
        req.tenantId
      );
      if (advances.length === 0) {
        return res.status(200).json({ message: "No data found" });
      }
      res.status(200).json({
        message: "All advance records fetched successfully",
        total_records: advances.length,
        advances,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async exportAdvanceExcel(req, res) {
    try {
      const buffer = await AdvanceService.exportExcel(req.query.branchName, req.tenantId);
      const fileName = `Advance_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      );
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      res.end(buffer);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new AdvanceController();