import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import usePG, { useUpdatePG } from "../../../hooks/usePGData";
import ToastMessage from "../../common_components/ToastMessage";

function PgUpdateForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);
  const getBranchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.role === "Warden"
        ? user?.branchName
        : null;

  const { data: pgData = [], isLoading: isPgLoading } = usePG(
    undefined,
    getBranchName,
  );
  const updateMutation = useUpdatePG();

  const [form, setForm] = useState({
    RoomNo: "",
    BillNo: "",
    DateOfJoining: "",
    DateOfLeaving: "",
    Name: "",
    MobileNo: "",
    AddharNumber: "",
    Reason: "Select Your Reason",
    Rent: "",
    PaymentMethod: "UPI",
    Discount: "",
    status: "staying",
    costPerDay: "",
    advance: "",
  });

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

  const handleInput = (e) => {
  const { name, value } = e.target;

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));

  if (name === "MobileNo") {
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length > 10) return;

    setForm((prev) => ({
      ...prev,
      MobileNo: numericValue,
    }));
    return;
  }

  if (name === "AddharNumber") {
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length > 12) return;

    setForm((prev) => ({
      ...prev,
      AddharNumber: numericValue,
    }));
    return;
  }

  if (
    ["Rent", "Discount", "costPerDay", "advance"].includes(name)
  ) {
    const numericValue = value.replace(/[^0-9.]/g, "");

    setForm((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
    return;
  }

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};


  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  if (!form.DateOfJoining) {
    newErrors.DateOfJoining = "Date of joining is required";
  }

  if (
    form.DateOfLeaving &&
    new Date(form.DateOfLeaving) <= new Date(form.DateOfJoining)
  ) {
    newErrors.DateOfLeaving =
      "Date of leaving must be after joining";
  }

  if (!form.RoomNo.trim()) {
    newErrors.RoomNo = "Room number is required";
  }

  if (!form.Name.trim()) {
    newErrors.Name = "Name is required";
  }

  if (form.MobileNo.length !== 10) {
    newErrors.MobileNo =
      "Mobile number must contain 10 digits";
  }

  if (
    form.AddharNumber &&
    !/^\d{12}$/.test(form.AddharNumber)
  ) {
    newErrors.AddharNumber =
      "Aadhaar number must contain exactly 12 digits";
  }

  if (!form.Reason) {
    newErrors.Reason =
      "Occupancy purpose is required";
  }

  if (!form.PaymentMethod) {
    newErrors.PaymentMethod =
      "Payment mode is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    showToast(Object.values(newErrors)[0], "error");
    return;
  }

  try {
    if (!id) {
      showToast("No record id found to update.", "error");
      return;
    }

    // existing payload code...

    const sanitize = (v) =>
  typeof v === "string" ? v.trim() : v;

const payload = {
  RoomNo: sanitize(form.RoomNo),
  BillNo: sanitize(form.BillNo),
  checkin: form.DateOfJoining || null,
  checkout: form.DateOfLeaving || null,
  Name: sanitize(form.Name),
  Whatsapp: sanitize(form.MobileNo),
  AddharNumber: sanitize(form.AddharNumber),
  Reason: sanitize(form.Reason),
  Rent: Number(form.Rent || 0),
  Discount: Number(form.Discount || 0),
  costPerDay: Number(form.costPerDay || 0),
  advance: Number(form.advance || 0),
  PaymentMethod: sanitize(form.PaymentMethod),
  branchName: getBranchName,
  status: form.status,
};

// Remove empty values
Object.keys(payload).forEach((key) => {
  if (
    payload[key] === "" ||
    payload[key] === undefined ||
    payload[key] === null
  ) {
    delete payload[key];
  }
});

await updateMutation.mutateAsync({
  id,
  payload,
});

    showToast("Record updated successfully.", "success");

    setTimeout(() => navigate(-1), 1000);
  } catch (err) {
    console.error(err);

    const message =
      err?.response?.data?.message ||
      "Failed to update record";

    const backendErrors = {};
    const lower = message.toLowerCase();

    if (lower.includes("mobile")) {
      backendErrors.MobileNo = message;
    }

    if (
      lower.includes("aadhaar") ||
      lower.includes("addhar")
    ) {
      backendErrors.AddharNumber = message;
    }

    if (lower.includes("room")) {
      backendErrors.RoomNo = message;
    }

    if (
      lower.includes("check-out") ||
      lower.includes("checkout")
    ) {
      backendErrors.DateOfLeaving = message;
    }

    if (
      lower.includes("check-in") ||
      lower.includes("joining")
    ) {
      backendErrors.DateOfJoining = message;
    }

    if (lower.includes("name")) {
      backendErrors.Name = message;
    }

    if (lower.includes("payment")) {
      backendErrors.PaymentMethod = message;
    }

    if (lower.includes("reason")) {
      backendErrors.Reason = message;
    }

    setErrors(backendErrors);
    showToast(message, "error");
  }
};

  const toInputDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!id || isPgLoading) return;
    const student = pgData.find((p) => p._id === id);
    if (!student) return;
    setForm((prev) => ({
      ...prev,
      RoomNo: student.RoomNo || student.roomNo || "",
      BillNo: student.BillNo || "",
      DateOfJoining: toInputDate(student.checkin || student.DateOfJoining),
      DateOfLeaving: toInputDate(student.checkout || student.DateOfLeaving),
      Name: student.Name || student.name || "",
      MobileNo:
        student.Whatsapp || student.MobileNo || student.WhatsappNumber || "",
      AddharNumber: student.AddharNumber || student.Aadhaar || "",
      Reason: student.Reason || prev.Reason,
      Rent: student.Rent || "",
      PaymentMethod: student.PaymentMethod || prev.PaymentMode,
      status: student.status ?? "staying",
      costPerDay: student.costPerDay ?? "",
      advance: student.advance ?? "",
      Discount:
        (student.Discount ??
          student.DiscountAmt ??
          student.DiscountAmount ??
          student.discount ??
          student.discountAmt) !== undefined
          ? String(
              student.Discount ??
                student.DiscountAmt ??
                student.DiscountAmount ??
                student.discount ??
                student.discountAmt,
            )
          : prev.Discount || "",
    }));
  }, [id, pgData, isPgLoading]);

  const inputClass =
    "w-full h-[46px] rounded-[12px] px-4 outline-none font-poppins text-[14px]";
  const inputStyle = {
    background:
      "linear-gradient(90deg, var(--theme-card-bg-linear2) 0%, var(--theme-card-bg-linear1) 100%)",
    border: "1px solid var(--theme-accent)",
    boxShadow: "inset 0px 0px 4px 0px var(--theme-accent)",
    color: "var(--theme-primary-text)",
  };
  const labelStyle = { color: "var(--theme-primary-text)", fontWeight: 500 };

  const ErrorText = ({ message }) =>
  message ? (
    <p
      className="mt-1 text-sm font-medium"
      style={{ color: "#dc2626" }}
    >
      * {message}
    </p>
  ) : null;

  return (
    <>
      <div
        className="flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-87px)] overflow-y-auto lg:overflow-hidden px-4 md:px-10 py-3 gap-6"
        style={{ backgroundColor: "var(--theme-app-bg)" }}
      >
        {/* LEFT SECTION */}
        <div
          className="relative w-full lg:w-[38%] h-auto lg:h-full flex flex-col justify-center items-center font-montserrat pt-6 md:pt-2 px-4 max-[426px]:mb-[30px]"
          style={{ color: "var(--theme-primary-text)" }}
        >
          <button
            onClick={() => navigate(-1)}
            className="absolute -top-5 left-4 flex items-center justify-center w-[42px] h-[42px] rounded-full shadow-md hover:opacity-80 transition-all duration-200"
            style={{
              backgroundColor: "var(--theme-card-bg)",
              border: "1px solid var(--theme-accent)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-600 hover:text-black cursor-pointer transition-all duration-200">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
</svg>
          </button>

          <h2 className="text-[42px] leading-[52px] font-bold text-center max-[769px]:text-[32px] max-[769px]:leading-[42px] max-[426px]:text-[24px] max-[426px]:leading-[32px]">
            Update Your
          </h2>

          <p
            className="font-semibold text-[22px] leading-[36px] text-center mt-1 max-[769px]:text-[16px] max-[769px]:leading-[28px] max-[426px]:text-[13px] max-[426px]:leading-[22px]"
            style={{ color: "var(--theme-heading-text)" }}
          >
            Stay Details
          </p>

          <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
</div>
        </div>

        {/* FORM SECTION */}
        <div className="w-full lg:w-[730px] h-auto lg:h-full flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide rounded-[24px] px-6 py-5 md:px-8 md:py-6 shadow-[0px_0px_20px_rgba(0,0,0,0.06)] max-[426px]:p-4"
            style={{ backgroundColor: "var(--theme-card-bg)" }}
          >
            <h2
              className="text-[30px] leading-[40px] font-bold mb-6 font-poppins"
              style={{ color: "var(--theme-heading-text)" }}
            >
              PG REGISTER
            </h2>

            {/* TOP INPUTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Room No.", name: "RoomNo", type: "text" },
                { label: "Bill No.", name: "BillNo", type: "text", readOnly: true },
                { label: "CheckIn", name: "DateOfJoining", type: "date" },
                { label: "CheckOut", name: "DateOfLeaving", type: "date" },
              ].map(({ label, name, type, readOnly }) => (
                <div key={name} className="flex flex-col gap-2">
                  <label
                    className="font-poppins font-medium text-[15px]"
                    style={labelStyle}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleInput}
                    readOnly={readOnly}
                    className={inputClass}
                    style={readOnly ? { ...inputStyle, opacity: 0.7, cursor: "not-allowed" } : inputStyle}
                  />
                  <ErrorText message={errors[name]} />
                </div>
              ))}
            </div>

            {/* PERSONAL DETAILS */}
            <h3
              className="font-poppins font-semibold text-[28px] leading-[40px] mt-7 mb-4"
              style={{ color: "var(--theme-primary-text)" }}
            >
              Personal Details
            </h3>

            <div className="space-y-4">
              {[
                {
                  label: "Name",
                  type: "text",
                  placeholder: "Enter your name",
                  name: "Name",
                },
                {
                  label: "Mobile Number",
                  type: "tel",
                  placeholder: "Mobile No.",
                  name: "MobileNo",
                },
                {
                  label: "Aadhaar Number",
                  type: "text",
                  placeholder: "Enter your aadhaar number",
                  name: "AddharNumber",
                },
                {
                  label: "Bill Amount",
                  type: "text",
                  placeholder: "Enter Rent",
                  name: "Rent",
                },
                {
                  label: "Discount",
                  type: "text",
                  placeholder: "Enter discount",
                  name: "Discount",
                },
                {
                  label: "CostPerDay",
                  type: "text",
                  placeholder: "Enter CostPerDay",
                  name: "costPerDay",
                },
                {
                  label: "Advance",
                  type: "text",
                  placeholder: "Enter Advance",
                  name: "advance",
                },
              ].map(({ label, type, placeholder, name }) => (
                <div className="flex flex-col gap-2 w-full" key={label}>
                  <label
                    className="font-poppins font-medium text-[15px]"
                    style={labelStyle}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    name={name}
                    value={form[name]}
                    onChange={handleInput}
                    className={inputClass}
                    style={inputStyle}
                  />
                  <ErrorText message={errors[name]} />
                </div>
              ))}

              {/* Reason */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-poppins font-medium text-[15px]"
                  style={labelStyle}
                >
                  Reason
                </label>
                <select
                  name="Reason"
                  value={form.Reason}
                  onChange={handleInput}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">Select Your Reason</option>
                  <option value="Full-Day">Full-Day</option>
                  <option value="Refreshment">Refreshment</option>
                </select>
                <ErrorText message={errors.Reason} />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-poppins font-medium text-[15px]"
                  style={labelStyle}
                >
                  Status
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleInput}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="staying">staying</option>
                  <option value="vacated">vacated</option>
                </select>
                <ErrorText message={errors.status} />
              </div>

              {/* Payment Mode */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-poppins font-medium text-[15px]"
                  style={labelStyle}
                >
                  Payment Mode
                </label>
                <select
                  name="PaymentMethod"
                  value={form.PaymentMethod}
                  onChange={handleInput}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">Select Payment Mode</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                </select>
                <ErrorText message={errors.PaymentMethod} />
              </div>
            </div>

            {/* SUBMIT */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={updateMutation.isLoading}
                className="w-[180px] h-[50px] rounded-[14px] font-poppins font-semibold text-[16px] transition-all duration-200"
                style={{
                  backgroundColor: updateMutation.isLoading
                    ? "#9CA3AF"
                    : "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                  boxShadow: updateMutation.isLoading
                    ? "none"
                    : "0px 4px 12px rgba(0,0,0,0.2)",
                  cursor: updateMutation.isLoading ? "not-allowed" : "pointer",
                }}
              >
                {updateMutation.isLoading ? "Updating..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

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

export default PgUpdateForm;
