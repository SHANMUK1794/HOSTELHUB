import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDeleteRoomRent, useRoomRentData } from "../../../hooks/useRoomRent";
import {
  clearSelectedRoomRent,
  setSelectedRoomRent,
} from "../../../store/slice/roomRentSlice";
import DatePicker from "../../common_components/DatePicker";
import Delete from "../../common_components/Delete";
import RoomRentAddPayment from "./RoomRentAddPayment";
import RoomRentExport from "./RoomRentExport";
import FinanceSubHeader from "../FinanceAndUtilities";
import { MdPayment, MdHistory } from "react-icons/md";
import InstallmentModal from "./InstallmentModal";
import PaymentHistoryModal from "./PaymentHistoryModal";
import SearchBar from "../../common_components/SearchBar";
import ToastMessage from "../../common_components/ToastMessage";

const RoomRent = () => {
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);
  const branchName = user?.role === "Admin" ? selectedBranch : user?.branchName;
const [isPayOpen, setIsPayOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedActionRecord, setSelectedActionRecord] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedRoomRent = useSelector(
    (state) => state.roomRent.selectedRoomRent,
  );

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYearMonth, setSelectedYearMonth] = useState("");
  const selectedYear = selectedYearMonth?.split("-")[0];
  const selectedMonth = selectedYearMonth?.split("-")[1];

  const { data: roomRentData = [], refetch } =
    useRoomRentData(selectedYearMonth);
  const { mutateAsync: deleteRoomRentAsync, isLoading: isDeleting } = useDeleteRoomRent();

  const filteredData = (roomRentData || []).filter(
    (item) =>
      (item?.ResidentName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item?.RoomNo || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id) => {
    const targetId = id || deleteId;
    if (targetId) {
      await deleteRoomRentAsync(targetId);
      setDeleteId(null);
      setIsOpenDelete(false);
      showToast("Room rent record deleted successfully", "success");
    }
  };

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

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--theme-app-bg)" }}
    >
      <FinanceSubHeader />

      {isOpenDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <Delete
            setIsOpenDelete={setIsOpenDelete}
            selectedId={deleteId}
            deleteData={handleDelete}
            refetch={refetch}
          />
        </div>
      )}

      {isOpenForm && (
        <div className="fixed inset-0 bg-black/40 z-50">
          <RoomRentAddPayment
            setIsOpen={setIsOpenForm}
            selectedRoomRent={selectedRoomRent}
            showToast={showToast}
          />
        </div>
      )}

      <div className="px-6 pb-4 pr-4">
        {/* Header Card */}
        <div
          className="p-5 rounded-lg mb-5"
          style={{ backgroundColor: "var(--theme-card-bg)" }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2
              className="font-bold text-2xl md:text-[40px]"
              style={{ color: "var(--theme-heading-text)" }}
            >
              Payment Types
            </h2>

            <div className="flex items-center gap-4">
              <label
                className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-xl shadow-sm"
                style={{
                  backgroundColor: "var(--theme-filter-bg)",
                  borderColor: "var(--theme-accent)40",
                }}
              >
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="w-4 h-4"
                  style={{ accentColor: "var(--theme-accent)" }}
                />
                <span
                  className="font-semibold"
                  style={{ color: "var(--theme-accent)" }}
                >
                  Deposit Amount
                </span>
              </label>
              <label
                onClick={() => navigate("/paymentManagement")}
                className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-xl hover:opacity-80 transition-all"
                style={{
                  backgroundColor: "var(--theme-filter-bg)",
                  borderColor: "var(--theme-accent)30",
                }}
              >
                <input type="checkbox" className="w-4 h-4" />
                <span
                  className="font-semibold"
                  style={{ color: "var(--theme-muted-text)" }}
                >
                  EB Bill
                </span>
              </label>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between w-full gap-4 py-2">
            <div className="flex flex-wrap w-full md:flex-1 items-center gap-4 flex-1">
              <DatePicker
                selectedYearMonth={selectedYearMonth}
                onChange={setSelectedYearMonth}
              />

              <SearchBar
                search={searchTerm}
                setSearch={setSearchTerm}
                placeholder="Search Name / Room / Mobile"
                containerClass="relative flex items-center border-2 rounded-2xl px-4 ml-20 py-1 w-full max-w-lg shadow-sm"
                inputClass="outline-none py-1 text-sm w-full bg-transparent"
              />
            </div>

            <button
              className="text-white font-bold px-6 py-2 rounded-xl flex items-center gap-2 shadow-md hover:opacity-80 transition-all whitespace-nowrap"
              style={{ backgroundColor: "var(--theme-button-bg)" }}
              onClick={() => {
                dispatch(clearSelectedRoomRent());
                setIsOpenForm(true);
              }}
            >
              <FaPlus /> Add Payment
            </button>
          </div>
        </div>

        {/* Sub-header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h3
            className="font-bold text-2xl"
            style={{ color: "var(--theme-heading-text)" }}
          >
            Room Rent Payment List
          </h3>
          <RoomRentExport
            year={selectedYear}
            month={selectedMonth}
            branchName={branchName || ""}
            showToast={showToast}
          />
        </div>

        {/* Table */}
        <div
          className="overflow-x-auto rounded-2xl border shadow-sm"
          style={{
            backgroundColor: "var(--theme-card-bg)",
            borderColor: "var(--theme-accent)15",
          }}
        >
          <table className="w-full text-center">
            <thead>
              <tr
                className="uppercase text-xs font-bold"
                style={{
                  backgroundColor: "var(--theme-table-header-bg)",
                  color: "var(--theme-button-text)",
                }}
              >
                {[
                  "Name",
                  "Floor No",
                  "Room",
                  "Bill No",
                  "Deposit",
                  "Rent",
                  "Total",
                  "Advance",
                  "Balance",
                  "Discount",
                  "Method",
                  "Mobile",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th key={h} className="px-1 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm font-semibold">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={14}
                    className="py-10"
                    style={{
                      color: "var(--theme-muted-text)",
                      backgroundColor: "var(--theme-table-row-bg)",
                    }}
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr
                    key={row._id}
                    className="border-b font-montserrat font-[400] transition-colors"
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
                      className="px-2 py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {row.ResidentName}
                    </td>
                    <td
                      className="px-1 py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {row.FloorNo || "-"}
                    </td>
                    <td
                      className="px-1 py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {row.RoomNo}
                    </td>
                    <td
                      className="px-1 py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {row.BillNo}
                    </td>
                    <td
                      className="px-3 py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      ₹{row.RoomDeposit}
                    </td>
                    <td
                      className="px-3 py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      ₹{row.RoomRent}
                    </td>
                    <td
                      className="px-2 py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      ₹{row.Total}
                    </td>
                    <td
                      className="px-1 py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      ₹{row.Advance}
                    </td>
                    <td
                      className="px-1 py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      ₹{row.Balance}
                    </td>
                    <td
                      className="px-1 py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      ₹{row.DisAmt || 0}
                    </td>
                    <td
                      className="px-1 py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {row.PaymentMethod}
                    </td>
                    <td
                      className="px-1 py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {row.MobileNo}
                    </td>
                    <td className="px-1 py-4">
                      <span
                        className={`px-4 py-1 rounded-full text-xs border ${
                          row.Status === "Paid"
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-red-500 text-red-600 bg-red-50"
                        }`}
                      >
                        {row.Status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
  {/* NEW PAY BUTTON */}
  <button
    title="Pay Installment"
    onClick={() => {
      setSelectedActionRecord(row);
      setIsPayOpen(true);
    }}
    className="p-2 border rounded-lg hover:bg-green-50 transition-colors"
    style={{ borderColor: "var(--theme-accent)30" }}
  >
    <MdPayment className="text-green-600" />
  </button>

  {/* NEW HISTORY BUTTON */}
  <button
    title="Payment History"
    onClick={() => {
      setSelectedActionRecord(row);
      setIsHistoryOpen(true);
    }}
    className="p-2 border rounded-lg hover:bg-blue-50 transition-colors"
    style={{ borderColor: "var(--theme-accent)30" }}
  >
    <MdHistory className="text-blue-500" />
  </button>

  {/* EXISTING EDIT BUTTON */}
  <button
    title="Edit Record"
    onClick={() => {
      dispatch(setSelectedRoomRent(row));
      setIsOpenForm(true);
    }}
    className="p-2 border rounded-lg hover:opacity-80"
    style={{ backgroundColor: "var(--theme-card-bg)", borderColor: "var(--theme-accent)30" }}
  >
    <MdEdit style={{ color: "var(--theme-icon-color)" }} />
  </button>

  {/* EXISTING DELETE BUTTON */}
  <button
    title="Delete Record"
    onClick={() => {
      setDeleteId(row._id);
      setIsOpenDelete(true);
    }}
    className="p-2 border rounded-lg hover:bg-red-50 transition-colors"
    style={{ backgroundColor: "var(--theme-card-bg)", borderColor: "var(--theme-accent)30" }}
  >
    <RiDeleteBin6Line className="text-red-500" />
  </button>
</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* NEW MODALS */}
      {isPayOpen && (
        <InstallmentModal 
          setIsOpen={setIsPayOpen} 
          selectedRecord={selectedActionRecord} 
          refetch={refetch} 
          showToast={showToast}
        />
      )}
      {isHistoryOpen && (
        <PaymentHistoryModal 
          setIsOpen={setIsHistoryOpen} 
          selectedRecord={selectedActionRecord} 
        />
      )}
        </div>
      {toastConfig.show && (
        <ToastMessage
          text={toastConfig.text}
          success={toastConfig.success}
          failed={toastConfig.failed}
          onClose={closeToast}
        />
      )}
    </div>
  </div>
  );
};

export default RoomRent;
