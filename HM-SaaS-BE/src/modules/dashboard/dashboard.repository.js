import Complaint from "../complaints/complaint.model.js";
import Register from "../register/register.model.js";
import Summary from "../foodAndKitchen/kitchenSummary/summary.model.js";
import StaffAttendance from "../attendance/staffAttendance/staffAttendance.model.js";
import Certificate from "../certificate/certificate.model.js"; 
import StoreRoomExpense from "../StoreRoomExpenses/item.model.js";
import StoreRoomHistory from "../StoreRoomInventory/inventoryHistory.model.js";

class DashboardRepository {
  async countComplaints(filter) {
    return await Complaint.countDocuments(filter);
  }

  async findSummary(tenantId, branchName, start, end) {
    return await Summary.findOne({
      tenantId,
      branchName,
      date: { $gte: start, $lte: end },
    });
  }

  async countVehicles(tenantId, branchName) {
    return await Register.countDocuments({
      tenantId,
      branchName,
      staying: true,
      isdeleted: false,
      vehicleNo: { $nin: [null, "", "null", "Null"] },
    });
  }

  async getFoodTypeBreakdown(tenantId, branchName) {
    return await Register.aggregate([
      { $match: { tenantId, branchName, staying: true, isdeleted: false } },
      { $group: { _id: "$FoodType", total: { $sum: 1 } } },
    ]);
  }

  async findStaffAttendance(tenantId, branchName, start, end) {
    return await StaffAttendance.findOne({
      tenantId,
      branchName,
      date: { $gte: start, $lte: end },
    });
  }

  async getFassaiCertificate(tenantId, branchName) {
    return await Certificate.findOne({ 
      tenantId,
      branchName, 
      isdeleted: false 
    }).sort({ renewal_date: 1 });
  }

  async countStoreRoomItems(tenantId, branchName) {
    return await StoreRoomHistory.countDocuments({ tenantId, branchName, quantity: { $gt: 0 } });
  }

  async getStoreRoomExpenses(tenantId, startDate, endDate, branchName) {
    return await StoreRoomExpense.find({
      tenantId,
      branchName,
      isdeleted: false,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1, createdAt: -1 });
  }
}

export default new DashboardRepository();