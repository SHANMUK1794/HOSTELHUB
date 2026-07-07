import React, { useState } from "react";
import useCylinderExport from "../../../../hooks/useCylinderExport";
import { BsDownload } from "react-icons/bs";

function Export({ branchName, year, month, showToast }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { usecyliner } = useCylinderExport();

  const handleDownload = () => {
    if (!year || !month) {
      if (showToast) showToast("Missing export parameters", "error");
      return;
    }

    usecyliner({ branchName, year, month, showToast });
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-colors h-full"
        style={{
          backgroundColor: "var(--theme-button-bg)",
          color: "var(--theme-button-text)",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--theme-accent-hover)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--theme-button-bg)")
        }
      >
        <BsDownload strokeWidth={0.5} className="text-lg" /> Download
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div
            className="rounded-2xl shadow-xl p-8 w-full max-w-sm relative"
            style={{ backgroundColor: "var(--theme-card-bg)" }}
          >
            <h2
              className="text-2xl font-bold mb-4 text-center"
              style={{
                color: "var(--theme-heading-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              Export Excel
            </h2>

            <p
              className="mb-8 text-center font-medium"
              style={{ color: "var(--theme-primary-text)" }}
            >
              Are you sure you want to download this Excel file?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                style={{
                  backgroundColor: "var(--theme-secondary-button-bg)",
                  color: "var(--theme-secondary-button-text)",
                  border: "1px solid var(--theme-secondary-card-bg)",
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Cancel
              </button>

              <button
                onClick={handleDownload}
                className="px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--theme-accent-hover)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--theme-button-bg)")
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
