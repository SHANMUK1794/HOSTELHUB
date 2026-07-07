import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import usePgExport from "../../../hooks/usePgExport";
import ToastMessage from "../../common_components/ToastMessage";
import { BsDownload } from "react-icons/bs";


function PgExport({ branchName, year, month }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { exportPg } = usePgExport();

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

  const handleDownload = () => {
    if (!branchName || !year || !month) {
      showToast("Missing export parameters", "error");
      return;
    }

    exportPg({ branchName, year, month, showToast });
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center bg-[--color-secondaryLiteBg] text-white px-4 py-[5px] gap-3 rounded-lg"
      >
        Download <BsDownload />

      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000CC]">
          <div className="bg-[#ECEBEB] rounded-xl shadow-lg px-6 py-5 w-[330px] h-[170px]">
            <h2 className="text-lg font-extrabold mb-3">Export Excel</h2>

            <p className="text-lg mb-3 text-center">
              Are you sure you want to Download this Excel file?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white"
              >
                Cancel
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-[#800080] text-white"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {toastConfig.show && (
        <ToastMessage
          text={toastConfig.text}
          success={toastConfig.success}
          failed={toastConfig.failed}
          onClose={closeToast}
        />
      )}
    </>
  );
}

export default PgExport;
