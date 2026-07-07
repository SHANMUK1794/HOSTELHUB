import { X } from "lucide-react";
import React, { useState } from "react";
import useCertificate from "../../hooks/useCertificate";
import { toast } from "sonner";

const CertificatesUpdateForm = ({ setIsOpenUpdateForm, selectedRowData, showToast }) => {
  const [certificatesEditFormData, setCertificatesEditFormData] = useState({
    ...selectedRowData,
    remainder_date: selectedRowData.remainder_date
      ? new Date(selectedRowData.remainder_date).toISOString().split("T")[0]
      : "",
    renewal_date: selectedRowData.renewal_date
      ? new Date(selectedRowData.renewal_date).toISOString().split("T")[0]
      : "",
  });

  const [errors, setErrors] = useState({});
  const { updateCertificate, refetch } = useCertificate(
    certificatesEditFormData.branchName,
  );

  const handleChange = (e) => {
    setCertificatesEditFormData({
      ...certificatesEditFormData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!certificatesEditFormData.certificate_name?.trim())
      newErrors.certificate_name = "Certificate name is required";
    if (!certificatesEditFormData.certificate_no?.trim())
      newErrors.certificate_no = "Certificate number is required";
    if (!certificatesEditFormData.remainder_date?.trim())
      newErrors.remainder_date = "Reminder date is required";
    if (!certificatesEditFormData.renewal_date?.trim())
      newErrors.renewal_date = "Renewal date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (
      certificatesEditFormData.remainder_date &&
      certificatesEditFormData.renewal_date &&
      new Date(certificatesEditFormData.remainder_date) >= new Date(certificatesEditFormData.renewal_date)
    ) {
      showToast("Reminder Date must be earlier than the Renewal Date.", "error");
      return;
    }

    if (!validateForm()) {
      showToast("Please fill all required fields", "error");
      return;
    }
    try {
      const { _id, ...updatedData } = certificatesEditFormData;
      await updateCertificate({ id: _id, updatedData });
      showToast("Certificate updated successfully", "success");
      setIsOpenUpdateForm(false);
      refetch();
    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to update certificate", "error");
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "overlay") setIsOpenUpdateForm(false);
  };

  const inputBase = {
    width: "100%",
    height: "44px",
    background:
      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
    borderRadius: "8px",
    boxShadow: "inset 0 0 4px rgba(0,0,0,0.06)",
    padding: "0 16px",
    outline: "none",
    color: "var(--theme-primary-text)",
    fontSize: "14px",
    fontFamily: "var(--theme-font-family-primary)",
  };
  const inputStyle = (hasError) => ({
    ...inputBase,
    border: hasError
      ? "1px solid #ef4444"
      : "1px solid var(--theme-secondary-card-bg)",
  });
  const labelStyle = {
    color: "var(--theme-primary-text)",
    fontSize: "14px",
    fontWeight: "500",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <div
      id="overlay"
      className="fixed inset-0 z-50 flex justify-center items-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={handleOutsideClick}
    >
      <div
        className="w-full max-w-sm md:w-[350px] rounded-xl shadow-xl p-6 relative"
        style={{
          backgroundColor: "var(--theme-card-bg)",
          fontFamily: "var(--theme-font-family-primary)",
        }}
      >
        <div className="flex justify-center items-center mb-6">
          <h1
            className="text-[20px] font-bold"
            style={{ color: "var(--theme-heading-text)" }}
          >
            Edit Certificate
          </h1>
          <button
            onClick={() => setIsOpenUpdateForm(false)}
            className="absolute top-6 right-6 hover:opacity-70 transition-opacity"
            style={{ color: "var(--theme-primary-text)" }}
          >
            <X size={22} />
          </button>
        </div>

        <div className="mb-4">
          <label style={labelStyle}>Certificate Name</label>
          <input
            type="text"
            name="certificate_name"
            value={certificatesEditFormData.certificate_name || ""}
            onChange={handleChange}
            style={inputStyle(!!errors.certificate_name)}
          />
          {errors.certificate_name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.certificate_name}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label style={labelStyle}>Certificate No</label>
          <input
            type="text"
            name="certificate_no"
            value={certificatesEditFormData.certificate_no || ""}
            onChange={handleChange}
            style={inputStyle(!!errors.certificate_no)}
          />
          {errors.certificate_no && (
            <p className="text-red-500 text-xs mt-1">{errors.certificate_no}</p>
          )}
        </div>

        <div className="mb-4">
          <label style={labelStyle}>Renewal Date</label>
          <input
            type="date"
            name="renewal_date"
            value={certificatesEditFormData.renewal_date || ""}
            onChange={handleChange}
            style={inputStyle(!!errors.renewal_date)}
          />
          {errors.renewal_date && (
            <p className="text-red-500 text-xs mt-1">{errors.renewal_date}</p>
          )}
        </div>

        <div className="mb-6">
          <label style={labelStyle}>Reminder Date</label>
          <input
            type="date"
            name="remainder_date"
            value={certificatesEditFormData.remainder_date || ""}
            onChange={handleChange}
            style={inputStyle(!!errors.remainder_date)}
          />
          {errors.remainder_date && (
            <p className="text-red-500 text-xs mt-1">{errors.remainder_date}</p>
          )}
        </div>

        <div className="flex items-center justify-center mt-6">
          <button
            type="button"
            onClick={handleUpdate}
            className="px-12 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
            style={{
              backgroundColor: "var(--theme-button-bg)",
              color: "var(--theme-button-text)",
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificatesUpdateForm;
