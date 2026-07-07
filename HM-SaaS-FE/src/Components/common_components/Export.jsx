import React, { useState } from "react";

import useExport from "../../hooks/useExport";
import { BsDownload } from "react-icons/bs";
import { XMarkIcon, CloudArrowDownIcon } from "@heroicons/react/24/solid";

function Export({ branchName, year, month, showToast }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { exportElectricitySummary } = useExport();

  const handleDownload = () => {
    if (!branchName || !year || !month) {
      showToast?.("Missing export parameters", "error");
      return;
    }
    exportElectricitySummary(
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
        className="flex items-center text-white px-4 py-[5px] gap-3 rounded-lg hover:opacity-90 transition"
        style={{ background: "var(--theme-button-bg)" }}
      >
        Download <BsDownload />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="rounded-[24px] shadow-[0_0_15px_rgba(0,0,0,0.12)] px-8 py-8 w-[400px] relative flex flex-col items-center"
            style={{
              background: "var(--theme-card-bg)",
              border: "1px solid #D9D9D9",
            }}
          >
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-5 right-5 hover:opacity-70 transition-colors"
              style={{ color: "var(--theme-muted-text)" }}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-5"
              style={{ background: "var(--theme-secondary-card-bg)" }}
            >
              <CloudArrowDownIcon
                className="w-[36px] h-[36px]"
                style={{ color: "var(--theme-accent)" }}
              />
            </div>

            <h2
              className="text-[24px] font-['Montserrat'] font-[700] mb-2 text-center leading-none"
              style={{ color: "var(--theme-heading-text)" }}
            >
              Export Excel
            </h2>

            <p
              className="text-[16px] font-['Montserrat'] font-[500] mb-8 text-center px-2"
              style={{ color: "var(--theme-muted-text)" }}
            >
              Are you sure you want to download this Excel file?
            </p>

            <div className="flex w-full gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 font-['Montserrat'] font-[600] text-[16px] py-[12px] rounded-[12px] hover:opacity-80 transition-colors"
                style={{
                  background: "var(--theme-secondary-button-bg)",
                  color: "var(--theme-primary-text)",
                  border: "1px solid #EAEAEA",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleDownload}
                className="flex-1 font-['Montserrat'] font-[600] text-[16px] py-[12px] rounded-[12px] hover:opacity-90 transition-colors"
                style={{
                  background: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    "var(--theme-accent-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--theme-button-bg)")
                }
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

export default Export;
