import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useCreateVacation } from "../../hooks/useVacation";

const ResidentStatusModal = ({
  setIsOpenResidentStatus,
  handleStatusChange,
  selectedRow,
  type,
  showToast,
}) => {
  const [vacateDate, setVacateDate] = useState("");
  const [reason, setReason] = useState("");
  const createVacation = useCreateVacation();

  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  const currentStatus = selectedRow?.status?.toLowerCase();
  const isActive =
    selectedRow?.staying === true ||
    currentStatus === "staying" ||
    currentStatus === "vacating";

  const handleSubmit = async () => {
    try {
      if (isActive) {
        if (!vacateDate) {
          showToast?.("Please select vacate date", "error");
          return;
        }

        const vacationPayload = {
          applicationname:
            selectedRow?.Name || selectedRow?.applicationname || "PG User",
          roomno: selectedRow?.RoomNo || "",
          floorno:
            selectedRow?.FloorNo && selectedRow?.FloorNo !== "-"
              ? selectedRow?.FloorNo
              : "NA",
          roomtype: type || "PG",
          dateofapply: new Date().toISOString(),
          vacatedate: vacateDate,
          reason: reason?.trim() || "Vacated",
          mobile: selectedRow?.MobileNo || selectedRow?.Whatsapp || "",
          branchName: branchName || "",
        };

        await createVacation.mutateAsync(vacationPayload);
        await handleStatusChange(vacateDate);
      } else {
        await handleStatusChange(null);
      }

      setIsOpenResidentStatus(false);
    } catch (error) {
      console.error("STATUS UPDATE ERROR =>", error);
      showToast?.(error?.response?.data?.message || "Failed to update status", "error");
    }
  };

  const labelStyle = { color: "var(--theme-heading-text)", fontWeight: 600 };
  const colonStyle = { color: "var(--theme-heading-text)" };
  const valueStyle = { color: "var(--theme-primary-text)", fontWeight: 500 };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* OVERLAY */}
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        onClick={() => setIsOpenResidentStatus(false)}
      />

      {/* MODAL */}
      <div
        className="relative z-10 w-full max-w-[430px] rounded-[18px] shadow-xl px-6 py-5"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        {/* CLOSE */}
        <button
          onClick={() => setIsOpenResidentStatus(false)}
          className="absolute top-3 right-4 text-[28px] font-bold"
          style={{ color: "var(--theme-primary-text)" }}
        >
          ✕
        </button>

        {/* TITLE */}
        <h2
          className="text-center text-[34px] font-bold mb-8"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Manage Resident
        </h2>

        {/* DETAILS */}
        <div className="space-y-5">
          <div className="grid grid-cols-[110px_20px_1fr] items-center">
            <p style={labelStyle}>Name</p>
            <span style={colonStyle}>:</span>
            <p style={valueStyle} className="break-words">
              {selectedRow?.Name || "N/A"}
            </p>
          </div>

          <div className="grid grid-cols-[110px_20px_1fr] items-center">
            <p style={labelStyle}>Room No</p>
            <span style={colonStyle}>:</span>
            <p style={valueStyle}>{selectedRow?.RoomNo || "N/A"}</p>
          </div>

          <div className="grid grid-cols-[110px_20px_1fr] items-center">
            <p style={labelStyle}>Mobile</p>
            <span style={colonStyle}>:</span>
            <p style={valueStyle}>{selectedRow?.MobileNo || "N/A"}</p>
          </div>

          <div className="grid grid-cols-[110px_20px_1fr] items-center">
            <p style={labelStyle}>Current Status</p>
            <span style={colonStyle}>:</span>
            <p
              className="font-bold"
              style={{ color: isActive ? "#16A34A" : "#EF4444" }}
            >
              {isActive ? "ACTIVE" : "INACTIVE"}
            </p>
          </div>

          {/* DEACTIVATE FIELDS */}
          {isActive && (
            <>
              <div className="grid grid-cols-[110px_20px_1fr] items-center">
                <p style={labelStyle}>Vacate Date</p>
                <span style={colonStyle}>:</span>
                <input
                  type="date"
                  value={vacateDate}
                  onChange={(e) => setVacateDate(e.target.value)}
                  className="h-[38px] rounded-md px-3 outline-none"
                  style={{
                    border: "1px solid var(--theme-accent)",
                    backgroundColor: "var(--theme-secondary-button-bg)",
                    color: "var(--theme-primary-text)",
                  }}
                />
              </div>

              <div className="grid grid-cols-[110px_20px_1fr] items-center">
                <p style={labelStyle}>Reason</p>
                <span style={colonStyle}>:</span>
                <input
                  type="text"
                  placeholder="Enter reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="h-[38px] rounded-md px-3 outline-none"
                  style={{
                    border: "1px solid var(--theme-accent)",
                    backgroundColor: "var(--theme-card-bg)",
                    color: "var(--theme-primary-text)",
                  }}
                />
              </div>
            </>
          )}

          {/* ACTIVATE MESSAGE */}
          {!isActive && (
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: "#F0FDF4",
                border: "1px solid #BBF7D0",
              }}
            >
              <p className="text-green-700 text-sm font-medium text-center">
                This resident is currently inactive.
                <br />
                Click activate to make resident active again.
              </p>
            </div>
          )}
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={createVacation?.isPending}
            className="text-white font-semibold h-[44px] px-10 rounded-[10px] shadow-md transition-all duration-300"
            style={{
              backgroundColor: isActive ? "#EF4444" : "#16A34A",
              opacity: createVacation?.isPending ? 0.7 : 1,
            }}
          >
            {createVacation?.isPending
              ? "Please wait..."
              : isActive
                ? "Deactivate"
                : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentStatusModal;
