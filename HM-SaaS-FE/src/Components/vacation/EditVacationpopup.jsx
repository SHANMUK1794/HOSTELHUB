import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { useUpdateVacation } from "../../hooks/useVacation";

const EditVacationpopup = ({ isOpen, onClose, editData, showToast }) => {
  const updateVacation = useUpdateVacation();

  const formatDate = (value) => {
    if (!value) return "";
    return value.split("T")[0];
  };

  const [form, setForm] = useState({
    applicationname: "",
    floorno: "",
    roomno: "",
    roomtype: "",
    updatedAt: "",
    vacatedate: "",
    status: "",
    mobile: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        applicationname: editData.applicationname || "",
        floorno: editData.floorno || "",
        roomno: editData.roomno || "",
        roomtype: editData.roomtype || "",
        updatedAt: formatDate(editData.updatedAt),
        vacatedate: formatDate(editData.vacatedate),
        status: editData.status || "",
        mobile: editData.mobile || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateVacation.mutate(
      { id: editData._id, payload: form },
      {
        onSuccess: () => {
          showToast?.("Vacation details updated successfully", "success");
          onClose();
        },
        onError: (error) => {
          console.error("Edit error:", error);
          const errMsg = 
            error?.response?.data?.message || 
            error?.response?.data?.error || 
            error?.message || 
            "Failed to update vacation details";
          showToast?.(errMsg, "error");
        }
      },
    );
  };

  const inputStyle = {
    width: "100%",
    height: "38px",
    border: "1px solid var(--theme-secondary-card-bg)",
    borderRadius: "8px",
    outline: "none",
    padding: "0 12px",
    fontSize: "14px",
    color: "var(--theme-primary-text)",
    backgroundColor: "var(--theme-filter-bg)",
  };

  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: "normal",
    color: "var(--theme-primary-text)",
    marginBottom: "4px",
    fontFamily: "var(--theme-font-family-primary)",
  };

  const fields = [
    {
      label: "Applicant Name",
      name: "applicationname",
      type: "text",
      placeholder: "Enter Name",
    },
    { label: "Floor No", name: "floorno", type: "text" },
    { label: "Room No", name: "roomno", type: "text" },
    { label: "Date of Application", name: "updatedAt", type: "date" },
    { label: "Proposed date of vacating", name: "vacatedate", type: "date" },
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm pt-0 pb-10"
    >
      <Dialog.Panel
        className="p-5 rounded-lg shadow-lg w-[400px] relative max-h-[calc(100vh-140px)] overflow-y-auto"
        style={{ backgroundColor: "var(--theme-card-bg)" }}
      >
        <button
          className="absolute top-3 right-3 transition-colors"
          style={{ color: "var(--theme-muted-text)" }}
          onMouseOver={(e) =>
            (e.currentTarget.style.color = "var(--theme-primary-text)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.color = "var(--theme-muted-text)")
          }
          onClick={onClose}
        >
          <IoMdClose size={22} />
        </button>

        <Dialog.Title
          className="text-xl font-bold mb-4 text-center"
          style={{
            color: "var(--theme-heading-text)",
            fontFamily: "var(--theme-font-family-primary)",
          }}
        >
          Edit Details
        </Dialog.Title>

        {editData && (
          <form className="space-y-2" onSubmit={handleSubmit}>
            {fields.map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label style={labelStyle}>{label}</label>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "var(--theme-accent)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "var(--theme-secondary-card-bg)")
                  }
                />
              </div>
            ))}

            {/* Room Type select */}
            <div>
              <label style={labelStyle}>Room Type</label>
              <select
                name="roomtype"
                value={form.roomtype}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--theme-accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor =
                    "var(--theme-secondary-card-bg)")
                }
              >
                <option value="">Select Room Type</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non AC</option>
              </select>
            </div>

            {/* Status select */}
            <div>
              <label style={labelStyle}>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--theme-accent)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor =
                    "var(--theme-secondary-card-bg)")
                }
              >
                <option value="Pending">Pending</option>
                <option value="Vacated">Vacated</option>
              </select>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="w-full max-w-[200px] py-[8px] rounded-[8px] font-medium transition"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                  fontFamily: "var(--theme-font-family-primary)",
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
                Submit
              </button>
            </div>
          </form>
        )}
      </Dialog.Panel>
    </Dialog>
  );
};

export default EditVacationpopup;
