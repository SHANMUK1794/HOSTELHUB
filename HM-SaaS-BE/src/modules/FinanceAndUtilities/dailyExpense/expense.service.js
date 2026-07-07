import mongoose from "mongoose";
import * as dailyExpenseRepo from "./expense.repository.js";
import { buildCombinedFilter } from "../../../utils/filter.js";
import ExcelJS from "exceljs";

const parseDate = (input) => {
  if (input.includes("/")) {
    const [dd, mm, yyyy] = input.split("/");
    return new Date(`${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`);
  }
  return new Date(input);
};

export const addExpense = async (body, userContext, tenantId) => {
  const { date, work, amount, status, voucherno } = body;
  const branchName = userContext.role === "Admin" ? body.branchName : userContext.branchName;

  if (!date?.trim() || !work?.trim() || !voucherno || !amount || !status?.trim()) {
    throw new Error("Please fill all fields");
  }

  const parsedDate = parseDate(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(parsedDate);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate > today) throw new Error("Future dates are not allowed");

  return await dailyExpenseRepo.create({
    date: parsedDate,
    work: work.trim(),
    amount: Number(amount),
    voucherno,
    status: status.trim(),
    branchName,
    tenantId,
  });
};

export const getExpenses = async (userContext, query) => {
  const filter = buildCombinedFilter(userContext, query);
  
  // 👉 FIXED: Explicitly filter out soft-deleted items from your main page view table
  filter.isdeleted = { $ne: true }; 
  
  return await dailyExpenseRepo.find(filter);
};

export const updateExpense = async (id, updateData, userContext, tenantId) => {
  const { date, work, amount, status, voucherno } = updateData;
  const branchName = userContext.role === "Admin" ? updateData.branchName : userContext.branchName;

  if (!date || !work || !voucherno || !amount || !status) {
    throw new Error("Please fill all fields");
  }

  const parsedDate = parseDate(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(parsedDate);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate > today) throw new Error("Future dates are not allowed");

  const updatedExpense = await dailyExpenseRepo.findByIdAndUpdate(
    { _id: id, tenantId },
    {
      date: parsedDate,
      work: typeof work === "string" ? work.trim() : work,
      amount: Number(amount),
      voucherno,
      status: typeof status === "string" ? status.trim() : status,
      ...(branchName && { branchName }),
    }
  );

  if (!updatedExpense) {
    throw new Error("Daily Expense not found");
  }

  return updatedExpense;
};

export const getWeeklyExpenseGraph = async (branchName, tenantId) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  const diffToMonday = (today.getDay() + 6) % 7;
  startOfWeek.setDate(today.getDate() - diffToMonday);

  const graph = [];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// 🛠️ FIX: Dynamically grab the StoreRoom model so we can combine both tables!
  const StoreRoomExpense = mongoose.models.StoreRoomExpense;

  for (let i = 0; i < 7; i++) {
    const dateObj = new Date(startOfWeek);
    dateObj.setDate(startOfWeek.getDate() + i);
    const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));

    // 1. Fetch standard Daily Expenses (Uses '$amount')
    const dailyResult = await dailyExpenseRepo.aggregate([
      { 
        $match: { 
          branchName, 
          tenantId,
          isdeleted: { $ne: true }, 
          date: { $gte: startOfDay, $lte: endOfDay } 
        } 
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // 2. Fetch Store Room Expenses (Uses '$price')
    let storeTotal = 0;
    if (StoreRoomExpense) {
      const storeResult = await StoreRoomExpense.aggregate([
        { 
          $match: { 
            branchName,
            tenantId,
            isdeleted: { $ne: true }, 
            date: { $gte: startOfDay, $lte: endOfDay } 
          } 
        },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]);
      storeTotal = storeResult[0]?.total || 0;
    }

    const dailyTotal = dailyResult[0]?.total || 0;

    // 3. Add them together for the final graph column!
    graph.push({ 
      day: dayNames[i], 
      total: dailyTotal + storeTotal 
    });
  }
  return graph;
};

export const getExpenseOverviewGraphData = async (tenantId, targetBranch, targetYear, user) => {
  const StoreRoomExpense = mongoose.models.StoreRoomExpense;
  const currentYear = targetYear ? parseInt(targetYear) : new Date().getFullYear();
  const branchName = user.role === "Admin" ? (targetBranch || user.branchName) : user.branchName;

  const startYear = 2021;
  const endYear = currentYear;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthlyData = Array.from({ length: 12 }, (_, i) => ({ month: monthNames[i], total: 0 }));
  const yearlyData = [];
  const compareData = [];
  for (let year = startYear; year <= endYear; year++) {
    yearlyData.push({ year: String(year), total: 0 });
    compareData.push({ name: String(year) });
  }

  const processAggregations = (dataList, amountField) => {
    dataList.forEach((item) => {
      const y = item._id.year;
      const m = item._id.month;
      const b = item._id.branchName;
      const amt = item.total || 0;

      // Comparative Data (All branches, by Year)
      if (y >= startYear && y <= endYear && b) {
        const compareEntry = compareData.find(c => c.name === String(y));
        if (compareEntry) {
          compareEntry[b] = (compareEntry[b] || 0) + amt;
        }
      }

      // Filter for specific branch for the other two graphs
      if (b === branchName) {
        // Yearly Data
        if (y >= startYear && y <= endYear) {
          const yearlyEntry = yearlyData.find(yData => yData.year === String(y));
          if (yearlyEntry) {
            yearlyEntry.total += amt;
          }
        }
        // Monthly Data for currentYear
        if (y === currentYear && m >= 1 && m <= 12) {
          monthlyData[m - 1].total += amt;
        }
      }
    });
  };

  const dailyAgg = await dailyExpenseRepo.aggregate([
    { $match: { tenantId, isdeleted: { $ne: true } } },
    { $group: { 
        _id: { year: { $year: "$date" }, month: { $month: "$date" }, branchName: "$branchName" },
        total: { $sum: "$amount" }
    }}
  ]);
  processAggregations(dailyAgg, "amount");

  if (StoreRoomExpense) {
    const storeAgg = await StoreRoomExpense.aggregate([
      { $match: { tenantId, isdeleted: { $ne: true } } },
      { $group: { 
          _id: { year: { $year: "$date" }, month: { $month: "$date" }, branchName: "$branchName" },
          total: { $sum: "$price" }
      }}
    ]);
    processAggregations(storeAgg, "price");
  }

  return {
    monthlyExpenses: monthlyData,
    yearlyExpenses: yearlyData,
    comparativeExpenses: compareData
  };
};

export const exportExcel = async (userContext, query) => {
  const branchName = userContext.role === "Admin" ? (query.branchName || "All") : userContext.branchName;
  const filter = buildCombinedFilter(userContext, query);
  
  // 👉 FIXED: Ensure exported Excel files don't download soft-deleted records accidentally
  filter.isdeleted = { $ne: true }; 

  const expenses = await dailyExpenseRepo.find(filter);

  if (!expenses.length) throw new Error("No Daily Expenses Found");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Daily Expenses");
  sheet.addRow(["Sl.No", "Date", "Branch", "Description", "Voucher No", "Amount"]).font = { bold: true };

  expenses.forEach((exp, index) => {
    sheet.addRow([index + 1, new Date(exp.date).toLocaleDateString("en-GB"), exp.branchName, exp.work, exp.voucherno, exp.amount]);
  });

  sheet.columns = [{ width: 8 }, { width: 15 }, { width: 25 }, { width: 30 }, { width: 15 }, { width: 15 }];
  return { buffer: await workbook.xlsx.writeBuffer(), fileName: `Daily_Expense_${branchName}.xlsx` };
};