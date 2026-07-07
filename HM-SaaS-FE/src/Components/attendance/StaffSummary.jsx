import { useEffect, useState } from "react";
import useAttendance from "../../hooks/useAttendance";
import DatePicker from "../common_components/DatePicker";
import { useSelector } from "react-redux";
import { useStaffAttendance } from "../../hooks/useStaffAttendance";

const StaffSummary = ({
  onClose,
  title,
  showRoom = false,
  dataKey = "users",
  isStaffSummary = false,
  showToast,
}) => {
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ", ");
  };

  const user = useSelector((state) => state.auth.user);
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);

  const branchName =
    user?.role === "Admin" ? selectedBranch : user?.branchName || null;

  const [selectedYearMonth, setSelectedYearMonth] = useState("");
  const [dataList, setDataList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const { getAttendanceSummary } = useAttendance();
  const { getStaffSummary } = useStaffAttendance();

  useEffect(() => {
    if (!selectedYearMonth || !branchName) return;

    if (isStaffSummary) {
      getStaffSummary(
        { branchName, yearMonth: selectedYearMonth },
        {
          onSuccess: (data) => {
            setDataList(data.employees || data.staff || data.users || []);
            setSelectedMonth(data?.month || "");
          },
          onError: (err) => {
            setDataList([]);
            const errMsg = err?.response?.data?.message || "Failed to fetch summary";
            showToast?.(errMsg, "error");
          },
        },
      );
    } else {
      getAttendanceSummary(
        { branchName, yearMonth: selectedYearMonth },
        {
          onSuccess: (data) => {
            setDataList(data?.users || []);
            setSelectedMonth(data?.month || "");
          },
          onError: (err) => {
            setDataList([]);
            const errMsg = err?.response?.data?.message || "Failed to fetch summary";
            showToast?.(errMsg, "error");
          },
        },
      );
    }
  }, [
    selectedYearMonth,
    branchName,
    getAttendanceSummary,
    getStaffSummary,
    isStaffSummary,
  ]);

  return (
    <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-0 pb-10">
      <div
        className="w-full max-w-[900px] max-h-[calc(100vh-140px)] overflow-hidden rounded-[20px] shadow-2xl flex flex-col"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        {/* Header */}
        <div className="p-6 pb-2">
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-2xl font-bold"
              style={{
                color: "var(--theme-primary-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-3xl leading-none transition-colors"
              style={{ color: "var(--theme-muted-text)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--theme-muted-text)")
              }
            >
              ×
            </button>
          </div>

          <div className="flex gap-4">
            <DatePicker
              selectedYearMonth={selectedYearMonth}
              onChange={(value) => setSelectedYearMonth(value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-6 pt-2 flex-1 overflow-y-auto scrollbar-hide">
          {dataList.length === 0 ? (
            <p
              className="mt-10 text-center italic text-lg"
              style={{
                color: "var(--theme-muted-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              No attendance data available for{" "}
              {selectedMonth || "selected month"}
            </p>
          ) : (
            <div
              className="rounded-[15px] p-4 shadow-inner"
              style={{ backgroundColor: "var(--theme-filter-bg)" }}
            >
              <table
                className="w-full text-center border-separate"
                style={{ borderSpacing: "0 10px" }}
              >
                <thead>
                  <tr
                    className="text-[16px]"
                    style={{
                      backgroundColor: "var(--theme-table-header-bg)",
                      color: "var(--theme-button-text)",
                    }}
                  >
                    {showRoom && (
                      <th
                        className="px-4 py-3 rounded-l-lg font-medium"
                        style={{
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        Room N.O
                      </th>
                    )}
                    <th
                      className={`px-4 py-3 font-medium ${!showRoom ? "rounded-l-lg" : ""}`}
                      style={{ fontFamily: "var(--theme-font-family-primary)" }}
                    >
                      Name
                    </th>
                    <th
                      className="px-4 py-3 font-medium"
                      style={{ fontFamily: "var(--theme-font-family-primary)" }}
                    >
                      Shift
                    </th>
                    <th
                      className="px-4 py-3 font-medium"
                      style={{ fontFamily: "var(--theme-font-family-primary)" }}
                    >
                      Present
                    </th>
                    <th
                      className="px-4 py-3 font-medium"
                      style={{ fontFamily: "var(--theme-font-family-primary)" }}
                    >
                      Absent
                    </th>
                    <th
                      className="px-4 py-3 rounded-r-lg font-medium text-left pl-6"
                      style={{ fontFamily: "var(--theme-font-family-primary)" }}
                    >
                      Absent Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((s, index) => (
                    <tr
                      key={s.userId || s.uid || index}
                      className="shadow-sm group"
                      style={{ backgroundColor: "var(--theme-app-bg)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--theme-card-bg)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "var(--theme-app-bg)")
                      }
                    >
                      {showRoom && (
                        <td
                          className="px-4 py-3 rounded-l-[10px]"
                          style={{
                            color: "var(--theme-primary-text)",
                            border: "1px solid var(--theme-filter-bg)",
                            borderRight: "none",
                          }}
                        >
                          {s.roomNo ?? "-"}
                        </td>
                      )}
                      <td
                        className={`px-4 py-3 font-medium ${!showRoom ? "rounded-l-[10px]" : ""}`}
                        style={{
                          color: "var(--theme-primary-text)",
                          borderTop: "1px solid var(--theme-filter-bg)",
                          borderBottom: "1px solid var(--theme-filter-bg)",
                          borderLeft: !showRoom
                            ? "1px solid var(--theme-filter-bg)"
                            : "none",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        {s.name || s.staffName}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{
                          color: "var(--theme-primary-text)",
                          borderTop: "1px solid var(--theme-filter-bg)",
                          borderBottom: "1px solid var(--theme-filter-bg)",
                        }}
                      >
                        {s.shift || "1st Shift"}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{
                          color: "var(--theme-primary-text)",
                          borderTop: "1px solid var(--theme-filter-bg)",
                          borderBottom: "1px solid var(--theme-filter-bg)",
                        }}
                      >
                        {s.present}
                      </td>
                      <td
                        className="px-4 py-3"
                        style={{
                          color: "var(--theme-primary-text)",
                          borderTop: "1px solid var(--theme-filter-bg)",
                          borderBottom: "1px solid var(--theme-filter-bg)",
                        }}
                      >
                        {s.absent}
                      </td>
                      <td
                        className="px-4 py-3 rounded-r-[10px] text-left pl-6 text-sm"
                        style={{
                          color: "var(--theme-muted-text)",
                          border: "1px solid var(--theme-filter-bg)",
                          borderLeft: "none",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        {Array.isArray(s.absentDates)
                          ? s.absentDates.map(formatDate).join("")
                          : formatDate(s.absentDates)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffSummary;
