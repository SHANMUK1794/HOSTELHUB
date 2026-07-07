import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRegister from "../../hooks/useRegister";
import { useSettings } from "../../hooks/useSettings";
import { useSelector } from "react-redux";
import { useRoomsResidents } from "../../hooks/useRoomsResident";
import ToastMessage from "../common_components/ToastMessage";
import { useSaveRoomRent } from "../../hooks/useRoomRent";

const Registration = () => {
  const navigate = useNavigate();
  const { createUser } = useRegister();
  const saveRoomRent = useSaveRoomRent();
  const { data: roomsData = [], isLoading } = useRoomsResidents();
  const rooms = roomsData || [];
  const [errors, setErrors] = useState({});

  const {
  businessConfig
} = useSettings();


const defaultDeposit =
  businessConfig?.securityDeposit || "";

  const availableRooms = rooms.filter((room) => {
    const category = room.category?.toString().trim();
    const isResident = !category || category === "Resident";
    const occupiedCount = room.users?.length || 0;
    const hasSpace = occupiedCount < Number(room.Capacity || 0);
    return isResident && hasSpace;
  });

  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);

  const getBranchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.role === "Warden"
        ? user?.branchName
        : "";

  const [sameAsMobile, setSameAsMobile] = useState(false);

  const [registerData, setRegisterData] = useState({
    AddharNumber: "",
    BillNo: "",
    DateOfBirth: "",
    DateOfJoining: "",
    Registerdate: "",
    Email: "",
    FoodType: "",
    FloorNo: "",
    MobileNo: "",
    Name: "",
    Parking: "no",
    PermanentAddress: "",
    RoomNo: "",
    RoomId: "",
    RoomType: "",
    SameAsWhatsapp: false,
    Whatsapp: "",
    branchName: "",
    vehicleNo: "",
    Deposit: defaultDeposit,
    Discount: "",
    Advance: "",
    Rent: "",
    __v: 0,
    _id: "",
  });

  useEffect(() => {
  if (businessConfig?.securityDeposit !== undefined) {
    setRegisterData((prev) => ({
      ...prev,
      Deposit: businessConfig.securityDeposit,
    }));
  }
}, [businessConfig]);

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

  useEffect(() => {
    if (!registerData.RoomId) {
      setRegisterData((prev) => ({
        ...prev,
        FloorNo: "",
        Rent: "",
        RoomType: "",
        RoomNo: "",
      }));
      return;
    }

    const selectedRoom = rooms.find((room) => room._id === registerData.RoomId);
    if (!selectedRoom) return;

    setRegisterData((prev) => {
      if (
        prev.FloorNo === selectedRoom.Floor &&
        prev.Rent === selectedRoom.Rate &&
        prev.RoomType === selectedRoom.RoomType &&
        prev.RoomNo === selectedRoom.RoomNo
      ) {
        return prev;
      }
      return {
        ...prev,
        FloorNo: selectedRoom.Floor || "",
        Rent: selectedRoom.Rate || "",
        RoomType: selectedRoom.RoomType || "",
        RoomNo: selectedRoom.RoomNo || "",
      };
    });
  }, [registerData.RoomId, rooms]);

  const handleInput = (e) => {
  const { name, value } = e.target;

  setRegisterData((prev) => {
    let updated = {
      ...prev,
      [name]: value,
    };

    if (name === "MobileNo" && sameAsMobile) {
      updated.Whatsapp = value;
    }

    return updated;
  });

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      AddharNumber, BillNo, DateOfBirth, DateOfJoining, Email,
      FoodType, FloorNo, MobileNo, Name, PermanentAddress,
      RoomNo, RoomType, Whatsapp,
    } = registerData;

    if (!getBranchName) {
      showToast("Please select a branch from the header before registering a user.", "error");
      return;
    }
    if (!DateOfJoining?.trim()) return showToast("Date of Joining is required.", "error");
    if (!registerData.RoomId?.trim()) return showToast("Room is required.", "error");
    if (!BillNo?.trim()) return showToast("Bill No is required.", "error");
    if (!Name?.trim()) return showToast("Name is required.", "error");
    if (!DateOfBirth?.trim()) return showToast("Date of Birth is required.", "error");
    if (!MobileNo?.trim()) return showToast("Mobile Number is required.", "error");
    if (MobileNo.length < 10) return showToast("Enter valid Mobile Number.", "error");
    if (!Email?.trim()) return showToast("Email is required.", "error");
    if (!PermanentAddress?.trim()) return showToast("Permanent Address is required.", "error");
    if (!AddharNumber?.trim()) return showToast("Aadhaar Number is required.", "error");
    if (AddharNumber.length < 12) return showToast("Enter valid Aadhaar Number.", "error");
    if (!Whatsapp?.trim()) return showToast("WhatsApp Number is required.", "error");
    if (!FoodType?.trim()) return showToast("Please select Food Type.", "error");
    if (!RoomType?.trim()) return showToast("Please select Room Type.", "error");
    if (!FloorNo?.toString().trim()) return showToast("Floor No is required.", "error");

    const matchedRoom = rooms.find((room) => room._id === registerData.RoomId);
    if (!matchedRoom) return showToast("Room No or Floor No does not exist.", "error");

    if (String(matchedRoom.RoomType).trim().toLowerCase() !== String(RoomType).trim().toLowerCase()) {
      return showToast("Selected Room Type does not match.", "error");
    }

    const occupiedCount = (matchedRoom.users?.length || 0) + (matchedRoom.pgUsers?.length || 0);
    const roomCapacity = Number(matchedRoom.Capacity || 0);
    if (occupiedCount >= roomCapacity) return showToast("Room is already full.", "error");

    if (registerData.Parking === "yes" && !registerData.vehicleNo.trim()) {
      return showToast("Vehicle Number is required.", "error");
    }

    const payload = {
      ...registerData,
      branchName: getBranchName,
      FloorNo: matchedRoom.Floor,
      RoomNo: matchedRoom.RoomNo,
      Rent: matchedRoom.Rate,
      Parking: registerData.Parking === "yes",
      vehicleNo: registerData.Parking === "yes" ? registerData.vehicleNo : "",
      Deposit: Number(registerData.Deposit || 0),
      Discount: Number(registerData.Discount || 0),
      Advance: Number(registerData.Advance || 0),
    };

    // ==========================================
    // STEP 1: SAVE THE RESIDENT
    // ==========================================
    let serverBillNo = "0000";
    try {
      const response = await createUser(payload);
      serverBillNo = response?.data?.BillNo || "0000";
    } catch (error) {

  const message = error?.response?.data?.message || "Registration failed.";

  if (message.includes("Email")) {
    setErrors({ Email: message });
    return;
  }

  if (message.includes("Mobile")) {
    setErrors({ MobileNo: message });
    return;
  }

  if (message.includes("Aadhaar")) {
    setErrors({ AddharNumber: message });
    return;
  }

  if (message.includes("Room")) {
    setErrors({ RoomId: message });
    return;
  }

  showToast(message, "error");
  return;
}

    // ==========================================
    // STEP 2: PAUSE FOR MONGODB SYNC
    // Increased to 1500ms to guarantee MongoDB finishes writing the resident
    // before the Room Rent service tries to look them up.
    // ==========================================
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // ==========================================
    // STEP 3: CREATE THE PAYMENT RECORD
    // ==========================================
    try {
      const rentAmt = Number(matchedRoom.Rate || 0);
      const depositAmt = Number(registerData.Deposit || 0);
      const advanceAmt = Number(registerData.Advance || 0);
      const discountAmt = Number(registerData.Discount || 0);
      
      const totalAmt = rentAmt + depositAmt;
      const calculatedBalance = totalAmt - advanceAmt - discountAmt;
      const finalBalance = calculatedBalance > 0 ? calculatedBalance : 0;

      const paymentPayload = {
        ResidentName: String(registerData.Name),
        RoomNo: String(matchedRoom.RoomNo),
        FloorNo: String(matchedRoom.Floor || "1"),
        MobileNo: Number(registerData.MobileNo),
        BillNo: String(serverBillNo),
        
        // Strict Mongoose Requirements
        RoomRent: rentAmt,
        RoomDeposit: depositAmt,
        EBDeposit: 0, 
        Total: totalAmt,
        Advance: advanceAmt,
        Balance: finalBalance,
        DisAmt: discountAmt,
        
        PaymentMethod: "UPI", 
        Status: advanceAmt >= totalAmt ? "Paid" : "Pending",
        branchName: getBranchName,
      };
      await saveRoomRent.mutateAsync({
        payload: paymentPayload,
        isEdit: false,
      });

      showToast("User registered & Payment auto-generated!", "success");
      setTimeout(() => navigate("/StudentDetails"), 1500);
      
    } catch (error) {
      console.error("Payment Error:", error);
      // IF IT FAILS NOW, THIS EXACT ERROR WILL TELL US WHY
      showToast("User registered, BUT Payment failed: " + (error?.response?.data?.message || error.message), "error");
      setTimeout(() => navigate("/StudentDetails"), 1500);
    }
  };
  

  // Shared input style using theme variables
  const inputClass = `
    w-full h-[46px] rounded-[12px] px-4 outline-none text-[14px]
    font-poppins placeholder:text-[color:var(--theme-muted-text)]
  `;
  const inputStyle = {
    background: "linear-gradient(90deg, var(--theme-card-bg-linear2) 0%, var(--theme-card-bg-linear1) 100%)",
    border: "1px solid var(--theme-accent)",
    boxShadow: "inset 0px 0px 4px 0px var(--theme-accent)",
    color: "var(--theme-primary-text)",
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
        <div className="relative w-full lg:w-[38%] h-auto lg:h-full flex flex-col justify-center items-center font-montserrat pt-6 md:pt-2 px-4"
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

          <h2
            className="text-[42px] leading-[52px] font-bold text-center max-[769px]:text-[32px] max-[769px]:leading-[42px] max-[426px]:text-[24px] max-[426px]:leading-[32px]"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Welcome!
          </h2>

          <p
            className="font-semibold text-[22px] leading-[36px] text-center mt-1 max-[769px]:text-[16px] max-[769px]:leading-[28px] max-[426px]:text-[13px] max-[426px]:leading-[22px]"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Register to Stay With Us
          </p>

          <img
            src={"https://asset.techjose.com/Hostelos/register.png"}
            alt="register"
            className="w-[500px] h-[400px] object-contain mt-6 max-[1024px]:w-[420px] max-[1024px]:h-[340px] max-[769px]:w-[300px] max-[769px]:h-[240px] max-[426px]:w-[220px] max-[426px]:h-[180px]"
          />
        </div>

        {/* FORM SECTION */}
        <div className="w-full lg:w-[730px] h-auto lg:h-full flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide rounded-[24px] px-6 py-5 md:px-8 md:py-6 shadow-[0px_0px_20px_rgba(0,0,0,0.06)] max-[426px]:p-4"
            style={{ backgroundColor: "var(--theme-card-bg)" }}
          >
            {/* TITLE */}
            <h2
              className="text-[30px] leading-[40px] font-bold mb-6 font-poppins"
              style={{ color: "var(--theme-heading-text)" }}
            >
              REGISTER
            </h2>

            {!getBranchName && (
              <div className="mb-6 p-4 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}
              >
                ⚠️ Please select a branch from the header dropdown before registering a new user.
              </div>
            )}

            {getBranchName && availableRooms.length === 0 && !isLoading && (
              <div className="mb-6 p-4 rounded-lg text-sm font-medium"
                style={{ backgroundColor: "#FEFCE8", border: "1px solid #FEF08A", color: "#A16207" }}
              >
                ⚠️ No rooms available in <b>{getBranchName}</b>. Please create rooms in the Rooms & Residents section first.
              </div>
            )}

            {/* TOP SECTION */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* DOJ */}
                <div className="flex flex-col flex-1">
                  <label className="font-medium text-[15px] mb-2" style={{ color: "var(--theme-primary-text)" }}>
                    Date Of Joining
                  </label>
                  <input type="date" name="DateOfJoining" value={registerData.DateOfJoining} onChange={handleInput} className={inputClass} style={inputStyle} />
                  <ErrorText message={errors.DateOfJoining} />
                </div>

                {/* BILL */}
                <div className="flex flex-col flex-1">
                  <label className="font-medium text-[15px] mb-2" style={{ color: "var(--theme-primary-text)" }}>
                    Bill No.
                  </label>
                  <input type="text" name="BillNo" value={registerData.BillNo} placeholder="Enter Bill Number" onChange={handleInput} className={inputClass} style={inputStyle} />
                </div>
              </div>

              {/* ROOM DETAILS */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* FLOOR */}
                <div className="flex flex-col flex-1">
                  <label className="font-medium text-[15px] mb-2" style={{ color: "var(--theme-primary-text)" }}>
                    Floor No.
                  </label>
                  <input
                    type="text" name="FloorNo" value={registerData.FloorNo} readOnly placeholder="Floor Number"
                    className={inputClass}
                    style={{ ...inputStyle, opacity: 0.7, cursor: "not-allowed" }}
                  />
                  <ErrorText message={errors.FloorNo} />
                </div>

                {/* ROOM */}
                <div className="flex flex-col flex-1">
                  <label className="font-medium text-[15px] mb-2" style={{ color: "var(--theme-primary-text)" }}>
                    Room No.
                  </label>
                  <select name="RoomId" value={registerData.RoomId} onChange={handleInput} className={inputClass} style={inputStyle}>
                    <option value="">{isLoading ? "Loading Rooms..." : "Select Room"}</option>
                    {availableRooms.map((room) => (
                      <option key={room._id} value={room._id}>{room.RoomNo}</option>
                    ))}
                  </select>
                  <ErrorText message={errors.RoomId} />
                </div>
              </div>
            </div>

            {/* PERSONAL DETAILS */}
            <h3 className="font-semibold text-[28px] mt-7 mb-4" style={{ color: "var(--theme-primary-text)" }}>
              Personal Details
            </h3>

            <div className="space-y-4">
              {[
                { label: "Name", type: "text", placeholder: "Enter your name", name: "Name" },
                { label: "Date of Birth", type: "date", placeholder: "", name: "DateOfBirth" },
                { label: "Mobile Number", type: "tel", placeholder: "Mobile No.", name: "MobileNo" },
                { label: "Email Address", type: "email", placeholder: "Enter your email", name: "Email" },
                { label: "Permanent Address", type: "text", placeholder: "Enter address", name: "PermanentAddress" },
                { label: "Aadhaar Number", type: "text", placeholder: "Enter Aadhaar Number", name: "AddharNumber" },
              ].map(({ label, type, placeholder, name }) => (
                <div className="flex flex-col gap-2 w-full" key={name}>
                  <label className="font-medium text-[15px]" style={{ color: "var(--theme-primary-text)" }}>
                    {label}
                  </label>
                  <input type={type} placeholder={placeholder} name={name} value={registerData[name]} onChange={handleInput} className={inputClass} style={inputStyle} />
                  <ErrorText message={errors[name]} />
                </div>
              ))}

              {/* WHATSAPP */}
              <div className="flex flex-col gap-2 w-full">
                <label className="font-medium text-[15px]" style={{ color: "var(--theme-primary-text)" }}>
                  Whatsapp Number
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="text" placeholder="Enter whatsapp number" name="Whatsapp"
                    value={registerData.Whatsapp} onChange={handleInput} disabled={sameAsMobile}
                    className={inputClass} style={{ ...inputStyle, opacity: sameAsMobile ? 0.7 : 1 }}
                  />
                  <label className="flex items-center gap-2 whitespace-nowrap">
                    <input
                      type="checkbox" checked={sameAsMobile}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSameAsMobile(checked);
                        if (checked) {
                          setRegisterData((prev) => ({ ...prev, Whatsapp: prev.MobileNo }));
                        } else {
                          setRegisterData((prev) => ({ ...prev, Whatsapp: "" }));
                        }
                      }}
                      className="w-4 h-4"
                      style={{ accentColor: "var(--theme-accent)" }}
                    />
                    <span className="text-[14px] font-medium" style={{ color: "var(--theme-primary-text)" }}>
                      Same as Mobile
                    </span>
                  </label>
                </div>
                <ErrorText message={errors.Whatsapp} />
              </div>
            </div>

            {/* HOSTEL PREFERENCES */}
            <h3 className="font-semibold text-[28px] mt-7 mb-4" style={{ color: "var(--theme-primary-text)" }}>
              Hostel Preferences
            </h3>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* ROOM TYPE */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-[15px]" style={{ color: "var(--theme-primary-text)" }}>
                    Room Type
                  </label>
                  <select name="RoomType" value={registerData.RoomType} onChange={handleInput} className={inputClass} style={inputStyle}>
                    <option value="">Select Room Type</option>
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                  </select>
                  <ErrorText message={errors.RoomType} />
                </div>

                {/* FOOD */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-[15px]" style={{ color: "var(--theme-primary-text)" }}>
                    Food Type
                  </label>
                  <select name="FoodType" value={registerData.FoodType} onChange={handleInput} className={inputClass} style={inputStyle}>
                    <option value="">Select Food Type</option>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                  <ErrorText message={errors.FoodType} />
                </div>
              </div>

              {/* VEHICLE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-[15px]" style={{ color: "var(--theme-primary-text)" }}>
                    Vehicle No.
                  </label>
                  <input type="text" name="vehicleNo" value={registerData.vehicleNo} placeholder="Enter Vehicle Number" onChange={handleInput} className={inputClass} style={inputStyle} />
                </div>

                <div className="flex items-center gap-3 pb-2">
                  <input
                    type="checkbox"
                    checked={registerData.Parking === "yes"}
                    onChange={(e) => handleInput({ target: { name: "Parking", value: e.target.checked ? "yes" : "no" } })}
                    className="w-4 h-4"
                    style={{ accentColor: "var(--theme-accent)" }}
                  />
                  <label className="text-[15px] font-medium" style={{ color: "var(--theme-primary-text)" }}>
                    Parking
                  </label>
                </div>
                <ErrorText message={errors.vehicleNo} />
              </div>

              {/* DEPOSIT */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-[15px]" style={{ color: "var(--theme-primary-text)" }}>
                  Deposit Amount
                </label>
                <input type="number" name="Deposit" value={registerData.Deposit} placeholder="Enter Deposit Amount" onChange={handleInput} className={inputClass} style={inputStyle} />
                <ErrorText message={errors.Deposit} />
              </div>

              {/* DISCOUNT */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-[15px]" style={{ color: "var(--theme-primary-text)" }}>
                  Discount
                </label>
                <input type="number" name="Discount" value={registerData.Discount} placeholder="Enter Discount Amount" onChange={handleInput} className={inputClass} style={inputStyle} />
                <ErrorText message={errors.Discount} />
              </div>
            </div>

            {/* SUBMIT */}
            <div className="flex justify-center mt-8">
              <button
                type="submit"
                className="w-[180px] h-[50px] rounded-[14px] font-semibold text-[16px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                Submit
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
};

export default Registration;