import { FaPlus, FaSearch } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import DatePicker from "../../common_components/DatePicker";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAmount from "../../../hooks/useAmount";
import useDailyExpense from "../../../hooks/useDailyExpense";
import Delete from "../../common_components/Delete";
import { useSelector } from "react-redux";
import FinanceSubHeader from "../FinanceAndUtilities";
import ToastMessage from "../../common_components/ToastMessage";

function Amount() {
  const navigate = useNavigate();
  const branchName = useSelector((state) => state.branch.selectedBranch);

  const [searchValue, setSearchValue] = useState("");
  const [selectedYearMonth, setSelectedYearMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    receiverName: "",
    senderName: "",
    paymentMethod: "UPI",
    amount: "",
    branchName: branchName,
    description: "",
  });

  const {
    data: amountData,
    isLoading: isAmountLoading,
    deleteMutation,
    createMutation,
    updateMutation,
    refetchAmounts,
  } = useAmount(currentPage, itemsPerPage, searchValue, selectedYearMonth);

  const { expenses: dailyExpenses } = useDailyExpense(selectedYearMonth);

  const totalReceivedAmount =
    amountData?.data?.reduce(
      (sum, item) => sum + (Number(item?.amount) || 0),
      0,
    ) || 0;

  const totalPaidExpenses =
    dailyExpenses?.reduce((sum, item) => {
      if (item.status?.toLowerCase() === "paid") {
        return sum + (Number(item.amount) || 0);
      }
      return sum;
    }, 0) || 0;

  const remainingAmountValue = totalReceivedAmount - totalPaidExpenses;

  useEffect(() => {
    if (branchName) {
      setFormData((prev) => ({ ...prev, branchName: branchName }));
    }
  }, [branchName]);

  const handleDateChange = (value) => {
    setSelectedYearMonth(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    setSelectedDeleteId(id);
    setIsOpenDelete(true);
  };

  const confirmDeleteData = async (idToClear) => {
    const targetId = idToClear || selectedDeleteId;
    if (targetId) {
      await deleteMutation.mutateAsync(targetId, {
        onSuccess: () => {
          showToast("Item moved to Recycle Bin safely!", "success");
          setIsOpenDelete(false);
          setSelectedDeleteId(null);
          if (refetchAmounts) refetchAmounts();
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

  const handleAddPayment = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      receiverName: "",
      senderName: "",
      paymentMethod: "UPI",
      amount: "",
      branchName: branchName,
      description: "",
    });
    setShowAddModal(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      date: item.date
        ? new Date(item.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      receiverName: item.receiverName || "",
      senderName: item.senderName || "",
      paymentMethod: item.paymentMethod || "UPI",
      description: item.description || "",
      amount: item.amount || "",
      branchName: item.branchName || branchName,
    });
    setShowEditModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      branchName: branchName,
      amount: parseFloat(formData.amount) || 0,
      date: formData.date,
    };

    if (showEditModal && selectedItem) {
      updateMutation.mutate(
        {
          id: selectedItem._id || selectedItem.id,
          updatedData: submissionData,
        },
        {
          onSuccess: () => {
            showToast("Updated ✨", "success");
            setShowEditModal(false);
          },
          onError: (error) => {
            console.error("Update error:", error);
            const errMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to update payment";
            showToast(errMsg, "error");
          }
        }
      );
    } else {
      createMutation.mutate(submissionData, {
        onSuccess: () => {
          showToast("Added ✅", "success");
          setShowAddModal(false);
        },
        onError: (error) => {
          console.error("Add error:", error);
          const errMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to add payment";
          showToast(errMsg, "error");
        }
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <div
      className="min-h-screen font-['Montserrat']"
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

      <div className="px-6 pb-8">
        {/* Header Card */}
        <div
          className="border rounded-[10px] p-5 mb-5 shadow-sm"
          style={{
            backgroundColor: "var(--theme-card-bg)",
            borderColor: "var(--theme-accent)20",
          }}
        >
          <h2
            className="text-[40px] font-bold mb-6"
            style={{ color: "var(--theme-heading-text)" }}
          >
            Daily Expense
          </h2>

          <div className="flex flex-wrap items-center gap-4">
            <DatePicker
              selectedYearMonth={selectedYearMonth}
              onChange={handleDateChange}
            />

            <div className="relative flex-1 w-full min-w-[260px] max-w-2xl">
              <input
                type="text"
                placeholder="Search Name / Room / Mobile"
                className="w-full h-[40px] px-6 pr-12 rounded-full border outline-none text-sm shadow-inner"
                style={{
                  borderColor: "var(--theme-accent)40",
                  backgroundColor: "var(--theme-filter-bg)",
                  color: "var(--theme-primary-text)",
                }}
                value={searchValue}
                onChange={handleSearchChange}
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full text-white"
                style={{ backgroundColor: "var(--theme-button-bg)" }}
              >
                <FaSearch size={10} />
              </button>
            </div>

            <button
              className="text-white px-8 h-[50px] rounded-2xl font-bold flex items-center gap-2 shadow-md ml-auto"
              style={{ backgroundColor: "var(--theme-button-bg)" }}
              onClick={handleAddPayment}
            >
              <FaPlus /> Add Amount
            </button>
          </div>
        </div>

        {/* Sub-nav + Summary */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-4 w-full md:gap[40px]">
            <div className="flex gap-4">
              <button
                className="px-4 py-1 border rounded-lg font-semibold"
                style={{
                  borderColor: "var(--theme-accent)",
                  color: "var(--theme-accent)",
                  backgroundColor: "var(--theme-card-bg)",
                }}
                onClick={() => navigate("/dailyExpense")}
              >
                Service Expense
              </button>
              <button
                className="px-4 py-1 rounded-lg font-semibold shadow-md text-white"
                style={{ backgroundColor: "var(--theme-button-bg)" }}
              >
                Payment History
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <div
                className="border px-4 py-1 flex-1 rounded-lg flex items-center gap-3 shadow-sm min-w-[200px]"
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
                <span
                  className="font-bold whitespace-nowrap text-xl"
                  style={{ color: "var(--theme-accent)" }}
                >
                  ₹ {totalReceivedAmount.toLocaleString()}
                </span>
              </div>
              <div
                className="border flex-1 px-4 py-1 rounded-lg flex items-center gap-3 shadow-sm min-w-[250px]"
                style={{
                  backgroundColor: "var(--theme-card-bg)",
                  borderColor: "var(--theme-accent)",
                }}
              >
                <span
                  className="font-semibold"
                  style={{ color: "var(--theme-accent)" }}
                >
                  Remaining Amount
                </span>
                <span
                  className="font-bold whitespace-nowrap text-xl"
                  style={{
                    color: remainingAmountValue < 0 ? "#ef4444" : "#16a34a",
                  }}
                >
                  ₹ {remainingAmountValue.toLocaleString()}
                </span>
              </div>
            </div>
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
          <table className="w-full text-center min-w-[800px] border-collapse">
            <thead>
              <tr
                className="uppercase text-[14px] font-bold"
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
                  className="py-4 border-r"
                  style={{ borderColor: "var(--theme-accent)40" }}
                >
                  Sender Name
                </th>
                <th
                  className="py-4 border-r"
                  style={{ borderColor: "var(--theme-accent)40" }}
                >
                  Receiver Name
                </th>
                <th
                  className="py-4 border-r"
                  style={{ borderColor: "var(--theme-accent)40" }}
                >
                  Payment Mode
                </th>
                <th
                  className="py-4 border-r"
                  style={{ borderColor: "var(--theme-accent)40" }}
                >
                  Description
                </th>
                <th
                  className="py-4 border-r"
                  style={{ borderColor: "var(--theme-accent)40" }}
                >
                  Amount
                </th>
                <th className="py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {isAmountLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-10"
                    style={{
                      color: "var(--theme-muted-text)",
                      backgroundColor: "var(--theme-table-row-bg)",
                    }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : (
                amountData?.data?.map((item) => (
                  <tr
                    key={item._id || item.id}
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
                      {formatDate(item.date)}
                    </td>
                    <td
                      className="py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {item.senderName}
                    </td>
                    <td
                      className="py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {item.receiverName}
                    </td>
                    <td
                      className="py-4 uppercase"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {item.paymentMethod}
                    </td>
                    <td
                      className="py-4"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      {item.description || "-"}
                    </td>
                    <td
                      className="py-4 font-bold"
                      style={{ color: "var(--theme-accent)" }}
                    >
                      ₹ {item.amount}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 border rounded-md shadow-sm"
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
                          onClick={() => handleDelete(item._id || item.id)}
                          className="p-1.5 border rounded-md shadow-sm"
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

      {/* Delete Modal */}
      {isOpenDelete && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center backdrop-blur-sm">
          <Delete
            setIsOpenDelete={setIsOpenDelete}
            selectedId={selectedDeleteId}
            deleteData={confirmDeleteData}
            refetch={refetchAmounts}
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-0 pb-10">
          <div
            className="rounded-2xl shadow-2xl w-full max-w-md border flex flex-col max-h-[calc(100vh-140px)] overflow-hidden"
            style={{
              backgroundColor: "var(--theme-card-bg)",
              borderColor: "var(--theme-accent)30",
            }}
          >
            <div
              className="p-4 flex justify-between items-center shrink-0"
              style={{ backgroundColor: "var(--theme-button-bg)" }}
            >
              <h3 className="text-xl font-bold text-white">
                {showEditModal ? "Edit Payment" : "Add New Payment"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="text-2xl text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    className="text-xs font-bold uppercase ml-1"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-2 border rounded-xl outline-none"
                    style={{
                      borderColor: "var(--theme-accent)40",
                      background:
                        "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                      color: "var(--theme-primary-text)",
                    }}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="text-xs font-bold uppercase ml-1"
                      style={{ color: "var(--theme-muted-text)" }}
                    >
                      Sender
                    </label>
                    <input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-2 border rounded-xl outline-none"
                      style={{
                        borderColor: "var(--theme-accent)40",
                        background:
                          "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                        color: "var(--theme-primary-text)",
                      }}
                      placeholder="Name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="text-xs font-bold uppercase ml-1"
                      style={{ color: "var(--theme-muted-text)" }}
                    >
                      Receiver
                    </label>
                    <input
                      type="text"
                      name="receiverName"
                      value={formData.receiverName}
                      onChange={handleInputChange}
                      className="w-full mt-1 px-4 py-2 border rounded-xl outline-none"
                      style={{
                        borderColor: "var(--theme-accent)40",
                        background:
                          "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                        color: "var(--theme-primary-text)",
                      }}
                      placeholder="Name"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="text-xs font-bold uppercase ml-1"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-2 border rounded-xl outline-none"
                    style={{
                      borderColor: "var(--theme-accent)40",
                      background:
                        "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                      color: "var(--theme-primary-text)",
                    }}
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label
                    className="text-xs font-bold uppercase ml-1"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-2 border rounded-xl outline-none font-bold"
                    style={{
                      borderColor: "var(--theme-accent)40",
                      background:
                        "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                      color: "var(--theme-accent)",
                    }}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label
                    className="text-xs font-bold uppercase ml-1"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-4 py-2 border rounded-xl outline-none"
                    style={{
                      borderColor: "var(--theme-accent)40",
                      background:
                        "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
                      color: "var(--theme-primary-text)",
                    }}
                    placeholder="Notes..."
                    rows="2"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="flex-1 py-3 border rounded-xl font-bold"
                  style={{
                    borderColor: "var(--theme-accent)30",
                    color: "var(--theme-primary-text)",
                    backgroundColor: "var(--theme-secondary-button-bg)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold shadow-lg text-white"
                  style={{ backgroundColor: "var(--theme-button-bg)" }}
                >
                  {showEditModal ? "Update" : "Add Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Amount;
