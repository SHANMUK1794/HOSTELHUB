import { FaSearch } from "react-icons/fa";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import useRegister from "../../hooks/useRegister";
import { setEditId } from "../../store/slice/RegisterSlice";
import DatePicker from "../common_components/DatePicker";
import Delete from "../common_components/Delete";
import ResidentStatusModal from "./ResidentsStatusModal";
import RoomInfoModal from "./RoomInfoModal";
import Pagination from "../common_components/Pagination";
import { toast } from "sonner";
import ToastMessage from "../common_components/ToastMessage";

const StudentDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedYearMonth, setSelectedYearMonth] = useState("");
  const [active, setActive] = useState("Active");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState("Residents");
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenRoomInfo, setIsOpenRoomInfo] = useState(false);
  const [isOpenResidentStatus, setIsOpenResidentStatus] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedRow, setSelectedRow] = useState({});
  const [toastConfig, setToastConfig] = useState(null);
  const rowsPerPage = 6;

  const { deactivateUser, deleteUser, refetch, isLoading } =
    useRegister(selectedYearMonth);
  const { registration } = useSelector((state) => state.register);
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);

  const getBranchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.role === "Warden"
        ? user?.branchName
        : null;

  const storeData = Array.isArray(registration) ? registration : [];

  const normalizedData = useMemo(() => {
    return storeData.map((item) => ({
      ...item,
      RoomNo:
        item?.RoomNo ||
        item?.roomNo ||
        item?.roomnumber ||
        item?.room?.RoomNo ||
        item?.room?.roomNo ||
        "",
      FloorNo:
        item?.FloorNo ||
        item?.floorNo ||
        item?.Floor ||
        item?.room?.Floor ||
        item?.room?.floorNo ||
        "",
      Whatsapp: item?.Whatsapp || item?.MobileNo || "",
      status: item?.staying ? "staying" : "vacated",
    }));
  }, [storeData]);

  const handleStatusChange = async (vacateDate) => {
    try {
      await deactivateUser({
        id: selectedRow?._id,
        applicationname: selectedRow?.Name || "",
        roomno: selectedRow?.RoomNo || "",
        floorno: selectedRow?.FloorNo || "1",
        roomtype: "Residents",
        vacatedate: vacateDate,
        mobile: selectedRow?.MobileNo || selectedRow?.Whatsapp || "",
        branchName: getBranchName || "",
      });
      setToastConfig({
        text: selectedRow?.staying
          ? "Student deactivated successfully!"
          : "Student activated successfully!",
        type: "success"
      });
      setIsOpenResidentStatus(false);
      setCurrentPage(1);
      await refetch();
    } catch (error) {
      console.error("Status Change Error:", error);
      setToastConfig({
        text: error?.response?.data?.message || "Failed to update status",
        type: "failed"
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!id) {
        setToastConfig({ text: "Student ID not found", type: "failed" });
        return;
      }
      await deleteUser(id);
      setToastConfig({ text: "Student deleted successfully", type: "success" });
      setIsOpenDelete(false);
      setSelectedId(null);
      await refetch();
    } catch (error) {
      console.error("Delete Error:", error);
      setToastConfig({
        text: error?.response?.data?.message || "Failed to delete student",
        type: "failed"
      });
      // Important: close the delete modal if error occurs so the user can see the popup without it being behind another modal
      setIsOpenDelete(false);
    }
  };

  useEffect(() => {
    let timer;
    if (toastConfig) {
      timer = setTimeout(() => {
        setToastConfig(null);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [toastConfig]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, active, selectedYearMonth]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const filteredData = useMemo(() => {
    return normalizedData
      .filter((e) => {
        const search = searchValue.toLowerCase().trim();
        return (
          String(e?.Name || "")
            .toLowerCase()
            .includes(search) ||
          String(e?.RoomNo || e?.roomNo || e?.roomno || "")
            .toLowerCase()
            .includes(search) ||
          String(e?.Whatsapp || "")
            .toLowerCase()
            .includes(search) ||
          String(e?.Email || "")
            .toLowerCase()
            .includes(search)
        );
      })
      .filter((e) => {
        if (active === "Active") return e?.staying === true;
        if (active === "Inactive") return e?.staying === false;
        return true;
      });
  }, [normalizedData, searchValue, active]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedData = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const selectedStudent = normalizedData.find(
    (s) => s?._id === selectedStudentId,
  );

  // Toggle button style helper
  const toggleBtnStyle = (isActive) => ({
    backgroundColor: isActive
      ? "var(--theme-button-bg)"
      : "var(--theme-card-bg)",
    color: isActive ? "var(--theme-button-text)" : "var(--theme-button-bg)",
    border: isActive ? "none" : "1px solid var(--theme-button-bg)",
  });

  console.log("Filtered Data resident table:", filteredData);

  return (
    <>
      {/* TOP TOGGLE */}
      <div className="w-full flex justify-center">
        <div className="w-full px-4">
          <div className="flex items-center gap-6 mt-6 mb-5">
            <button
              onClick={() => setSelected("Residents")}
              className="flex items-center justify-center font-montserrat font-medium text-[16px] w-[150px] h-[42px] rounded-[8px] transition-all duration-300 shadow-sm max-[769px]:w-[120px] max-[769px]:text-[12px] max-[426px]:w-[90px] max-[426px]:text-[9px] max-[426px]:h-[32px]"
              style={toggleBtnStyle(selected === "Residents")}
            >
              Residents
            </button>

            <button
              onClick={() => {
                setSelected("PG");
                navigate("/RegisterPG");
              }}
              className="flex items-center justify-center font-montserrat font-medium text-[16px] w-[150px] h-[42px] rounded-[8px] transition-all duration-300 shadow-sm max-[769px]:w-[120px] max-[769px]:text-[12px] max-[426px]:w-[90px] max-[426px]:text-[9px] max-[426px]:h-[32px]"
              style={toggleBtnStyle(selected === "PG")}
            >
              PG
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="w-full flex justify-center">
        <div className="w-full px-4">
          <div
            className="flex flex-col px-6 py-4 rounded-[20px]"
            style={{
              backgroundColor: "var(--theme-card-bg)",
              border: "1px solid #CDCDCD",
              boxShadow: "0px 0px 10px 0px #80808040",
            }}
          >
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div
                className="font-montserrat font-bold text-[32px] max-[769px]:text-[26px] max-[426px]:text-[20px]"
                style={{ color: "var(--theme-heading-text)" }}
              >
                Student Records
              </div>

              {/* ACTIVE / INACTIVE TOGGLE */}
              <div
                className="flex items-center rounded-full p-1 shadow-sm w-fit"
                style={{
                  backgroundColor: "var(--theme-secondary-card-bg)",
                  border: "1px solid #DFDFDF",
                }}
              >
                {["Active", "Inactive"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActive(tab);
                      setCurrentPage(1);
                    }}
                    className="px-6 py-2 rounded-full font-montserrat font-medium text-[16px] transition-all duration-300 max-[426px]:px-3 max-[426px]:py-1 max-[426px]:text-[12px]"
                    style={
                      active === tab
                        ? {
                          backgroundColor: "var(--theme-button-bg)",
                          color: "var(--theme-button-text)",
                        }
                        : { color: "var(--theme-primary-text)" }
                    }
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* FILTERS */}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-6">
              <DatePicker
                selectedYearMonth={selectedYearMonth}
                onChange={(value) => setSelectedYearMonth(value)}
              />

              {/* SEARCH */}
              <div
                className="flex items-center justify-between gap-2 w-full max-w-[740px] h-[45px] rounded-[30px] px-4"
                style={{
                  border: "1px solid #DFDFDF",
                  backgroundColor: "#FFFFFFD9",
                  boxShadow: "0px 0px 10px 0px #BABABA40",
                }}
              >
                <input
                  className="text-sm outline-none w-full bg-transparent max-[426px]:text-[11px]"
                  style={{ color: "var(--theme-primary-text)" }}
                  type="text"
                  placeholder="Search Name/Room/Mobile"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <div
                  className="rounded-full flex items-center justify-center w-7 h-7 flex-shrink-0"
                  style={{ backgroundColor: "var(--theme-button-bg)" }}
                >
                  <FaSearch className="text-white text-sm" />
                </div>
              </div>

              {/* ADD BUTTON */}
              <button
                onClick={() => navigate("/Registration")}
                className="rounded-[6px] text-sm px-4 py-2 flex items-center gap-2 whitespace-nowrap"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                  boxShadow: "inset 0px 4px 4px 0px #FFFFFF40",
                }}
              >
                <PlusIcon className="h-4 w-4" />
                Add Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full flex justify-center mt-5">
        <div className="w-full px-4 pb-5 overflow-x-auto">
          <div
            className="rounded-lg border overflow-x-auto"
            style={{ backgroundColor: "var(--theme-card-bg)" }}
          >
            <table className="w-full text-sm font-montserrat whitespace-nowrap">
              <thead
                style={{
                  backgroundColor: "var(--theme-table-header-bg)",
                  color: "var(--theme-button-text)",
                }}
              >
                <tr>
                  {[
                    "S.NO",
                    "NAME",
                    "FLOOR NO",
                    "ROOM NO",
                    "JOINING DATE",
                    "WHATSAPP",
                    "DEPOSIT (₹)",
                    "ACTION",
                    "STATUS",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-3 py-3 ${i === 1 ? "text-left" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-5">
                      Loading...
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-5">
                      No records available.
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((studentData, idx) => (
                    <tr
                      key={studentData?._id || idx}
                      className="transition-all duration-200"
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
                      <td className="p-3 font-bold text-center">
                        {String(indexOfFirstRow + idx + 1).padStart(2, "0")}
                      </td>
                      <td className="p-2 text-left">
                        {studentData?.Name || "-"}
                      </td>
                      <td className="p-2 text-center">
                        {studentData?.FloorNo || "-"}
                      </td>
                      <td className="p-2 text-center">
                        {studentData?.RoomNo?.trim()
                          ? studentData.RoomNo
                          : studentData?.roomNo?.trim()
                            ? studentData.roomNo
                            : studentData?.roomno?.trim()
                              ? studentData.roomno
                              : "-"}
                      </td>
                      <td className="p-2 text-center">
                        {formatDate(studentData?.DateOfJoining)}
                      </td>
                      <td className="p-2 text-center">
                        {studentData?.Whatsapp || "-"}
                      </td>
                      <td
                        className="p-2 font-semibold text-center"
                        style={{ color: "#16A34A" }}
                      >
                        ₹ {Number(studentData?.Deposit || 0).toLocaleString()}
                      </td>

                      {/* ACTION */}
                      <td className="p-2">
                        <div className="flex gap-3 justify-center items-center">
                          <img
                            src={
                              "https://asset.techjose.com/Hostelos/tableedit.png"
                            }
                            alt="Edit"
                            title="Edit student details"
                            onClick={() => {
                              if (!studentData?._id) return;
                              dispatch(setEditId(studentData._id));
                              navigate("/StudentUpdateDetailForm");
                            }}
                            className="w-4 h-4 cursor-pointer object-contain hover:scale-110 transition-all duration-200"
                          />
                          <img
                            src={
                              "https://asset.techjose.com/Hostelos/tableview.png"
                            }
                            alt="View"
                            title="Student Details"
                            onClick={() => {
                              setSelectedStudentId(studentData?._id);
                              setIsOpenRoomInfo(true);
                            }}
                            className="w-5 h-5 cursor-pointer object-contain hover:scale-110 transition-all duration-200"
                          />
                          <img
                            src={
                              "https://asset.techjose.com/Hostelos/tabledelete.png"
                            }
                            alt="Delete"
                            title="Delete Student"
                            onClick={() => {
                              setSelectedId(studentData?._id);
                              setIsOpenDelete(true);
                            }}
                            className="w-5 h-5 cursor-pointer object-contain hover:scale-110 transition-all duration-200"
                          />
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => {
                            setSelectedRow(studentData);
                            setIsOpenResidentStatus(true);
                          }}
                          className="px-4 py-[6px] rounded-full border text-sm font-semibold transition-all duration-300"
                          style={{
                            borderColor: studentData?.staying
                              ? "#16A34A"
                              : "#EF4444",
                            color: studentData?.staying ? "#16A34A" : "#EF4444",
                            backgroundColor: studentData?.staying
                              ? "#F0FDF4"
                              : "#FEF2F2",
                          }}
                        >
                          {studentData?.staying ? "Active" : "Inactive"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {filteredData.length > 0 && (
            <div className="flex py-3 px-4">
              <div className="ml-auto">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {isOpenDelete && (
        <Delete
          setIsOpenDelete={setIsOpenDelete}
          deleteData={handleDelete}
          selectedId={selectedId}
          refetch={refetch}
        />
      )}

      {/* STATUS MODAL */}
      {isOpenResidentStatus && (
        <ResidentStatusModal
          setIsOpenResidentStatus={setIsOpenResidentStatus}
          handleStatusChange={handleStatusChange}
          selectedRow={selectedRow}
          type="Resident"
        />
      )}

      {/* ROOM INFO MODAL */}
      {isOpenRoomInfo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setIsOpenRoomInfo(false)}
          />
          <div className="relative z-10 w-full max-w-3xl">
            <RoomInfoModal
              setIsOpenRoomInfo={setIsOpenRoomInfo}
              selectedStudentId={selectedStudentId}
              selectedRoomNo={selectedStudent?.RoomNo}
            />
          </div>
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
    </>
  );
};

export default StudentDetails;
