import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const FinanceSubHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: "Payment Management", path: "/paymentManagement" },
    { name: "Daily Expenses", path: "/dailyExpense" },
    { name: "Payroll Management", path: "/payroll" },
  ];

  return (
    <div
      className="flex overflow-x-auto whitespace-nowrap scrollbar-hide gap-4 px-6 py-4 border-b"
      style={{
        // backgroundColor: "var(--theme-filter-bg)",
        // borderColor: "var(--theme-secondary-card-bg)",
      }}
    >
      {tabs.map((tab) => {
        const isActive =
          location.pathname === tab.path ||
          (tab.path === "/paymentManagement" &&
            location.pathname === "/roomRent") ||
          (tab.path === "/dailyExpense" && location.pathname === "/Amount") ||
          (tab.path === "/payroll" && location.pathname === "/AdvancePayments");

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
            style={
              isActive
                ? {
                    backgroundColor: "var(--theme-button-bg)",
                    color: "var(--theme-button-text)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }
                : {
                    backgroundColor: "var(--theme-card-bg)",
                    border: "1px solid var(--theme-secondary-card-bg)",
                    color: "var(--theme-accent)",
                  }
            }
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
};

export default FinanceSubHeader;
