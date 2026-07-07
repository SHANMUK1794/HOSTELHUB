import React from "react";
import { MdClose } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { useTheme } from "../../../../hooks/ThemeContext";
import {useEmployees} from "../../../../hooks/useEmployee"; 

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === "" || isNaN(amount))
    return "0";
  return Number(amount).toLocaleString("en-IN");
};

const DetailItem = ({ label, value }) => (
  <div className="flex items-center gap-2 text-[15px]">
    <p
      className="font-semibold min-w-[78px]"
      style={{ color: "var(--theme-heading-text)" }}
    >
      {label}
    </p>
    <p style={{ color: "var(--theme-muted-text)" }}>:</p>
    <p
      className="font-medium break-all"
      style={{ color: "var(--theme-primary-text)" }}
    >
      {value || "0"}
    </p>
  </div>
);

const ViewDetailsPopup = ({ rowData, onClose }) => {
  const { data: employees = [] } = useEmployees();

  const employee = employees.find(
    (emp) => emp._id === rowData.employeeId
  );

  const { theme } = useTheme();
  if (!rowData) return null;

  

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex flex-row items-center justify-center bg-black/40 p-4"
    >
      <div
        className="relative w-full max-w-[560px] rounded-md shadow-2xl px-5 py-5"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5"
          style={{ color: "var(--theme-primary-text)" }}
        >
          <MdClose size={20} />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center shadow-md"
            style={{ backgroundColor: "var(--theme-button-bg)" }}
          >
            <FaRegCircleUser className="text-white text-[28px]" />
          </div>
          <h2
            className="text-[34px] font-bold"
            style={{
              color: "var(--theme-heading-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            {rowData.staff_name ?? rowData.name ?? "Balaji"}
          </h2>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12">
          <div className="space-y-5">
            <DetailItem
              label="Salary Date"
              value={rowData.salarydate ?? "22"}
            />
            <DetailItem label="Month" value={rowData.month ?? "11"} />
            <DetailItem label="Year" value={rowData.year ?? "2026"} />
            <DetailItem
              label="mobile No."
              value={rowData.mobile ?? "1236547890"}
            />
            <DetailItem
              label="Salary"
              value={formatCurrency(rowData.salary ?? 15000)}
            />
            <DetailItem
              label="Advance"
              value={formatCurrency(rowData.advance ?? 5000)}
            />
            <DetailItem
              label="Balance"
              value={formatCurrency(rowData.balance ?? 10000)}
            />
          </div>
          <div className="space-y-5">
            <DetailItem
              label="Total"
              value={formatCurrency(rowData.total ?? 15000)}
            />
            <DetailItem
              label="Deduction"
              value={formatCurrency(rowData.deduction ?? 0)}
            />
            <DetailItem
              label="Over Time"
              value={formatCurrency(rowData.overtime ?? 0)}
            />
            <DetailItem
              label="Working Days"
              value={rowData.workingdays ?? "0"}
            />
            <DetailItem
              label="Leave Deduction"
              value={formatCurrency(rowData.bonus ?? 0)}
            />
            <DetailItem
              label="Designation"
              value={employee?.Designation ??  "-"}
            />

            <DetailItem
              label="Round off"
              value={formatCurrency(rowData.roundoff ?? 0)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetailsPopup;
