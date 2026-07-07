import React, { useState } from "react";

const DepositPaymentPopup = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    totalAmount: "11000",
    paidAmount: "0",
    balanceAmount: "11000",
    payAmount: "",
    paymentMode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 pt-0 pb-10">
      <div className="bg-[#f5f5f5] rounded-md shadow-lg w-full max-w-md p-6 relative max-h-[calc(100vh-140px)] overflow-y-auto">
        <h2 className="text-xl font-bold text-purple-800 mb-6">Depositsssssssss Payment</h2>

        {/* Total / Paid / Balance */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-sm font-medium">Total Amount</label>
            <input
              name="totalAmount"
              value={formData.totalAmount}
              readOnly
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Balance Amount</label>
            <input
              name="balanceAmount"
              value={formData.balanceAmount}
              readOnly
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-sm font-medium">Paid Amount</label>
            <input
              name="paidAmount"
              value={formData.paidAmount}
              readOnly
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Pay Amount</label>
            <input
              name="payAmount"
              value={formData.payAmount}
              onChange={handleChange}
              placeholder="Enter Amount"
              className="w-full border rounded-md px-3 py-2 mt-1"
            />
          </div>
        </div>

        {/* Payment Mode */}
        <div className="mb-5">
          <label className="text-sm font-medium">Payment Mode</label>
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 mt-1"
          >
            <option value="">Payment Type</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => onSubmit(formData)}
            className="bg-purple-800 text-white px-5 py-2 rounded-md hover:bg-purple-900"
          >
            Make Payment
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default DepositPaymentPopup;
