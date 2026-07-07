import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../common_components/ToastMessage";
import { useSelector } from "react-redux";
import useRegister from "../../hooks/useRegister";

const StudentUpdateDetailForm = () => {
  const { deactivateUser, deleteUser, refetch, isLoading } = useRegister();
  const selectedBranch = useSelector((state) => state.branch.selectedBranch);
  const user = useSelector((state) => state.auth.user);
  const [errors, setErrors] = useState({});

  const getBranchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.role === "Warden"
        ? user?.branchName
        : null;

  const navigate = useNavigate();
  const { editUser, update } = useRegister();
  const { editId, editData } = useSelector((state) => state.register);

  const [sameAsMobile, setSameAsMobile] = useState(() => {
    return editData?.MobileNo === editData?.WhatsAppNumber;
  });

  const [updateFormData, setUpdateFormData] = useState(() => {
    const initialData = {
      ...editData,
      Parking: editData?.Parking || "no",
      vehicleNo: editData?.vehicleNo || "",
      DateOfJoining: editData?.DateOfJoining?.slice(0, 10) || "",
      Registerdate: editData?.Registerdate?.slice(0, 10) || "",
      DateOfBirth: editData?.DateOfBirth?.slice(0, 10) || "",
      Whatsapp: editData?.Whatsapp || "",
      AddharNumber: editData?.AddharNumber || "",
      Discount: editData?.Discount || editData?.DiscountAmt || "",
      Advance: editData?.Advance || editData?.AdvanceAmt || "",
    };
    if (editData?.MobileNo === editData?.Whatsapp) {
      initialData.Whatsapp = editData.MobileNo;
    }
    return initialData;
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

  setUpdateFormData((prevData) => {
    const newData = { ...prevData, [name]: value };

    if (name === "MobileNo" && sameAsMobile) {
      newData.Whatsapp = value;
    }

    return newData;
  });

  setErrors((prev) => ({
    ...prev,
    [name]: "",
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

if (!updateFormData.DateOfJoining?.trim())
  validationErrors.DateOfJoining = "Date of Joining is required.";

if (!updateFormData.Registerdate?.trim())
  validationErrors.Registerdate = "Register Date is required.";

if (!updateFormData.RoomNo?.trim())
  validationErrors.RoomNo = "Room Number is required.";

if (!updateFormData.BillNo?.trim())
  validationErrors.BillNo = "Bill Number is required.";

if (!updateFormData.Name?.trim())
  validationErrors.Name = "Name is required.";

if (!updateFormData.DateOfBirth?.trim())
  validationErrors.DateOfBirth = "Date of Birth is required.";

if (!updateFormData.MobileNo?.trim())
  validationErrors.MobileNo = "Mobile Number is required.";
else if (!/^\d{10}$/.test(updateFormData.MobileNo))
  validationErrors.MobileNo = "Enter valid Mobile Number.";

if (!updateFormData.Email?.trim())
  validationErrors.Email = "Email is required.";
else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateFormData.Email))
  validationErrors.Email = "Enter valid Email.";

if (!updateFormData.PermanentAddress?.trim())
  validationErrors.PermanentAddress = "Permanent Address is required.";

if (!/^\d{12}$/.test(updateFormData.AddharNumber || ""))
  validationErrors.AddharNumber = "Enter valid Aadhaar Number.";

if (!updateFormData.Whatsapp?.trim())
  validationErrors.Whatsapp = "WhatsApp Number is required.";
else if (!sameAsMobile && !/^\d{10}$/.test(updateFormData.Whatsapp))
  validationErrors.Whatsapp = "Enter valid WhatsApp Number.";

if (!updateFormData.FoodType)
  validationErrors.FoodType = "Select Food Type.";

if (updateFormData.Parking === "yes" && !updateFormData.vehicleNo?.trim())
  validationErrors.vehicleNo = "Vehicle Number is required.";

if (Object.keys(validationErrors).length) {
  setErrors(validationErrors);
  return;
}
    try {
      await editUser({
        editId,
        data: { ...updateFormData, staying: true, vacatedate: null },
      });
      showToast("Student details updated successfully!", "success");
      setTimeout(() => navigate("/StudentDetails"), 1000);
   } catch (err) {
  const message =
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    err?.message ||
    "Failed to update student details.";

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

  showToast(message, "error");
}
  };

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

          <h2
            className="text-[42px] leading-[52px] font-bold text-center max-[769px]:text-[32px] max-[769px]:leading-[42px] max-[426px]:text-[24px] max-[426px]:leading-[32px]"
            style={{ color: "var(--theme-heading-text)" }}
          >
            Update Your
          </h2>

          <p
            className="font-semibold text-[22px] leading-[36px] text-center mt-1 max-[769px]:text-[16px] max-[769px]:leading-[28px] max-[426px]:text-[13px] max-[426px]:leading-[22px]"
            style={{ color: "var(--theme-primary-text)" }}
          >
            Stay Details
          </p>

          <img
            src={"https://asset.techjose.com/Hostelos/register.png"}
            alt="stayUpdate"
            className="w-[500px] h-[400px] object-contain mt-6 max-[1024px]:w-[420px] max-[1024px]:h-[340px] max-[769px]:w-[300px] max-[769px]:h-[240px] max-[426px]:w-[220px] max-[426px]:h-[180px]"
          />
        </div>

        {/* FORM SECTION */}
        <div className="w-full lg:w-[730px] h-auto lg:h-full flex items-center justify-center">
          <form
            className="w-full max-w-xl max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide rounded-[24px] px-6 py-5 md:px-8 md:py-6 shadow-[0px_0px_20px_rgba(0,0,0,0.06)] max-[426px]:p-4"
            style={{ backgroundColor: "var(--theme-card-bg)" }}
          >
            <h2
              className="text-[30px] leading-[40px] font-bold mb-6 font-poppins"
              style={{ color: "var(--theme-heading-text)" }}
            >
              UPDATE DETAILS
            </h2>

            {/* TOP INPUTS */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label
                    className="font-poppins font-medium text-[15px] mb-2"
                    style={labelStyle}
                  >
                    Date Of Joining
                  </label>
                  <input
                    type="date"
                    name="DateOfJoining"
                    value={updateFormData.DateOfJoining}
                    onChange={handleInput}
                    className={inputClass}
                    style={inputStyle}
                  />
                  <ErrorText message={errors.DateOfJoining} />
                </div>
                <div className="flex flex-col">
                  <label
                    className="font-poppins font-medium text-[15px] mb-2"
                    style={labelStyle}
                  >
                    Register Date
                  </label>
                  <input
                    type="date"
                    name="Registerdate"
                    value={updateFormData.Registerdate || ""}
                    onChange={handleInput}
                    className={inputClass}
                    style={inputStyle}
                  />
                  <ErrorText message={errors.Registerdate} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label
                    className="font-poppins font-medium text-[15px] mb-2"
                    style={labelStyle}
                  >
                    Room No.
                  </label>
                  <input
                    type="text"
                    name="RoomNo"
                    value={updateFormData.RoomNo}
                    onChange={handleInput}
                    placeholder="Room No."
                    className={inputClass}
                    style={inputStyle}
                  />
                  <ErrorText message={errors.RoomNo} />
                </div>
                <div className="flex flex-col">
                  <label
                    className="font-poppins font-medium text-[15px] mb-2"
                    style={labelStyle}
                  >
                    Bill No.
                  </label>
                  <input
                    type="text"
                    name="BillNo"
                    value={updateFormData.BillNo || ""}
                    readOnly
                    placeholder="Bill No."
                    className={inputClass}
                    style={{ ...inputStyle, opacity: 0.7, cursor: "not-allowed" }}
                  />
                  <ErrorText message={errors.BillNo} />
                </div>
              </div>
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
                  label: "Date of Birth",
                  type: "date",
                  placeholder: "",
                  name: "DateOfBirth",
                },
                {
                  label: "Mobile Number",
                  type: "tel",
                  placeholder: "Enter your mobile number",
                  name: "MobileNo",
                },
                {
                  label: "Email Address",
                  type: "email",
                  placeholder: "Enter your email address",
                  name: "Email",
                },
                {
                  label: "Permanent Address",
                  type: "text",
                  placeholder: "Enter your permanent address",
                  name: "PermanentAddress",
                },
                {
                  label: "AddharNumber",
                  type: "text",
                  placeholder: "Enter your aadhaar number",
                  name: "AddharNumber",
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
                    name={name}
                    value={updateFormData[name] || ""}
                    onChange={handleInput}
                    placeholder={placeholder}
                    className={inputClass}
                    style={inputStyle}
                  />
                  <ErrorText message={errors[name]} />
                </div>
              ))}

              {/* WHATSAPP */}
              <div className="flex flex-col gap-2 w-full">
                <label
                  className="font-poppins font-medium text-[15px]"
                  style={labelStyle}
                >
                  WhatsApp Number
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="tel"
                    name="Whatsapp"
                    value={updateFormData.Whatsapp || ""}
                    onChange={handleInput}
                    placeholder="WhatsApp Number"
                    className={inputClass}
                    style={inputStyle}
                  />
                  <label className="flex items-center gap-2 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={sameAsMobile}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSameAsMobile(checked);
                        if (checked)
                          setUpdateFormData((prev) => ({
                            ...prev,
                            Whatsapp: prev.MobileNo || "",
                          }));
                      }}
                      className="w-4 h-4"
                      style={{ accentColor: "var(--theme-accent)" }}
                    />
                    <span
                      className="text-[14px] font-medium"
                      style={{ color: "var(--theme-primary-text)" }}
                    >
                      Same as Mobile
                    </span>
                  </label>
                </div>
                <ErrorText message={errors.Whatsapp} />
              </div>
            </div>

            {/* HOSTEL PREFERENCES */}
            <h3
              className="font-poppins font-semibold text-[28px] leading-[40px] mt-7 mb-4"
              style={{ color: "var(--theme-primary-text)" }}
            >
              Hostel Preferences
            </h3>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label
                    className="font-poppins font-medium text-[15px]"
                    style={labelStyle}
                  >
                    Food Type
                  </label>
                  <select
                    name="FoodType"
                    value={updateFormData.FoodType}
                    onChange={handleInput}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="">Food Type --</option>
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                  </select>
                  <ErrorText message={errors.FoodType} />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="font-poppins font-medium text-[15px]"
                    style={labelStyle}
                  >
                    Room Type
                  </label>
                  <select
                    name="RoomType"
                    value={updateFormData.RoomType}
                    onChange={handleInput}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option value="">Room Type --</option>
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                  </select>
                  <ErrorText message={errors.RoomType} />
                </div>
              </div>

              {/* PARKING */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                <div className="flex flex-col gap-2">
                  {!updateFormData.vehicleNo ? (
                    <>
                      <label
                        className="font-poppins font-medium text-[15px]"
                        style={labelStyle}
                      >
                        Require Parking?
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          name="Parking"
                          checked={updateFormData.Parking === "yes"}
                          onChange={(e) =>
                            handleInput({
                              target: {
                                name: "Parking",
                                value: e.target.checked ? "yes" : "no",
                              },
                            })
                          }
                          className="w-4 h-4"
                          style={{ accentColor: "var(--theme-accent)" }}
                        />
                        <span
                          className="text-[15px] font-medium"
                          style={{ color: "var(--theme-primary-text)" }}
                        >
                          Yes
                        </span>
                      </div>
                      {updateFormData.Parking === "yes" && (
                        <input
                          type="text"
                          name="vehicleNo"
                          placeholder="Enter Vehicle No."
                          value={updateFormData.vehicleNo || ""}
                          onChange={handleInput}
                          className={inputClass}
                          style={inputStyle}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <label
                        className="font-poppins font-medium text-[15px]"
                        style={labelStyle}
                      >
                        Vehicle Number
                      </label>
                      <input
                        type="text"
                        name="vehicleNo"
                        placeholder="Enter Vehicle No."
                        value={updateFormData.vehicleNo}
                        onChange={handleInput}
                        className={inputClass}
                        style={inputStyle}
                      />
                      <ErrorText message={errors.vehicleNo} />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-[180px] h-[50px] rounded-[14px] font-poppins font-semibold text-[16px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                }}
              >
                Update
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

export default StudentUpdateDetailForm;
