import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoading, error, googleLogin } = useAuth();

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      if(response.success === true){
         toast.success(response.message || "Login Successfully")
      }
    } catch (error) {
        toast.error(error?.response?.data?.message || error.message || " something went wrong")
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
        <div className="w-full max-w-[480px]">
          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-6 text-center drop-shadow-md lg:drop-shadow-none">
            Login
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-[#555555]/10 lg:bg-[#555555]/5 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-[30px] p-6 sm:p-8 flex flex-col space-y-5"
          >
            {/* Username Field */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-[15px] font-semibold mb-1.5 text-teal-800"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full h-[48px] sm:h-[50px] rounded-[10px] border border-gray-400 bg-white/50 text-black placeholder-gray-500 px-4 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all duration-200"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-[15px] font-semibold mb-1.5 text-teal-800"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full h-[48px] sm:h-[50px] rounded-[10px] border border-gray-400 text-black placeholder-gray-500 px-4 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all duration-200"
              />

              {/* Password Helpers */}
              <div className="flex justify-between items-center mt-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="w-4 h-4 rounded border-gray-400 text-teal-600 focus:ring-teal-600 cursor-pointer"
                  />
                  <span className="text-[14px] font-medium text-gray-600 group-hover:text-black transition-colors">
                    Show password
                  </span>
                </label>
                <button
                  onClick={() => navigate("/reset")}
                  type="button"
                  className="text-[14px] font-semibold text-teal-800 hover:underline"
                >
                  Reset password
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2 mt-2">
              <div className="h-[1px] flex-1 bg-gray-400/60" />
              <span className="whitespace-nowrap text-[13px] font-medium text-gray-500">
                Or Continue with
              </span>
              <div className="h-[1px] flex-1 bg-gray-400/60" />
            </div>

            <div className="flex items-center justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    await googleLogin(credentialResponse.credential);
                  } catch (err) {
                    console.error("Google Login failed on our backend", err);
                  }
                }}
                onError={() => {
                  console.log("Google Login Failed popup closed or failed");
                }}
                shape="rectangular"
                size="large"
                text="continue_with"
                width="100"
              />
            </div>

            {/* Sign In Button */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] font-[Poppins] bg-teal-600 text-white font-semibold text-[16px] rounded-[10px] shadow-md hover:bg-teal-700 transition-colors disabled:opacity-70 flex justify-center items-center"
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
            </div>

            {/* Create Account Link */}
            <div className="text-center text-[13.5px] text-gray-600 mt-2">
              Don&apos;t Have an Account ?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="font-bold text-teal-800 hover:underline underline-offset-2 ml-1 cursor-pointer"
              >
                Create Account
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-center text-[14px] font-medium bg-red-50/80 p-2 rounded-lg">
                {error.response?.data?.message || "Wrong Credentials"}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
