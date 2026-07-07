import { useState } from "react";
import useComplaints from "../../hooks/useComplaints";
import { X } from "lucide-react";

const ComplaintsUpdateForm = ({ setIsOpenUpdateForm, selectedRowData, showToast }) => {
  const [selectedYearMonth, setSelectedYearMonth] = useState("");
  const { updateComplaint } = useComplaints(selectedYearMonth);

  const [complaintsEditFormData, setComplaintsEditFormData] = useState({
    ...selectedRowData,
  });
  const [showStatus, setShowStatus] = useState(false);

  const handleChange = (e) => {
    setComplaintsEditFormData({
      ...complaintsEditFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const { _id, ...updatePayload } = complaintsEditFormData;
      await updateComplaint({ _id, ...updatePayload });
      showToast("Complaint updated successfully", "success");
      setIsOpenUpdateForm(false);
    } catch (error) {
      console.error("Error updating complaint:", error);
      showToast(error?.response?.data?.message || "Failed to update complaint", "error");
    }
  };

  // Shared input style
  const inputStyle = {
    fontFamily: "var(--theme-font-family-primary)",
    fontSize: "13px",
    color: "var(--theme-primary-text)",
    background:
      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
    border: "1px solid var(--theme-secondary-card-bg)",
    borderRadius: "8px",
    boxShadow: "inset 0 0 4px rgba(0,0,0,0.06)",
    width: "100%",
    padding: "0 16px",
    outline: "none",
  };

  const labelStyle = {
    color: "var(--theme-primary-text)",
    fontFamily: "var(--theme-font-family-primary)",
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "4px",
    display: "block",
  };

  return (
    <div
      className="w-full max-w-[350px] rounded-[24px] shadow-[0px_4px_24px_rgba(0,0,0,0.08)] p-5 relative max-h-[95vh] overflow-y-auto"
      style={{ backgroundColor: "var(--theme-card-bg)" }}
    >
        {/* Header */}
        <div className="flex justify-center items-center mb-4">
          <h1
            className="font-bold text-[20px]"
            style={{
              color: "var(--theme-primary-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Edit Complaint
          </h1>
          <button
            onClick={() => setIsOpenUpdateForm(false)}
            className="absolute top-4 right-4 rounded-full p-1 transition hover:opacity-70"
            style={{ color: "var(--theme-primary-text)" }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Floor */}
        <div className="mb-2">
          <label style={labelStyle}>Floor No</label>
          <input
            type="text"
            name="floor"
            placeholder="Enter Floor No"
            value={complaintsEditFormData.floor || ""}
            onChange={handleChange}
            style={{ ...inputStyle, height: "38px" }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--theme-accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor =
                "var(--theme-secondary-card-bg)")
            }
          />
        </div>

        {/* Room No */}
        <div className="mb-2">
          <label style={labelStyle}>Room No</label>
          <input
            type="text"
            name="room_no"
            placeholder="A101"
            value={complaintsEditFormData.room_no || ""}
            onChange={handleChange}
            style={{ ...inputStyle, height: "38px" }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--theme-accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor =
                "var(--theme-secondary-card-bg)")
            }
          />
        </div>

        {/* Date */}
        <div className="mb-2">
          <label style={labelStyle}>Date</label>
          <input
            type="date"
            name="date"
            value={
              complaintsEditFormData.date
                ? complaintsEditFormData.date.split("T")[0]
                : ""
            }
            onChange={handleChange}
            style={{ ...inputStyle, height: "38px" }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--theme-accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor =
                "var(--theme-secondary-card-bg)")
            }
          />
        </div>

        {/* Issue */}
        <div className="mb-2">
          <label style={labelStyle}>Issue</label>
          <input
            type="text"
            name="issue"
            placeholder="Enter"
            value={complaintsEditFormData.issue || ""}
            onChange={handleChange}
            style={{ ...inputStyle, height: "38px" }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--theme-accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor =
                "var(--theme-secondary-card-bg)")
            }
          />
        </div>

        {/* Issue Description */}
        <div className="mb-2">
          <label style={labelStyle}>Issue Description</label>
          <textarea
            name="issue_description"
            placeholder="Enter Description"
            value={complaintsEditFormData.issue_description || ""}
            onChange={handleChange}
            style={{
              ...inputStyle,
              height: "60px",
              padding: "8px 16px",
              resize: "none",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--theme-accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor =
                "var(--theme-secondary-card-bg)")
            }
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label style={labelStyle}>Status</label>
          <div className="relative w-full">
            <div
              onClick={() => setShowStatus((prev) => !prev)}
              className="w-full h-[38px] flex justify-between items-center px-4 cursor-pointer rounded-[8px]"
              style={{
                backgroundColor: "var(--theme-filter-bg)",
                border: "1px solid var(--theme-secondary-card-bg)",
                fontFamily: "var(--theme-font-family-primary)",
                fontSize: "13px",
                color: complaintsEditFormData.status
                  ? "var(--theme-primary-text)"
                  : "var(--theme-muted-text)",
              }}
            >
              <span>{complaintsEditFormData.status || "Select Status"}</span>
              <span
                style={{ color: "var(--theme-muted-text)", fontSize: "12px" }}
              >
                ▼
              </span>
            </div>

            {showStatus && (
              <div
                className="absolute left-0 bottom-full mb-1 w-full rounded-lg shadow-lg z-50 overflow-hidden"
                style={{
                  backgroundColor: "var(--theme-card-bg)",
                  border: "1px solid var(--theme-filter-bg)",
                }}
              >
                {[
                  { title: "Pending", color: "#ef4444" },
                  { title: "Working", color: "#3b82f6" },
                  { title: "Solved", color: "#22c55e" },
                ].map(({ title, color }) => (
                  <p
                    key={title}
                    onClick={() => {
                      handleChange({
                        target: { name: "status", value: title },
                      });
                      setShowStatus(false);
                    }}
                    className="text-center py-2 cursor-pointer font-medium text-[13px] transition-opacity hover:opacity-80"
                    style={{
                      color,
                      fontFamily: "var(--theme-font-family-primary)",
                    }}
                  >
                    {title}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-center mt-2">
          <button
            onClick={handleUpdate}
            className="px-10 py-2 rounded-[10px] font-[500] shadow-sm transition-opacity hover:opacity-90 w-full max-w-[180px] text-[14px]"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
              fontFamily: "var(--theme-font-family-primary)",
            }}
          >
            Submit
          </button>
        </div>
    </div>
  );
};

export default ComplaintsUpdateForm;
