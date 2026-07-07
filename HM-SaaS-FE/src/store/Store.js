import { configureStore } from "@reduxjs/toolkit";
import LoginReducer from "../store/slice/LoginSlice";
import AchievementsSlice from "./slice/AchievementsSlice";
import attendanceReducer from "./slice/AttendanceSlice";
import birthdayReducer from "./slice/BirthdaySlice";
import BranchReducer from "./slice/BranchSlice";
import CertificateReducer from "./slice/CertificateSlice";
import complaintsSlice from "./slice/ComplaintsSlice";
import dailyExpenseReducer from "./slice/DailyExpenseSlice";
import expenseReducer from "./slice/ExpenseSlice";
import FoodSummaryReducer from "./slice/FoodDashSlice";
import MenuSlice from "./slice/MenuSlice";
import RegisterSlice from "./slice/RegisterSlice";
import storeRoomReducer from "./slice/StoreRoomSlice";
import UserReducer from "./slice/UserSlice";
import ebDataReducer from './slice/ebDataSlice';
import InventorySlice from "./slice/InventorySlice";
import payrollReducer from './slice/payrollSlice';
import roomRentReducer from './slice/roomRentSlice';
import roomReducer from "./slice/roomSlice";
import staffAttendanceReducer from "./slice/staffAttendanceSlice";
import storeRoomInventoryReducer from "./slice/storeRoomInventorySlice";
import advanceReducer from "./slice/advanceSlice";
import staffReducer from "./slice/staffSlice";
import kitchenDashboardReducer from "./slice/kitchenDashboardSlice"
import cylinderReducer from "./slice/cylinderSlice"
// import vacationReducer from "./slice/VacationSlice";
import reminderReducer from "./slice/reminderSlice"




export const store = configureStore({
  reducer: {
    auth: LoginReducer,
    rooms: roomReducer,
    certificates: CertificateReducer,
    users: UserReducer,
    register: RegisterSlice,
    achievement: AchievementsSlice,
    inventory: InventorySlice,
    staffAttendance: staffAttendanceReducer,
    attendance: attendanceReducer,
    birthday: birthdayReducer,
    storeRoomExpense: storeRoomReducer,
    dailyExpense: dailyExpenseReducer,
    expenses: expenseReducer,
    kitchenmenu: MenuSlice,
    complaints: complaintsSlice,
    payroll: payrollReducer,
    storeRoomInventory: storeRoomInventoryReducer,
    roomRent:roomRentReducer,
    ebData:ebDataReducer,
    branch: BranchReducer,
    foodSummary: FoodSummaryReducer,
    advance: advanceReducer,
    staff: staffReducer,
    kitchenDashboard: kitchenDashboardReducer,
    cylinder: cylinderReducer,
    reminder: reminderReducer,
    // vacation: vacationReducer,
  },
});
