import React, { useEffect, useState } from "react";
import useDailyExpense from "../../../hooks/useDailyExpense";
import { useSelector } from "react-redux";

const DailyExpenseForm = ({
  setIsOpen,
  editingIndex,
  setEditingIndex,
  expenseData = [],
  showToast,
}) => {
  const [formData, setFormData] = useState({
    date: "",
    work: "",
    amount: "",
    status: "Unpaid",
    voucherno: "",
  });

  const { addPayment, editPayment } = useDailyExpense();
  const user = useSelector((state) => state.auth.user);
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const branchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.role === "Warden"
        ? user?.branchName
        : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => resetForm();

  const resetForm = () => {
    setFormData({
      date: "",
      work: "",
      amount: "",
      status: "Unpaid",
      voucherno: "",
    });
    setEditingIndex(null);
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      // const id = expenseData[editingIndex]?._id;
      const id =
        expenseData[editingIndex]?._id || expenseData[editingIndex]?.id;
      if (id) {
        editPayment(
          { id, updatedData: { ...formData, branchName } },
          {
            onSuccess: () => {
              showToast("Expense edited successfully", "success");
              resetForm();
            },
            onError: (error) => {
              console.error("Edit error:", error);
              const errMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to edit expense";
              showToast(errMsg, "error");
            }
          }
        );
      }
    } else {
      addPayment(
        { ...formData, branchName },
        {
          onSuccess: () => {
            showToast("Expense added successfully", "success");
            resetForm();
          },
          onError: (error) => {
            console.error("Add error:", error);
            const errMsg = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Failed to add expense";
            showToast(errMsg, "error");
          }
        }
      );
    }
  };

  useEffect(() => {
    if (editingIndex !== null && expenseData?.[editingIndex]) {
      const selectedData = expenseData[editingIndex];
      const formattedDate = new Date(selectedData.date)
        .toISOString()
        .split("T")[0];
      setFormData({
        date: formattedDate,
        work: selectedData.work,
        amount: selectedData.amount,
        status: selectedData.status || "Unpaid",
        voucherno: selectedData.voucherno,
      });
    }
  }, [editingIndex, expenseData]);

  const inputClass =
    "w-full h-[48px] px-4 rounded-[12px] outline-none text-[14px]";
  const inputStyle = {
    background:
      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
    boxShadow: "inset 0 0 4px 0 var(--theme-accent)",
    color: "var(--theme-primary-text)",
    border: "1px solid var(--theme-accent)40",
  };

  return (
    <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 pt-0 pb-10">
      <form
        key={editingIndex}
        onSubmit={handleSubmit}
        className="p-7 rounded-[20px] w-full max-w-[420px] shadow-2xl relative max-h-[calc(100vh-140px)] overflow-y-auto"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <button
          type="button"
          onClick={handleCancel}
          className="absolute top-5 right-5 text-[20px] font-bold"
          style={{ color: "var(--theme-primary-text)" }}
        >
          ✕
        </button>
        <h2
          className="text-[22px] font-bold text-center mb-6"
          style={{ color: "var(--theme-heading-text)" }}
        >
          {editingIndex !== null ? "Edit Expense" : "Add Expense"}
        </h2>

        {/* Date */}
        <div className="mb-4">
          <label
            className="block text-[15px] mb-1.5"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label
            className="block text-[15px] mb-1.5"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="Enter Amount"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Work */}
        <div className="mb-4">
          <label
            className="block text-[15px] mb-1.5"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Service Type
          </label>
          <input
            type="text"
            name="work"
            value={formData.work}
            onChange={handleChange}
            required
            placeholder="Enter Service Type"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Voucher */}
        <div className="mb-4">
          <label
            className="block text-[15px] mb-1.5 uppercase"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Voucher
          </label>
          <input
            type="number"
            name="voucherno"
            value={formData.voucherno}
            onChange={handleChange}
            required
            placeholder="Enter Voucher No"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Status */}
        <div className="mb-6">
          <label
            className="block text-[15px] mb-1.5"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={inputClass}
            style={inputStyle}
          >
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-2.5 rounded-[10px] text-[15px] font-medium"
            style={{
              backgroundColor: "var(--theme-secondary-button-bg)",
              color: "var(--theme-secondary-button-text)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-10 py-2.5 rounded-[10px] text-[15px] font-medium text-white"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {editingIndex !== null ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyExpenseForm;
