import React, { useState, useMemo } from "react";
import ResidentStatusModal from "../ResidentsStatusModal";
import { useSelector } from "react-redux";
import { useRoomsResidents } from "../../../hooks/useRoomsResident";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import DatePicker from "../../common_components/DatePicker";
import { PlusIcon } from "@heroicons/react/24/solid";
import usePG, { useDeletePG, useDeactivatePG } from "../../../hooks/usePGData";
import ToastMessage from "../../common_components/ToastMessage";
import Pagination from "../../common_components/Pagination";
import Delete from "../../common_components/Delete";
import { useNavigate } from "react-router-dom";

function RegisterPG() {
  const navigate = useNavigate();

  const [selectedYearMonth, setSelectedYearMonth] = useState("");
  const [active, setActive] = useState("Active");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState("PG");
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRow, setSelectedRow] = useState({});
  const [isOpenResidentStatus, setIsOpenResidentStatus] = useState(false);
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

  const deleteMutation = useDeletePG();
  const deactivatePGMutation = useDeactivatePG();
  const deleteUser = deleteMutation.mutateAsync;

  const { data: rooms = [] } = useRoomsResidents();
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);

  const getBranchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.role === "Warden"
        ? user?.branchName
        : null;

  const {
    data: pgData = [],
    refetch: pgRefetch,
    isLoading,
    error,
  } = usePG(selectedYearMonth, getBranchName);

  const handleStatusChange = async (vacateDate) => {
    try {
      const currentStatus = selectedRow?.status?.toLowerCase();
      const isCurrentlyActive =
        currentStatus === "staying" || currentStatus === "vacating";
      const payload = isCurrentlyActive
        ? {
            status: "vacated",
            checkout: vacateDate || new Date().toISOString().split("T")[0],
            staying: false,
          }
        : { status: "staying", checkout: null, staying: true };

      await deactivatePGMutation.mutateAsync({ id: selectedRow?._id, payload });
      showToast(
        isCurrentlyActive
          ? "User deactivated successfully"
          : "User activated successfully",
        "success"
      );
      setIsOpenResidentStatus(false);
      setSelectedRow({});
      await pgRefetch();
    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!id) {
        showToast("PG ID not found", "error");
        return;
      }
      
      const itemToDelete = pgData.find(item => item._id === id);
      const status = itemToDelete?.status?.toLowerCase();
      const isActive = status === "staying" || status === "vacating";
      
      if (isActive) {
        showToast("Deactivate the user first before deleting", "error");
        setIsOpenDelete(false);
        setSelectedId(null);
        return;
      }

      await deleteUser(id);
      showToast("Deleted successfully", "success");
      setIsOpenDelete(false);
      setSelectedId(null);
      await pgRefetch();
    } catch (error) {
      console.error(error);
      const errMsg = error?.response?.data?.message || "Delete failed";
      showToast(errMsg, "error");
      setIsOpenDelete(false);
    }
  };

  const filteredData = useMemo(() => {
    return (pgData || [])
      .filter((e) => {
        const s = searchValue.toLowerCase();
        return (
          String(e?.Name || "")
            .toLowerCase()
            .includes(s) ||
          String(e?.RoomNo || "")
            .toLowerCase()
            .includes(s) ||
          String(e?.MobileNo || "")
            .toLowerCase()
            .includes(s)
        );
      })
      .filter((e) => {
        const status = e?.status?.toLowerCase();
        if (active === "Active")
          return status === "staying" || status === "vacating";
        if (active === "Inactive") return status === "vacated";
        return true;
      });
  }, [pgData, searchValue, active]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const paginatedData = filteredData.slice(indexOfFirst, indexOfLast);

  const getFloor = (roomNo) => {
    if (!roomNo) return "-";
    const room = rooms.find(
      (r) =>
        String(r.RoomNo).trim().toLowerCase() ===
        String(roomNo).trim().toLowerCase(),
    );
    return room?.Floor || "-";
  };

  const toggleBtnStyle = (isActive) => ({
    backgroundColor: isActive
      ? "var(--theme-button-bg)"
      : "var(--theme-card-bg)",
    color: isActive ? "var(--theme-button-text)" : "var(--theme-button-bg)",
    border: isActive ? "none" : "1px solid var(--theme-button-bg)",
  });

  console.log("Filtered register PG Data:", filteredData);


  return (
    <>
      {/* DELETE MODAL */}
      {isOpenDelete && (
        <Delete
          setIsOpenDelete={setIsOpenDelete}
          deleteData={handleDelete}
          selectedId={selectedId}
          refetch={pgRefetch}
        />
      )}

      {/* STATUS MODAL */}
      {isOpenResidentStatus && (
        <ResidentStatusModal
          setIsOpenResidentStatus={setIsOpenResidentStatus}
          handleStatusChange={handleStatusChange}
          selectedRow={selectedRow}
          type="PG"
          showToast={showToast}
        />
      )}

      {/* TOP TOGGLE */}
      <div className="w-full flex justify-center">
        <div className="w-full px-4">
          <div className="flex items-center gap-6 mt-6 mb-5">
            <button
              onClick={() => {
                setSelected("Residents");
                navigate("/StudentDetails");
              }}
              className="flex items-center justify-center font-montserrat font-medium text-[16px] w-[150px] h-[42px] rounded-[8px] transition-all duration-300 shadow-sm max-[769px]:w-[120px] max-[769px]:text-[12px] max-[426px]:w-[90px] max-[426px]:text-[9px] max-[426px]:h-[32px]"
              style={toggleBtnStyle(selected === "Residents")}
            >
              Residents
            </button>
            <button
              onClick={() => setSelected("PG")}
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
        <div className="w-full  px-4">
          <div
            className="flex flex-col px-6 py-4 rounded-[20px]"
            style={{
              backgroundColor: "var(--theme-card-bg)",
              border: "1px solid #CDCDCD",
              boxShadow: "0px 0px 10px 0px #80808040",
            }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div
                className="font-montserrat font-bold text-[32px] max-[769px]:text-[26px] max-[426px]:text-[20px]"
                style={{ color: "var(--theme-heading-text)" }}
              >
                Student Records
              </div>

              {/* ACTIVE / INACTIVE */}
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

              <button
                onClick={() => navigate("/AddPgDetails")}
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
                    "MOBILE",
                    "RENT (₹)",
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
                ) : error ? (
                  <tr>
                    <td colSpan={9} className="text-center py-5 text-red-500">
                      Failed to load data
                    </td>
                  </tr>
                ) : paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-5">
                      No records found
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item, idx) => {
                    const status = item?.status?.toLowerCase();
                    const isActive =
                      status === "staying" || status === "vacating";
                    return (
                      <tr
                        key={item._id || idx}
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
                          {String(
                            currentPage * rowsPerPage - rowsPerPage + idx + 1,
                          ).padStart(2, "0")}
                        </td>
                        <td className="p-2 text-left">{item?.Name || "-"}</td>
                        <td className="p-2 text-center">
                          {getFloor(item?.RoomNo)}
                        </td>
                        <td className="p-2 text-center">
                          {item?.RoomNo || "-"}
                        </td>
                        <td className="p-2 text-center">
                          {item?.checkin
                            ? new Date(item.checkin).toLocaleDateString("en-GB")
                            : "-"}
                        </td>
                        <td className="p-2 text-center">
                          {item?.MobileNo || "-"}
                        </td>
                        <td
                          className="p-2 font-semibold text-center"
                          style={{ color: "#16A34A" }}
                        >
                          ₹ {Number(item?.Rent || 0).toLocaleString()}
                        </td>

                        <td className="p-2">
                          <div className="flex gap-3.5 justify-center items-center">
                            <FaEdit
                              title="Edit PG details"
                              onClick={() =>
                                navigate(`/PgUpdateForm/${item._id}`)
                              }
                              className="w-4.5 h-4.5 text-teal-600 hover:text-teal-800 cursor-pointer hover:scale-110 transition-all duration-200"
                            />
                            <FaTrash
                              title="Delete PG"
                              onClick={() => {
                                setSelectedId(item._id);
                                setIsOpenDelete(true);
                              }}
                              className="w-4.5 h-4.5 text-red-600 hover:text-red-800 cursor-pointer hover:scale-110 transition-all duration-200"
                            />
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="p-2 text-center">
                          <button
                            onClick={() => {
                              setSelectedRow(item);
                              setIsOpenResidentStatus(true);
                            }}
                            className="px-4 py-[6px] rounded-full border text-sm font-semibold transition-all duration-300"
                            style={{
                              borderColor: isActive ? "#16A34A" : "#EF4444",
                              color: isActive ? "#16A34A" : "#EF4444",
                              backgroundColor: isActive ? "#F0FDF4" : "#FEF2F2",
                            }}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

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
}

export default RegisterPG;
