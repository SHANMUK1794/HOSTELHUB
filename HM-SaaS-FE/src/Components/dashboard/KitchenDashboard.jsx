import React, { useState } from "react";
import { useSelector } from "react-redux";
import useDashboard from "../../hooks/useDashboard";
import { useTheme } from "../../hooks/ThemeContext";

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
} from "recharts";

const ICONS = {
  booking: "https://asset.techjose.com/Hostelos/dasboardImg/booking.png",
  acRoom: "https://asset.techjose.com/Hostelos/dasboardImg/acroom.png",
  nonAcRoom: "https://asset.techjose.com/Hostelos/dasboardImg/NonAc.png",
  vacant: "https://asset.techjose.com/Hostelos/dasboardImg/vacant.png",
  totalRooms: "https://asset.techjose.com/Hostelos/dasboardImg/totalrooms.png",
  cake: "https://asset.techjose.com/Hostelos/dasboardImg/cake.png",
  kitchen: "https://asset.techjose.com/Hostelos/dasboardImg/kitchenpot.png",
  complaints: "https://asset.techjose.com/Hostelos/dasboardImg/clipboard.png",
  inmates: "https://asset.techjose.com/Hostelos/dasboardImg/inmates.png",
  vehicles: "https://asset.techjose.com/Hostelos/dasboardImg/vehicles.png",
  present: "https://asset.techjose.com/Hostelos/dasboardImg/present.png",
  absent: "https://asset.techjose.com/Hostelos/dasboardImg/absent.png",
  store: "https://asset.techjose.com/Hostelos/dasboardImg/store.png",
  fassai: "https://asset.techjose.com/Hostelos/dasboardImg/fassai.png",
  bannerBg: "https://asset.techjose.com/Hostelos/dasboardImg/banner.jpg",
  veg: "https://asset.techjose.com/Hostelos/dasboardImg/veg.png",
  nonVeg: "https://asset.techjose.com/Hostelos/dasboardImg/nonVeg.png",
  pendingIcon:
    "https://asset.techjose.com/Hostelos/dasboardImg/pendingkitchen.png",
  completedIcon:
    "https://asset.techjose.com/Hostelos/dasboardImg/completedkitchen.png",
};

const KitchenDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();

  const { selectedBranch, tenantBranches } = useSelector(
    (state) => state.branch || {},
  );

  const branchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.role === "Chef" || user?.role === "Kitchen branch"
        ? user?.branchName
        : null;

  const [selectedAttendanceBranch, setSelectedAttendanceBranch] = useState("");
  const [selectedExpenseBranch, setSelectedExpenseBranch] = useState("");

  const availableBranches = tenantBranches || [];

  React.useEffect(() => {
    if (branchName) {
      setSelectedAttendanceBranch(branchName);
      setSelectedExpenseBranch(branchName);
    }
  }, [branchName]);

  const { data, refetch, isLoading, isError } = useDashboard(branchName);

  React.useEffect(() => {
    refetch();
  }, [branchName, refetch]);

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen text-lg font-semibold"
        style={{ color: "var(--theme-accent)" }}
      >
        Loading Dashboard...
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg font-semibold">
        Failed to load dashboard data.
      </div>
    );
  }

  const dashboard = data.data;

  // ================= ATTENDANCE =================
  const attendance =
    dashboard?.allBranchAttendance?.[selectedAttendanceBranch] || {};

  // ================= DATA =================
  const vegCount = dashboard.foodTypeSummary?.vegCount || 0;
  const nonVegCount = dashboard.foodTypeSummary?.nonVegCount || 0;
  const kitchenExpenses = dashboard.kitchenExpenses || 0;
  const complaintsPending = dashboard.pendingComplaints || 0;
  const complaintsCompleted = dashboard.closedComplaints || 0;
  const graphData =
    dashboard.dynamicGraphs?.[selectedExpenseBranch] || dashboard.graph || [];
  const vehicleCount = dashboard.vehicleCount || 0;

  return (
    <div
      className="min-h-screen p-3 sm:p-5 lg:p-8 font-[Inter] max-w-[1450px] mx-auto"
      style={{
        background: "var(--theme-app-bg)",
        fontFamily: "var(--theme-font-family-secondary)",
      }}
    >
      {/* ================= BANNER ================= */}
      <div className="relative w-full h-[180px] sm:h-[220px] lg:h-[250px] rounded-[20px] sm:rounded-[28px] overflow-hidden mb-5 shadow-sm">
        <img
          src={theme.bannerImage || ICONS.bannerBg}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover object-[right_79%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 lg:px-12">
          <p
            className="font-medium text-[10px] sm:text-xs md:text-sm tracking-widest uppercase mb-1"
            style={{ color: "var(--theme-accent)" }}
          >
            Smart Hostel Control
          </p>
          <h1
            className="font-extrabold mb-2 font-serif leading-tight"
            style={{
              color: "var(--theme-heading-text)",
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
            }}
          >
            Welcome Kitchen
          </h1>
          <p
            className="text-xs sm:text-sm lg:text-base font-medium mb-4 max-w-[650px]"
            style={{ color: "var(--theme-accent)" }}
          >
            Smart administration makes management{" "}
            <span
              className="font-bold"
              style={{ color: "var(--theme-primary-text)" }}
            >
              simple
            </span>{" "}
            and{" "}
            <span
              className="font-bold"
              style={{ color: "var(--theme-primary-text)" }}
            >
              effective
            </span>
            .
          </p>
          <button
            className="px-5 sm:px-8 py-2 rounded-full w-max text-xs sm:text-sm font-semibold shadow-md transition-colors"
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

      {/* ================= MAIN SECTION ================= */}
      <div className="w-full flex flex-col gap-5">
        {/* ================= ATTENDANCE ================= */}
        <div
          className="rounded-[18px] shadow-sm px-3 sm:px-6 py-5"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid #D9D9D9",
          }}
        >
          <div className="flex flex-col items-center">
            <h2
              className="text-[18px] sm:text-[20px] font-semibold text-center"
              style={{ color: "var(--theme-primary-text)" }}
            >
              Today's Attendance
            </h2>
            <select
              value={selectedAttendanceBranch}
              onChange={(e) => setSelectedAttendanceBranch(e.target.value)}
              className="mt-3 rounded-full px-4 py-2 text-[12px] sm:text-[13px] outline-none w-full max-w-[260px]"
              style={{
                border: "1px solid #D7D7D7",
                background: "var(--theme-card-bg)",
                color: "var(--theme-primary-text)",
              }}
            >
              {availableBranches.map((b, idx) => (
                <option key={idx} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* ================= ATTENDANCE BOXES ================= */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 max-w-[1000px] mx-auto">
            {[
              {
                title: "Inmates",
                value: attendance.totalCount || 0,
                icon: ICONS.inmates,
              },
              {
                title: "Present",
                value: attendance.totalPresent || 0,
                icon: ICONS.present,
              },
              {
                title: "Absent",
                value: attendance.totalAbsent || 0,
                icon: ICONS.absent,
              },
              { title: "Vehicles", value: vehicleCount, icon: ICONS.vehicles },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative shadow-[0px_4px_4px_0px_#00000040] rounded-[14px] flex flex-col items-center justify-center h-[95px] sm:h-[110px]"
                style={{
                  background: `linear-gradient(97.49deg, ${theme.secondaryCardBg} 3.86%, ${theme.cardBgLinear2} 94.68%)`,
                }}
              >
                <div
                  className="absolute -top-4 w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full flex items-center justify-center"
                  style={{ background: "var(--theme-card-bg-linear2)" }}
                >
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                  />
                </div>
                <h3
                  className="text-[22px] sm:text-[28px] font-semibold leading-none pt-4"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  {item.value}
                </h3>
                <p
                  className="text-[12px] sm:text-[14px] mt-1"
                  style={{ color: "var(--theme-muted-text)" }}
                >
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SECOND SECTION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[260px_260px_1fr] gap-5">
          {/* ================= KITCHEN ================= */}
          <div
            className="rounded-[18px] p-4 sm:p-5 shadow-sm min-h-[280px] flex flex-col items-center justify-between"
            style={{
              background: `linear-gradient(180deg, ${theme.cardBgLinear2} 30%, ${theme.cardBg} 100%)`,
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div>
              <div
                className="w-[110px] h-[110px] rounded-full flex items-center justify-center mb-5"
                style={{ background: "var(--theme-secondary-card-bg)" }}
              >
                <img
                  src={theme?.images?.kitchen}
                  alt="kitchen"
                  className="w-12 h-12 sm:w-9 sm:h-9 object-contain"
                />
              </div>
              <h2
                className="text-[16px] sm:text-[18px] font-semibold uppercase"
                style={{ color: "var(--theme-primary-text)" }}
              >
                Kitchen Data
              </h2>
              <p
                className="text-[11px] sm:text-[12px] mt-1"
                style={{ color: "var(--theme-muted-text)" }}
              >
                This Month Expenses
              </p>
              <h3
                className="text-[24px] sm:text-[30px] font-bold mt-4 break-words"
                style={{ color: "var(--theme-accent)" }}
              >
                ₹{kitchenExpenses.toLocaleString()}
              </h3>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <img src={ICONS.veg} alt="Veg" className="w-5 h-5" />
                  <span
                    className="text-[13px] sm:text-[14px]"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    Veg &nbsp; {vegCount}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img src={ICONS.nonVeg} alt="Non-Veg" className="w-5 h-5" />
                  <span
                    className="text-[13px] sm:text-[14px]"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    Non-Veg &nbsp; {nonVegCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= COMPLAINTS ================= */}
          <div
            className="rounded-[18px] p-4 sm:p-5 shadow-sm min-h-[280px] flex flex-col items-center justify-between"
            style={{
              background: `linear-gradient(180deg, ${theme.cardBgLinear2} 30%, ${theme.cardBg} 100%)`,
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div>
              <div
                className="w-[110px] h-[110px] rounded-full flex items-center justify-center mb-5"
                style={{ background: "var(--theme-secondary-card-bg)" }}
              >
                <img
                  src={theme?.images?.complaints}
                  alt="complaints"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <h2
                className="text-[16px] sm:text-[18px] font-semibold uppercase"
                style={{ color: "var(--theme-primary-text)" }}
              >
                Complaints
              </h2>
              <p
                className="text-[11px] sm:text-[12px] mt-1"
                style={{ color: "var(--theme-muted-text)" }}
              >
                This month complaints
              </p>
              <div className="mt-6 sm:mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full border flex items-center justify-center"
                    style={{
                      background: "var(--theme-card-bg-linear2)",
                      borderColor: "rgba(0,0,0,0.15)",
                    }}
                  >
                    <img
                      src={ICONS.pendingIcon}
                      alt="Pending"
                      className="w-4 h-4"
                    />
                  </div>
                  <span
                    className="text-[14px] sm:text-[15px]"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    Pending - {complaintsPending}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-full border flex items-center justify-center"
                    style={{
                      background: "var(--theme-card-bg-linear2)",
                      borderColor: "rgba(0,0,0,0.15)",
                    }}
                  >
                    <img
                      src={ICONS.completedIcon}
                      alt="Completed"
                      className="w-4 h-4"
                    />
                  </div>
                  <span
                    className="text-[14px] sm:text-[15px]"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    Completed - {complaintsCompleted}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= EXPENSE GRAPH ================= */}
          <div
            className="rounded-[18px] shadow-sm p-4 sm:p-5"
            style={{
              background: "var(--theme-card-bg)",
              border: "1px solid #D9D9D9",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-[16px] sm:text-[18px] font-semibold uppercase tracking-wide"
                style={{ color: "var(--theme-heading-text)" }}
              >
                Total Expenses
              </h2>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[500px] h-[260px] sm:h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={graphData || []}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
                      {(graphData || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={theme.accent} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;
