import React, { useEffect, useState, useMemo } from "react";
import useDashboard from "../../hooks/useDashboard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/ThemeContext";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const StaffDashboard = () => {
  const { data, refetch } = useDashboard();
  const getBranchName = useSelector((state) => state.branch.selectedBranch);
  const tenantBranches =
    useSelector((state) => state.branch.tenantBranches) || [];
  const { theme } = useTheme();

  const [selectedHostel, setSelectedHostel] = useState("");
  const navigate = useNavigate();

  const handleHostelChange = (event) => setSelectedHostel(event.target.value);

  const getSelectedHostelData = useMemo(() => {
    if (!data?.data) return null;
    return data.data.dynamicRoomSummaries?.[selectedHostel] || {};
  }, [selectedHostel, data]);

  const selectedAttendance = useMemo(() => {
    if (!data?.data?.allBranchAttendance) return null;
    return data.data.allBranchAttendance[selectedHostel] || {};
  }, [selectedHostel, data]);

  const selectedHostelData = getSelectedHostelData;

  useEffect(() => {
    refetch();
  }, [getBranchName]);

  useEffect(() => {
    if (getBranchName) setSelectedHostel(getBranchName);
  }, [getBranchName]);

  // 🛠️ Enforce perfect math for attendance
  const inmatesCount = selectedAttendance?.totalCount || 0;
  const presentCount = selectedAttendance?.totalPresent || 0;
  const absentCount = Math.max(0, inmatesCount - presentCount);

  const Card = ({ children, className = "" }) => (
    <div
      className={`rounded-3xl p-6 shadow-sm ${className}`}
      style={{
        background: "var(--theme-card-bg)",
        border: "1px solid rgba(0,0,0,0.07)",
      }}
    >
      {children}
    </div>
  );

  return (
    <div
      className="min-h-screen p-4 md:p-6 lg:p-8 font-sans"
      style={{
        background: "var(--theme-app-bg)",
        fontFamily: "var(--theme-font-family-secondary)",
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ===== HEADER BANNER ===== */}
        <div className="relative w-full min-h-[180px] md:min-h-[220px] flex rounded-3xl overflow-hidden shadow-sm">
          <img
            src={
              theme.bannerImage ||
              "https://asset.techjose.com/Hostelos/dasboardImg/banner.jpg"
            }
            alt="Room Background"
            className="absolute inset-0 w-full h-full object-cover object-[right_79%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
          <div className="relative z-10 flex flex-col justify-center px-6 py-8 w-full md:px-12">
            <p
              className="font-medium text-xs md:text-sm tracking-widest uppercase mb-1"
              style={{ color: "var(--theme-accent)" }}
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
              Welcome Office
            </h1>
            <p
              className="font-bold mb-5"
              style={{ color: "var(--theme-accent)" }}
            >
              Smart administration makes management{" "}
              <span
                className="text-sm md:text-base font-medium"
                style={{ color: "var(--theme-primary-text)" }}
              >
                simple
              </span>{" "}
              <span
                className="font-bold"
                style={{ color: "var(--theme-accent)" }}
              >
                and
              </span>{" "}
              <span
                className="text-sm md:text-base font-medium"
                style={{ color: "var(--theme-primary-text)" }}
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

        {/* ===== ROW 1: RESERVATION & KITCHEN ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reservation Overview Container */}
          <Card className="lg:col-span-2">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="p-4 rounded-2xl col-span-2 flex items-center gap-4 transition cursor-pointer"
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
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    {selectedHostelData?.bookings || 0}
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
                  val: selectedHostelData?.totalAC || 0,
                  label: "AC Rooms",
                },
                {
                  icon: "https://asset.techjose.com/Hostelos/NewImages/Fan.png",
                  val: selectedHostelData?.totalNonAC || 0,
                  label: "Non AC Rooms",
                },
                {
                  icon: "https://asset.techjose.com/Hostelos/dasboardImg/vacant.png",
                  val: selectedHostelData?.totalVacant || 0,
                  label: "Total Vacant",
                },
                {
                  icon: "https://asset.techjose.com/Hostelos/NewImages/TotalRoom.png",
                  val: selectedHostelData?.roomCount || 0,
                  label: "Total Rooms",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl flex items-center gap-3 transition cursor-pointer"
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
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div>
                    <p
                      className="text-xl font-bold"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {item.val}
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

          {/* Kitchen Data Card */}
          <div
            className="rounded-3xl p-6 shadow-sm flex flex-col justify-between cursor-pointer transition"
            style={{
              background:
                "linear-gradient(to bottom, var(--theme-card-bg-linear2), var(--theme-card-bg))",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
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
                  className="font-bold uppercase tracking-wide mb-1"
                  style={{
                    color: "var(--theme-heading-text)",
                    fontSize: "var(--theme-font-card-title)",
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
                  ₹{(data?.data?.kitchenExpenses || 0).toLocaleString()}
                </p>
              </div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm shrink-0 overflow-hidden"
                style={{
                  background: "var(--theme-card-bg)",
                  border: "1px solid rgba(0,0,0,0.07)",
                }}
              >
                <img
                  src={theme?.images?.kitchen}
                  alt="Kitchen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={"https://asset.techjose.com/Hostelos/vegicon.png"}
                    alt="veg"
                    className="w-5 h-5"
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    Veg{" "}
                    <span
                      className="font-normal ml-2"
                      style={{ color: "var(--theme-muted-text)" }}
                    >
                      {data?.data?.foodTypeSummary?.vegCount || 0}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={"https://asset.techjose.com/Hostelos/nonvegicon.png"}
                    alt="non-veg"
                    className="w-5 h-5"
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    Non-Veg{" "}
                    <span
                      className="font-normal ml-2"
                      style={{ color: "var(--theme-muted-text)" }}
                    >
                      {data?.data?.foodTypeSummary?.nonVegCount || 0}
                    </span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/KitchenExpenses")}
                className="text-xs underline font-medium mt-auto mb-1"
                style={{ color: "var(--theme-accent)" }}
              >
                View details
              </button>
            </div>
          </div>
        </div>

        {/* ===== ROW 2: ATTENDANCE & EXPENSES ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
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
                  label: "Inmates",
                  val: inmatesCount,
                  icon: "https://asset.techjose.com/Hostelos/dasboardImg/inmates.png",
                },
                {
                  label: "Vehicles",
                  val: data?.data?.vehicleCount || 0,
                  icon: "https://asset.techjose.com/Hostelos/dasboardImg/vehicles.png",
                },
                {
                  label: "Present",
                  val: presentCount,
                  icon: "https://asset.techjose.com/Hostelos/dasboardImg/present.png",
                },
                {
                  label: "Absent",
                  val: absentCount,
                  icon: "https://asset.techjose.com/Hostelos/dasboardImg/absent.png",
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
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-2 shadow-lg"
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
                    {item.val}
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

          <Card className="lg:col-span-2 flex flex-col">
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
            </div>
            <div className="flex-1 w-full min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    data?.data?.dynamicGraphs?.[selectedHostel] ||
                    data?.data?.graph ||
                    []
                  }
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  barSize={24}
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
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {(data?.data?.graph || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={theme.accent} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
