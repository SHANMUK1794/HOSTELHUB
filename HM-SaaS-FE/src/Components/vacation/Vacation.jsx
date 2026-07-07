import React, { useState, useEffect } from "react";
import { FaPlus, FaRegTrashAlt } from "react-icons/fa";
import { PiPencilSimpleLine } from "react-icons/pi";
import { useSelector } from "react-redux";
import VacationFormPopup from "../vacation/VacationFormpopup";
import EditVacationPopup from "../vacation/EditVacationpopup";
import Delete from "../../Components/common_components/Delete";
import { useVacation, useDeleteVacation } from "../../hooks/useVacation";
import Pagination from "../common_components/Pagination";
import ToastMessage from "../common_components/ToastMessage";

const Vacation = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");

  const [selectedMonth, setSelectedMonth] = useState("All Month");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [selectedType, setSelectedType] = useState("Residents");
  const [toastConfig, setToastConfig] = useState(null);

  const toggleBtnStyle = (isActive) => ({
    backgroundColor: isActive
      ? "var(--theme-button-bg)"
      : "var(--theme-card-bg)",
    color: isActive ? "var(--theme-button-text)" : "var(--theme-button-bg)",
    border: isActive ? "none" : "1px solid var(--theme-button-bg)",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  const {
    data: vacations = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useVacation();

  const deleteVacation = useDeleteVacation();

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, selectedMonth, selectedYear, selectedType]);

  useEffect(() => {
    let timer;
    if (toastConfig) {
      timer = setTimeout(() => {
        setToastConfig(null);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [toastConfig]);

  const filteredData = vacations.filter((v) => {
    const matchesTab =
      selectedTab === "All" ||
      v.status === selectedTab ||
      v.status === selectedTab.toUpperCase();

    const vacationDate = v.dateofapply ? new Date(v.dateofapply) : null;

    const monthMatch =
      selectedMonth === "All Month" ||
      (vacationDate &&
        vacationDate.toLocaleString("default", { month: "long" }) ===
        selectedMonth);

    const yearMatch =
      selectedYear === "All Years" ||
      (vacationDate && vacationDate.getFullYear().toString() === selectedYear);

    // Use userType if available (new entries), fallback to roomtype heuristic for old entries
    const userCategory = v.userType || (v.roomtype === "AC" || v.roomtype === "Non-AC" ? "Resident" : v.roomtype === "PG" ? "PG" : "Resident");
    const typeMatch = selectedType === "All" || userCategory === (selectedType === "Residents" ? "Resident" : "PG");

    return matchesTab && monthMatch && yearMatch && typeMatch;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleEdit = (item) => {
    setEditData(item);
    setIsEditOpen(true);
  };

  const handleDelete = () => {
    deleteVacation.mutate(deleteId, {
      onSuccess: () => {
        setToastConfig({ text: "Vacation deleted successfully", type: "success" });
        setIsOpenDelete(false);
        setDeleteId(null);
      },
      onError: (error) => {
        const errMsg = error?.response?.data?.message || "Failed to delete vacation";
        setToastConfig({ text: errMsg, type: "failed" });
        setIsOpenDelete(false);
      }
    });
  };

  const showToast = (text, type) => {
    setToastConfig({ text, type: type === "success" ? "success" : "failed" });
  };

  if (isError) {
    return (
      <div
        className="p-6 min-h-screen"
        style={{ backgroundColor: "var(--theme-app-bg)" }}
      >
        <div className="text-center py-8 text-red-600">
          Error loading vacations: {error.message}
        </div>
      </div>
    );
  }

  if (!branchName) {
    return (
      <div
        className="p-6 min-h-screen"
        style={{ backgroundColor: "var(--theme-app-bg)" }}
      >
        <div className="text-center py-8 text-yellow-600">
          Please select a branch to view vacation data.
        </div>
      </div>
    );
  }

  return (
    <div
      className="lg:pl-5 p-4 md:p-6 min-h-screen"
      style={{ backgroundColor: "var(--theme-app-bg)" }}
    >
      {/* TOP TOGGLE */}
      <div className="w-full flex justify-center">
        <div className="w-full">
          <div className="flex items-center gap-6 mb-5">
            <button
              onClick={() => setSelectedType("Residents")}
              className="flex items-center justify-center font-montserrat font-medium text-[16px] w-[150px] h-[42px] rounded-[8px] transition-all duration-300 shadow-sm max-[769px]:w-[120px] max-[769px]:text-[12px] max-[426px]:w-[90px] max-[426px]:text-[9px] max-[426px]:h-[32px]"
              style={toggleBtnStyle(selectedType === "Residents")}
            >
              Residents
            </button>
            <button
              onClick={() => setSelectedType("PG")}
              className="flex items-center justify-center font-montserrat font-medium text-[16px] w-[150px] h-[42px] rounded-[8px] transition-all duration-300 shadow-sm max-[769px]:w-[120px] max-[769px]:text-[12px] max-[426px]:w-[90px] max-[426px]:text-[9px] max-[426px]:h-[32px]"
              style={toggleBtnStyle(selectedType === "PG")}
            >
              PG
            </button>
          </div>
        </div>
      </div>

      <div
        className="p-4 md:p-6 rounded-lg shadow-sm min-h-[90vh] flex flex-col"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1
            className="text-2xl font-montserrat font-bold"
            style={{ color: "var(--theme-heading-text)" }}
          >
            Vacation
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1
            className="font-['Montserrat'] font-semibold text-[18px] leading-[100%]"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Room Details
          </h1>

          <div className="flex flex-row gap-4 w-full md:w-auto">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-24 md:w-28 h-[35px] border border-gray-200 rounded-[5px] px-2 text-sm md:text-[14px] font-montserrat outline-none cursor-pointer"
              style={{
                backgroundColor: "var(--theme-secondary-card-bg)",
                color: "var(--theme-primary-text)",
              }}
            >
              <option value="All Years">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-28 md:w-32 h-[35px] border border-gray-200 rounded-[5px] px-2 text-sm md:text-[14px] font-montserrat outline-none cursor-pointer"
              style={{
                backgroundColor: "var(--theme-secondary-card-bg)",
                color: "var(--theme-primary-text)",
              }}
            >
              <option value="All Month">All Month</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 mb-4 overflow-x-auto no-scrollbar">
          {["All", "Vacated", "Pending"].map((tab) => (
            <button
              key={tab}
              className="pb-1 font-medium whitespace-nowrap transition-colors"
              style={{
                borderBottom:
                  selectedTab === tab
                    ? "2px solid var(--theme-accent)"
                    : "2px solid transparent",
                color:
                  selectedTab === tab
                    ? "var(--theme-accent)"
                    : "var(--theme-primary-text)",
              }}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-lg shadow-md flex-grow">
          {isLoading ? (
            <p
              className="text-center py-6"
              style={{ color: "var(--theme-muted-text)" }}
            >
              Loading data...
            </p>
          ) : paginatedData.length === 0 ? (
            <p
              className="text-center py-6"
              style={{ color: "var(--theme-muted-text)" }}
            >
              No vacation records found.
            </p>
          ) : (
            <table className="min-w-[1000px] lg:min-w-full border-collapse text-sm">
              <thead
                className="sticky top-0 z-[1]"
                style={{
                  backgroundColor: "var(--theme-table-header-bg)",
                  color: "var(--theme-button-text)",
                }}
              >
                <tr>
                  <th className="px-4 py-3 text-left text-[16px] font-medium first:rounded-l-lg">
                    NAME
                  </th>
                  <th className="px-4 py-2 text-left text-[16px] font-medium">
                    FLOOR NO
                  </th>
                  <th className="px-4 py-2 text-left text-[16px] font-medium">
                    ROOM NO
                  </th>
                  <th className="px-4 py-2 text-left text-[16px] font-medium">
                    ROOM TYPE
                  </th>
                  <th className="px-4 py-2 text-left text-[16px] font-medium">
                    APPLIED DATE
                  </th>
                  <th className="px-4 py-2 text-left text-[16px] font-medium leading-tight align-middle">
                    DATE OF <br /> VACATION
                  </th>
                  <th className="px-4 py-2 text-left text-[16px] font-medium">
                    STATUS
                  </th>
                  <th className="px-4 py-2 text-left text-[16px] font-medium last:rounded-r-lg">
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((item) => (
                  <tr
                    key={item._id}
                    className="text-left font-medium border-b transition"
                    style={{ backgroundColor: "var(--theme-table-row-bg)" }}
                    onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--theme-filter-bg)")
                    }
                    onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--theme-table-row-bg)")
                    }
                  >
                    <td
                      className="px-4 py-3 font-['Montserrat'] font-medium text-[14px] leading-[100%] tracking-[0%]"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {item.applicationname}
                    </td>
                    <td
                      className="px-4 py-3 font-['Montserrat'] font-medium text-[14px] leading-[100%] tracking-[0%]"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {item.floorno}
                    </td>
                    <td
                      className="px-4 py-3 font-['Montserrat'] font-medium text-[14px] leading-[100%] tracking-[0%]"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {item.roomno}
                    </td>
                    <td
                      className="px-4 py-3 font-['Montserrat'] font-medium text-[14px] leading-[100%] tracking-[0%]"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {item.roomtype}
                    </td>
                    <td
                      className="px-4 py-3 font-['Montserrat'] font-medium text-[14px] leading-[100%] tracking-[0%]"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {item.dateofapply
                        ? new Date(item.dateofapply).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                    <td
                      className="px-4 py-3 font-['Montserrat'] font-medium text-[14px] leading-[100%] tracking-[0%]"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {item.vacatedate
                        ? new Date(item.vacatedate).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                    <td
                      className="px-4 py-2 font-medium font-['Montserrat'] text-[14px] leading-[100%] tracking-[0%]"
                      style={{
                        color:
                          item.status === "VACATED" || item.status === "Vacated"
                            ? "#16a34a"
                            : "#ca8a04",
                      }}
                    >
                      {item.status}
                    </td>

                    <td className="px-4 py-2 flex items-center gap-3">
                      <div
                        onClick={() => handleEdit(item)}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-[10px] flex items-center justify-center cursor-pointer shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                        style={{ backgroundColor: "var(--theme-card-bg)" }}
                      >
                        <PiPencilSimpleLine
                          size={20}
                          style={{ color: "var(--theme-icon-color)" }}
                        />
                      </div>

                      <div
                        onClick={() => {
                          setDeleteId(item._id);
                          setIsOpenDelete(true);
                        }}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-[10px] flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(255,0,0,0.2)] hover:shadow-lg transition-shadow"
                        style={{ backgroundColor: "var(--theme-card-bg)" }}
                      >
                        <FaRegTrashAlt size={18} className="text-red-500" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-end py-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* POPUPS */}
        {isEditOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <EditVacationPopup
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              editData={editData}
              showToast={showToast}
            />
          </div>
        )}

        {isOpenDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <Delete
              setIsOpenDelete={setIsOpenDelete}
              deleteData={handleDelete}
              selectedId={deleteId}
              refetch={refetch}
            />
          </div>
        )}

        {/* TOAST MODAL */}
        {toastConfig && (
          <ToastMessage
            text={toastConfig.text}
            success={toastConfig.type === "success"}
            failed={toastConfig.type === "failed"}
            onClose={() => setToastConfig(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Vacation;
