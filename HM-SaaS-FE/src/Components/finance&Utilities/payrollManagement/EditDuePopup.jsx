import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/AxiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

const EditDuePopup = ({ isOpen, onClose, rowData, selectedBranch, showToast }) => {
  const [totalAmount, setTotalAmount] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [status, setStatus] = useState("borrowed");
  const [paymentMethod, setPaymentMethod] = useState("Net banking");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (rowData) {
      setTotalAmount(rowData.total_amount || "");
      setPaidAmount(rowData.paid_amount || "");
      setStatus(rowData.status || "borrowed");
      setPaymentMethod(rowData.payment_method || "Net banking");
    }
  }, [rowData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      total_amount: totalAmount,
      paid_amount: paidAmount,
      status,
      payment_method: paymentMethod,
    };
    try {
      setIsSubmitting(true);
      const { data: updatedRecord } = await axiosInstance.put(
        `/api/advance/v1/due/${rowData._id}`,
        payload,
      );
      const updatedData = {
        ...rowData,
        advance: updatedRecord.total_amount,
        paid: updatedRecord.paid_amount,
        status: updatedRecord.status,
        payment_method: updatedRecord.payment_method,
        balance: updatedRecord.total_amount - updatedRecord.paid_amount,
      };
      queryClient.setQueryData(["advances", selectedBranch], (oldData) => {
        if (!oldData) return [];
        return oldData.map((item) =>
          item._id === rowData._id ? updatedData : item,
        );
      });
      await queryClient.invalidateQueries(["advances", selectedBranch]);
      showToast("Record updated successfully", "success");
      onClose();
    } catch (err) {
      console.error(
        "Failed to update record:",
        err.response?.data || err.message,
      );
      showToast(
        `Failed to update record: ${err.response?.data?.message || err.message}`, "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    height: "40px",
    width: "100%",
    borderRadius: "12px",
    border: "1px solid var(--theme-secondary-card-bg)",
    background:
      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
    padding: "0 16px",
    fontSize: "15px",
    outline: "none",
    color: "var(--theme-primary-text)",
    fontFamily: "var(--theme-font-family-primary)",
  };
  const labelStyle = {
    display: "block",
    marginBottom: "4px",
    fontSize: "14px",
    fontWeight: "500",
    color: "var(--theme-primary-text)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="relative w-full max-w-[460px] rounded-[22px] px-6 py-4 shadow-xl"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 hover:opacity-70 transition-opacity"
          style={{ color: "var(--theme-primary-text)" }}
        >
          <X size={24} strokeWidth={2.2} />
        </button>

        <h2
          className="mb-3 text-center text-[24px] font-bold"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Edit Due Record
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label style={labelStyle}>Total Amount</label>
            <input
              type="number"
              placeholder="Enter Amount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Paid Amount</label>
            <input
              type="number"
              placeholder="Enter Borrow Amount"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <input
              type="text"
              value={status === "paid" ? "Paid" : "Borrow"}
              readOnly
              style={{ ...inputStyle, cursor: "not-allowed", opacity: 0.7 }}
            />
          </div>
          <div>
            <label style={labelStyle}>Payment Mode</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
              required
            >
              <option value="Cash">Cash</option>
              <option value="Net banking">Net banking</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
          <div className="mt-2 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[40px] w-[180px] rounded-[12px] text-[15px] font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDuePopup;
