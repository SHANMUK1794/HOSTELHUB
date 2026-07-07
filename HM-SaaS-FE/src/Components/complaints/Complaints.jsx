import { useEffect, useState } from "react";
import useComplaints from "../../hooks/useComplaints";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
import Delete from "../common_components/Delete";
import ComplaintsForm from "./ComplaintsForm";
import ComplaintsUpdateForm from "./ComplaintsUpdateForm";
import { useSelector } from "react-redux";
import DatePicker from "../common_components/DatePicker";
import LottieLoader from "../../Components/common_components/LottieLoader";
import Pagination from "../common_components/Pagination";
import ToastMessage from "../common_components/ToastMessage";

const Complaints = () => {
  const [selectedYearMonth, setSelectedYearMonth] = useState("");
  const { deleteComplaint, data, refetch, isLoading } =
    useComplaints("all-all");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdateForm, setIsOpenUpdateForm] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getBranchName = useSelector((state) => state.branch.selectedBranch);

  const handleEditData = (rowData) => {
    setIsOpenUpdateForm(true);
    setSelectedRowData(rowData);
  };

  useEffect(() => {
    if (data?.data) {
      let filtered = data.data;

      if (selectedYearMonth && selectedYearMonth !== "all-all") {
        const [filterYear, filterMonth] = selectedYearMonth.split("-");
        if (filterYear !== "all" || filterMonth !== "all") {
          filtered = filtered.filter((item) => {
            if (!item.date) return false;
            const d = new Date(item.date);
            if (isNaN(d)) return false;
            const itemYear = String(d.getFullYear());
            const monthNames = [
              "january",
              "february",
              "march",
              "april",
              "may",
              "june",
              "july",
              "august",
              "september",
              "october",
              "november",
              "december",
            ];
            const itemMonth = monthNames[d.getMonth()];
            const matchYear = filterYear === "all" || itemYear === filterYear;
            const matchMonth =
              filterMonth === "all" || itemMonth === filterMonth.toLowerCase();
            return matchYear && matchMonth;
          });
        }
      }

      const result = filtered.filter(
        (e) =>
          String(e.issue).toLowerCase().includes(searchValue.toLowerCase()) ||
          String(e.room_no).toLowerCase().includes(searchValue.toLowerCase()) ||
          String(e.floor || "")
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          String(e.status).toLowerCase().includes(searchValue.toLowerCase()),
      );
      setFilteredData(result);
    } else {
      setFilteredData([]);
    }
  }, [data, searchValue, selectedYearMonth]);

  useEffect(() => {
    refetch();
  }, [getBranchName]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <>
      <div
        className="p-4 md:p-6 min-h-screen"
        style={{ backgroundColor: "var(--theme-app-bg)" }}
      >
        {/* Top Controls Card */}
        <div
          className="rounded-xl shadow-md p-6 mb-6"
          style={{
            backgroundColor: "var(--theme-card-bg)",
            border: "1px solid var(--theme-filter-bg)",
          }}
        >
          <h1
            className="text-[28px] md:text-[32px] font-bold mb-6"
            style={{
              color: "var(--theme-accent)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Complaints
          </h1>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* DatePicker */}
            <div className="w-full md:w-auto">
              <DatePicker
                selectedYearMonth={selectedYearMonth}
                onChange={(value) => setSelectedYearMonth(value)}
              />
            </div>

            {/* Search */}
            <div className="flex-1 flex justify-center w-full max-w-xl">
              <div
                className="flex items-center rounded-full px-4 py-2 w-full h-[48px]"
                style={{
                  border: "1px solid var(--theme-secondary-card-bg)",
                  backgroundColor: "var(--theme-card-bg)",
                }}
              >
                <input
                  className="w-full outline-none text-[15px] bg-transparent"
                  style={{
                    color: "var(--theme-primary-text)",
                    fontFamily: "var(--theme-font-family-primary)",
                  }}
                  type="text"
                  placeholder="Search Name / Room"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <div
                  className="rounded-full p-2.5 flex items-center justify-center cursor-pointer flex-shrink-0"
                  style={{ backgroundColor: "var(--theme-button-bg)" }}
                >
                  <MagnifyingGlassIcon
                    className="w-4 h-4 font-bold"
                    style={{ color: "var(--theme-button-text)" }}
                  />
                </div>
              </div>
            </div>

            {/* Add Button */}
            <div className="w-full md:w-auto flex justify-end">
              <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 rounded-[8px] text-[16px] font-medium flex items-center justify-center gap-2 w-full md:w-auto shadow-sm transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              >
                <PlusIcon className="w-5 h-5 font-bold" />
                Add Complaints
              </button>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div
          className="rounded-xl shadow-sm overflow-hidden"
          style={{
            backgroundColor: "var(--theme-card-bg)",
            border: "1px solid var(--theme-filter-bg)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead
                className="uppercase text-xs font-semibold"
                style={{
                  backgroundColor: "var(--theme-table-header-bg)",
                  color: "var(--theme-button-text)",
                }}
              >
                <tr>
                  {[
                    "S.NO",
                    "Floor No",
                    "Room",
                    "Date",
                    "Issue",
                    "Issue Description",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-4 font-[600] text-[16px] leading-[20px] tracking-[0.7px] uppercase align-middle"
                      style={{ fontFamily: "var(--theme-font-family-primary)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-10">
                      <LottieLoader />
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-10"
                      style={{ color: "var(--theme-muted-text)" }}
                    >
                      No records available.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((ele, idx) => (
                    <tr
                      key={ele._id}
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
                      {/* S.NO */}
                      <td
                        className="px-6 py-4 font-[500] text-[15px] leading-[20px] align-middle text-center"
                        style={{
                          color: "var(--theme-primary-text)",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        {indexOfFirstRow + idx + 1}
                      </td>
                      {/* Floor */}
                      <td
                        className="px-6 py-4 font-[500] text-[15px] leading-[20px] align-middle text-center"
                        style={{
                          color: "var(--theme-primary-text)",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        {ele.floor || "-"}
                      </td>
                      {/* Room */}
                      <td
                        className="px-6 py-4 font-[500] text-[15px] leading-[20px] align-middle text-center"
                        style={{
                          color: "var(--theme-primary-text)",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        {ele.room_no}
                      </td>
                      {/* Date */}
                      <td
                        className="px-6 py-4 font-[500] text-[15px] leading-[20px] align-middle text-center"
                        style={{
                          color: "var(--theme-primary-text)",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        {formatDate(ele.date)}
                      </td>
                      {/* Issue */}
                      <td
                        className="px-6 py-4 font-[500] text-[15px] leading-[20px] align-middle text-center"
                        style={{
                          color: "var(--theme-primary-text)",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        {ele.issue}
                      </td>
                      {/* Issue Description */}
                      <td
                        className="px-6 py-4 truncate max-w-[200px] font-[500] text-[15px] leading-[20px] align-middle text-center"
                        style={{
                          color: "var(--theme-primary-text)",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        {ele.issue_description}
                      </td>
                      {/* Status — semantic colors kept */}
                      <td className="px-6 py-4 font-[500] text-[15px] leading-[20px] align-middle">
                        <span
                          className={`w-[137px] h-[43px] rounded-[15px] border-[0.5px] font-[500] text-[14px] flex items-center justify-center shadow-[0_4px_4px_rgba(0,0,0,0.25)] ${
                            ele.status?.trim().toLowerCase() === "pending"
                              ? "text-[#FF0000] border-[#FF0000] shadow-[0_-4px_4px_rgba(255,0,0,0.25)]"
                              : ele.status?.trim().toLowerCase() === "working"
                                ? "text-[#0000FF] border-[#0000FF] shadow-[0_-4px_4px_rgba(0,0,255,0.25)]"
                                : ele.status?.trim().toLowerCase() === "solved"
                                  ? "text-[#008000] border-[#008000] shadow-[0_-4px_4px_rgba(0,128,0,0.25)]"
                                  : "text-gray-500 border-gray-300"
                          }`}
                          style={{
                            backgroundColor: "var(--theme-card-bg)",
                            fontFamily: "var(--theme-font-family-primary)",
                          }}
                        >
                          {ele.status}
                        </span>
                      </td>
                      {/* Action */}
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center">
                          <div
                            onClick={() => handleEditData(ele)}
                            className="w-[43px] h-[43px] rounded-[5px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:opacity-80 transition cursor-pointer flex items-center justify-center"
                            style={{
                              backgroundColor: "var(--theme-card-bg)",
                              border: "1px solid var(--theme-filter-bg)",
                            }}
                          >
                            <img
                              src="https://asset.techjose.com/Hostelos/basileditoutline.png"
                              alt="Edit"
                              className="w-5 h-5"
                            />
                          </div>
                          <div
                            onClick={() => {
                              setIsOpenDelete(true);
                              setSelectedId(ele._id);
                            }}
                            className="w-[43px] h-[43px] rounded-[5px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:opacity-80 transition cursor-pointer flex items-center justify-center"
                            style={{
                              backgroundColor: "var(--theme-card-bg)",
                              border: "1px solid var(--theme-filter-bg)",
                            }}
                          >
                            <img
                              src="https://asset.techjose.com/Hostelos/materialsymbolsdeleteoutline.png"
                              alt="Delete"
                              className="w-5 h-5"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            className="flex justify-end py-4 px-6 border-t"
            style={{ borderColor: "var(--theme-filter-bg)" }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md flex justify-center items-start pt-2 px-4 pb-4 z-[9990]">
          <ComplaintsForm setIsOpen={setIsOpen} refetch={refetch} showToast={showToast} />
        </div>
      )}

      {isOpenUpdateForm && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md flex justify-center items-start pt-2 px-4 pb-4 z-[9990]">
          <ComplaintsUpdateForm
            setIsOpenUpdateForm={setIsOpenUpdateForm}
            selectedRowData={selectedRowData}
            showToast={showToast}
          />
        </div>
      )}

      {isOpenDelete && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md flex justify-center items-start pt-2 px-4 pb-4 z-[9990]">
          <Delete
            setIsOpenDelete={setIsOpenDelete}
            deleteData={(id) => deleteComplaint(id).then(() => showToast("Complaint deleted successfully", "success")).catch(err => { showToast(err?.response?.data?.message || "Failed to delete complaint", "error"); throw err; })}
            selectedId={selectedId}
            refetch={refetch}
          />
        </div>
      )}

      {toastConfig.show && (
        <ToastMessage
          text={toastConfig.text}
          success={toastConfig.success}
          failed={toastConfig.failed}
          onClose={closeToast}
        />
      )}
    </>
  );
};

export default Complaints;
