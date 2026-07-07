import Achievements from "../Components/achievements/Achievements";
import Attendance from "../Components/attendance/Attendance";
import StaffAttendance from "../Components/attendance/StaffAttendance";
import Certificates from "../Components/certificates/Certificates";
import Complaints from "../Components/complaints/Complaints";
import Dashboard from "../Components/dashboard/Dashboard";
// Add this with your other imports at the top
import DashboardController from "../Components/dashboard/DashboardController";
import DailyExpense from "../Components/finance&Utilities/dailyExpense/DailyExpense";
import FinanceAndUtilities from "../Components/finance&Utilities/FinanceAndUtilities";
import EBData from "../Components/finance&Utilities/paymentManagement/EBData";
import RoomRent from "../Components/finance&Utilities/paymentManagement/RoomRent";
import Payroll from "../Components/finance&Utilities/payrollManagement/Payroll";
import KitchenLanding from "../Components/food_and_kitchen/KitchenLanding";
import FoodAndKitchen from "../Components/food_and_kitchen/FoodAndKitchen";
import KitchenExpenses from "../Components/food_and_kitchen/foodAndKitchenSideBar/kitchenExpenses/KitchenExpenses";
import KitchenInventory from "../Components/food_and_kitchen/foodAndKitchenSideBar/kitchenInventory/KitchenInventory";
import KitchenMenu from "../Components/food_and_kitchen/foodAndKitchenSideBar/kitchenMenu/KitchenMenu";

import Header from "../Components/Header/Header";
import Login from "../Components/login&signup/Login";
import Signup from "../Components/login&signup/Signup";
import Reset from "../Components/login&signup/Reset";
import Registration from "../Components/register/Registration";
import LandingPage from "../Components/login&signup/LandingPage";

import StudentDetails from "../Components/register/StudentDetails";
import StudentUpdateDetailForm from "../Components/register/StudentUpdateDetailForm";
import Reminders from "../Components/reminders/Reminders";
import RoomsAndResidents from "../Components/rooms_and_residents/RoomsAndResidents";
import Sidebar from "../Components/sidebar/Sidebar";
import StoreRoom from "../Components/storeRoom/StoreRoom";
import StoreRoomInventory from "../Components/storeRoom/storeRoomSidebar/storeroomInventory/StoreRoomInventory";
import UsersAndRoles from "../Components/users_and_roles/User/UsersAndRoles";
import SubscriptionPlans from "../Components/subscription/SubscriptionPlans";

import AchievementView from "../Components/achievements/AchievementView";
import ProtectedRoute from "./ProtectedRoute";
import Empolyee from "../Components/users_and_roles/Employee/Empolyee";
import AdvancePayments from "../Components/finance&Utilities/payrollManagement/AdvancePayments";

import KitchenDashboard from "../Components/dashboard/KitchenDashboard";

import RecycleBin from "../Components/recycle_bin/RecycleBin";
import DashboardWarden from "../Components/dashboard/DashboardWarden";
import ExpenseOverview from "../Components/dashboard/ExpenseOverview";

import LpgCylinderMain from "../Components/food_and_kitchen/foodAndKitchenSideBar/LPG Cylinder/LpgCylinderMain"
import Vacation from "../Components/vacation/Vacation";
import RegisterPG from "../Components/register/pg/RegisterPG";
import AddPgDetails from "../Components/register/pg/AddPgDetails";
import PgUpdateForm from "../Components/register/pg/PgUpdateForm";
import StaffDashboard from "../Components/dashboard/StaffDashboard";
import Amount from "../Components/finance&Utilities/dailyExpense/Amount";
import PublicRoute from "./PublicRoute";
import WelcomeSplash from "../Components/login&signup/WelcomeSplash";
import CreateTenant from "../Components/login&signup/CreateTenant";
import { Navigate } from "react-router-dom";

import Settings from "../Components/settings/Settings";



export const route1 = [
  {
    id: 1,
    path: "/",
    element: <LandingPage />,
  },
  {
    id: 102,
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
{
    id: 99,
    path: "/welcome",
    element: <WelcomeSplash />, // App.js handles the protection!
  },
  {
    id: 100,
    path: "/onboard",
    element: <CreateTenant />,
  },
  {
    id: 101,
    path: "/subscription",
    element: <SubscriptionPlans />,
  },

  {
    id: 60,
    path: "/signup",
    element: <Signup />,
  },
  {
    id: 61,
    path: "/reset",
    element: <Reset />,
  },
  {
    id: 2,
    path: "/Header",
    element: <Header />,
  },
  {
    id: 3,
    path: "/Sidebar",
    element: <Sidebar />,
  },

  {
    id: 4,
    path: "/Dashboard",
    element: (
      // Allow all valid roles to reach the controller!
      <ProtectedRoute
        allowedRoles={[
          "Admin",
          "admin",
          "Warden",
          "warden",
          "chef",
          "Kitchen branch",
          "Staff",
          "staff",
        ]}
      >
        <DashboardController />
      </ProtectedRoute>
    ),
  },

  {
    id: 5,
    path: "/Registration",
    element: <Registration />,
  },

  {
    id: 6,
    path: "/RoomsAndResidents",
    element: <RoomsAndResidents />,
  },
  // Kitchen and Food related routes Updated to landing page
  {
    id: 7,
    path: "/KitchenLanding",
    element: <KitchenLanding />,
  },

  {
    id: 8,
    path: "/Attendance",
    element: <Attendance />,
  },
  {
    id: 9,
    path: "/FinanceAndUtilities",
    element: <Navigate to="/roomRent" />,
  },
  {
    id: 10,
    path: "/UsersAndRoles",
    element: <UsersAndRoles />,
  },
  {
    id: 66,
    path: "/Employee",
    element: <Empolyee />,
  },

  {
    id: 11,
    path: "/Complaints",
    element: <Complaints />,
  },

  {
    id: 12,
    path: "/Reminders",
    element: <Reminders />,
  },
  {
    id: 13,
    path: "/Storeroom",
    element: <StoreRoom />,
  },
  {
    id: 14,
    path: "/Certificates",
    element: <Certificates />,
  },
  {
    id: 15,
    path: "/Achievements",
    element: <Achievements />,
  },
  {
    id: 16,
    path: "/payroll",
    element: <Payroll />,
  },
  {
    id: 17,
    path: "/staffAttendance",
    element: <StaffAttendance />,
  },
  {
    id: 18,
    path: "/StudentUpdateDetailForm",
    element: <StudentUpdateDetailForm />,
  },
  {
    id: 19,
    path: "/StudentDetails",
    element: <StudentDetails />,
  },
  {
    id: 20,
    path: "/StoreRoomInventory",
    element: <StoreRoomInventory />,
  },

  {
    id: 22,
    path: "/dailyExpense",
    element: <DailyExpense />,
  },

  {
    id: 23,
    path: "/paymentManagement",
    element: <EBData />,
  },
  {
    id: 24,
    path: "/roomRent",
    element: <RoomRent />,
  },
  {
    id: 25,
    path: "/settings",
    element: <Settings />,
  },

  {
    id: 40,
    path: "/KitchenMenu",
    element: <KitchenMenu />,
  },
  {
    id: 41,
    path: "/KitchenExpenses",
    element: <KitchenExpenses />,
  },
  {
    id: 42,
    path: "/KitchenInventory",
    element: <KitchenInventory />,
  },

  {
    id: 43,
    path: "/AchievementView",
    element: <AchievementView />,
  },
  {
    id: 44,
    path: "/AdvancePayments",
    element: <AdvancePayments />,
  },

  {
    id: 45,
    path: "/KitchenDashboard",
    element: <KitchenDashboard />,
  },
  {
    id: 46,
    path: "/ExpenseOverview",
    element: <ExpenseOverview />,
  },

  {
    id: 45,
    path: "/recycleBin",
    element: <RecycleBin />,
  },

  {
    id: 46,
    path: "/DashboardWarden",
    element: <DashboardWarden />,
  },

  {
    id: 47,
    path: "/LpgCylinderMain",
    element: <LpgCylinderMain />,
  },

  {
    id: 48,
    path: "/Vacation",
    element: <Vacation />,
  },
  {
    id: 49,
    path: "/RegisterPG",
    element: <RegisterPG />,
  },
  {
    id: 50,
    path: "/AddPgDetails",
    element: <AddPgDetails />,
  },
  {
    id: 51,
    path: "/PgUpdateForm/:id",
    element: <PgUpdateForm />,
  },
  {
    id: 52,
    path: "/StaffDashboard",
    element: <StaffDashboard />,
  },
  {
    id: 53,
    path: "/Amount",
    element: <Amount />,
  },
  //this the EMPLOYEE
  {
    id: 54,
    path: "/Employee",
    element: <Empolyee />,
  },
  // This is the route for the main Food and Kitchen page
  {
    id: 55,
    path: "/foodAndKitchen",
    element: <FoodAndKitchen />,
  },
];
