import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setMessage } from "../../store/slice/reminderSlice";

const CustomMessageModal = ({ isOpen, onClose, onSend }) => {
  const dispatch = useDispatch();
  const [inputMsg, setInputMsg] = useState("");

  if (!isOpen) return null;

  const handleNext = () => {
    if (!inputMsg.trim()) return;
    dispatch(setMessage(inputMsg.trim()));
    onClose?.();
    onSend?.();
  };

  return (
    <div className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] w-full flex justify-center items-center bg-black/30 backdrop-blur-[2px]">
      <div
        className="p-4 rounded-[14px] w-[400px] shadow-xl max-h-[calc(100vh-140px)] overflow-y-auto"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-1 right-2 text-2xl transition-opacity hover:opacity-70"
            style={{ color: "var(--theme-primary-text)" }}
          >
            &times;
          </button>
        </div>

        <h2
          className="font-bold text-lg mb-3"
          style={{
            color: "var(--theme-primary-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Custom Message
        </h2>

        <textarea
          className="w-full p-3 rounded-[14px] resize-none outline-none"
          style={{
            // Linear gradient input as requested
            background:
              "linear-gradient(90.38deg, var(--theme-filter-bg) 0.75%, var(--theme-card-bg) 100%)",
            border: "1px solid var(--theme-secondary-card-bg)",
            boxShadow: "inset 0px 0px 4px 0px rgba(0,0,0,0.08)",
            color: "var(--theme-primary-text)",
            fontFamily: "var(--theme-font-family-primary)",
            fontSize: "14px",
          }}
          rows={5}
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Enter your message..."
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--theme-accent)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor =
              "var(--theme-secondary-card-bg)")
          }
        />

        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={handleNext}
            className="px-3 py-1 rounded-md transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomMessageModal;
