import React, { useState } from "react";
import { toast } from "sonner";
import StoreExpenceDownload from "../../../../hooks/useStoreExpenceExport";
import { BsDownload } from "react-icons/bs";
import { XMarkIcon, CloudArrowDownIcon } from "@heroicons/react/24/solid";

function StoreExpenceExport({ year, month, btnClass, btnStyle }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { store } = StoreExpenceDownload();

  const handleDownload = () => {
    if (!year || !month) {
      toast.error("Missing export parameters");
      return;
    }

    store({ year, month });
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className={
          btnClass ||
          "flex items-center px-4 py-[5px] gap-3 rounded-lg hover:opacity-90 transition-opacity"
        }
        style={
          btnStyle || {
            backgroundColor: "var(--theme-button-bg)",
            color: "var(--theme-button-text)",
          }
        }
      >
        <span>Download</span>
        <BsDownload className="w-[18px] h-[18px]" />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="rounded-[24px] shadow-[0_0_15px_rgba(0,0,0,0.12)] px-8 py-8 w-[400px] relative flex flex-col items-center border border-[#D9D9D9]"
            style={{ backgroundColor: "var(--theme-app-bg)" }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-5 right-5 hover:opacity-70 transition-colors"
              style={{ color: "var(--theme-muted-text)" }}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Themed Cloud Icon */}
            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: "var(--theme-filter-bg)" }}
            >
              <CloudArrowDownIcon
                className="w-[36px] h-[36px]"
                style={{ color: "var(--theme-accent)" }}
              />
            </div>

            {/* Title */}
            <h2
              className="text-[24px] font-['Montserrat'] font-[700] mb-2 text-center leading-none"
              style={{ color: "var(--theme-primary-text)" }}
            >
              Export Excel
            </h2>

            {/* Subtitle */}
            <p
              className="text-[16px] font-['Montserrat'] font-[500] mb-8 text-center px-2"
              style={{ color: "var(--theme-muted-text)" }}
            >
              Are you sure you want to download this Excel file?
            </p>

            {/* Buttons */}
            <div className="flex w-full gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 font-['Montserrat'] font-[600] text-[16px] py-[12px] rounded-[12px] hover:opacity-80 transition-colors border border-[#EAEAEA]"
                style={{
                  backgroundColor: "var(--theme-secondary-button-bg)",
                  color: "var(--theme-primary-text)",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleDownload}
                className="flex-1 font-['Montserrat'] font-[600] text-[16px] py-[12px] rounded-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] hover:opacity-90 transition-colors"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                }}
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

export default StoreExpenceExport;
