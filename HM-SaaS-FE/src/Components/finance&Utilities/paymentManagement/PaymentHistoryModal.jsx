import React from "react";

const PaymentHistoryModal = ({ setIsOpen, selectedRecord }) => {
  // Placeholder array until we update your backend
  const history = selectedRecord?.paymentHistory || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl rounded-2xl shadow-xl p-6" style={{ backgroundColor: "var(--theme-card-bg)" }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--theme-heading-text)" }}>Payment History</h2>
            <p className="text-sm text-gray-500">Resident: <span className="font-bold">{selectedRecord?.ResidentName}</span></p>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-2xl font-bold text-gray-500 hover:text-red-500">×</button>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Amount Paid</th>
                <th className="px-4 py-3">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-400">No payment history found for this user.</td>
                </tr>
              ) : (
                history.map((record, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{record.date}</td>
                    <td className="px-4 py-3">{record.time}</td>
                    <td className="px-4 py-3 text-green-600 font-bold">+ ₹{record.amountPaid}</td>
                    <td className="px-4 py-3 text-red-500 font-bold">₹{record.balanceAfter}</td>
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

export default PaymentHistoryModal;