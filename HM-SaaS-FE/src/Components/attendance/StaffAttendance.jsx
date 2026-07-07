import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useStaffAttendance } from "../../hooks/useStaffAttendance";
import { useEmployees } from "../../hooks/useEmployee";
import { useNavigate } from "react-router-dom";
import StaffSummary from "./StaffSummary";
import LottieLoader from "../../Components/common_components/LottieLoader";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import FoodMenu from "./FoodMenu";
import ToastMessage from "../common_components/ToastMessage";

const StaffAttendance = () => {
  const navigate = useNavigate();

  const {
    fetchStaffAttendance,
    submitStaffAttendance,
    summary,
    isLoading: isAttendanceLoading,
    isSubmitting,
    summaryLoading,
  } = useStaffAttendance();

  const { data: masterStaff, isLoading: isStaffLoading } = useEmployees();

  const staffData = useSelector((state) => state.staffAttendance.staffData);
  const user = useSelector((state) => state.auth.user);
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);

  const branchName =
    user?.role === "Admin" ? selectedBranch : user?.branchName || null;

  const normalizedBranchName =
    branchName?.toString().replace(/['"]/g, "").trim() || null;

  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [localStaffAttendance, setLocalStaffAttendance] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const [toastConfig, setToastConfig] = useState({ show: false, text: "", success: false, failed: false });

  const showToast = (text, type) => {
    setToastConfig({ show: true, text, success: type === "success", failed: type === "error" });
    setTimeout(() => {
      setToastConfig({ show: false, text: "", success: false, failed: false });
    }, 3000);
  };

  const closeToast = () => {
    setToastConfig({ show: false, text: "", success: false, failed: false });
  };

  useEffect(() => {
    if (selectedDate && normalizedBranchName) {
      fetchStaffAttendance(
        {
          date: selectedDate,
          branch: normalizedBranchName,
        },
        {
          onError: (err) => {
            const errMsg = err?.response?.data?.message || "Failed to fetch staff attendance";
            showToast(errMsg, "error");
          }
        }
      );
    }
  }, [selectedDate, normalizedBranchName]);

  useEffect(() => {
    if (!masterStaff || !Array.isArray(masterStaff)) return;

    const normalizeAttendanceValue = (value) => {
      if (value === true || value === "present") return "present";
      if (value === false || value === "absent") return "absent";
      return null;
    };

    const getStaffKey = (staff) =>
      staff?.employeeId ||
      staff?.userId ||
      staff?.id ||
      staff?.uid ||
      staff?._id ||
      null;

    const staffMap = {};
    masterStaff.forEach((staff) => {
      const key = staff._id || staff.id;
      if (key) {
        staffMap[String(key)] = {
          id: String(key),
          staffName: staff.Name || staff.name || "Unnamed",
          role: staff.Designation || staff.role || "Staff",
          shift: staff.Shift || staff.shift || "-",
          attendance: null,
        };
      }
    });

    if (Array.isArray(staffData)) {
      staffData.forEach((s) => {
        const key = getStaffKey(s);
        if (key && staffMap[String(key)]) {
          staffMap[String(key)].attendance = normalizeAttendanceValue(
            s.attendance ?? s.present,
          );
        }
      });
    }

    setLocalStaffAttendance(Object.values(staffMap));
  }, [staffData, masterStaff]);

  const handleAttendance = (staffId, status) => {
    setLocalStaffAttendance((prev) =>
      prev.map((staff) =>
        staff.id !== staffId
          ? staff
          : {
              ...staff,
              attendance: staff.attendance === status ? null : status,
            },
      ),
    );
  };

  const markAllAsPresent = () => {
    setLocalStaffAttendance((prev) =>
      prev.map((staff) => ({ ...staff, attendance: "present" })),
    );
  };

  const handleSubmit = () => {
    if (!localStaffAttendance?.length) return;

    const attendancePayload = localStaffAttendance
      .filter((staff) => staff.attendance !== null)
      .map((staff) => ({
        userId: String(staff.id),
        present: staff.attendance === "present",
      }));

    submitStaffAttendance(
      {
        localStaffAttendance: attendancePayload,
        date: selectedDate,
        branchName: normalizedBranchName,
      },
      {
        onSuccess: () => {
          showToast("Staff attendance submitted successfully!", "success");
          if (selectedDate && normalizedBranchName) {
            fetchStaffAttendance({
              date: selectedDate,
              branch: normalizedBranchName,
            });
          }
        },
        onError: (err) => {
          const errMsg = err?.response?.data?.message || err?.message || "Failed to submit attendance";
          showToast(errMsg, "error");
        }
      },
    );
  };

  const filteredData = (localStaffAttendance || []).filter(
    (item) =>
      (item?.staffName || "")
        .toLowerCase()
        .includes(searchName.toLowerCase()) ||
      (item?.role || "").toLowerCase().includes(searchName.toLowerCase()),
  );

  const totalStaff = localStaffAttendance.length;
  const totalPresent = localStaffAttendance.filter(
    (s) => s.attendance === "present",
  ).length;
  const totalAbsent = localStaffAttendance.filter(
    (s) => s.attendance === "absent",
  ).length;

  if (isAttendanceLoading || isStaffLoading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <LottieLoader />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: "var(--theme-app-bg)" }}
    >
      {/* Top Tabs */}
      <div className="flex gap-3 mb-4">
        {(user?.role === "Admin" || user?.role === "Warden") && (
          <button
            onClick={() => navigate("/attendance")}
            className="px-6 py-2 rounded-md font-medium text-[15px] transition-colors"
            style={{
              backgroundColor: "var(--theme-card-bg)",
              color: "var(--theme-accent)",
              border: "1px solid var(--theme-accent)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--theme-filter-bg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--theme-card-bg)")
            }
          >
            Residents
          </button>
        )}
        <button
          className="px-6 py-2 rounded-md font-medium text-[15px] shadow-sm"
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Staffs
        </button>
      </div>

      {/* Main Panel */}
      <div
        className="w-full rounded-xl shadow-sm p-6 mb-6"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          border: "1px solid var(--theme-filter-bg)",
        }}
      >
        <div className="flex flex-col xl:flex-row justify-between items-center gap-4 mb-6">
          <h2
            className="text-[32px] font-bold"
            style={{
              color: "var(--theme-accent)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Attendance
          </h2>

          <div className="flex-1 flex justify-center w-full max-w-xl xl:mx-4 mx-4">
            <div
              className="flex items-center border rounded-full px-4 py-2 w-full shadow-sm"
              style={{
                border: "1px solid",
                backgroundColor: "var(--theme-card-bg)",
              }}
            >
              <input
                className="w-full outline-none text-sm bg-transparent"
                style={{
                  color: "var(--theme-primary-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
                type="text"
                placeholder="Search Name / Role"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <div
                className="rounded-full p-2 flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "var(--theme-button-bg)" }}
              >
                <MagnifyingGlassIcon
                  className="w-4 h-4 font-bold"
                  style={{ color: "var(--theme-button-text)" }}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full xl:w-auto">
            <button
              className="px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
              onClick={() => setSummaryOpen(true)}
            >
              Check Status
            </button>
            <button
              className="px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
              onClick={() => setShowMenu(true)}
            >
              <img
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>"
                alt="Kitchen"
                className="w-4 h-4 filter brightness-0 invert"
              />
              Food Menu
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Total Staffs */}
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
              style={{
                border: "1px solid var(--theme-accent)",
                backgroundColor: "var(--theme-card-bg)",
              }}
            >
              <img
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>"
                alt="Inmates"
                className="w-7 h-7"
              />
              <span
                className="font-bold text-lg"
                style={{ color: "var(--theme-accent)" }}
              >
                {String(totalStaff).padStart(2, "0")}
              </span>
              <span
                className="font-medium text-[15px]"
                style={{ color: "var(--theme-primary-text)" }}
              >
                Total Staffs
              </span>
            </div>

            {/* Present — semantic green */}
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
              style={{
                border: "1px solid #00AA00",
                backgroundColor: "#F4fdf4",
              }}
            >
              <img
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>"
                alt="Present"
                className="w-7 h-7"
              />
              <span className="text-[#00AA00] font-bold text-lg">
                {String(totalPresent).padStart(2, "0")}
              </span>
              <span
                className="font-medium text-[15px]"
                style={{ color: "var(--theme-primary-text)" }}
              >
                Present
              </span>
            </div>

            {/* Absent — semantic red */}
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
              style={{
                border: "1px solid #FF0000",
                backgroundColor: "var(--theme-card-bg)",
              }}
            >
              <img
                src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>"
                alt="Absent"
                className="w-7 h-7"
              />
              <span className="text-[#FF0000] font-bold text-lg">
                {String(totalAbsent).padStart(2, "0")}
              </span>
              <span
                className="font-medium text-[15px]"
                style={{ color: "var(--theme-primary-text)" }}
              >
                Absent
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={markAllAsPresent}
              className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: "var(--theme-accent)",
                border: "1px solid var(--theme-accent)",
                backgroundColor: "var(--theme-card-bg)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              All Present
            </button>

            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-sm"
              style={{
                border: "1px solid var(--theme-accent)",
                backgroundColor: "var(--theme-filter-bg)",
              }}
            >
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-sm font-medium outline-none bg-transparent cursor-pointer"
                style={{
                  color: "var(--theme-accent)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl shadow-sm overflow-hidden mb-6"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          border: "1px solid var(--theme-filter-bg)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead
              style={{
                backgroundColor: "var(--theme-table-header-bg)",
                color: "var(--theme-button-text)",
              }}
            >
              <tr>
                <th
                  className="px-6 py-4 font-semibold"
                  style={{ fontFamily: "var(--theme-font-family-primary)" }}
                >
                  Name
                </th>
                <th
                  className="px-6 py-4 font-semibold"
                  style={{ fontFamily: "var(--theme-font-family-primary)" }}
                >
                  Role
                </th>
                <th
                  className="px-6 py-4 font-semibold"
                  style={{ fontFamily: "var(--theme-font-family-primary)" }}
                >
                  Shift
                </th>
                <th
                  className="px-6 py-4 font-semibold text-center"
                  style={{ fontFamily: "var(--theme-font-family-primary)" }}
                >
                  Attendance
                </th>
              </tr>
            </thead>

            <tbody
              className="text-[15px]"
              style={{ color: "var(--theme-primary-text)" }}
            >
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    No records available.
                  </td>
                </tr>
              ) : (
                filteredData.map((staff) => (
                  <tr
                    key={staff.id}
                    className="border-b"
                    style={{ borderColor: "var(--theme-filter-bg)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        "var(--theme-filter-bg)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td
                      className="px-6 py-4 font-medium"
                      style={{
                        borderRight: "1px solid var(--theme-filter-bg)",
                      }}
                    >
                      <span className="font-bold mr-2">•</span>
                      {staff.staffName}
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{
                        borderRight: "1px solid var(--theme-filter-bg)",
                      }}
                    >
                      {staff.role}
                    </td>
                    <td
                      className="px-6 py-4"
                      style={{
                        borderRight: "1px solid var(--theme-filter-bg)",
                      }}
                    >
                      {staff.shift}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center">
                        {staff.attendance === "present" ? (
                          <button
                            onClick={() => handleAttendance(staff.id, null)}
                            className="flex items-center justify-center gap-1.5 w-[110px] h-[34px] rounded-full text-white text-[14px] font-semibold shadow-sm transition-all"
                            style={{ backgroundColor: "#28A745" }}
                          >
                            <FaCheck className="w-3.5 h-3.5" />
                            Present
                          </button>
                        ) : staff.attendance === "absent" ? (
                          <button
                            onClick={() => handleAttendance(staff.id, null)}
                            className="flex items-center justify-center gap-1.5 w-[110px] h-[34px] rounded-full text-white text-[14px] font-semibold shadow-sm transition-all"
                            style={{ backgroundColor: "#FF0000" }}
                          >
                            <FaTimes className="w-3.5 h-3.5" />
                            Absent
                          </button>
                        ) : (
                          <div
                            className="flex items-center justify-center gap-2 w-[110px] h-[34px] rounded-full px-2"
                            style={{
                              border: "1.5px solid var(--theme-accent)",
                              backgroundColor: "var(--theme-card-bg)",
                            }}
                          >
                            <button
                              onClick={() =>
                                handleAttendance(staff.id, "present")
                              }
                              className="flex items-center justify-center w-9 h-5 rounded-[4px] transition-colors"
                              style={{ border: "1px solid #28A745" }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#f0fdf4")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "transparent")
                              }
                            >
                              <FaCheck
                                className="w-2.5 h-2.5"
                                style={{ color: "#28A745" }}
                              />
                            </button>
                            <button
                              onClick={() =>
                                handleAttendance(staff.id, "absent")
                              }
                              className="flex items-center justify-center w-9 h-5 rounded-[4px] transition-colors"
                              style={{ border: "1px solid #FF0000" }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#fff1f2")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "transparent")
                              }
                            >
                              <FaTimes
                                className="w-2.5 h-2.5"
                                style={{ color: "#FF0000" }}
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pb-10">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-10 py-3 rounded-lg font-medium transition-colors ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {showMenu && (
        <FoodMenu
          onClose={() => setShowMenu(false)}
          branchName={normalizedBranchName}
        />
      )}

      {summaryLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <LottieLoader />
        </div>
      )}

      {summaryOpen && (
        <StaffSummary
          title="Yearly Staff Attendance"
          showRoom={false}
          dataKey="staff"
          months={summary}
          isStaffSummary={true}
          onClose={() => setSummaryOpen(false)}
          showToast={showToast}
        />
      )}

      {toastConfig.show && (
        <ToastMessage
          text={toastConfig.text}
          success={toastConfig.success}
          failed={toastConfig.failed}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default StaffAttendance;
