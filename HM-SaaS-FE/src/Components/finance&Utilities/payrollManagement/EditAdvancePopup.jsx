import React, { useState, useEffect } from "react";
import { useEditAdvance } from "../../../hooks/useAdvance";
import { useQueryClient } from "@tanstack/react-query";
import ApiRoutes from "../../../utils/ApiRoutes";

const EditAdvancePopup = ({ isOpen, onClose, data = {}, showToast }) => {
  const { mutate: editAdvance, isLoading } = useEditAdvance();
  const queryClient = useQueryClient();

  const [staffName, setStaffName] = useState("");
  const [salary, setSalary] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [paid, setPaid] = useState(0);
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    setStaffName(data?.staff_name || "");
    setSalary(data?.salary || 0);
    setAdvance(data?.advance || 0);
    setPaid(data?.paid || 0);
    setBalance(data?.balance || 0);
    setStatus(data?.status || "Pending");
  }, [data]);

  useEffect(() => {
    setBalance(salary - advance - paid);
  }, [salary, advance, paid]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      staff_name: staffName,
      salary,
      advance,
      paid,
      balance,
      status,
    };
    console.log("advanceId:", data?._id);
    console.log("POST body", updatedData);
    console.log("Endpoint", ApiRoutes.ADVANCE.UPDATE(data?._id));
    editAdvance(
      { advanceId: data?._id || data?.id, updatedData },
      {
        onSuccess: () => {
          showToast("Advance updated successfully", "success");
          queryClient.invalidateQueries(["advances"]);
          onClose();
        },
        onError: (error) => {
          showToast(
            error.response?.data?.message || "Failed to update advance", "error"
          );
          console.error(error);
        },
      },
    );
  };

  if (!isOpen) return null;

  const inputClass = "w-full rounded-xl px-4 py-2 outline-none focus:ring-2";
  const inputStyle = {
    border: "1px solid var(--theme-secondary-card-bg)",
    backgroundColor: "var(--theme-filter-bg)",
    color: "var(--theme-primary-text)",
    fontFamily: "var(--theme-font-family-primary)",
  };
  const labelStyle = {
    display: "block",
    marginBottom: "4px",
    fontWeight: "600",
    color: "var(--theme-primary-text)",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.18)" }}
    >
      <div
        className="rounded-xl shadow-lg px-10 py-8 relative w-full max-w-[400px]"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-3 text-2xl hover:opacity-70 transition-opacity"
          style={{ color: "var(--theme-muted-text)" }}
        >
          &#10005;
        </button>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              className={inputClass}
              style={inputStyle}
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
              placeholder="Vignesh"
            />
          </div>
          <div>
            <label style={labelStyle}>Amount Borrowed</label>
            <input
              type="number"
              className={inputClass}
              style={inputStyle}
              value={advance}
              onChange={(e) => setAdvance(Number(e.target.value))}
              placeholder="10,000"
            />
          </div>
          <div>
            <label style={labelStyle}>Salary</label>
            <input
              type="number"
              className={inputClass}
              style={inputStyle}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
              placeholder="10,000"
            />
          </div>
          <div>
            <label style={labelStyle}>Paid Amount</label>
            <input
              type="number"
              className={inputClass}
              style={inputStyle}
              value={paid}
              onChange={(e) => setPaid(Number(e.target.value))}
              placeholder="5,000"
            />
          </div>
          <div>
            <label style={labelStyle}>Balance</label>
            <input
              type="number"
              className={inputClass}
              style={{ ...inputStyle, opacity: 0.7 }}
              value={balance}
              readOnly
              placeholder="3,000"
            />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select
              className={inputClass}
              style={{
                ...inputStyle,
                cursor: "pointer",
                color: status === "Pending" ? "#EF4444" : "#16a34a",
              }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending" className="text-red-500">
                Pending
              </option>
              <option value="paid" className="text-green-600">
                Paid
              </option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="font-semibold px-8 py-2 rounded-xl text-base shadow hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdvancePopup;
