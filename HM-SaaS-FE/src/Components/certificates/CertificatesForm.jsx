import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useCertificate from "../../hooks/useCertificate";
import { toast } from "sonner";
import { X } from "lucide-react";

const CertificatesForm = ({ setIsOpen, showToast }) => {
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);

  const branchName =
    user?.role?.toLowerCase() === "admin"
      ? selectedBranch
      : user?.role?.toLowerCase() === "warden"
        ? user?.branchName
        : null;

  const { addCertificate, refetch } = useCertificate();
  const formRef = useRef();

  const [certificatesFormData, setcertificatesFormData] = useState({
    certificate_name: "",
    certificate_no: "",
    branchName: branchName,
    remainder_date: "",
    renewal_date: "",
    createdAt: "",
    updatedAt: "",
    _v: 0,
    _id: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setcertificatesFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { certificate_name, certificate_no, remainder_date, renewal_date } =
      certificatesFormData;
    if (
      !certificate_name ||
      !certificate_no ||
      !remainder_date ||
      !renewal_date
    ) {
      showToast("All fields are required", "error");
      return;
    }

    if (new Date(remainder_date) >= new Date(renewal_date)) {
      showToast("Reminder Date must be earlier than the Renewal Date.", "error");
      return;
    }
    try {
      await addCertificate(certificatesFormData);
      showToast("Certificate added successfully", "success");
      setIsOpen(false);
      if (refetch) await refetch();
    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to add certificate", "error");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputStyle = {
    width: "100%",
    height: "44px",
    background:
      "linear-gradient(to right, color-mix(in srgb, var(--theme-accent) 15%, white), var(--theme-card-bg))",
    border: "1px solid var(--theme-secondary-card-bg)",
    borderRadius: "8px",
    boxShadow: "inset 0 0 4px rgba(0,0,0,0.06)",
    padding: "0 16px",
    outline: "none",
    color: "var(--theme-primary-text)",
    fontSize: "14px",
    fontFamily: "var(--theme-font-family-primary)",
  };
  const labelStyle = {
    color: "var(--theme-primary-text)",
    fontSize: "14px",
    fontWeight: "500",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        ref={formRef}
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
            Add Certificate
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 hover:opacity-70 transition-opacity"
            style={{ color: "var(--theme-primary-text)" }}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label style={labelStyle}>Certificate Name</label>
            <input
              type="text"
              name="certificate_name"
              required
              placeholder="Enter Name"
              value={certificatesFormData.certificate_name}
              onChange={handleInput}
              style={inputStyle}
            />
          </div>

          <div className="mb-4">
            <label style={labelStyle}>Certificate No</label>
            <input
              type="text"
              name="certificate_no"
              required
              placeholder="A101"
              value={certificatesFormData.certificate_no}
              onChange={handleInput}
              style={inputStyle}
            />
          </div>

          <div className="mb-4">
            <label style={labelStyle}>Reminder Date</label>
            <input
              type="date"
              name="remainder_date"
              required
              value={certificatesFormData.remainder_date}
              onChange={handleInput}
              style={inputStyle}
            />
          </div>

          <div className="mb-6">
            <label style={labelStyle}>Renewal Date</label>
            <input
              type="date"
              name="renewal_date"
              required
              value={certificatesFormData.renewal_date}
              onChange={handleInput}
              style={inputStyle}
            />
          </div>

          <div className="flex items-center justify-center mt-6">
            <button
              type="submit"
              className="px-12 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
              style={{
                backgroundColor: "var(--theme-button-bg)",
                color: "var(--theme-button-text)",
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificatesForm;
