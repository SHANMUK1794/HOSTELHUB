import DueTrackerService from "./dueTracker.service.js";

class DueTrackerController {
  async createOrUpdateDue(req, res) {
    try {
      const result = await DueTrackerService.createOrUpdateDue(req.body, req.tenantId);
      res.status(200).json({
        message: `Advance ${result.status} successfully`,
        advance: {
          total_advance: result.advance.advance,
          total_paid: result.advance.paid,
          current_balance: result.advance.balance,
        },
        due_tracker: result.dueTracker,
        employee: {
          name: result.employee.staff_name,
          current_advance: result.employee.Advance,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateDueTracker(req, res) {
    try {
      const result = await DueTrackerService.updateDueTracker(
        req.params.due_tracker_id,
        req.body,
        req.tenantId
      );
      res.status(200).json({
        message: "Due tracker updated successfully",
        dueTracker: result.dueTracker,
        changes: {
          total_amount_change: result.totalAmountDiff,
          paid_amount_change: result.paidAmountDiff,
        },
        current_advance: result.advance.balance,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteDueTracker(req, res) {
    try {
      const result = await DueTrackerService.deleteDueTracker(
        req.params.due_tracker_id,
        req.tenantId
      );
      res.status(200).json({
        message: "Due tracker deleted successfully",
        deleted_tracker: result.deletedTracker,
        adjustments_made: {
          status: result.deletedTracker.status,
          new_advance_balance: result.advance.balance,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getDue(req, res) {
    try {
      const result = await DueTrackerService.getDueByEmployee(
        req.params.employee_id,
        req.tenantId
      );
      res.status(200).json({
        message: "Due details fetched successfully",
        dueTrackers: result.dueTrackers,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new DueTrackerController();
