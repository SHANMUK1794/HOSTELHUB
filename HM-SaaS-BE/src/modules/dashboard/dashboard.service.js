import dashboardRepository from "./dashboard.repository.js";
import { getRoomSummary } from "../roomAndResidents/Room&Residence.service.js";
import DashRepo from "../foodAndKitchen/dashboard/dashboard.repository.js";
import { buildDateRangeFilter } from "../../utils/filter.js";
import KitchenExpense from "../foodAndKitchen/expenses/expenses.service.js";
import { getBirthDayData } from "../reminder/reminder.service.js";
import { getWeeklyExpenseGraph } from "../FinanceAndUtilities/dailyExpense/expense.service.js";
import roomModel from "../roomAndResidents/Room&Residence.model.js";

import Tenant from "../tenant/tenant.model.js";

class DashboardService {
  async getDashboardData(branchName, today, tenantId) {
    const startOfDay = new Date(new Date(today).setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date(today).setHours(23, 59, 59, 999));
    
    const tenantDoc = await Tenant.findById(tenantId);
    let branches = [];
    if (tenantDoc && tenantDoc.branches) {
      branches = tenantDoc.branches.filter(b => b && b !== "Kitchen branch" && b !== "Office");
    } else {
      const allBranchesRaw = await roomModel.distinct("branchName", { tenantId, isdeleted: false });
      branches = allBranchesRaw.filter(b => b && b !== "Kitchen branch" && b !== "Office");
    }

    // 1. Room Summaries
    const roomSummariesList = await Promise.all(branches.map(b => getRoomSummary(b, tenantId)));
    const roomSummary = await getRoomSummary(branchName, tenantId);

    let IOB = null, NewMens = null, Rameswaram = null, Womens = null;
    let dynamicRoomSummaries = {};
    branches.forEach((b, i) => {
       dynamicRoomSummaries[b] = roomSummariesList[i];
       if(b === "IOB Mens Hostel") IOB = roomSummariesList[i];
       else if(b === "New Mens Hostel") NewMens = roomSummariesList[i];
       else if(b === "Rameswaram Mens Hostel") Rameswaram = roomSummariesList[i];
       else if(b === "Womens Hostel") Womens = roomSummariesList[i];
    });

    // 2. Attendance & Food Summaries (All Branches)
    const attendanceDocs = await Promise.all(
      branches.map((b) =>
        dashboardRepository.findSummary(tenantId, b, startOfDay, endOfDay),
      ),
    );
    const foodDocs = await Promise.all(
      branches.map((b) => DashRepo.getFoodSummaries(tenantId, b, startOfDay, endOfDay)),
    );

    let allBranchAttendance = {};
    branches.forEach((b, i) => {
      const tCount = attendanceDocs[i]?.totalCount || 0;
      const tPresent = attendanceDocs[i]?.totalPresent || 0;
      
      allBranchAttendance[b] = {
        totalPresent: tPresent,
        totalAbsent: Math.max(0, tCount - tPresent), 
        totalCount: tCount,
        totalVeg: foodDocs[i]?.totalVeg || 0,
        totalNonVeg: foodDocs[i]?.totalNonVeg || 0,
      };
    });

    // 3. Complaint Summary
    const monthList = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december",
    ];
    const dateFilter = buildDateRangeFilter(
      monthList[today.getMonth()],
      today.getFullYear(),
    );
    let branchComplaints = {};

    const pendingStatuses = ["Pending", "Working", "In Progress"];
    const closedStatuses = ["Solved", "Completed", "Done", "Closed"];

    for (const b of branches) {
      const open = await dashboardRepository.countComplaints({
        tenantId,
        status: { $in: pendingStatuses },
        branchName: b,
        isdeleted: false,
        ...dateFilter,
      });
      const closed = await dashboardRepository.countComplaints({
        tenantId,
        status: { $in: closedStatuses },
        branchName: b,
        isdeleted: false,
        ...dateFilter,
      });
      branchComplaints[b] = { open, closed };
    }

    let pendingComplaints = branchComplaints[branchName]?.open || 0;
    let closedComplaints = branchComplaints[branchName]?.closed || 0;

    let foodTypeSummary = { vegCount: 0, nonVegCount: 0 };
    const breakdown = await dashboardRepository.getFoodTypeBreakdown(tenantId, branchName);
    breakdown.forEach((item) => {
      if (item._id === "Veg") foodTypeSummary.vegCount = item.total;
      if (item._id === "Non-Veg") foodTypeSummary.nonVegCount = item.total;
    });

    // 5. Staff Attendance
    const allBranchStaffAttendance = {};
    for (const b of branches) {
      const doc = await dashboardRepository.findStaffAttendance(
        tenantId,
        b,
        startOfDay,
        endOfDay,
      );
      if (!doc) {
        allBranchStaffAttendance[b] = {
          staffPresent: 0,
          staffAbsent: 0,
          staffTotal: 0,
        };
      } else {
        const total = doc.attendance.length;
        const present = doc.attendance.filter((a) => a.present).length;
        allBranchStaffAttendance[b] = {
          staffPresent: present,
          staffAbsent: total - present,
          staffTotal: total,
        };
      }
    }

    const dynamicGraphs = {};
    const graphPromises = branches.map(async (b) => {
      dynamicGraphs[b] = await getWeeklyExpenseGraph(b, tenantId);
    });

    const [birthday, expensesRaw, graph, vehicleCount, fassaiCert, totalStoreItems,thisMonthStoreExpenses] = await Promise.all([
      getBirthDayData(branchName, tenantId),
      KitchenExpense.calculateKitchenExpenses(startOfDay, tenantId, branchName),
      getWeeklyExpenseGraph(branchName, tenantId),
      dashboardRepository.countVehicles(tenantId, branchName),
      dashboardRepository.getFassaiCertificate(tenantId, branchName), 
      dashboardRepository.countStoreRoomItems(tenantId, branchName),
      dashboardRepository.getStoreRoomExpenses(
        tenantId,
        new Date(today.getFullYear(), today.getMonth(), 1), 
        new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999),
        branchName
      ),
      ...graphPromises
    ]);

    const kitchenExpenses = Array.isArray(expensesRaw)
      ? expensesRaw.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)
      : expensesRaw;

    let fassai = { message: "No certificate found" };
    if (fassaiCert && fassaiCert.renewal_date) {
      const todayDate = new Date();
      const renewal = new Date(fassaiCert.renewal_date);
      todayDate.setHours(0, 0, 0, 0);
      renewal.setHours(0, 0, 0, 0);

      const diffDays = Math.ceil((renewal - todayDate) / (1000 * 60 * 60 * 24));

      if (diffDays < 0) fassai.message = "Certificate Expired";
      else if (diffDays === 0) fassai.message = "Expires Today";
      else fassai.message = `Expires in ${diffDays} days`;
    }

    const storeRoom = {
      totalItems: totalStoreItems || 0,
      thisMonthExpense: 0,
      lastExpense: 0
    };

    if (thisMonthStoreExpenses && thisMonthStoreExpenses.length > 0) {
      storeRoom.thisMonthExpense = thisMonthStoreExpenses.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
      storeRoom.lastExpense = Number(thisMonthStoreExpenses[0].price) || 0;
    }

    return {
      roomSummary,
      dynamicRoomSummaries,
      pendingComplaints,
      closedComplaints,
      foodTypeSummary,
      totalPresent:
        branchName === "Kitchen branch"
          ? branches.reduce(
              (s, b) => s + (allBranchAttendance[b]?.totalPresent || 0),
              0,
            )
          : attendanceDocs.find((d) => d?.branchName === branchName)
              ?.totalPresent || 0,
      totalAbsent:
        branchName === "Kitchen branch"
          ? branches.reduce((s, b) => s + (allBranchAttendance[b]?.totalAbsent || 0), 0)
          : attendanceDocs.find((d) => d?.branchName === branchName)
              ?.totalAbsent || 0,
      totalCount:
        branchName === "Kitchen branch"
          ? branches.reduce((s, b) => s + (allBranchAttendance[b]?.totalCount || 0), 0)
          : attendanceDocs.find((d) => d?.branchName === branchName)
              ?.totalCount || 0,
      allBranchAttendance,
      allBranchStaffAttendance,
      complaintsSummary: {
        totalOpen: Object.values(branchComplaints).reduce(
          (s, x) => s + x.open,
          0,
        ),
        totalClosed: Object.values(branchComplaints).reduce(
          (s, x) => s + x.closed,
          0,
        ),
        branches: branchComplaints,
      },
      vehicleCount,
      kitchenExpenses,
      birthday,
      graph,
      dynamicGraphs,
      fassai, 
      storeRoom,
      IOB,
      NewMens,
      Rameswaram,
      Womens,
    };
  }
}

export default new DashboardService();