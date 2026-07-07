import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../../common_components/ToastMessage";
import { useCreatePG } from "../../../hooks/usePGData";
import { useRoomsResidents } from "../../../hooks/useRoomsResident";
import { useSelector } from "react-redux";
import axiosInstance from "../../../utils/AxiosInstance";

function AddPgDetails() {
  const navigate = useNavigate();
  const { data: rooms = [] } = useRoomsResidents();
  const [errors, setErrors] = useState({});

  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);

  const availablePgRooms = rooms.filter((room) => {
    const category = room.category?.toString().trim();
    const isPG = category === "PG";
    const occupiedCount =
      (room.users?.length || 0) + (room.pgUsers?.length || 0);
    const hasSpace = occupiedCount < Number(room.Capacity || 0);
    return isPG && hasSpace;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  const [formData, setFormData] = useState({
    RoomNo: "",
    BillNo: "",
    checkin: "",
    checkout: "",
    Name: "",
    MobileNo: "",
    AddharNumber: "",
    Reason: "",
    Rent: "",
    PaymentMethod: "UPI",
    DiscountAmt: "",
    status: "staying",
    costPerDay: "",
    totalStayRent: "",
    advance: "",
    balance: "",
  });

  const [toastConfig, setToastConfig] = useState({
    show: false,
    text: "",
    success: false,
    failed: false,
  });

  const showToast = (text, type) => {
    setToastConfig({
      show: true,
      text,
      success: type === "success",
      failed: type === "error",
    });
    setTimeout(() => {
      setToastConfig({ show: false, text: "", success: false, failed: false });
    }, 3000);
  };

  const closeToast = () => {
    setToastConfig({ show: false, text: "", success: false, failed: false });
  };

  const createMutation = useCreatePG();
  // 1. Auto-fill Rent when RoomNo changes
  useEffect(() => {
    if (formData.RoomNo) {
      const selectedRoomObj = rooms.find(
        (r) => String(r.RoomNo).trim() === String(formData.RoomNo).trim(),
      );
      if (selectedRoomObj && selectedRoomObj.Rate) {
        setFormData((prev) => {
          const newRent = selectedRoomObj.Rate.toString();
          // Only update if it actually changed to prevent loops
          if (prev.Rent !== newRent) {
            return { ...prev, Rent: newRent };
          }
          return prev;
        });
      }
    }
  }, [formData.RoomNo, rooms]);

  // 2. Calculate Cost Per Day whenever Rent, checkin, or checkout changes
  // Calculate Cost Per Day and Balance whenever dependencies change
  useEffect(() => {
    const rent = parseFloat(formData.Rent) || 0;
    const discount = parseFloat(formData.DiscountAmt) || 0;
    const advance = parseFloat(formData.advance) || 0;

    let days = 1;


// Rent per day = monthly rent / 30
let computedCostPerDay =
  rent > 0 ? (rent / 30).toFixed(2) : "0.00";


// calculate staying days
if (formData.checkin && formData.checkout) {

  const start = new Date(formData.checkin);
  const end = new Date(formData.checkout);

  const timeDiff = end.getTime() - start.getTime();

  days = Math.ceil(
    timeDiff / (1000 * 3600 * 24)
  );

  if (days <= 0) {
    days = 1;
  }
}


// total stay rent
const computedStayRent =
  (
    Number(computedCostPerDay) * days
  ).toFixed(2);


// balance
const computedBalance =
  (
    Number(computedStayRent)
    - discount
    - advance
  ).toFixed(2);

    setFormData((prev) => {
      // Only update if values actually changed to avoid infinite re-renders
      if (
        prev.costPerDay !== computedCostPerDay ||
        prev.totalStayRent !== computedStayRent ||
        prev.balance !== computedBalance
      ){
        return {
  ...prev,
  costPerDay: computedCostPerDay,
  totalStayRent: computedStayRent,
  balance: computedBalance,
};
      }
      return prev;
    });
  }, [
    formData.Rent,
    formData.checkin,
    formData.checkout,
    formData.DiscountAmt,
    formData.advance,
  ]);

  // Existing dynamic customer info search workflow

  
 useEffect(() => {
  if (formData.MobileNo.length !== 10) return;

  const fetchPGUserInfo = async () => {
    setIsFetchingUser(true);
    

    try {
      
      const res = await axiosInstance.get(
        `/api/pgdata/v1/mobile?MobileNo=${formData.MobileNo}`
      );

      const userData = res?.data?.data;

      if (userData) {
        setFormData((prev) => ({
          ...prev,
          Name: userData.Name || "",
          AddharNumber: userData.AddharNumber || "",
          Reason: userData.Reason || "",
          Rent: userData.Rent?.toString() || "",
          costPerDay: userData.costPerDay?.toString() || "",
          advance: userData.advance?.toString() || "",
          balance: userData.balance?.toString() || "",
          status: userData.status || "staying",
        }));
      }
    } catch (error) {
      // If user is not found, don't clear what the user has typed.
      if (error.response?.status !== 404) {
        console.error("Fetch PG User Error:", error);
      }
    } finally {
      setIsFetchingUser(false);
    }
  };

  fetchPGUserInfo();
}, [formData.MobileNo]);

  

  const handleInput = (e) => {
  const { name, value } = e.target;

  // Clear the error for the current field
  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));

  switch (name) {
    case "MobileNo": {
      const numericValue = value.replace(/\D/g, "");

      if (numericValue.length > 10) return;

      if (numericValue.length < 10) {
        setFormData((prev) => ({
          ...prev,
          MobileNo: numericValue,
          Name: "",
          AddharNumber: "",
          Reason: "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          MobileNo: numericValue,
        }));
      }
      return;
    }

    case "AddharNumber": {
      const numericValue = value.replace(/\D/g, "");

      if (numericValue.length > 12) return;

      setFormData((prev) => ({
        ...prev,
        AddharNumber: numericValue,
      }));
      return;
    }

    case "Rent":
    case "DiscountAmt":
    case "costPerDay":
    case "advance":
    case "balance": {
      const numericValue = value.replace(/[^0-9.]/g, "");

      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    default:
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (isSubmitting || createMutation.isPending) return;

  const newErrors = {};

  // Frontend validation
  if (!formData.checkin) {
    newErrors.checkin = "Date of joining is required";
  }

  if (!formData.checkin) {
  newErrors.checkin = "Date of joining is required";
}

if (!formData.checkout) {
  newErrors.checkout = "Date of leaving is required";
}

if (
  formData.checkin &&
  formData.checkout &&
  new Date(formData.checkout) <= new Date(formData.checkin)
) {
  newErrors.checkout = "Date of leaving must be after joining";
}

  if (!formData.RoomNo) {
    newErrors.RoomNo = "Room number is required";
  }

  if (!formData.Name.trim()) {
    newErrors.Name = "Name is required";
  }

  if (!/^\d{10}$/.test(formData.MobileNo)) {
    newErrors.MobileNo = "Mobile number must contain exactly 10 digits";
  }

if (!formData.AddharNumber) {
  newErrors.AddharNumber = "Aadhaar number is required";
} else if (!/^\d{12}$/.test(formData.AddharNumber)) {
  newErrors.AddharNumber = "Aadhaar must be 12 digits";
}

if (!formData.AddharNumber || !formData.checkout) {
  showToast("Aadhaar and Checkout are required", "error");
  return;
}

  if (!formData.Reason) {
    newErrors.Reason = "Occupancy purpose is required";
  }

  if (!formData.PaymentMethod) {
    newErrors.PaymentMethod = "Payment mode is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    showToast("Please fix the highlighted fields.", "error");
    return;
  }

  const branchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.branchName;

  if (!branchName) {
    showToast("Branch not selected", "error");
    return;
  }

  setIsSubmitting(true);

  try {
    const registerPayload = {
  RoomNo: formData.RoomNo,
  BillNo: formData.BillNo,

  checkin: formData.checkin,
  checkout: formData.checkout,

  Name: formData.Name,
  MobileNo: formData.MobileNo,
  AddharNumber: formData.AddharNumber,

  Reason: formData.Reason,
  PaymentMethod: formData.PaymentMethod,

  Rent: Number(formData.Rent || 0),
  Discount: Number(formData.DiscountAmt || 0),

  costPerDay: Number(formData.costPerDay || 0),
  advance: Number(formData.advance || 0),

  branchName,
  status: formData.status || "staying",

  staying: true
};

    await createMutation.mutateAsync(registerPayload);

    showToast("PG guest registered successfully!", "success");

    setFormData({
      RoomNo: "",
      BillNo: "",
      checkin: "",
      checkout: "",
      Name: "",
      MobileNo: "",
      AddharNumber: "",
      Reason: "",
      Rent: "",
      PaymentMethod: "UPI",
      DiscountAmt: "",
      status: "staying",
      costPerDay: "",
      totalStayRent: "",
      advance: "",
      balance: "",
    });

    navigate(-1);
  } catch (err) {
    console.error("Submission Error:", err);

    const responseData = err?.response?.data || {};

    console.log("Status:", err?.response?.status);
    console.log("Response:", responseData);

    const message =
      responseData.message ||
      responseData.error ||
      "Failed to add record";

    const backendErrors = {};

    if (/mobile/i.test(message)) {
      backendErrors.MobileNo = message;
    }

    if (/aadhaar|aadhar|addhar/i.test(message)) {
      backendErrors.AddharNumber = message;
    }

    if (/room/i.test(message)) {
      backendErrors.RoomNo = message;
    }

    if (/check[\s-]?out/i.test(message)) {
      backendErrors.checkout = message;
    }

    if (/check[\s-]?in|joining/i.test(message)) {
      backendErrors.checkin = message;
    }

    if (/payment/i.test(message)) {
      backendErrors.PaymentMethod = message;
    }

    if (/reason/i.test(message)) {
      backendErrors.Reason = message;
    }

    if (/name/i.test(message)) {
      backendErrors.Name = message;
    }

    setErrors(backendErrors);

    showToast(message, "error");
  } finally {
    setIsSubmitting(false);
  }
};


  const inputClass = "h-[46px] rounded-[14px] px-4 outline-none text-[14px]";
  const inputStyle = {
    background:
      "linear-gradient(90deg, var(--theme-card-bg-linear2) 0%, var(--theme-card-bg-linear1) 100%)",
    border: "1px solid var(--theme-accent)",
    boxShadow: "inset 0px 0px 4px 0px var(--theme-accent)",
    color: "var(--theme-primary-text)",
    width: "100%",
  };
  const labelStyle = {
    color: "var(--theme-primary-text)",
    fontWeight: 500,
    fontSize: 14,
  };

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
          className="relative w-full lg:w-[38%] h-auto lg:h-full flex flex-col justify-center items-center font-montserrat pt-6 md:pt-2 px-4"
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
            <img
              src={"https://asset.techjose.com/Hostelos/backarrow.png"}
              alt="Back"
              className="w-5 h-5 object-contain"
            />
          </button>

          <h2 className="text-[42px] leading-[52px] font-bold text-center max-[769px]:text-[32px] max-[769px]:leading-[42px] max-[426px]:text-[24px] max-[426px]:leading-[32px]">
            Welcome!
          </h2>

          <p className="font-semibold text-[22px] leading-[36px] text-center mt-1 max-[769px]:text-[16px] max-[769px]:leading-[28px] max-[426px]:text-[13px] max-[426px]:leading-[22px]">
            Register to Stay With Us
          </p>

          <img
            src={"https://asset.techjose.com/Hostelos/register.png"}
            alt="Register"
            className="w-[500px] h-[400px] object-contain mt-6 max-[1024px]:w-[420px] max-[1024px]:h-[340px] max-[769px]:w-[300px] max-[769px]:h-[240px] max-[426px]:w-[220px] max-[426px]:h-[180px]"
          />
        </div>

        {/* FORM SECTION */}
        <div className="w-full lg:w-[730px] h-auto lg:h-full flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[760px] max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide rounded-[28px] px-6 py-6 md:px-8 md:py-7 max-[426px]:p-4"
            style={{
              backgroundColor: "var(--theme-card-bg)",
              boxShadow: "0px 8px 30px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              className="text-[30px] font-bold mb-6 text-center md:text-left max-[769px]:text-[24px]"
              style={{ color: "var(--theme-heading-text)" }}
            >
              PG REGISTER
            </h2>

            {/* TOP FIELDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label style={labelStyle}>Date of Joining</label>
                <input
                  type="date"
                  max={formData.checkout || undefined}
                  name="checkin"
                  value={formData.checkin}
                  onChange={handleInput}
                  className={inputClass}
                  style={inputStyle}
                />
                <ErrorText message={errors.checkin} />
              </div>
              <div className="flex flex-col gap-2">
                <label style={labelStyle}>Room No.</label>
                <select
                  name="RoomNo"
                  value={formData.RoomNo}
                  onChange={handleInput}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="">Select Room</option>
                  {availablePgRooms.map((room) => (
                    <option key={room._id} value={room.RoomNo}>
                      {room.RoomNo}
                    </option>
                  ))}
                </select>
                <ErrorText message={errors.RoomNo} />
              </div>
            </div>

            {/* SECOND ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div className="flex flex-col gap-2">
                <label style={labelStyle}>Date of Leaving</label>
                <input
                  type="date"
                  min={formData.checkin || undefined}
                  name="checkout"
                  value={formData.checkout}
                  onChange={handleInput}
                  className={inputClass}
                  style={inputStyle}
                />
                <ErrorText message={errors.checkout} />
              </div>
              <div className="flex flex-col gap-2">
                <label style={labelStyle}>Bill No.</label>
                <input
                  type="text"
                  name="BillNo"
                  value="Auto Generated"
                  readOnly
                  className={inputClass}
                  style={{ ...inputStyle, opacity: 0.7, cursor: "not-allowed" }}
                />
                <ErrorText message={errors.BillNo} />
              </div>
            </div>

            {/* PERSONAL DETAILS */}
            <h3
              className="text-[24px] font-semibold mt-8 mb-5"
              style={{ color: "var(--theme-primary-text)" }}
            >
              Personal Details
            </h3>

            {/* MOBILE */}
            <div className="flex flex-col gap-2 mb-5">
              <label style={labelStyle}>Mobile Number</label>
              <input
                type="tel"
                name="MobileNo"
                value={formData.MobileNo}
                onChange={handleInput}
                placeholder="Enter Mobile Number"
                autoComplete="off"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                className={inputClass}
                style={inputStyle}
              />
              <ErrorText message={errors.MobileNo} />
            </div>

            {/* OTHER FIELDS */}
            <div className="space-y-5">
              {[
                {
                  label: "Name",
                  type: "text",
                  name: "Name",
                  placeholder: "Enter your name",
                },
                {
                  label: "Aadhaar Number",
                  type: "text",
                  name: "AddharNumber",
                  placeholder: "Enter Aadhaar Number",
                },
                {
                  label: "Occupancy Purpose",
                  type: "select",
                  name: "Reason",
                  options: ["Full-Day", "Refreshment"],
                },
                {
                  label: "Rent",
                  type: "number",
                  name: "Rent",
                  placeholder: "Enter Rent amount",
                },
                {
                  label: "Payment Mode",
                  type: "select",
                  name: "PaymentMethod",
                  options: ["Cash", "Card", "UPI", "Net Banking"],
                },
                {
                  label: "Discount",
                  type: "number",
                  name: "DiscountAmt",
                  placeholder: "Enter discount amount",
                },
                {
                  label: "Cost Per Day",
                  type: "number",
                  name: "costPerDay",
                  placeholder: "Cost per day",
                },
              ].map(({ label, type, name, placeholder, options }) => (
                <div className="flex flex-col gap-2" key={name}>
                  <label style={labelStyle}>{label}</label>
                  {type === "select" ? (
                    <select
                      name={name}
                      value={formData[name]}
                      onChange={handleInput}
                      className={inputClass}
                      style={inputStyle}
                    >
                      {name === "Reason" && (
                        <option value="">Select Occupancy Purpose</option>
                      )}
                      {name === "PaymentMethod" && (
                        <option value="">Select Payment Mode</option>
                      )}
                      {options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    
                  ) : (
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleInput}
                      placeholder={placeholder}
                      autoComplete="off"
                      className={inputClass}
                      style={inputStyle}
                    />
                    
                  )}
                  <ErrorText message={errors[name]} />
                </div>
              ))}
            </div>

            {/* ADVANCE + BALANCE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div className="flex flex-col gap-2">
                <label style={labelStyle}>Advance Payment</label>
                <input
                  type="number"
                  name="advance"
                  value={formData.advance}
                  onChange={handleInput}
                  placeholder="Enter advance amount"
                  className={inputClass}
                  style={inputStyle}
                />
                <ErrorText message={errors.advance} />
              </div>
              <div className="flex flex-col gap-2">
                <label style={labelStyle}>Balance Payment</label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleInput}
                  placeholder="Enter balance amount"
                  className={inputClass}
                  style={inputStyle}
                />
                <ErrorText message={errors.balance} />
              </div>
            </div>

            {/* SUBMIT */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={
                  isSubmitting || createMutation.isPending || isFetchingUser
                }
                className="w-[180px] h-[48px] rounded-[14px] text-white text-[15px] font-semibold transition-all duration-300"
                style={{
                  backgroundColor:
                    isSubmitting || createMutation.isPending || isFetchingUser
                      ? "#9CA3AF"
                      : "var(--theme-button-bg)",
                  boxShadow: "0px 6px 18px rgba(0,0,0,0.15)",
                  cursor:
                    isSubmitting || createMutation.isPending || isFetchingUser
                      ? "not-allowed"
                      : "pointer",
                  color: "var(--theme-button-text)",
                }}
              >
                {isSubmitting || createMutation.isPending
                  ? "Creating..."
                  : "Submit"}
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

export default AddPgDetails;