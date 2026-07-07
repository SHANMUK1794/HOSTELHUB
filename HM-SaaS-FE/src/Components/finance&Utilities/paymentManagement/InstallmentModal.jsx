import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/AxiosInstance"; // Make sure this path is correct based on your project structure

const InstallmentModal = ({ setIsOpen, selectedRecord, refetch, showToast }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    amountPaid: "",
    remainingBalance: selectedRecord?.Balance || 0,
  });

  
  const handleAmountChange = (e) => {
    const val = Number(e.target.value);
    const newBalance = selectedRecord?.Balance - val;
    setFormData((prev) => ({
      ...prev,
      amountPaid: val,
      remainingBalance: newBalance > 0 ? newBalance : 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amountPaid || formData.amountPaid <= 0) {
      return showToast("Please enter a valid amount.", "error");
    }
    
    try {
      // 👉 FIXED THE URL ROUTE HERE: Matches your /api/payement/v1/ base structure
      await axiosInstance.put(`/api/payement/v1/installment/${selectedRecord._id}`, formData);
      
      showToast("Installment paid successfully!", "success");
      
      // Refresh the table so the new Balance shows immediately
      if (refetch) refetch(); 
      setIsOpen(false);
    } catch (err) {
      console.error("Installment Error:", err);
      showToast(err?.response?.data?.message || "Failed to process payment", "error");
    }
  };

  const inputStyle = {
    background:
      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
    borderColor: "var(--theme-accent)40",
    color: "var(--theme-primary-text)",
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl shadow-xl p-6" style={{ backgroundColor: "var(--theme-card-bg)" }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "var(--theme-heading-text)" }}>
            Pay Installment
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-2xl font-bold text-gray-500 hover:text-red-500">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-500">Date</label>
              <input type="date" value={formData.date} readOnly className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-50 outline-none"
              style={inputStyle} />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500">Time</label>
              <input type="time" value={formData.time} readOnly className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-50 outline-none" 
              style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Current Balance</label>
            <input type="number" value={selectedRecord?.Balance} readOnly className="w-full border rounded-lg px-3 py-2 mt-1 bg-red-50 text-red-600 font-bold outline-none" 
            style={inputStyle} />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Payment Amount</label>
            <input type="number" placeholder="Enter amount..." value={formData.amountPaid} onChange={handleAmountChange} className="w-full border rounded-lg px-3 py-2 mt-1 outline-none" autoFocus 
            style={inputStyle} />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Balance After Payment</label>
            <input type="number" value={formData.remainingBalance} readOnly className="w-full border rounded-lg px-3 py-2 mt-1 bg-green-50 text-green-600 font-bold outline-none" style={inputStyle}      />
          </div>

          <button type="submit" className="w-full text-white font-bold py-3 rounded-xl mt-4 shadow-md transition-all hover:opacity-90" style={{ backgroundColor: "var(--theme-button-bg)" }}>
            Confirm Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default InstallmentModal;