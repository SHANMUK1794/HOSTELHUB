import React, { useState } from "react";
import useDepositExport from "../../../hooks/useDepositExport";
import { BsDownload } from "react-icons/bs";

function RoomRentExport({ branchName, year, month, showToast }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { deposit } = useDepositExport();

  const handleDownload = () => {
    if (!branchName || !year || !month) {
      showToast("Missing export parameters", "error");
      return;
    }
    deposit(
      { branchName, year, month },
      {
        onSuccess: (msg) => showToast?.(msg, "success"),
        onError: (msg) => showToast?.(msg, "error"),
      }
    );
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center text-white px-4 py-[5px] gap-3 rounded-lg"
        style={{ backgroundColor: "var(--theme-button-bg)" }}
      >
        Download <BsDownload />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000CC]">
          <div
            className="rounded-xl shadow-lg px-6 py-5 w-[330px] h-[170px]"
            style={{ backgroundColor: "var(--theme-card-bg)" }}
          >
            <h2
              className="text-lg font-extrabold mb-3"
              style={{ color: "var(--theme-primary-text)" }}
            >
              Export Excel
            </h2>

            <p
              className="text-lg mb-3 text-center"
              style={{ color: "var(--theme-primary-text)" }}
            >
              Are you sure you want to Download this Excel file?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl border"
                style={{
                  backgroundColor: "var(--theme-secondary-button-bg)",
                  borderColor: "var(--theme-accent)30",
                  color: "var(--theme-secondary-button-text)",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl text-white"
                style={{ backgroundColor: "var(--theme-button-bg)" }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RoomRentExport;
