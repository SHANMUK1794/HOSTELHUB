import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { useCreateVacation } from "../../hooks/useVacation";
import { useSelector } from "react-redux";

const VacationFormpopup = ({ isOpen, onClose, showToast }) => {
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  const createVacation = useCreateVacation();

  const [form, setForm] = useState({
    applicationname: "",
    floorno: "",
    roomno: "",
    roomtype: "",
    dateofapply: "",
    vacatedate: "",
    mobile: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, branchName };
    createVacation.mutate(payload, {
      onSuccess: () => {
        showToast?.("Vacation details added successfully", "success");
        onClose();
      },
      onError: (error) => {
        console.error("Create error:", error);
        const errMsg = 
          error?.response?.data?.message || 
          error?.response?.data?.error || 
          error?.message || 
          "Failed to add vacation details";
        showToast?.(errMsg, "error");
      },
    });
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
    {
      label: "Floor No",
      name: "floorno",
      type: "text",
      placeholder: "Floor No",
    },
    { label: "Room No", name: "roomno", type: "text", placeholder: "Room No" },
    {
      label: "Date of Application",
      name: "dateofapply",
      type: "date",
      placeholder: "Date of Application",
    },
    { label: "Proposed date of vacating", name: "vacatedate", type: "date" },
    { label: "Mobile", name: "mobile", type: "text", placeholder: "Mobile" },
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed top-[87px] bottom-0 left-0 right-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-sm pt-0 pb-10"
    >
      <Dialog.Panel
        className="p-5 rounded-lg shadow-lg w-[400px] relative z-10 max-h-[calc(100vh-140px)] overflow-y-auto"
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
          Add Details
        </Dialog.Title>

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
      </Dialog.Panel>
    </Dialog>
  );
};

export default VacationFormpopup;
