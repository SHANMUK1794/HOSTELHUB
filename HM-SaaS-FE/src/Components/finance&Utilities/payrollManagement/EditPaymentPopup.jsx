import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../utils/AxiosInstance";
import { useSelector } from "react-redux";

const EditPaymentPopup = ({ isOpen, onClose, data, showToast }) => {
  const queryClient = useQueryClient();
  const { selectedBranch } = useSelector((state) => state.branch || {});

  const [payAmount, setPayAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (data) {
      setPayAmount("");
      setBorrowAmount("");
      setDate("");
      setPaymentMethod("");
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const { data: res } = await axiosInstance.post(
        "/api/advance/v1/due",
        payload,
      );
      return res;
    },
    onSuccess: () => {
      showToast("Payment updated successfully", "success");
      const employeeId = data?.employee_id || data?._id;
      queryClient.invalidateQueries({
        queryKey: ["advanceHistory", employeeId],
      });
      queryClient.invalidateQueries({ queryKey: ["advances"] });
      queryClient.invalidateQueries({ queryKey: ["advances", selectedBranch] });
      onClose();
    },
    onError: (err) => {
      console.error("Update failed:", err.response?.data || err.message);
      showToast(
        err.response?.data?.message ||
          err.message ||
          "Failed to update payment", "error"
      );
    },
  });

  const resolveEmployeeId = async () => {
    if (data.employee_id) return data.employee_id;
    const phone =
      data.mobile ||
      data.Mobile ||
      data.phonenumber ||
      data.phone ||
      data.mobileNumber;
    if (!phone) return null;
    try {
      const resp = await axiosInstance.post("/api/v1/payroll/getinfo", {
        phoneNumber: Number(phone),
      });
      const emp = resp.data?.data?.employee;
      return emp?._id || null;
    } catch (err) {
      console.error(
        "Failed to fetch employee from payroll:",
        err.response?.data || err.message,
      );
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!payAmount && !borrowAmount) {
      showToast("Enter either Pay Amount or Borrow Amount", "error");
      return;
    }
    const employeeId = await resolveEmployeeId();
    if (!employeeId) {
      showToast("Employee not found — please verify phone / payroll data", "error");
      return;
    }
    const payload = {
      date: date || new Date().toISOString().split("T")[0],
      employee_id: employeeId,
      payamount: Number(payAmount) || 0,
      borrowedamount: Number(borrowAmount) || 0,
      payment_method: paymentMethod || "Cash",
      branchName: data.branchName || selectedBranch || "",
    };
    if (!payload.branchName) {
      showToast("Branch name missing. Select a branch first.", "error");
      return;
    }
    mutation.mutate(payload);
  };

  if (!isOpen || !data) return null;

  const inputStyle = {
    height: "45px",
    borderRadius: "10px",
    padding: "0 20px",
    outline: "none",
    border: "none",
    background:
      "linear-gradient(90.38deg, var(--theme-filter-bg) 0.75%, var(--theme-card-bg) 100%)",
    boxShadow: "inset 0px 0px 4px 0px var(--theme-accent)",
    fontSize: "20px",
    color: "var(--theme-primary-text)",
    fontFamily: "var(--theme-font-family-primary)",
    width: "100%",
  };
  const labelStyle = {
    color: "var(--theme-primary-text)",
    fontFamily: "var(--theme-font-family-primary)",
    fontSize: "16px",
    lineHeight: "28px",
    marginBottom: "4px",
    display: "block",
  };

  return (
    <div
      className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center backdrop-blur-sm p-4 pt-0 pb-10"
      style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
    >
      <div
        className="rounded-xl shadow-lg px-6 py-5 relative w-full max-w-[480px]"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl font-bold hover:opacity-70 transition-opacity"
          style={{ color: "var(--theme-primary-text)" }}
          type="button"
          aria-label="Close"
        >
          &#10005;
        </button>

        <h2
          className="text-2xl text-center font-bold mb-4"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Update Payment
        </h2>

        <div className="mb-4 flex flex-col max-w-[500px]">
          <label style={labelStyle}>Pay Amount</label>
          <input
            type="number"
            value={payAmount}
            onChange={(e) => {
              setPayAmount(e.target.value);
              if (e.target.value !== "") setBorrowAmount("");
            }}
            placeholder={borrowAmount ? "0" : "Enter amount"}
            disabled={borrowAmount !== ""}
            style={{ ...inputStyle, opacity: borrowAmount !== "" ? 0.7 : 1 }}
          />
        </div>

        <div className="mb-4 flex flex-col max-w-[500px]">
          <label style={labelStyle}>Borrow Amount</label>
          <input
            type="number"
            value={borrowAmount}
            onChange={(e) => {
              setBorrowAmount(e.target.value);
              if (e.target.value !== "") setPayAmount("");
            }}
            placeholder={payAmount ? "0" : "Enter amount"}
            disabled={payAmount !== ""}
            style={{ ...inputStyle, opacity: payAmount !== "" ? 0.7 : 1 }}
          />
        </div>

        <div className="mb-4 flex flex-col max-w-[500px]">
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div className="mb-4 flex flex-col max-w-[500px]">
          <label style={labelStyle}>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
          >
            <option value="">Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
          </select>
        </div>

        <div className="flex justify-center gap-2 mt-3">
          <button
            type="button"
            className="px-4 py-2 rounded hover:opacity-90 transition-opacity"
            onClick={handleSubmit}
            disabled={mutation.isLoading}
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
            }}
          >
            {mutation.isLoading ? "Processing..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPaymentPopup;
