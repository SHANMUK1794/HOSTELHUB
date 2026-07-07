import React, { useEffect, useState, useMemo } from "react";
import useDashboard from "../../hooks/useDashboard";
import { useSelector } from "react-redux";
import { useTheme } from "../../hooks/ThemeContext";

const DashboardWarden = () => {
  const { data, refetch } = useDashboard();
  const getBranchName = useSelector((state) => state.branch.selectedBranch);
  const { theme } = useTheme();

  const [selectedHostel, setSelectedHostel] = useState("");
  const availableBranches =
    useSelector((state) => state.branch.tenantBranches) || [];

  const handleHostelChange = (event) => setSelectedHostel(event.target.value);

  const getSelectedHostelData = useMemo(() => {
    if (!data?.data?.dynamicRoomSummaries) return null;
    return data.data.dynamicRoomSummaries[selectedHostel] || {};
  }, [selectedHostel, data]);

  const selectedHostelData = getSelectedHostelData;

  useEffect(() => {
    setSelectedHostel(getBranchName);
  }, [getBranchName]);

  useEffect(() => {
    refetch();
  }, [getBranchName]);

  const inmatesCount = data?.data?.totalCount || 0;
  const presentCount = data?.data?.totalPresent || 0;
  const absentCount = Math.max(0, inmatesCount - presentCount);

  return (
    <div
      className="min-h-screen py-8 px-6 md:px-8 lg:px-10"
      style={{
        background: "var(--theme-app-bg)",
        fontFamily: "var(--theme-font-family-secondary)",
      }}
    >
        {/* ===== Banner Section ===== */}
        <div className="relative w-full h-[180px] md:h-[250px] rounded-3xl overflow-hidden mb-6 shadow-sm">
          <img
            src={
              theme.bannerImage ||
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>"
            }
            alt="Room Background"
            // {/* Added 'object-right' to ensure the sofa stays in view */}
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
              Welcome Warden
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

        {/* ===== Reservation Overview ===== */}
        <div
          className="w-full max-w-full rounded-2xl shadow-sm p-6 mb-6"
          style={{
            background: "var(--theme-card-bg)",
            border: "1px solid #D1D5DB",
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className="font-montserrat font-semibold text-[22px]"
              style={{ color: "var(--theme-heading-text)" }}
            >
              Reservation Overview
            </h3>
            <select
              value={selectedHostel}
              onChange={handleHostelChange}
              className="rounded-full text-sm px-4 py-1.5 focus:outline-none shadow-sm font-medium"
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div
              className="md:col-span-2 rounded-lg p-4 flex items-center space-x-4 shadow-sm"
              style={{
                background: "var(--theme-secondary-card-bg)",
                border: "1px solid #CCCCCC",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "var(--theme-card-bg-linear2)",
                  border: "1px solid rgba(0,0,0,0.07)",
                }}
              >
                <img
                  src={
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>"
                  }
                  alt="Bookings"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  {selectedHostelData?.bookings ||
                    data?.data?.roomSummary?.bookings ||
                    0}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--theme-muted-text)" }}
                >
                  Bookings
                </span>
              </div>
            </div>

            {[
              {
                icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
                val:
                  selectedHostelData?.totalAC ||
                  data?.data?.roomSummary?.totalAC ||
                  0,
                label: "AC Rooms",
              },
              {
                icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
                val:
                  selectedHostelData?.totalNonAC ||
                  data?.data?.roomSummary?.totalNonAC ||
                  0,
                label: "Non AC Rooms",
              },
              {
                icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
                val:
                  selectedHostelData?.totalVacant ||
                  data?.data?.roomSummary?.totalVacant ||
                  0,
                label: "Total Vacant",
              },
              {
                icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
                val:
                  selectedHostelData?.roomCount ||
                  data?.data?.roomSummary?.roomCount ||
                  0,
                label: "Total Rooms",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg p-4 flex items-center space-x-4 shadow-sm"
                style={{
                  background: "var(--theme-secondary-card-bg)",
                  border: "1px solid #CCCCCC",
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
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
                <div className="flex flex-col">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    {item.val}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== 3 Columns Section ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Today's Attendance */}
          <div
            className="rounded-2xl shadow-sm p-6 flex flex-col justify-start"
            style={{
              background: "var(--theme-card-bg)",
              border: "1px solid #D1D5DB",
            }}
          >
            <h3
              className="text-center text-lg font-bold mb-6"
              style={{ color: "var(--theme-primary-text)" }}
            >
              Today's Attendance
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 mt-2">
              {[
                {
                  label: "Inmates",
                  val: inmatesCount,
                  icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
                },
                {
                  label: "Vehicles",
                  val: data?.data?.vehicleCount || 0,
                  icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
                },
                {
                  label: "Present",
                  val: presentCount,
                  icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
                },
                {
                  label: "Absent",
                  val: absentCount,
                  icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="relative rounded-xl pt-8 pb-5 flex flex-col items-center shadow-sm mt-10"
                  style={{
                    background:
                      "linear-gradient(to right, var(--theme-secondary-card-bg), var(--theme-card-bg-linear2))",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <div
                    className="absolute -top-5 w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                    style={{ background: "var(--theme-card-bg-linear2)" }}
                  >
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <span
                    className="text-xl font-bold"
                    style={{ color: "var(--theme-primary-text)" }}
                  >
                    {item.val}
                  </span>
                  <span
                    className="text-sm font-medium mt-1"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column: Birthday + Kitchen */}
          <div className="flex flex-col gap-6">
            {/* Birthday Reminder */}
            <div
              className="relative rounded-2xl p-5 shadow-sm flex items-center justify-center gap-6 flex-1"
              style={{
                background:
                  "linear-gradient(to bottom, var(--theme-card-bg-linear2), var(--theme-card-bg))",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div className="w-[80px] h-[80px] flex-shrink-0 flex items-center justify-center">
                <div
                  className="rounded-full w-full h-full flex items-center justify-center shadow-sm p-4"
                  style={{ background: "var(--theme-card-bg)" }}
                >
                  <img
                    src={theme?.images?.birthday}
                    alt="Birthday"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col items-start text-left">
                <h3
                  className="font-['Montserrat'] text-[20px] leading-[100%] uppercase"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  Birthday <br />
                  <span className="mt-2 block">Reminder</span>
                </h3>
                {data?.data?.birthday?.count > 0 ? (
                  <>
                    <p
                      className="font-['Montserrat'] font-medium text-[16px] italic mt-5"
                      style={{ color: "var(--theme-accent)" }}
                    >
                      {data.data.birthday.count > 1
                        ? `${data.data.birthday.first.Name} & ${data.data.birthday.count - 1} more`
                        : data.data.birthday.first.Name}
                    </p>
                    <p
                      className="font-['Montserrat'] font-medium text-[13px] mt-2"
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
                      className="font-['Montserrat'] font-medium text-[16px] italic mt-5"
                      style={{ color: "var(--theme-accent)" }}
                    >
                      No Birthdays Today
                    </p>
                    <p
                      className="font-['Montserrat'] font-medium text-[13px] mt-2"
                      style={{ color: "var(--theme-muted-text)" }}
                    >
                      —
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Kitchen Data */}
            <div
              className="relative rounded-[30px] p-5 shadow-sm flex-1 flex justify-between items-start"
              style={{
                background:
                  "linear-gradient(to bottom, var(--theme-card-bg-linear2), var(--theme-card-bg))",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex flex-col justify-start">
                <h3
                  className="font-['Montserrat'] font-normal text-[24px] mt-3"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  Kitchen Data
                </h3>
                <p
                  className="text-[12px] mt-3"
                  style={{ color: "var(--theme-muted-text)" }}
                >
                  This Month Expenses
                </p>
                <p
                  className="font-['Poppins'] font-medium text-[28px] mt-2"
                  style={{ color: "var(--theme-accent)" }}
                >
                  ₹{(data?.data?.kitchenExpenses || 0).toLocaleString()}
                </p>
                <div
                  className="flex items-center gap-4 mt-5 text-xs font-medium"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border border-[#06A213] flex items-center justify-center bg-white rounded-[2px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#06A213]"></span>
                    </span>
                    Veg {data?.data?.foodTypeSummary?.vegCount || 0}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border border-[#C13B3B] flex items-center justify-center bg-white rounded-[2px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C13B3B]"></span>
                    </span>
                    Non-Veg {data?.data?.foodTypeSummary?.nonVegCount || 0}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center pr-2">
                <div
                  className="rounded-full w-[64px] h-[64px] flex items-center justify-center shadow-sm p-3 mb-2"
                  style={{ background: "var(--theme-card-bg)" }}
                >
                  <img
                    src={theme?.images?.kitchen}
                    alt="Kitchen"
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  className="text-[10px] underline"
                  style={{ color: "var(--theme-accent)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--theme-accent-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--theme-accent)")
                  }
                >
                  View details
                </button>
              </div>
            </div>
          </div>

          {/* Complaints */}
          <div
            className="rounded-[30px] p-6 shadow-sm flex flex-col"
            style={{
              background:
                "linear-gradient(to bottom, var(--theme-card-bg-linear2), var(--theme-card-bg))",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="self-center rounded-full w-[96px] h-[96px] flex items-center justify-center shadow-sm p-6 mt-2 mb-4"
              style={{ background: "var(--theme-card-bg)" }}
            >
              <img
                src={theme?.images?.complaints}
                alt="Complaints"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col items-start px-2 mt-2 w-full">
              <h3
                className="font-['Montserrat'] text-[32px] font-normal leading-none"
                style={{ color: "var(--theme-primary-text)" }}
              >
                COMPLAINTS
              </h3>
              <p
                className="text-[14px] mt-3 mb-8"
                style={{ color: "var(--theme-muted-text)" }}
              >
                This Month complaints
              </p>
              <div className="flex flex-col gap-5 w-full">
                <div
                  className="flex items-center gap-4 text-[20px] font-medium"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "var(--theme-card-bg-linear2)" }}
                  >
                    <img
                      src={
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>"
                      }
                      alt="Pending"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  Pending - {data?.data?.pendingComplaints || 0}
                </div>
                <div
                  className="flex items-center gap-4 text-[20px] font-medium"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "var(--theme-card-bg-linear2)" }}
                  >
                    <img
                      src={
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>"
                      }
                      alt="Completed"
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  Completed - {data?.data?.closedComplaints || 0}
                </div>
              </div>
              <button
                className="text-[15px] underline mt-12 mb-2"
                style={{ color: "var(--theme-accent)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--theme-accent-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--theme-accent)")
                }
              >
                View details
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default DashboardWarden;
