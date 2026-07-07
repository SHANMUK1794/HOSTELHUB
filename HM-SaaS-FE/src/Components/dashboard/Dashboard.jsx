import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useDashboard from "../../hooks/useDashboard";
import LottieLoader from "../../Components/common_components/LottieLoader";
import { useTheme } from "../../hooks/ThemeContext";

const Dashboard = () => {
  const { data, refetch, isLoading, isError } = useDashboard();
  const getBranchName = useSelector((state) => state.branch.selectedBranch);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // --- Data Extraction Logic ---
  const dashboardData = data?.data || {};
  const dynamicRooms = dashboardData.dynamicRoomSummaries || {};
  const availableBranches =
    useSelector((state) => state.branch.tenantBranches) || [];

  // --- States for Dropdowns ---
  const [selectedHostel, setSelectedHostel] = useState("");
  const [selectedAttendanceBranch, setSelectedAttendanceBranch] = useState("");
  const [selectedExpenseBranch, setSelectedExpenseBranch] = useState("");

  useEffect(() => {
    refetch();
  }, [getBranchName, refetch]);

  useEffect(() => {
    setSelectedHostel(getBranchName);
    setSelectedAttendanceBranch(getBranchName);
    setSelectedExpenseBranch(getBranchName);
  }, [getBranchName]);

  // 1. Reservation Logic (Switches data based on dropdown)
  const getSelectedHostelData = () => {
    return dynamicRooms[selectedHostel] || {};
  };
  const reservationData = getSelectedHostelData();

  // 2. Staff Attendance Logic
  const staffAttendanceData =
    dashboardData.allBranchStaffAttendance?.[selectedAttendanceBranch] || {};

  // 3. General Data Fallbacks
  const storeRoomData = dashboardData.storeRoom || {
    totalItems: 0,
    thisMonthExpense: 0,
    lastExpense: 0,
  };
  const fassaiData = dashboardData.fassai || {
    message: "No certificate found",
  };
  const kitchenData = dashboardData.foodTypeSummary || {
    vegCount: 0,
    nonVegCount: 0,
  };

  // --- Loading / Error States ---
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--theme-app-bg)" }}
      >
        <LottieLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        Failed to load dashboard data.
      </div>
    );
  }

  // --- Reusable UI Card Wrapper ---
  const Card = ({ children, className = "", onClick = null }) => (
    <div
      onClick={onClick}
      className={`rounded-3xl p-6 shadow-sm ${onClick ? "cursor-pointer transition" : ""} ${className}`}
      style={{
        background: "var(--theme-card-bg)",
        border: "1px solid rgba(0,0,0,0.07)",
      }}
      onMouseEnter={
        onClick
          ? (e) =>
              (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)")
          : undefined
      }
      onMouseLeave={
        onClick
          ? (e) =>
              (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.07)")
          : undefined
      }
    >
      {children}
    </div>
  );

  console.log("Dashboard Data:", dashboardData);
  console.log("Staff Attendance Data for", selectedAttendanceBranch, staffAttendanceData);
  console.log("Reservation Data for", selectedHostel, reservationData);

  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-4 font-sans"
      style={{
        background: "var(--theme-app-bg)",
        fontFamily: "var(--theme-font-family-secondary)",
      }}
    >

      {/* ==================== ROW 1: TOP BANNER ==================== */}
      <div className="relative w-full h-[180px] md:h-[250px] rounded-3xl overflow-hidden mb-6 shadow-sm">
        <img
          src={
            theme.bannerImage ||
            "https://asset.techjose.com/Hostelos/dasboardImg/banner.jpg"
          }
          alt="Room Background"
          className="absolute inset-0 w-full h-full object-cover object-[right_79%]"
        />

        {/* Adjusted the gradient to be slightly more transparent on the right so the sofa is clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-[transparent] to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
          <p
            className="font-medium text-xs md:text-sm tracking-widest uppercase mb-1"
            style={{
              color: "var(--theme-accent)",
              fontSize: "var(--theme-font-xs)",
            }}
          >
            Smart Hostel Control
          </p>
          <h1
            className="font-extrabold mb-2 font-serif"
            style={{
              color: "var(--theme-primary-text)",
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
            }}
          >
            Welcome Admin
          </h1>
          <p
            className="font-medium mb-5"
            style={{
              color: "var(--theme-primary-text)",
              fontSize: "var(--theme-font-small)",
            }}
          >
            Smart administration makes management{" "}
            <span
              className="font-bold"
              style={{ color: "var(--theme-accent)" }}
            >
              simple
            </span>{" "}
            and{" "}
            <span
              className="font-bold"
              style={{ color: "var(--theme-accent)" }}
            >
              effective
            </span>
            .
          </p>
          <button
            className="px-8 py-2.5 rounded-full w-max text-sm font-semibold shadow-md transition-colors"
            style={{
              background: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--theme-accent-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--theme-button-bg)")
            }
          >
            View More
          </button>
        </div>
      </div>

      {/* ==================== ROW 2: TOP GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* 1. RESERVATION OVERVIEW */}
        <Card className="lg:col-span-5">
          <div className="flex justify-between items-center mb-6">
            <h2
              className="font-bold uppercase tracking-wide"
              style={{
                color: "var(--theme-heading-text)",
                fontSize: "var(--theme-font-card-title)",
              }}
            >
              Reservation Overview
            </h2>
            <select
              value={selectedHostel}
              onChange={(e) => setSelectedHostel(e.target.value)}
              className="rounded-full px-4 py-1 text-sm focus:outline-none cursor-pointer"
              style={{
                border: "1px solid #D1D5DB",
                background: "var(--theme-card-bg)",
                color: "var(--theme-primary-text)",
              }}
            >
              {availableBranches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => navigate("/RoomsAndResidents")}
              className="p-4 rounded-2xl col-span-2 flex items-center gap-4 cursor-pointer transition"
              style={{
                background: "var(--theme-secondary-card-bg)",
                border: "1px solid transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--theme-accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm shrink-0"
                style={{
                  background: "var(--theme-card-bg-linear2)",
                  border: "1px solid rgba(0,0,0,0.07)",
                }}
              >
                <img
                  src={
                    "https://asset.techjose.com/Hostelos/dasboardImg/booking.png"
                  }
                  alt="Bookings"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  {reservationData.totalBookings || 0}
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  Bookings
                </p>
              </div>
            </div>

            {[
              {
                icon: "https://asset.techjose.com/Hostelos/dasboardImg/acroom.png",
                val: reservationData.totalAC,
                label: "AC Rooms",
                iconSize: "w-5 h-5",
              },
              {
                icon: "https://asset.techjose.com/Hostelos/NewImages/Fan.png",
                val: reservationData.totalNonAC,
                label: "Non AC Rooms",
                iconSize: "w-7 h-7",
              },
              {
                icon: "https://asset.techjose.com/Hostelos/dasboardImg/vacant.png",
                val: reservationData.totalVacant,
                label: "Total Vacant",
                iconSize: "w-5 h-5",
              },
              {
                icon: "https://asset.techjose.com/Hostelos/NewImages/TotalRoom.png",
                val: reservationData.roomCount,
                label: "Total Rooms",
                iconSize: "w-7 h-7",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate("/RoomsAndResidents")}
                className="p-4 rounded-2xl flex items-center gap-3 cursor-pointer transition"
                style={{
                  background: "var(--theme-secondary-card-bg)",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--theme-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "transparent")
                }
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0"
                  style={{
                    background: "var(--theme-card-bg-linear2)",
                    border: "1px solid rgba(0,0,0,0.07)",
                  }}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className={`${item.iconSize || "w-5 h-5"} object-contain`}
                  />
                </div>
                <div>
                  <p
                    className="text-xl font-bold"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    {item.val || 0}
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* MIDDLE COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* 2. BIRTHDAY REMINDER */}
          <div
            className="rounded-3xl p-6 shadow-sm flex items-center gap-6 cursor-pointer transition flex-1"
            style={{
              background:
                "linear-gradient(to bottom, var(--theme-card-bg-linear2), var(--theme-card-bg))",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
            onClick={() => navigate("/Reminders")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.07)")
            }
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm shrink-0"
              style={{ background: "var(--theme-card-bg)" }}
            >
              <img
                src={theme?.images?.birthday}
                alt="Birthday"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex flex-col items-start">
              <h2
                className="font-medium uppercase tracking-wide mb-1"
                style={{
                  color: "var(--theme-primary-text)",
                  fontSize: "var(--theme-font-small)",
                }}
              >
                Birthday Reminder
              </h2>
              {data?.data?.birthday?.count > 0 ? (
                <>
                  <p
                    className="font-['Montserrat'] font-medium text-[16px] italic mt-1"
                    style={{ color: "var(--theme-accent)" }}
                  >
                    {data.data.birthday.count > 1
                      ? `${data.data.birthday.first.Name} & ${data.data.birthday.count - 1} more`
                      : data.data.birthday.first.Name}
                  </p>
                  <p
                    className="font-['Montserrat'] font-medium text-[13px] mt-1 mb-3"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    {data.data.birthday.count > 1
                      ? "Multiple Birthdays Today!"
                      : `Room No - ${data.data.birthday.first.RoomNo || "Staff"}`}
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="font-['Montserrat'] font-medium text-[16px] italic mt-1"
                    style={{ color: "var(--theme-accent)" }}
                  >
                    No Birthdays Today
                  </p>
                  <p
                    className="font-['Montserrat'] font-medium text-[13px] mt-1 mb-3"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    —
                  </p>
                </>
              )}
              <span
                className="text-xs underline font-medium mt-auto"
                style={{ color: "var(--theme-accent)" }}
              >
                View details
              </span>
            </div>
          </div>

          {/* 3. KITCHEN DATA */}
          <div
            className="rounded-3xl p-6 shadow-sm cursor-pointer transition flex-1 flex flex-col justify-between"
            style={{
              background:
                "linear-gradient(to bottom, var(--theme-card-bg-linear2), var(--theme-card-bg))",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
            onClick={() => navigate("/FoodAndKitchen")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.07)")
            }
          >
            <div className="flex justify-between items-start">
              <div>
                <h2
                  className="font-medium uppercase tracking-wide mb-1"
                  style={{
                    color: "var(--theme-primary-text)",
                    fontSize: "var(--theme-font-small)",
                  }}
                >
                  Kitchen Data
                </h2>
                <p
                  className="text-xs mb-2"
                  style={{ color: "var(--theme-muted-text)" }}
                >
                  This Month Expenses
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: "var(--theme-accent)" }}
                >
                  ₹{dashboardData.kitchenExpenses?.toLocaleString() || 0}
                </p>
              </div>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm shrink-0"
                style={{ background: "var(--theme-card-bg)" }}
              >
                <img
                  src={theme?.images?.kitchen}
                  alt="Kitchen"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div
                className="flex items-center gap-4 text-sm font-bold"
                style={{ color: "var(--theme-primary-text)" }}
              >
                <span className="flex items-center gap-1">
                  <img
                    src="https://asset.techjose.com/Hostelos/vegicon.png"
                    alt="veg icon"
                    className="w-4 h-4"
                  />
                  Veg{" "}
                  <span
                    className="font-normal"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    {kitchenData.vegCount}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <img
                    src="https://asset.techjose.com/Hostelos/nonvegicon.png"
                    alt="non-veg icon"
                    className="w-4 h-4"
                  />
                  Non-Veg{" "}
                  <span
                    className="font-normal"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    {kitchenData.nonVegCount}
                  </span>
                </span>
              </div>
              <span
                className="text-xs underline font-medium"
                style={{ color: "var(--theme-accent)" }}
              >
                View details
              </span>
            </div>
          </div>
        </div>

        {/* 4. COMPLAINTS */}
        <div
          className="rounded-3xl p-6 shadow-sm lg:col-span-3 flex flex-col items-center justify-center text-center cursor-pointer transition"
          style={{
            background:
              "linear-gradient(to bottom, var(--theme-card-bg-linear2), var(--theme-card-bg))",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
          onClick={() => navigate("/complaints")}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.10)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.07)")
          }
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center shadow-sm mb-4"
            style={{ background: "var(--theme-card-bg)" }}
          >
            <img
              src={theme?.images?.complaints}
              alt="Complaints"
              className="w-10 h-10 object-contain"
            />
          </div>
          <h2
            className="font-medium uppercase tracking-wide mb-1"
            style={{
              color: "var(--theme-primary-text)",
              fontSize: "var(--theme-font-card-title)",
            }}
          >
            Complaints
          </h2>
          <p
            className="text-xs mb-6"
            style={{ color: "var(--theme-muted-text)" }}
          >
            This Month complaints
          </p>
          <div className="w-full space-y-3 mb-6">
            <div
              className="flex justify-center items-center gap-2 font-bold text-sm"
              style={{ color: "var(--theme-primary-text)" }}
            >
              <span
                className="w-4 h-4 rounded border-2 flex items-center justify-center text-[10px]"
                style={{
                  borderColor: "var(--theme-accent)",
                  color: "var(--theme-accent)",
                }}
              >
                ⏳
              </span>
              Pending –{" "}
              <span
                className="font-normal"
                style={{ color: "var(--theme-muted-text)" }}
              >
                {dashboardData.pendingComplaints || 0}
              </span>
            </div>
            <div
              className="flex justify-center items-center gap-2 font-bold text-sm"
              style={{ color: "var(--theme-primary-text)" }}
            >
              <span
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px]"
                style={{
                  borderColor: "var(--theme-accent)",
                  color: "var(--theme-accent)",
                }}
              >
                ✓
              </span>
              Completed –{" "}
              <span
                className="font-normal"
                style={{ color: "var(--theme-muted-text)" }}
              >
                {dashboardData.closedComplaints || 0}
              </span>
            </div>
          </div>
          <span
            className="text-xs underline font-medium mt-auto"
            style={{ color: "var(--theme-accent)" }}
          >
            View details
          </span>
        </div>
      </div>

      {/* ==================== ROW 3: MIDDLE GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* 5. TODAY'S ATTENDANCE */}
        <Card className="lg:col-span-4" onClick={() => navigate("/Attendance")}>
          <h2
            className="font-bold uppercase tracking-wide text-center mb-6"
            style={{
              color: "var(--theme-heading-text)",
              fontSize: "var(--theme-font-card-title)",
            }}
          >
            Today's Attendance
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: "https://asset.techjose.com/Hostelos/dasboardImg/inmates.png",
                val: dashboardData.totalCount,
                label: "Inmates",
              },
              {
                icon: "https://asset.techjose.com/Hostelos/dasboardImg/vehicles.png",
                val: dashboardData.vehicleCount,
                label: "Vehicles",
              },
              {
                icon: "https://asset.techjose.com/Hostelos/dasboardImg/present.png",
                val: dashboardData.totalPresent,
                label: "Present",
              },
              {
                icon: "https://asset.techjose.com/Hostelos/dasboardImg/absent.png",
                val: dashboardData.totalAbsent,
                label: "Absent",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl flex flex-col items-center justify-center shadow-lg"
                style={{
                  background:
                    "linear-gradient(to left, var(--theme-card-bg-linear2), var(--theme-card-bg))",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-sm"
                  style={{
                    background: "var(--theme-card-bg)",
                    border: "1px solid rgba(0,0,0,0.07)",
                  }}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-5 h-5 object-contain"
                  />
                </div>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  {item.val || 0}
                </p>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* 6. TOTAL EXPENSES CHART */}
        <Card className="lg:col-span-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2
              className="font-bold uppercase tracking-wide"
              style={{
                color: "var(--theme-heading-text)",
                fontSize: "var(--theme-font-card-title)",
              }}
            >
              Total Expenses
            </h2>
            <select
              value={selectedExpenseBranch}
              onChange={(e) => setSelectedExpenseBranch(e.target.value)}
              className="rounded-full px-4 py-1.5 text-sm font-medium focus:outline-none cursor-pointer"
              style={{
                background: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
            >
              {availableBranches.map((b) => (
                <option key={b} value={b}>
                  {b} ▼
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 w-full min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={
                  dashboardData.dynamicGraphs?.[selectedExpenseBranch] ||
                  dashboardData.graph ||
                  []
                }
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="day"
                  axisLine={true}
                  tickLine={false}
                  tick={{ fill: "#4B5563", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={true}
                  tickLine={false}
                  tick={{ fill: "#4B5563", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} barSize={20}>
                  {(
                    dashboardData.dynamicGraphs?.[selectedExpenseBranch] ||
                    dashboardData.graph ||
                    []
                  ).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={theme.accent} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-end mt-2">
            <span
              onClick={() => navigate("/ExpenseOverview")}
              className="text-xs underline font-medium cursor-pointer"
              style={{ color: "var(--theme-accent)" }}
            >
              View more info
            </span>
          </div>
        </Card>
      </div>

      {/* ==================== ROW 4: BOTTOM GRID ==================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7. STAFF ATTENDANCE */}
        <Card className="lg:col-span-5 flex flex-col items-center">
          <h2
            className="font-bold uppercase tracking-wide mb-4"
            style={{
              color: "var(--theme-heading-text)",
              fontSize: "var(--theme-font-card-title)",
            }}
          >
            Staff Attendance
          </h2>
          <select
            className="rounded-full px-4 py-1.5 text-sm font-medium focus:outline-none mb-6 cursor-pointer"
            style={{
              background: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
            }}
            value={selectedAttendanceBranch}
            onChange={(e) => setSelectedAttendanceBranch(e.target.value)}
          >
            {availableBranches.map((b) => (
              <option key={b} value={b}>
                {b} ▼
              </option>
            ))}
          </select>
          <div
            className="w-full rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(0,0,0,0.08)" }}
          >
            <table className="w-full text-center">
              <thead>
                <tr
                  style={{
                    background: "var(--theme-table-header-bg)",
                    color: "var(--theme-white-text)",
                  }}
                >
                  <th className="p-3 font-medium text-left px-6">Attendance</th>
                  <th className="p-3 font-medium">Count</th>
                </tr>
              </thead>
              <tbody
                className="text-sm font-bold"
                style={{
                  background: "var(--theme-secondary-card-bg)",
                  color: "var(--theme-primary-text)",
                }}
              >
                <tr className="border-b border-white">
                  <td className="p-4 text-left px-6">Total Present</td>
                  <td className="p-4">
                    {staffAttendanceData.staffPresent || 0}
                  </td>
                </tr>
                <tr className="border-b border-white">
                  <td className="p-4 text-left px-6">Total Absent</td>
                  <td className="p-4">
                    {staffAttendanceData.staffAbsent || 0}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-left px-6">Total Staff</td>
                  <td className="p-4">{staffAttendanceData.staffTotal || 0}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* 8. STORE ROOM */}
        <div
          className="rounded-3xl p-6 shadow-sm lg:col-span-4 flex flex-col relative overflow-hidden cursor-pointer"
          style={{
            background:
              "linear-gradient(to bottom, var(--theme-card-bg-linear2), var(--theme-card-bg))",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
          onClick={() => navigate("/StoreRoom")}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-4 shrink-0 z-10"
            style={{ background: "var(--theme-card-bg)" }}
          >
            <img
              src={theme?.images?.storeRoom}
              alt="Store Room"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h2
            className="font-medium uppercase tracking-wide mb-3 z-10"
            style={{
              color: "var(--theme-primary-text)",
              fontSize: "var(--theme-font-card-title)",
            }}
          >
            Store Room
          </h2>
          <div
            className="text-sm space-y-1 mb-4 z-10"
            style={{ color: "var(--theme-primary-text)" }}
          >
            <p>
              Total Items :{" "}
              <span className="font-normal">{storeRoomData.totalItems}</span>
            </p>
            <p>
              This Month Expense :{" "}
              <span
                className="font-normal"
                style={{ color: "var(--theme-accent)" }}
              >
                ₹{storeRoomData.thisMonthExpense?.toLocaleString()}
              </span>
            </p>
            <p>
              Last Expense :{" "}
              <span className="font-normal">
                ₹{storeRoomData.lastExpense?.toLocaleString()}
              </span>
            </p>
          </div>
          <span
            className="text-xs underline font-medium cursor-pointer z-10 mt-auto"
            style={{ color: "var(--theme-accent)" }}
          >
            View details
          </span>
        </div>

        {/* 9. FASSAI */}
        <div
          className="rounded-3xl p-6 shadow-sm lg:col-span-3 flex flex-col relative overflow-hidden"
          style={{
            background:
              "linear-gradient(to bottom, var(--theme-card-bg-linear2), var(--theme-card-bg))",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm mb-4 shrink-0 z-10"
            style={{ background: "var(--theme-card-bg)" }}
          >
            <img
              src={theme?.images?.certificates}
              alt="FASSAI"
              className="w-8 h-8 object-contain"
            />
          </div>
          <h2
            className="font-medium uppercase tracking-wide mb-3 z-10"
            style={{
              color: "var(--theme-primary-text)",
              fontSize: "var(--theme-font-card-title)",
            }}
          >
            FASSAI
          </h2>
          <div className="text-sm space-y-2 mb-4 z-10">
            <p className="font-normal" style={{ color: "var(--theme-accent)" }}>
              {fassaiData.message}
            </p>
            <p
              className="text-xs leading-tight"
              style={{ color: "var(--theme-muted-text)" }}
            >
              Please renew to avoid
              <br />
              interruption
            </p>
          </div>
          <span
            className="text-xs underline font-medium cursor-pointer z-10 mt-auto"
            style={{ color: "var(--theme-accent)" }}
          >
            Check now
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
