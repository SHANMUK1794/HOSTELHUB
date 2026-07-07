import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/AxiosInstance";
import { 
  ArrowLeft, 
  Lock, 
  Key, 
  ShieldAlert, 
  CheckCircle 
} from "lucide-react";

const Reset = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    new_password: "",
    confirm_password: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // States for API requests
  const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);
  const [sendOtpError, setSendOtpError] = useState(null);

  const [isVerifyOtpLoading, setIsVerifyOtpLoading] = useState(false);
  const [verifyOtpError, setVerifyOtpError] = useState(null);

  const [isResetLoading, setIsResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsSendOtpLoading(true);
    setSendOtpError(null);
    try {
      const response = await axiosInstance.post("/api/users/v1/forgot-password", {
        email: formData.email,
      });
      toast.success(response.data?.message || "OTP Sent Successfully");
      setStep(2);
    } catch (err) {
      setSendOtpError(err);
      toast.error(err?.response?.data?.message || err.message || "Failed to send OTP");
    } finally {
      setIsSendOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsVerifyOtpLoading(true);
    setVerifyOtpError(null);
    try {
      const otpCode = otp.join("");
      const response = await axiosInstance.post("/api/users/v1/verify-otp", {
        email: formData.email,
        otp: otpCode,
      });
      toast.success(response.data?.message || "OTP Verified Successfully");
      setStep(3);
    } catch (err) {
      setVerifyOtpError(err);
      toast.error(err?.response?.data?.message || err.message || "Failed to verify OTP");
    } finally {
      setIsVerifyOtpLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    setIsResetLoading(true);
    setResetError(null);
    try {
      const response = await axiosInstance.post("/api/users/v1/reset-password", {
        email: formData.email,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });
      toast.success(response.data?.message || "Password Reset Successfully");
      setStep(4);
    } catch (err) {
      setResetError(err);
      toast.error(err?.response?.data?.message || err.message || "Failed to reset password");
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden bg-gray-50 font-sans">
      <section className="hidden w-1/2 inset-0 z-0 relative lg:flex items-center justify-center lg:w-1/2 bg-gradient-to-br from-teal-800 to-indigo-950 lg:rounded-r-[350px] xl:rounded-r-[850px] shadow-[10px_0_30px_rgba(0,0,0,0.15)]">
        <div className="text-center text-white px-8 max-w-lg z-10">
          <h2 className="text-5xl font-extrabold tracking-wide mb-6 bg-gradient-to-r from-teal-300 to-indigo-300 bg-clip-text text-transparent">
            HostelHub
          </h2>
          <p className="text-teal-100 text-lg leading-relaxed mb-8">
            The smart, modern way to manage rooms, residents, kitchen inventories, and payroll seamlessly.
          </p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce delay-75"></div>
            <div className="w-3 h-3 bg-teal-300 rounded-full animate-bounce delay-150"></div>
            <div className="w-3 h-3 bg-teal-200 rounded-full animate-bounce delay-225"></div>
          </div>
        </div>
      </section>

      <section className="relative z-10 flex w-full lg:w-1/2 flex-col items-center justify-center p-4 sm:p-8">
        {/* STEP 1: SEND OTP */}
        {step === 1 && (
          <div className="w-full max-w-[480px]">
            <form
              onSubmit={handleSendOtp}
              className="bg-[#555555]/10 lg:bg-[#555555]/5 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[30px] p-6 sm:p-8 flex flex-col space-y-5 relative"
            >
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="absolute top-5 left-5 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200/50 hover:bg-gray-200 transition text-gray-700 cursor-pointer border-none focus:outline-none"
              >
                <ArrowLeft size={16} />
              </button>
              
              <div className="flex flex-col items-center w-full gap-4 text-center mt-6">
                <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center shadow-inner">
                  <Lock size={32} />
                </div>
                <h1 className="text-2xl font-bold text-black">
                  Forgot Password?
                </h1>
                <p className="text-sm text-gray-600">
                  Enter your email address and we'll send you an OTP code to reset your password.
                </p>
              </div>

              <div className="flex flex-col mt-4">
                <label className="text-[15px] font-semibold mb-1.5 text-teal-800">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full h-[48px] rounded-[10px] border border-gray-400 bg-white/50 px-4 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-black placeholder-gray-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSendOtpLoading}
                  className="w-full h-[50px] bg-teal-600 text-white font-semibold text-[16px] rounded-[10px] shadow-md hover:bg-teal-700 transition disabled:opacity-70"
                >
                  {isSendOtpLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>

              <button
                type="button"
                className="text-teal-800 font-semibold hover:underline text-[14px] self-center mt-2"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>

              {sendOtpError && (
                <p className="text-red-500 text-center text-sm bg-red-50 p-2 rounded-lg">
                  {sendOtpError.response?.data?.message || "Failed to send OTP"}
                </p>
              )}
            </form>
          </div>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 2 && (
          <div className="w-full max-w-[480px]">
            <form
              onSubmit={handleVerifyOtp}
              className="bg-[#555555]/10 lg:bg-[#555555]/5 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[30px] p-6 sm:p-8 flex flex-col space-y-5 relative"
            >
              <button
                type="button"
                onClick={() => setStep(1)}
                className="absolute top-5 left-5 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200/50 hover:bg-gray-200 transition text-gray-700 cursor-pointer border-none focus:outline-none"
              >
                <ArrowLeft size={16} />
              </button>
              
              <div className="flex flex-col items-center w-full gap-4 text-center mt-6">
                <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center shadow-inner">
                  <ShieldAlert size={32} />
                </div>
                <h1 className="text-2xl font-bold text-black">
                  Enter OTP
                </h1>
                <p className="text-sm text-gray-600">
                  We've sent a 6-digit code to <strong>{formData.email}</strong>
                </p>
              </div>

              <div className="flex justify-center gap-2.5 my-4">
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
                    className="w-12 h-12 text-center text-xl font-bold rounded-xl border border-gray-400 bg-white focus:outline-none focus:border-teal-600 text-black focus:ring-1 focus:ring-teal-600"
                  />
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifyOtpLoading}
                  className="w-full h-[50px] bg-teal-600 text-white font-semibold text-[16px] rounded-[10px] shadow-md hover:bg-teal-700 transition disabled:opacity-70"
                >
                  {isVerifyOtpLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>

              <button
                type="button"
                className="text-teal-800 font-semibold hover:underline text-[14px] self-center"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>

              {verifyOtpError && (
                <p className="text-red-500 text-center text-sm bg-red-50 p-2 rounded-lg">
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
              className="bg-[#555555]/10 lg:bg-[#555555]/5 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[30px] p-6 sm:p-8 flex flex-col space-y-5"
            >
              <div className="flex flex-col items-center w-full gap-4 text-center">
                <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center shadow-inner">
                  <Key size={32} />
                </div>
                <h1 className="text-2xl font-bold text-black">
                  Create New Password
                </h1>
                <p className="text-sm text-gray-600">Enter your new password details below</p>
              </div>

              <div className="flex flex-col">
                <label className="text-[15px] font-semibold mb-1.5 text-teal-800">
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
                  className="w-full h-[48px] rounded-[10px] border border-gray-400 bg-white/50 px-4 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-black placeholder-gray-500"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[15px] font-semibold mb-1.5 text-teal-800">
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
                  className="w-full h-[48px] rounded-[10px] border border-gray-400 bg-white/50 px-4 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-black placeholder-gray-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isResetLoading}
                  className="w-full h-[50px] bg-teal-600 text-white font-semibold text-[16px] rounded-[10px] shadow-md hover:bg-teal-700 transition disabled:opacity-70"
                >
                  {isResetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
              {resetError && (
                <p className="text-red-500 text-center text-sm bg-red-50 p-2 rounded-lg">
                  {resetError.response?.data?.message || "Failed to reset password"}
                </p>
              )}
            </form>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 4 && (
          <div className="w-full max-w-[480px]">
            <div className="bg-[#555555]/10 lg:bg-[#555555]/5 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[30px] p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-inner animate-bounce">
                <CheckCircle size={32} />
              </div>
              <h1 className="text-2xl font-bold text-black">
                Password Reset!
              </h1>
              <p className="text-sm text-gray-600">
                Your password has been successfully updated. You can now login with your new credentials.
              </p>
              <button
                onClick={() => {
                  setStep(1);
                  navigate("/login");
                }}
                className="w-full h-[50px] bg-teal-600 text-white font-semibold text-[16px] rounded-[10px] shadow-md hover:bg-teal-700 transition flex justify-center items-center"
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
