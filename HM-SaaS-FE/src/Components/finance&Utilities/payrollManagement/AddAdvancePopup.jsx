import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAddAdvance } from "../../../hooks/useAdvance";
import axiosInstance from "../../../utils/AxiosInstance";

const AddAdvancePopup = ({ isOpen, onClose, showToast }) => {
  const { selectedBranch } = useSelector((state) => state.branch || {});
  const { mutate: addAdvance, isLoading } = useAddAdvance();

  const [formData, setFormData] = useState({
    phonenumber: "",
    employeeName: "",
    amount: "",
    payment_method: "",
    date: "",
  });

  useEffect(() => {
    const fetchEmployeeName = async () => {
      if (!formData.phonenumber) {
        setFormData((prev) => ({ ...prev, employeeName: "" }));
        return;
      }
      try {
        const response = await axiosInstance.post("/api/v1/payroll/getinfo", {
          phoneNumber: Number(formData.phonenumber),
        });
        const name = response.data?.data?.employee?.Name || "";
        setFormData((prev) => ({ ...prev, employeeName: name }));
      } catch (error) {
        console.error("Error fetching employee name:", error);
        setFormData((prev) => ({ ...prev, employeeName: "" }));
      }
    };
    fetchEmployeeName();
  }, [formData.phonenumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { phonenumber, amount, payment_method, date } = formData;
    if (!phonenumber || !amount || !payment_method || !date) {
      return showToast("Please fill all required fields", "error");
    }
    if (!selectedBranch) return showToast("Branch not selected", "error");
    const payload = {
      phonenumber: Number(phonenumber),
      amount: Number(amount),
      payment_method,
      branchName: selectedBranch,
      date,
    };
    addAdvance(payload, {
      onSuccess: () => {
        showToast("Advance added successfully", "success");
        setFormData({
          phonenumber: "",
          employeeName: "",
          amount: "",
          payment_method: "",
          date: "",
        });
        onClose();
      },
      onError: (error) => {
        showToast(error.response?.data?.message || "Failed to add advance", "error");
      },
    });
  };

  if (!isOpen) return null;

  const inputStyle = {
    height: "38px",
    borderRadius: "8px",
    padding: "0 16px",
    outline: "none",
    border: "none",
    background:
      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
    boxShadow: "inset 0px 0px 4px 0px var(--theme-accent)",
    fontSize: "15px",
    color: "var(--theme-primary-text)",
    fontFamily: "var(--theme-font-family-primary)",
    width: "100%",
  };
  const labelStyle = {
    color: "var(--theme-primary-text)",
    fontFamily: "var(--theme-font-family-primary)",
    fontWeight: "500",
    fontSize: "14px",
    lineHeight: "28px",
    marginBottom: "4px",
    display: "block",
  };

  return (
    <div
      className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center backdrop-blur-sm p-4 pt-0 pb-10"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="rounded-xl shadow-xl p-6 w-full max-w-lg relative"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold hover:opacity-70 transition-opacity"
          style={{ color: "var(--theme-muted-text)" }}
        >
          &times;
        </button>

        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Add Advance
        </h2>

        <form
          className="space-y-2 w-full max-w-[420px] mx-auto"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col">
            <label style={labelStyle}>Employee Name</label>
            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              readOnly
              placeholder="Employee name will appear here"
              style={{ ...inputStyle, opacity: 0.8 }}
            />
          </div>

          <div className="flex flex-col">
            <label style={labelStyle}>Employee Phone Number</label>
            <input
              type="number"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              placeholder="Enter Employee Phone Number"
              style={inputStyle}
              required
            />
          </div>

          <div className="flex flex-col">
            <label style={labelStyle}>Advance Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div className="flex flex-col">
            <label style={labelStyle}>Advance Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter Advance Amount"
              style={inputStyle}
              required
            />
          </div>

          <div className="flex flex-col">
            <label style={labelStyle}>Payment Method</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              style={{ ...inputStyle, cursor: "pointer", appearance: "none" }}
              required
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>
          </div>

          <div className="flex justify-center pt-3">
            <button
              type="submit"
              disabled={isLoading}
              className="font-medium text-[14px] px-7 py-2 rounded-[8px] shadow-md transition-all duration-200 cursor-pointer hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
            >
              {isLoading ? "Adding..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdvancePopup;
