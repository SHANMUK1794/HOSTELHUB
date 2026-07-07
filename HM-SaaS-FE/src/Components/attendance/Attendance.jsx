import { useEffect, useState } from "react";
import LottieLoader from "../../Components/common_components/LottieLoader";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAttendance from "../../hooks/useAttendance";
import useRegister from "../../hooks/useRegister";
import { useSelector } from "react-redux";
import StaffSummary from "./StaffSummary";
import FoodMenu from "./FoodMenu";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ToastMessage from "../common_components/ToastMessage";

const Attendance = () => {
  const navigate = useNavigate();

  const {
    fetchAttendance,
    submitAttendance,
    isLoading,
    isSubmitting,
    summaryLoading,
    summary,
  } = useAttendance();

  const { data: masterResidents } = useRegister();

  const [localAttendance, setLocalAttendance] = useState([]);

  const residentsData = useSelector((state) => state.attendance.attendance);
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth?.user);

  const branchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.role === "Warden"
        ? user?.branchName
        : null;

  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [searchName, setSearchName] = useState("");
  const [showSummary, setShowSummary] = useState(false);
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
    const today = new Date().toISOString().split("T")[0];
    fetchAttendance({ date: today, branchName });
  }, [branchName]);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendance({ date: selectedDate, branch: branchName });
    }
  }, [selectedDate, branchName, fetchAttendance]);

  useEffect(() => {
    const roomMap = {};

    if (masterResidents && masterResidents.length > 0) {
      masterResidents.forEach((res) => {
        if (res.staying === false || res.isdeleted === true || res.vacatedate) {
          return;
        }
        const roomKey = res.roomNo || "Unassigned";
        if (!roomMap[roomKey]) {
          roomMap[roomKey] = {
            roomNo: roomKey,
            floor: res.floor || null,
            members: [],
          };
        }
        roomMap[roomKey].members.push({
          id: res._id,
          name: res.name || res.fullName || res.firstName || "Unnamed",
          attendance: null,
        });
      });
    }

    if (residentsData && residentsData.length > 0) {
      residentsData.forEach((room) => {
        const roomKey = room.roomNo || "Unassigned";
        if (!roomMap[roomKey]) {
          roomMap[roomKey] = {
            roomNo: roomKey,
            floor: room.floor || null,
            members: [],
          };
        }
        room.members.forEach((m) => {
          const existingMember = roomMap[roomKey].members.find(
            (masterMem) => masterMem.id === m.id || masterMem.name === m.name,
          );
          if (existingMember) {
            existingMember.attendance = m.attendance;
          } else {
            roomMap[roomKey].members.push({ ...m });
          }
        });
      });
    }

    const mergedArray = Object.values(roomMap).sort((a, b) =>
      String(a.roomNo).localeCompare(String(b.roomNo), undefined, {
        numeric: true,
      }),
    );

    setLocalAttendance(mergedArray);
  }, [residentsData, masterResidents]);

  const handleAttendance = (roomIndex, memberIndex, status) => {
    setLocalAttendance((prevData) =>
      prevData.map((room, rIndex) =>
        rIndex !== roomIndex
          ? room
          : {
              ...room,
              members: room.members.map((member, mIndex) =>
                mIndex !== memberIndex
                  ? member
                  : {
                      ...member,
                      attendance: member.attendance === status ? null : status,
                    },
              ),
            },
      ),
    );
  };

  const markAllAsPresent = () => {
    setLocalAttendance((prevData) =>
      prevData.map((room) => ({
        ...room,
        members: room.members.map((member) => ({
          ...member,
          attendance: "present",
        })),
      })),
    );
  };

  const handleSubmit = () => {
    submitAttendance({ localAttendance, date: selectedDate, branchName }, {
      onSuccess: () => {
        showToast("Attendance submitted successfully!", "success");
      },
      onError: (error) => {
        const errMsg = 
          error?.response?.data?.message || 
          error?.response?.data?.error || 
          error?.message || 
          "Submission failed. Please try again.";
        showToast(errMsg, "error");
      }
    });
  };

  const filteredData = (localAttendance || []).filter((room) => {
    const query = searchName.toLowerCase().trim();
    const roomMatch = room.roomNo.toLowerCase().includes(query);
    const memberMatch = room.members.some((member) =>
      member.name.toLowerCase().includes(query),
    );
    return roomMatch || memberMatch;
  });

  let totalInmates = 0;
  let totalPresent = 0;
  let totalAbsent = 0;

  filteredData.forEach((room) => {
    totalInmates += room.members.length;
    room.members.forEach((m) => {
      if (m.attendance === "present") totalPresent++;
      if (m.attendance === "absent") totalAbsent++;
    });
  });

  const getFloorText = (room) => {
    if (room.floor) return room.floor;
    if (!room.roomNo) return "-";
    const firstChar = String(room.roomNo).trim().charAt(0).toUpperCase();
    if (firstChar === "G") return "Ground Floor";
    if (firstChar === "F") return "First Floor";
    if (firstChar === "S") return "Second Floor";
    if (firstChar === "T") return "Third Floor";
    if (!isNaN(firstChar)) return `Floor ${firstChar}`;
    return `Floor ${firstChar}`;
  };

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: "var(--theme-app-bg)" }}
    >
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <LottieLoader />
        </div>
      )}

      {/* Top Tabs */}
      <div className="flex gap-3 mb-4">
        <button
          className="px-6 py-2 rounded-md font-medium text-[15px] shadow-sm"
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Residents
        </button>
        <button
          onClick={() => navigate("/staffAttendance")}
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
          Staffs
        </button>
      </div>

      {/* Main Control Panel */}
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
              className="flex items-center rounded-full px-4 py-2 w-full shadow-sm"
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
                placeholder="Search Name / Room"
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
              className="px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
              onClick={() => setShowSummary(true)}
            >
              Check Status
            </button>
            <button
              className="px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
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
            {/* Total Inmates */}
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-sm"
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
                {String(totalInmates).padStart(2, "0")}
              </span>
              <span
                className="font-medium text-[15px]"
                style={{ color: "var(--theme-primary-text)" }}
              >
                Total Inmates
              </span>
            </div>

            {/* Present — semantic green, kept fixed */}
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

            {/* Absent — semantic red, kept fixed */}
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl"
              style={{
                border: "1px solid #FF0000",
                backgroundColor: "var(--theme-card-bg)",
                boxShadow: "0 0 15px rgba(255,0,0,0.15)",
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
              className="px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
              style={{
                color: "var(--theme-accent)",
                border: "1px solid var(--theme-accent)",
                backgroundColor: "var(--theme-card-bg)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
              onClick={markAllAsPresent}
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

      {/* Table Card */}
      <div
        className="rounded-xl shadow-sm overflow-hidden mb-6"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          border: "1px solid var(--theme-filter-bg)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center whitespace-nowrap">
            <thead
              className="text-[15px] font-medium"
              style={{
                backgroundColor: "var(--theme-table-header-bg)",
                color: "var(--theme-button-text)",
              }}
            >
              <tr>
                <th className="px-6 py-4 font-semibold">Floor No</th>
                <th className="px-6 py-4 font-semibold">Room No</th>
                <th className="px-6 py-4 font-semibold">Number Of Members</th>
                <th className="px-6 py-4 font-semibold text-left">Name</th>
                <th className="px-6 py-4 font-semibold">Attendances</th>
              </tr>
            </thead>
            <tbody
              className="text-[15px]"
              style={{ color: "var(--theme-primary-text)" }}
            >
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    No records available.
                  </td>
                </tr>
              ) : (
                filteredData.map((room, roomIndex) =>
                  room.members.map((member, memberIndex) => (
                    <tr
                      key={`${roomIndex}-${memberIndex}`}
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
                      {memberIndex === 0 && (
                        <>
                          <td
                            rowSpan={room.members.length}
                            className="px-6 py-4 align-middle font-medium"
                            style={{
                              borderRight: "1px solid var(--theme-filter-bg)",
                            }}
                          >
                            {getFloorText(room)}
                          </td>
                          <td
                            rowSpan={room.members.length}
                            className="px-6 py-4 align-middle font-medium"
                            style={{
                              borderRight: "1px solid var(--theme-filter-bg)",
                            }}
                          >
                            {room.roomNo}
                          </td>
                          <td
                            rowSpan={room.members.length}
                            className="px-6 py-4 align-middle font-medium"
                            style={{
                              borderRight: "1px solid var(--theme-filter-bg)",
                            }}
                          >
                            {room.members.length}
                          </td>
                        </>
                      )}
                      <td
                        className="px-6 py-4 text-left font-medium"
                        style={{
                          borderRight: "1px solid var(--theme-filter-bg)",
                        }}
                      >
                        <span className="font-bold mr-2">•</span>
                        {member.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center">
                          {member.attendance === "present" ? (
                            <button
                              onClick={() =>
                                handleAttendance(roomIndex, memberIndex, null)
                              }
                              className="flex items-center justify-center gap-1.5 w-[110px] h-[34px] rounded-full text-white text-[14px] font-semibold shadow-sm transition-all"
                              style={{ backgroundColor: "#28A745" }}
                            >
                              <FaCheck className="w-3.5 h-3.5" /> Present
                            </button>
                          ) : member.attendance === "absent" ? (
                            <button
                              onClick={() =>
                                handleAttendance(roomIndex, memberIndex, null)
                              }
                              className="flex items-center justify-center gap-1.5 w-[110px] h-[34px] rounded-full text-white text-[14px] font-semibold shadow-sm transition-all"
                              style={{ backgroundColor: "#FF0000" }}
                            >
                              <FaTimes className="w-3.5 h-3.5" /> Absent
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
                                  handleAttendance(
                                    roomIndex,
                                    memberIndex,
                                    "present",
                                  )
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
                                  handleAttendance(
                                    roomIndex,
                                    memberIndex,
                                    "absent",
                                  )
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
                  )),
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pb-10">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-10 py-3 rounded-lg font-medium shadow-sm transition-colors ${
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
        <FoodMenu onClose={() => setShowMenu(false)} branchName={branchName} />
      )}

      {summaryLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <LottieLoader />
        </div>
      )}

      {showSummary && (
        <StaffSummary
          title="Yearly Resident Attendance"
          showRoom={true}
          months={summary}
          dataKey="users"
          isStaffSummary={false}
          onClose={() => setShowSummary(false)}
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

export default Attendance;
