import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

// Shared styles
const PANEL_BG = "linear-gradient(160deg, #060d1f 0%, #0a1628 40%, #0d1f45 70%, #060d1f 100%)";
const ACCENT   = "#3b82f6";
const ACCENT2  = "#7c3aed";

function PremiumLeftPanel({ mode }) {
  const navigate = useNavigate();

  const loginFeatures = [
    { icon: "🏢", label: "Real-time room & occupancy dashboard" },
    { icon: "💳", label: "Automated billing & invoice tracking" },
    { icon: "📊", label: "Staff payroll & attendance insights" },
  ];
  const signupFeatures = [
    "Unlimited residents on free plan",
    "Automated billing generation",
    "Role-based access for all staff",
    "Kitchen, payroll & complaints",
  ];

  return (
    <div
      className="hidden lg:flex flex-col relative overflow-hidden"
      style={{
        width: "46%",
        flexShrink: 0,
        background: PANEL_BG,
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025,
        backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }} />

      {/* Top blob */}
      <div style={{ position: "absolute", top: "-120px", left: "-80px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />
      {/* Bottom blob */}
      <div style={{ position: "absolute", bottom: "-100px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3 cursor-pointer" style={{ padding: "36px 40px" }} onClick={() => navigate("/")}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "11px",
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 900, fontSize: "17px", color: "#fff",
          boxShadow: "0 0 24px rgba(37,99,235,0.35)",
        }}>H</div>
        <span style={{ fontSize: "18px", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
          Hostel<span style={{ color: "#60a5fa" }}>Hub</span>
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center" style={{ padding: "0 40px" }}>

        {mode === "login" ? (
          <>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.18)",
                borderRadius: "20px", padding: "6px 14px", marginBottom: "28px", width: "fit-content",
              }}
            >
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Secure Access</span>
            </div>
            <h2 style={{ fontSize: "46px", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#fff", marginBottom: "18px" }}>
              Welcome<br />back.
            </h2>
            <p style={{ fontSize: "16px", color: "#4b6280", lineHeight: 1.7, maxWidth: "320px", marginBottom: "48px" }}>
              Sign in to your workspace and get back to managing your properties with ease.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {loginFeatures.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "11px", flexShrink: 0, fontSize: "18px",
                    background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.14)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{f.icon}</div>
                  <span style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.5 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.18)",
                borderRadius: "20px", padding: "6px 14px", marginBottom: "28px", width: "fit-content",
              }}
            >
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#a78bfa", display: "inline-block" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#c4b5fd", textTransform: "uppercase", letterSpacing: "0.1em" }}>Free to Start</span>
            </div>
            <h2 style={{ fontSize: "46px", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#fff", marginBottom: "18px" }}>
              Start managing<br />smarter.
            </h2>
            <p style={{ fontSize: "16px", color: "#4b6280", lineHeight: 1.7, maxWidth: "320px", marginBottom: "44px" }}>
              Create your free HostelHub account and launch your first hostel workspace in minutes.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "13px", marginBottom: "44px" }}>
              {signupFeatures.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0,
                    background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#60a5fa" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span style={{ fontSize: "14px", color: "#64748b" }}>{item}</span>
                </div>
              ))}
            </div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {[{ v: "50+", l: "Hubs" }, { v: "10k+", l: "Residents" }, { v: "4.9★", l: "Rating" }].map((s, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "14px", padding: "14px 10px", textAlign: "center",
                }}>
                  <p style={{ fontSize: "20px", fontWeight: 800, color: "#f1f5f9", marginBottom: "2px" }}>{s.v}</p>
                  <p style={{ fontSize: "11px", color: "#475569" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom testimonial */}
      <div className="relative z-10" style={{ margin: "0 28px 32px" }}>
        <div style={{
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px", padding: "22px 24px",
        }}>
          <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="13" height="13" viewBox="0 0 20 20" fill="#fbbf24"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </div>
          <p style={{ fontSize: "13px", color: "#4b6280", lineHeight: 1.65, marginBottom: "16px" }}>
            "HostelHub cut our admin work by 70%. Billing, kitchen, payroll — all running automatically."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 800, color: "#fff" }}>SK</div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#cbd5e1" }}>Suresh Kumar</p>
              <p style={{ fontSize: "11px", color: "#334155" }}>Owner, SkyNest PG · Hyderabad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── INPUT COMPONENT ──────────────────────────────────────────────
function PremiumInput({ label, id, type = "text", placeholder, value, onChange, rightElement, extra }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px", letterSpacing: "0.01em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          style={{
            width: "100%", height: "48px", borderRadius: "12px",
            background: focused ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.035)",
            border: focused ? "1px solid rgba(59,130,246,0.55)" : "1px solid rgba(255,255,255,0.09)",
            color: "#f1f5f9", fontSize: "15px", padding: rightElement ? "0 48px 0 16px" : "0 16px",
            outline: "none", boxSizing: "border-box",
            boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.04)" : "inset 0 1px 0 rgba(255,255,255,0.02)",
            transition: "all 0.18s ease",
          }}
          {...extra}
        />
        {rightElement && (
          <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

// ── SUBMIT BUTTON ─────────────────────────────────────────────────
function SubmitButton({ isLoading, label, loadingLabel }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      style={{
        width: "100%", height: "50px", borderRadius: "12px",
        background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
        color: "#fff", fontSize: "15px", fontWeight: 700, border: "none",
        cursor: isLoading ? "default" : "pointer", opacity: isLoading ? 0.7 : 1,
        display: "flex", alignItems: "center", justifyContent: "center", gap: "9px",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.07), 0 6px 24px rgba(37,99,235,0.28)",
        transition: "all 0.2s ease",
        letterSpacing: "-0.01em",
      }}
      onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.08), 0 10px 32px rgba(37,99,235,0.36)"; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.07), 0 6px 24px rgba(37,99,235,0.28)"; }}
    >
      {isLoading ? (
        <>
          <svg style={{ animation: "spin 1s linear infinite" }} width="18" height="18" fill="none" viewBox="0 0 24 24">
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <path d="M12 2a10 10 0 010 20" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {loadingLabel}
        </>
      ) : label}
    </button>
  );
}

// ── EYE TOGGLE ────────────────────────────────────────────────────
function EyeToggle({ show, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.color = "#94a3b8"}
      onMouseLeave={e => e.currentTarget.style.color = "#475569"}
    >
      {show ? (
        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
      ) : (
        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      )}
    </button>
  );
}

// ── BACK LINK ─────────────────────────────────────────────────────
function BackLink({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "#334155", marginBottom: "44px", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.color = "#64748b"}
      onMouseLeave={e => e.currentTarget.style.color = "#334155"}
    >
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
      Back to home
    </button>
  );
}

// ── DIVIDER ───────────────────────────────────────────────────────
function Divider({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
      <span style={{ fontSize: "12px", color: "#1e293b", fontWeight: 500, whiteSpace: "nowrap" }}>{text}</span>
      <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

// ── ERROR BOX ─────────────────────────────────────────────────────
function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)",
      borderRadius: "10px", padding: "12px 14px", fontSize: "13px", color: "#fca5a5",
    }}>
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      {message}
    </div>
  );
}

// ── RIGHT PANEL WRAPPER ───────────────────────────────────────────
function RightPanel({ children }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", position: "relative", overflowY: "auto" }}>
      {/* Subtle center glow */}
      <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translateX(-50%)", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.05), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ width: "100%", maxWidth: "400px", position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ── LOGIN ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
export const Login = () => {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, isLoading, error, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      if (res.success) toast.success(res.message || "Logged in successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Invalid credentials");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', -apple-system, sans-serif", background: "#050A14" }}>
      <PremiumLeftPanel mode="login" />
      <RightPanel>
        <BackLink onClick={() => navigate("/")} />

        {/* Mobile logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }} className="lg:hidden">
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "15px", color: "#fff" }}>H</div>
          <span style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>HostelHub</span>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "30px", fontWeight: 900, color: "#f8fafc", letterSpacing: "-0.03em", marginBottom: "8px", lineHeight: 1.1 }}>
            Sign in to your account
          </h2>
          <p style={{ fontSize: "14px", color: "#334155" }}>
            New to HostelHub?{" "}
            <button onClick={() => navigate("/signup")} style={{ color: "#60a5fa", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "14px", letterSpacing: "-0.01em" }}>
              Create a free account →
            </button>
          </p>
        </div>



        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
          <PremiumInput
            label="Email address"
            id="email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#64748b" }}>Password</label>
              <button type="button" onClick={() => navigate("/reset")} style={{ fontSize: "12px", color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 500 }}>
                Forgot password?
              </button>
            </div>
            <PremiumInput
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              rightElement={<EyeToggle show={showPw} onToggle={() => setShowPw(!showPw)} />}
            />
          </div>

          <div style={{ marginTop: "4px" }}>
            <SubmitButton isLoading={isLoading} label="Sign in to HostelHub" loadingLabel="Signing in…" />
          </div>

          <ErrorBox message={error ? (error.response?.data?.message || "Invalid email or password.") : null} />
        </form>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#1e293b", marginTop: "28px", lineHeight: 1.6 }}>
          By signing in you agree to our{" "}
          <a href="#" style={{ color: "#334155", textDecoration: "underline" }}>Terms</a> &amp;{" "}
          <a href="#" style={{ color: "#334155", textDecoration: "underline" }}>Privacy Policy</a>
        </p>
      </RightPanel>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// ── SIGNUP ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════
export const Signup = () => {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const { signup, isLoading, error, googleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(form);
      toast.success(res?.message || "Account created!");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Something went wrong");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', -apple-system, sans-serif", background: "#050A14" }}>
      <PremiumLeftPanel mode="signup" />
      <RightPanel>
        <BackLink onClick={() => navigate("/")} />

        {/* Mobile logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }} className="lg:hidden">
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "15px", color: "#fff" }}>H</div>
          <span style={{ fontSize: "16px", fontWeight: 800, color: "#fff" }}>HostelHub</span>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{ fontSize: "30px", fontWeight: 900, color: "#f8fafc", letterSpacing: "-0.03em", marginBottom: "8px", lineHeight: 1.1 }}>
            Create your account
          </h2>
          <p style={{ fontSize: "14px", color: "#334155" }}>
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} style={{ color: "#60a5fa", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: "14px", letterSpacing: "-0.01em" }}>
              Sign in →
            </button>
          </p>
        </div>



        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
          <PremiumInput
            label="Full name"
            id="username"
            type="text"
            placeholder="Jane Doe"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />

          <PremiumInput
            label="Work email"
            id="email"
            type="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#64748b", marginBottom: "8px" }}>Password</label>
            <PremiumInput
              id="password"
              type={showPw ? "text" : "password"}
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              rightElement={<EyeToggle show={showPw} onToggle={() => setShowPw(!showPw)} />}
            />
          </div>

          {/* Password strength hint */}
          {form.password.length > 0 && (
            <div style={{ display: "flex", gap: "4px", marginTop: "-6px" }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  flex: 1, height: "3px", borderRadius: "2px",
                  background: form.password.length >= i * 2
                    ? form.password.length < 4 ? "#ef4444"
                    : form.password.length < 7 ? "#f59e0b"
                    : "#10b981"
                    : "rgba(255,255,255,0.08)",
                  transition: "background 0.3s ease",
                }} />
              ))}
            </div>
          )}

          <div style={{ marginTop: "4px" }}>
            <SubmitButton isLoading={isLoading} label="Create free account" loadingLabel="Creating account…" />
          </div>

          <ErrorBox message={error ? (error.response?.data?.message || "Failed to create account.") : null} />
        </form>

        <p style={{ textAlign: "center", fontSize: "12px", color: "#1e293b", marginTop: "24px", lineHeight: 1.6 }}>
          By creating an account you agree to our{" "}
          <a href="#" style={{ color: "#334155", textDecoration: "underline" }}>Terms</a> &amp;{" "}
          <a href="#" style={{ color: "#334155", textDecoration: "underline" }}>Privacy Policy</a>
        </p>
      </RightPanel>
    </div>
  );
};

export default Login;
