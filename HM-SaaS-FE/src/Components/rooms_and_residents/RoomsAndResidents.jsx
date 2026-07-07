import React, { useState } from "react";
import ResidentTable from "./ResidentTable";
import PGTable from "./PGTable";
import ToastMessage from "../common_components/ToastMessage";

const RoomsAndResidents = () => {
  const [activeTab, setActiveTab] = useState("Residents");

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

  return (
    <div
      className="min-h-screen p-4 md:p-5"
      style={{ backgroundColor: "var(--theme-app-bg)" }}
    >
      {/* Tab Buttons */}
      <div className="flex gap-4 mb-6">
        {["Residents", "PG"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-8 py-1.5 rounded-lg border-2 font-semibold transition-all"
            style={{
              backgroundColor:
                activeTab === tab
                  ? "var(--theme-button-bg)"
                  : "var(--theme-card-bg)",
              color:
                activeTab === tab
                  ? "var(--theme-button-text)"
                  : "var(--theme-heading-text)",
              borderColor: "var(--theme-accent)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div
        className="rounded-[25px] shadow-sm p-6 border border-gray-100"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <h2
          className="text-2xl md:text-3xl font-bold mb-8"
          style={{
            color: "var(--theme-heading-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Room & {activeTab === "Residents" ? "Resident" : "PG"} Management
        </h2>

        {activeTab === "Residents" ? <ResidentTable showToast={showToast} /> : <PGTable showToast={showToast} />}
      </div>

      {toastConfig.show && (
        <ToastMessage
          text={toastConfig.text}
          success={toastConfig.success}
          failed={toastConfig.failed}
          onClose={closeToast}
        />
      )}
    </div>
  );
};

export default RoomsAndResidents;
