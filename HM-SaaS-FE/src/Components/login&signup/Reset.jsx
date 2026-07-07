import { useRef, useState } from "react";
// import loginImg from "../../assets/loginImg.png";
// import reset_image from "../../assets/loginAndsignup/resetimage.png";
// import lock_image from "../../assets/loginAndsignup/lockimage.png";
// import after_reset_image from "../../assets/loginAndsignup/afterresetimage.png";
// import correct_icon from "../../assets/loginAndsignup/correcticon.png";
// import password_image from "../../assets/loginAndsignup/passwordimage.png";

// import opt_image from "../../assets/loginAndsignup/otpimage.png";
import useAuth from "../../hooks/useAuth";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { toast } from "react-toastify";

const Reset = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", new_password: "", confirm_password: "" });
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // const [timer, setTimer] = useState(120); 

  const { 
    sendOtp, isSendOtpLoading, sendOtpError, 
    verifyOtp, isVerifyOtpLoading, verifyOtpError, 
    resetPassword, isResetLoading, resetError 
  } = useAuth();

  

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await sendOtp(formData.email);
      toast.success(response?.message || "OTP sent successfully");
      setStep(2); // Only move to step 2 if successful
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    try {
      const response = await verifyOtp({ email: formData.email, otp: otpString });
      toast.success(response?.message || "OTP verified successfully");
      setStep(3); // Only move to step 3 if successful
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Invalid OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await resetPassword({ email: formData.email, newPassword: formData.new_password });
      toast.success(response?.message || "Password reset successfully");
      setStep(4)
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to reset password");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden bg-gray-50 font-sans">
      {/* Global Background Image */}
      <img
        src={"https://asset.techjose.com/Hostelos/loginImg.png"}
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover opacity-30 z-0 pointer-events-none"
      />
      <section className="hidden w-1/2 inset-0 z-0 lg:relative lg:flex lg:w-1/2 bg-[#2563EB]/30 lg:rounded-r-[350px] xl:rounded-r-[850px] items-center justify-center">
        <div className="h-full w-full -translate-x-[80px] absolute inset-0 z-0 lg:relative lg:flex lg:w-full bg-[#758DC7] lg:rounded-r-[350px] xl:rounded-r-[850px]">
          <div className="h-full w-full -translate-x-[80px] absolute inset-0 z-0 lg:relative lg:flex lg:w-full bg-[#263765] lg:rounded-r-[350px] xl:rounded-r-[850px]"></div>
          <img
            src={
              step === 4
                ? "https://asset.techjose.com/Hostelos/loginAndsignup/afterresetimage.png"
                : "https://asset.techjose.com/Hostelos/loginAndsignup/resetimage.png"
            }
            alt="Illustration"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-2xl
                      w-[clamp(420px,40vw,900px)] h-[clamp(480px,45vw,1100px)]"        
                 />
        </div>
      </section>

      <section className="relative z-10 flex w-full lg:w-1/2 flex-col items-center justify-center p-4 sm:p-8">
        {/* STEP 1: SEND OTP */}
        {step === 1 && (
          <div className="w-full max-w-[480px]">
            <form
              onSubmit={handleSendOtp}
              className="bg-white/60 lg:bg-[#555555]/5 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[30px] p-6 sm:p-8 flex flex-col space-y-5"
            >
              <span
                onClick={() => navigate("/login")}
                className="absolute top-5 left-5 text-2xl text-[#757575] cursor-pointer"
              >
                <MdOutlineArrowBackIosNew />
              </span>
              <div className="flex flex-col items-center w-full gap-4 text-center">
                <div className="p-3 font-[#2563EB] bg-[#2563EB]/30 rounded-full">
                  <img
                    src={
                      "https://asset.techjose.com/Hostelos/loginAndsignup/lockimage.png"
                    }
                    alt="lock_image"
                  />
                </div>
                <h1 className="text-[#263765] text-2xl font-semibold">
                  Forgot Password?
                </h1>
                <p>
                  Enter your email address and we'll send you an OTP to reset
                  your password.
                </p>
              </div>

              <div className="flex flex-col">
                <label className="text-[15px] font-semibold mb-1.5 text-[#263765]">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full h-[48px] rounded-[10px] border border-gray-400 bg-white/50 px-4 focus:outline-none focus:border-[#263765]"
                />
              </div>

              <div className="flex items-center gap-2 w-[300px]">
                <span className="text-[20px] text-[#2563EB]">
                  <IoMdInformationCircleOutline />
                </span>
                <h1 className="text-[#757575]">
                  Make sure it's the email you used to create you account.
                </h1>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSendOtpLoading}
                  className="w-full h-[50px] bg-[#2563EB] text-white font-medium text-[20px] rounded-[10px] shadow-md hover:bg-[#2563EB]/90 disabled:opacity-70"
                >
                  {isSendOtpLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>

              <button
                className="text-[#2563EB] hover:underline text-[20px]"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>

              {sendOtpError && (
                <p className="text-red-500 text-center text-sm">
                  {sendOtpError.response?.data?.message || "Failed to send OTP"}
                </p>
              )}
            </form>
          </div>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 2 && (
          <div className="w-full max-w-[450px]">
            <form
              onSubmit={handleVerifyOtp}
              className="bg-white/60 lg:bg-[#555555]/5 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[30px] p-6 sm:p-8 flex flex-col "
            >
              <span
                onClick={() => setStep(1)}
                className="absolute top-5 left-5 text-2xl text-[#757575] cursor-pointer"
              >
                <MdOutlineArrowBackIosNew />
              </span>
              <div className="flex flex-col items-center w-full gap-4 text-center">
                <img
                  src={
                    "https://asset.techjose.com/Hostelos/loginAndsignup/otpimage.png"
                  }
                  alt="lock_image"
                />
                <h1 className="text-[#263765] text-2xl font-semibold">
                  Enter OTP
                </h1>
                <p>
                  We've sent a 6-digit code to <strong>{formData.email}</strong>
                </p>
              </div>
              <h1 className="text-[#2563EB] font-bold mt-6 ml-4 mb-2">
                OTP CODE
              </h1>
              <div className="flex justify-center gap-3 mb-4">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index]}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-xl font-semibold rounded-xl border border-gray-400 focus:outline-none focus:border-[#263765]"
                  />
                ))}
              </div>

              <div className="flex justify-between items-center px-6">
                <h1 className="text-[#757575] hover:text-black">
                  Didn't receive the code?
                </h1>
                <h1 className="text-[#2563EB] cursor-pointer">
                  Resend OTP(00:30)
                </h1>
              </div>

              <div className="pt-4 mt-4 mb-4">
                <button
                  type="submit"
                  disabled={isVerifyOtpLoading}
                  className="w-full h-[50px] bg-[#2563EB] text-white font-medium text-[20px] rounded-[10px] shadow-md hover:bg-[#2563EB]/90 disabled:opacity-70"
                >
                  {isVerifyOtpLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>

              <button
                className="text-[#2563EB] text-[20px] hover:underline"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>

              {verifyOtpError && (
                <p className="text-red-500 text-center text-sm">
                  {verifyOtpError.response?.data?.message || "Invalid OTP"}
                </p>
              )}
            </form>
          </div>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {step === 3 && (
          <div className="w-full max-w-[480px]">
            <form
              onSubmit={handleResetPassword}
              className="bg-white/60 lg:bg-[#555555]/5 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[30px] p-6 sm:p-8 flex flex-col space-y-5"
            >
              <div className="flex flex-col items-center w-full gap-4 text-center">
                <img
                  src={
                    "https://asset.techjose.com/Hostelos/loginAndsignup/passwordimage.png"
                  }
                  alt=""
                />
                <h1 className="text-[#263765] text-2xl font-semibold">
                  Create New Password?
                </h1>
                <p>Enter your new password below</p>
              </div>

              <div className="flex flex-col">
                <label className="text-[15px] font-semibold mb-1.5 text-[#2563EB]">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={formData.new_password}
                  onChange={(e) =>
                    setFormData({ ...formData, new_password: e.target.value })
                  }
                  required
                  className="w-full h-[48px] rounded-[10px] border border-gray-400 bg-white/50 px-4 focus:outline-none focus:border-[#263765]"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[15px] font-semibold mb-1.5 text-[#2563EB]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter confirm password"
                  value={formData.confirm_password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirm_password: e.target.value,
                    })
                  }
                  required
                  className="w-full h-[48px] rounded-[10px] border border-gray-400 bg-white/50 px-4 focus:outline-none focus:border-[#263765]"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="w-full h-[50px] bg-[#2563EB] text-white font-medium text-[20px] rounded-[10px] shadow-md hover:bg-[#2563EB]/90 disabled:opacity-70"
                >
                  {isResetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
              {resetError && (
                <p className="text-red-500 text-center text-sm">
                  {resetError.response?.data?.message ||
                    "Failed to reset password"}
                </p>
              )}
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="relative w-full h-full flex flex-col justify-between items-center gap-[200px]">
            <div className="p-4 w-[80px] absolute top-1/3 bg-[#BDFFAE] rounded-full">
              <img
                className="w-full"
                src={
                  "https://asset.techjose.com/Hostelos/loginAndsignup/correcticon.png"
                }
                alt="correctIcon"
              />
            </div>
            <div className="w-[400px] absolute bottom-10">
              <button
                onClick={() => (navigate("/login"), setStep(1))}
                className="w-full py-2 bg-[#263765] text-white font-medium gap-10 text-[20px] rounded-[10px] shadow-md hover:bg-[#1a2546] disabled:opacity-70"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Reset;
