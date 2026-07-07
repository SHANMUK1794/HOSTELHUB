import { useState } from "react";
import { FaPlus, FaSearch, FaWhatsapp } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useEBData } from "../../../hooks/useEBData";
import DatePicker from "../../common_components/DatePicker";
import Delete from "../../common_components/Delete";
import EBFormAdd from "./EBFormAdd";
import EBFormEdit from "./EBFormEdit";
import Export from "../../common_components/Export";
import FinanceSubHeader from "../FinanceAndUtilities";
import SearchBar from "../../common_components/SearchBar";
import ToastMessage from "../../common_components/ToastMessage";

const EBData = () => {
  const navigate = useNavigate();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYearMonth, setSelectedYearMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showStatementFilter, setShowStatementFilter] = useState(false);

  const { ebData, deleteEBPayment, whatsappMessage, branchName } =
    useEBData(selectedYearMonth);

  const year = selectedYearMonth?.split("-")[0] || "";
  const month = selectedYearMonth?.split("-")[1] || "";

  const isDateInRange = (dateToCheck, start, end) => {
    if (!dateToCheck) return false;
    const check = new Date(dateToCheck).toISOString().split("T")[0];
    const s = start ? new Date(start).toISOString().split("T")[0] : null;
    const e = end ? new Date(end).toISOString().split("T")[0] : null;
    if (s && check < s) return false;
    if (e && check > e) return false;
    return true;
  };

  const filteredData = (ebData || []).filter((item) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      (item?.RoomNo || "").toString().toLowerCase().includes(term) ||
      (item?.UserName || "").toLowerCase().includes(term) ||
      (item?.Mobile || "").toString().toLowerCase().includes(term);
    if (!matchesSearch) return false;
    const pDate = item.paymentdate || item.paymentDate;
    if (startDate || endDate) return isDateInRange(pDate, startDate, endDate);
    return true;
  });

  const handleDelete = () => {
    if (deleteId) {
      deleteEBPayment(deleteId);
      setDeleteId(null);
      setIsOpenDelete(false);
      showToast("EB Payment deleted successfully", "success");
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

  const handleEdit = (id) => {
    setEditingId(id);
    setIsOpenForm(true);
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--theme-app-bg)" }}
    >
      <FinanceSubHeader />

      {toastConfig.show && (
        <ToastMessage
          text={toastConfig.text}
          success={toastConfig.success}
          failed={toastConfig.failed}
          onClose={closeToast}
        />
      )}

      {/* Modals */}
      {isOpenDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <Delete setIsOpenDelete={setIsOpenDelete} deleteData={handleDelete} />
        </div>
      )}

      {isOpenForm && (
        <>
          {editingId ? (
            <EBFormEdit
              setIsOpen={setIsOpenForm}
              editingId={editingId}
              setEditingId={setEditingId}
              paymentData={ebData}
              showToast={showToast}
            />
          ) : (
            <EBFormAdd setIsOpen={setIsOpenForm} showToast={showToast} />
          )}
        </>
      )}

      <div className="px-6 pb-4">
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

            <div className="flex flex-wrap items-center gap-4">
              <label
                onClick={() => navigate("/roomRent")}
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
                  Deposit Amount
                </span>
              </label>
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
                setEditingId(null);
                setIsOpenForm(true);
              }}
            >
              <FaPlus /> Add Details
            </button>
          </div>
        </div>

        {/* Sub-header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <h3
              className="font-bold text-2xl"
              style={{ color: "var(--theme-heading-text)" }}
            >
              Electricity Bill Payment Table
            </h3>
            <button
              onClick={() => setShowStatementFilter(!showStatementFilter)}
              className="border text-xs font-bold px-3 py-1 rounded-lg hover:opacity-80 transition-all"
              style={{
                backgroundColor: "var(--theme-filter-bg)",
                color: "var(--theme-accent)",
                borderColor: "var(--theme-accent)40",
              }}
            >
              {showStatementFilter ? "Hide Statement" : "Statement View"}
            </button>
          </div>
          <Export month={month} year={year} branchName={branchName} showToast={showToast} />
        </div>

        {/* Statement Filter */}
        {showStatementFilter && (
          <div
            className="p-4 rounded-2xl border mb-6 flex items-center gap-6"
            style={{
              backgroundColor: "var(--theme-filter-bg)",
              borderColor: "var(--theme-accent)30",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--theme-muted-text)" }}
              >
                From:
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg p-1 text-sm outline-none"
                style={{
                  borderColor: "var(--theme-accent)40",
                  backgroundColor: "var(--theme-card-bg)",
                  color: "var(--theme-primary-text)",
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--theme-muted-text)" }}
              >
                To:
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-lg p-1 text-sm outline-none"
                style={{
                  borderColor: "var(--theme-accent)40",
                  backgroundColor: "var(--theme-card-bg)",
                  color: "var(--theme-primary-text)",
                }}
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-xs font-bold underline text-red-500"
              >
                Clear
              </button>
            )}
          </div>
        )}

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
                className="uppercase text-[11px] font-bold"
                style={{
                  backgroundColor: "var(--theme-table-header-bg)",
                  color: "var(--theme-button-text)",
                }}
              >
                {[
                  "S.No",
                  "Floor No",
                  "Room No",
                  "Resident Name",
                  "Month",
                  "Payment Date",
                  "Prev Units",
                  "Current Units",
                  "Total Units",
                  "Amount",
                  "Per Head EB",
                  "Days",
                  "Discount",
                  "Additional",
                  "Total Amount",
                  "Status",
                  "Action",
                  "Share",
                ].map((h) => (
                  <th key={h} className="px-2 py-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm font-semibold">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={18}
                    className="py-10"
                    style={{
                      color: "var(--theme-muted-text)",
                      backgroundColor: "var(--theme-table-row-bg)",
                    }}
                  >
                    No records available.
                  </td>
                </tr>
              ) : (
                filteredData.map((payment, index) => (
                  <tr
                    key={payment._id}
                    className="border-b transition-colors font-montserrat font-[400]"
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
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {index + 1}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {payment.FloorNo || "F-1"}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {payment.RoomNo}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {payment.UserName}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {payment.Month}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {payment.paymentdate
                        ? new Date(payment.paymentdate).toLocaleDateString(
                            "en-IN",
                          )
                        : "-"}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {payment.PrevMonth}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {payment.CurrentMonth}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {payment.Units}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      ₹{payment.Amount}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      ₹{Number(payment.PerHead || 0).toFixed(2)}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {payment.TotalPresent || "-"}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      ₹{payment.DisAmt || 0}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      ₹{payment.Extras || 0}
                    </td>
                    <td
                      className="px-2 py-3"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      ₹{payment.total?.toFixed(2)}
                    </td>
                    <td className="px-2 py-3">
                      <span
                        className={`px-4 py-1 rounded-full text-[10px] font-bold border ${
                          payment.Status?.toLowerCase() === "paid"
                            ? "bg-[#F0FFF0] border-green-500 text-green-600"
                            : "bg-[#FFF0F0] border-red-500 text-red-600"
                        }`}
                      >
                        {payment.Status?.toLowerCase() === "unpaid"
                          ? "Pending"
                          : payment.Status}
                      </span>
                    </td>
                    <td className="px-2 py-3 flex justify-center gap-1">
                      <button
                        onClick={() => handleEdit(payment._id)}
                        className="p-1.5 border rounded-lg hover:opacity-80"
                        style={{
                          backgroundColor: "var(--theme-card-bg)",
                          borderColor: "var(--theme-accent)30",
                        }}
                      >
                        <MdEdit
                          size={16}
                          style={{ color: "var(--theme-icon-color)" }}
                        />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(payment._id);
                          setIsOpenDelete(true);
                        }}
                        className="p-1.5 border rounded-lg hover:opacity-80"
                        style={{
                          backgroundColor: "var(--theme-card-bg)",
                          borderColor: "var(--theme-accent)30",
                        }}
                      >
                        <RiDeleteBin6Line size={16} className="text-red-500" />
                      </button>
                    </td>
                    <td className="px-2 py-3">
                      <button
                        onClick={() =>
                          whatsappMessage({
                            RoomNo: payment.RoomNo,
                            Month: payment.Month,
                            branchName,
                          })
                        }
                      >
                        <FaWhatsapp
                          className="text-green-500 hover:scale-110 transition-transform"
                          size={20}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EBData;
