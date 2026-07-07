import React from "react";
import { useSelector } from "react-redux";
import { XMarkIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

const SwapConfirmModal = ({ isOpen, onConfirm, onClose, targetMode }) => {
  const rooms = useSelector((state) => state.rooms.rooms) || [];

  const availableCount = rooms.filter((room) => {
    if (targetMode === "PG") return room.category === "PG";
    return !room.category || room.category === "Resident";
  }).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 font-montserrat">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div
        className="relative w-full max-w-md rounded-[35px] p-8 shadow-2xl flex flex-col items-center text-center border border-white"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 transition-transform hover:scale-110"
          style={{ color: "var(--theme-primary-text)" }}
        >
          <XMarkIcon className="h-6 w-6 stroke-2" />
        </button>

        <img
          src="https://asset.techjose.com/Hostelos/recycle.png"
          alt="Recycle Img"
        />

        <h2
          className="text-2xl font-bold mb-2"
          style={{
            color: "var(--theme-heading-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Swap to {targetMode} Mode
        </h2>

        <div
          className="px-4 py-1 rounded-md text-xs font-bold mb-4 shadow-sm"
          style={{
            backgroundColor: "#D1FAE5",
            color: "#065F46",
          }}
        >
          {targetMode} Rooms Available: {availableCount}
        </div>

        <p
          className="text-sm mb-1"
          style={{
            color: "var(--theme-muted-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          You are about to switch to {targetMode} mode.
        </p>
        <p
          className="text-[12px] mb-6"
          style={{
            color: "var(--theme-muted-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Room listings will show bed-wise availability.
        </p>

        <div
          className="rounded-xl p-3 flex items-center gap-3 mb-8 w-full"
          style={{
            backgroundColor: "var(--theme-filter-bg)",
            border: "1px solid var(--theme-secondary-card-bg)",
          }}
        >
          <InformationCircleIcon
            className="h-6 w-6 shrink-0"
            style={{ color: "var(--theme-accent)" }}
          />
          <p
            className="text-[10px] leading-tight text-left font-medium"
            style={{
              color: "var(--theme-heading-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            This will help you manage and assign {targetMode} beds more
            efficiently.
          </p>
        </div>

        <button
          onClick={onConfirm}
          className="w-full font-bold py-3 rounded-xl transition-all active:scale-95 shadow-md hover:opacity-90"
          style={{
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Confirm Switch
        </button>
      </div>
    </div>
  );
};

export default SwapConfirmModal;
