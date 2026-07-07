import React from "react";
import { useTheme } from "../../hooks/ThemeContext";

const ConfirmSendAlert = ({ onClose }) => {
  const { theme } = useTheme();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      {/* Modal */}
      <div
        className="relative w-[760px] rounded-[28px] py-10 px-8 flex flex-col items-center shadow-lg
          max-[768px]:w-[90%] max-[426px]:py-8"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-[42px] font-light leading-none transition-opacity hover:opacity-70"
          style={{ color: "var(--theme-primary-text)" }}
        >
          ×
        </button>

        {/* Title */}
        <h2
          className="text-[20px] font-semibold text-center mb-8 max-[426px]:text-[16px]"
          style={{
            color: "var(--theme-primary-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Your message is Successfully Send..!!
        </h2>

        {/* Mail Image */}
        <img
          src={theme?.images?.mail}
          alt="Mail Sent"
          className="w-[180px] h-auto object-contain mb-8 max-[426px]:w-[140px]"
        />

        {/* Continue Button */}
        <button
          onClick={onClose}
          className="text-[18px] font-medium px-9 py-3 rounded-[12px] shadow-md transition-opacity hover:opacity-90
            max-[426px]:text-[16px] max-[426px]:px-7"
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ConfirmSendAlert;
