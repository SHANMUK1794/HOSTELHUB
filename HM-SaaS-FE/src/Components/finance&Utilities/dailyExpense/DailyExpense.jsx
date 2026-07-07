import { useEffect, useState } from "react";
import { FaSearch, FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import useDailyExpense from "../../../hooks/useDailyExpense";
import DatePicker from "../../common_components/DatePicker";
import Delete from "../../common_components/Delete";
import DailyExpenseForm from "./DailyExpenseForm";
import LottieLoader from "../../common_components/LottieLoader";
import { useNavigate } from "react-router-dom";
import FinanceSubHeader from "../FinanceAndUtilities";
import ToastMessage from "../../common_components/ToastMessage";

function DailyExpense() {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYearMonth, setSelectedYearMonth] = useState("");

  const navigate = useNavigate();
  const {
    expenses: dailyexpenseData,
    isLoading,
    refetch,
    deletePayment,
  } = useDailyExpense(selectedYearMonth);

  useEffect(() => {
    refetch();
  }, []);

  const handleDelete = async (idToClear) => {
    const targetId = idToClear || deleteId;
    if (targetId) {
      deletePayment(targetId, {
        onSuccess: () => {
          setDeleteId(null);
          setIsOpenDelete(false);
          showToast("Item moved to Recycle Bin safely!", "success");
        },
        onError: () => {
          showToast("Delete payment failed!", "error");
        }
      });
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

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleDateString("en-GB");
  };

  const filteredData = (dailyexpenseData || []).filter((item) =>
    (item?.work || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalAmount = filteredData.reduce(
    (sum, item) => sum + (Number(item?.amount) || 0),
    0,
  );

  return (
    <div
      className="min-h-screen font-montserrat"
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

      {isOpenDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm">
          <Delete
            setIsOpenDelete={setIsOpenDelete}
            selectedId={deleteId}
            deleteData={handleDelete}
            refetch={refetch}
          />
        </div>
      )}

      {isOpenForm && (
        <DailyExpenseForm
          setIsOpen={setIsOpenForm}
          editingIndex={editingIndex}
          setEditingIndex={setEditingIndex}
          refetch={refetch}
          expenseData={filteredData}
          showToast={showToast}
        />
      )}

      <div className="px-6 pb-8">
        {/* Header Card */}
        <div
          className="rounded-[10px] p-5 mb-5 shadow-sm"
          style={{
            backgroundColor: "var(--theme-card-bg)",
            borderColor: "var(--theme-accent)20",
          }}
        >
          <h2
            className="text-2xl md:text-[40px] font-bold mb-6"
            style={{ color: "var(--theme-heading-text)" }}
          >
            Daily Expense
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <DatePicker
              selectedYearMonth={selectedYearMonth}
              onChange={(v) => setSelectedYearMonth(v)}
            />

            <div className="relative flex-1 min-w-[260px] w-full max-w-2xl">
              <input
                type="text"
                placeholder="Search Name / Room / Mobile"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[40px] px-6 pr-12 rounded-full border outline-none text-sm shadow-inner"
                style={{
                  borderColor: "var(--theme-accent)40",
                  backgroundColor: "var(--theme-filter-bg)",
                  color: "var(--theme-primary-text)",
                }}
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full text-white"
                style={{ backgroundColor: "var(--theme-button-bg)" }}
              >
                <FaSearch size={10} />
              </button>
            </div>

            <button
              className="text-white px-8 h-[40px] rounded-xl flex items-center gap-2 font-montserrat shadow-md whitespace-nowrap shrink-0"
              style={{ backgroundColor: "var(--theme-button-bg)" }}
              onClick={() => {
                setEditingIndex(null);
                setIsOpenForm(true);
              }}
            >
              <FaPlus /> Add Expense
            </button>
          </div>
        </div>

        {/* Sub-nav + Total */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              className="px-4 py-1 rounded-lg font-semibold shadow-md text-white"
              style={{ backgroundColor: "var(--theme-button-bg)" }}
            >
              Service Expense
            </button>
            <button
              onClick={() => navigate("/Amount")}
              className="px-4 py-1 border rounded-lg font-semibold"
              style={{
                borderColor: "var(--theme-accent)",
                color: "var(--theme-accent)",
                backgroundColor: "var(--theme-card-bg)",
              }}
            >
              Payment History
            </button>
          </div>

          <div
            className="border px-4 py-1 rounded-lg flex items-center gap-3"
            style={{
              backgroundColor: "var(--theme-card-bg)",
              borderColor: "var(--theme-accent)",
            }}
          >
            <span
              className="font-semibold"
              style={{ color: "var(--theme-accent)" }}
            >
              Total Amount
            </span>
            <span className="font-bold text-xl" style={{ color: "#16a34a" }}>
              ₹ {totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-x-auto shadow-sm border"
          style={{
            backgroundColor: "var(--theme-card-bg)",
            borderColor: "var(--theme-accent)15",
          }}
        >
          <table className="w-full text-center min-w-[800px]">
            <thead>
              <tr
                className="uppercase text-[15px] font-bold"
                style={{
                  backgroundColor: "var(--theme-table-header-bg)",
                  color: "var(--theme-button-text)",
                }}
              >
                <th
                  className="py-4 border-r"
                  style={{ borderColor: "var(--theme-accent)40" }}
                >
                  Date
                </th>
                <th
                  className="py-4 border-r text-left px-10"
                  style={{ borderColor: "var(--theme-accent)40" }}
                >
                  Service Type
                </th>
                <th
                  className="py-4 border-r"
                  style={{ borderColor: "var(--theme-accent)40" }}
                >
                  Amount
                </th>
                <th
                  className="py-4 border-r"
                  style={{ borderColor: "var(--theme-accent)40" }}
                >
                  Status
                </th>
                <th className="py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-10"
                    style={{ backgroundColor: "var(--theme-table-row-bg)" }}
                  >
                    <LottieLoader />
                  </td>
                </tr>
              ) : (
                filteredData.map((expense, index) => (
                  <tr
                    key={expense._id || expense.id}
                    className="border-b transition-colors"
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
                      className="py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {formatDate(expense.date)}
                    </td>
                    <td
                      className="py-4 text-left px-10"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {expense.work}
                    </td>
                    <td
                      className="py-4 font-bold"
                      style={{ color: "var(--theme-accent)" }}
                    >
                      ₹ {expense.amount}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-6 py-1 rounded-full text-sm font-bold border ${
                          expense.status?.toLowerCase() === "paid"
                            ? "bg-[#F0FFF0] border-[#34A853] text-[#34A853]"
                            : "bg-[#FFF0F0] border-[#FF4D4D] text-[#FF4D4D]"
                        }`}
                      >
                        {expense.status === "Unpaid"
                          ? "Pending"
                          : expense.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingIndex(index);
                            setIsOpenForm(true);
                          }}
                          className="p-1.5 border rounded-md"
                          style={{
                            backgroundColor: "var(--theme-card-bg)",
                            borderColor: "var(--theme-accent)30",
                          }}
                        >
                          <MdEdit
                            style={{ color: "var(--theme-icon-color)" }}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(expense._id || expense.id);
                            setIsOpenDelete(true);
                          }}
                          className="p-1.5 border rounded-md"
                          style={{
                            backgroundColor: "var(--theme-card-bg)",
                            borderColor: "var(--theme-accent)30",
                          }}
                        >
                          <RiDeleteBin6Line className="text-red-500" />
                        </button>
                      </div>
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
}

export default DailyExpense;
