import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { toast } from "react-toastify";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoading, error, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      if (response.success === true) {
        toast.success(response.message || "Logged In Successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden bg-gradient-to-br from-slate-900 via-teal-950 to-indigo-950 text-white font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-teal-500/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Left Branding Panel */}
      <section className="hidden w-1/2 inset-0 z-0 relative lg:flex items-center justify-center bg-white/5 border-r border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="text-center px-12 max-w-lg z-10 space-y-6">
          <div 
            onClick={() => navigate("/")}
            className="mx-auto w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-900 rounded-2xl flex items-center justify-center font-black text-3xl shadow-xl shadow-teal-500/20 cursor-pointer hover:scale-105 transition-transform"
          >
            H
          </div>
          <h2 className="text-5xl font-black tracking-wider bg-gradient-to-r from-white via-teal-200 to-teal-400 bg-clip-text text-transparent">
            HostelHub
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Access your secure workspace to manage residents, room allocations, meal schedules, and payroll operations.
          </p>
          <div className="flex justify-center gap-2.5 pt-4">
            <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-teal-300 rounded-full animate-pulse delay-150" />
            <div className="w-3 h-3 bg-teal-200 rounded-full animate-pulse delay-300" />
          </div>
        </div>
      </section>

      {/* Right Login Panel */}
      <section className="relative z-10 flex w-full lg:w-1/2 flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px] space-y-6">
          {/* Header */}
          <div className="text-center space-y-2 relative">
            <button 
              onClick={() => navigate("/")}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-teal-300 hover:text-white transition-all cursor-pointer"
              title="Back to home"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-400">
              Sign in to manage your hub.
            </p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-8 flex flex-col space-y-5"
          >
            {/* Email Field */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-teal-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-teal-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="w-full h-12 pl-11 pr-11 rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Helpers */}
              <div className="flex justify-between items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-teal-600 focus:ring-teal-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                    Show Password
                  </span>
                </label>
                <button
                  onClick={() => navigate("/reset")}
                  type="button"
                  className="text-xs font-semibold text-teal-300 hover:text-teal-200 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 py-1">
              <div className="h-[1px] flex-1 bg-white/10" />
              <span className="whitespace-nowrap text-xs font-semibold text-slate-400">
                Or Continue With
              </span>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            {/* Google OAuth */}
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
                  console.log("Google Login Failed");
                }}
                shape="rectangular"
                size="large"
                theme="filled_dark"
                text="continue_with"
                width="100%"
              />
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-900 font-extrabold rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-teal-400/20 hover:scale-[1.01] transition-all duration-300 disabled:opacity-70 flex justify-center items-center active:scale-95"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            {/* Create Account Link */}
            <div className="text-center text-xs text-slate-400 mt-2">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-bold text-teal-300 hover:text-teal-200 hover:underline ml-1 cursor-pointer"
              >
                Create Account
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-400 text-center text-xs font-semibold bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                {error.response?.data?.message || "Invalid credentials. Please try again."}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
