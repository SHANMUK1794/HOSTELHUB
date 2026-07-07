import React from "react";
import { MdClose } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { useTheme } from "../../../../hooks/ThemeContext";

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === "" || isNaN(amount))
    return "₹ 0";
  return `₹ ${(parseFloat(amount) || 0).toLocaleString("en-IN")}`;
};

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-sm" style={{ color: "var(--theme-muted-text)" }}>
      {label}
    </p>
    <p className="font-semibold" style={{ color: "var(--theme-primary-text)" }}>
      {value ?? "—"}
    </p>
  </div>
);

const ProfilePopup = ({ rowData, onClose }) => {
  const { theme } = useTheme();
  if (!rowData) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4"
      style={{ fontFamily: "var(--theme-font-family-primary)" }}
    >
      <div
        className="rounded-xl w-full max-w-md p-6 shadow-2xl relative"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        {/* CLOSE */}
        <MdClose
          size={18}
          onClick={onClose}
          className="absolute right-4 top-4 cursor-pointer transition-colors"
          style={{ color: "var(--theme-muted-text)" }}
        />

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--theme-secondary-card-bg)" }}
          >
            <FaRegCircleUser
              size={40}
              style={{ color: "var(--theme-heading-text)" }}
            />
          </div>
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--theme-heading-text)" }}
          >
            {rowData.staff_name || rowData.name || "Unknown Staff"}
          </h2>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <DetailItem label="Branch" value={rowData.branchName ?? "—"} />
          <DetailItem label="Employee No" value={rowData.employeeNo ?? "—"} />
          <DetailItem label="Days" value={rowData.days ?? "—"} />
          <DetailItem label="Per/Day" value={formatCurrency(rowData.perDay)} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePopup;
