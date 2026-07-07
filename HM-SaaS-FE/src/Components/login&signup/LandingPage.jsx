import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const features = [
    { icon: "🏢", title: "Room & Bed Allocation", desc: "Smart multi-branch room management with real-time availability views.", span: "col-span-1 row-span-2" },
    { icon: "👥", title: "Resident Lifecycle", desc: "Onboard, manage, and offboard with full history.", span: "col-span-1" },
    { icon: "🍽️", title: "Kitchen & Meals", desc: "Daily preference tracking and live inventory.", span: "col-span-1" },
    { icon: "💳", title: "Automated Billing", desc: "Invoices, dues, and advance management on autopilot.", span: "col-span-2" },
    { icon: "📊", title: "Payroll & Staff", desc: "Full payroll processing with attendance tracking.", span: "col-span-1" },
    { icon: "🔐", title: "Role-Based Access", desc: "Granular permissions for every role.", span: "col-span-1" },
  ];

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
        background: "#050A14",
      }}
    >
      {/* Mouse-following spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(29,78,216,0.06), transparent 50%)`,
        }}
      />

      {/* Static ambient blobs */}
      <div className="pointer-events-none fixed z-0" style={{ top: "-200px", left: "-100px", width: "700px", height: "700px", background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 65%)", borderRadius: "50%" }} />
      <div className="pointer-events-none fixed z-0" style={{ top: "40%", right: "-150px", width: "600px", height: "600px", background: "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 65%)", borderRadius: "50%" }} />
      <div className="pointer-events-none fixed z-0" style={{ bottom: "10%", left: "25%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 65%)", borderRadius: "50%" }} />

      {/* Subtle noise texture overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
      }} />

      {/* ── NAVBAR ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(5,10,20,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div className="flex items-center justify-between" style={{ height: "72px" }}>
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
              <div
                className="flex items-center justify-center font-black text-white text-lg"
                style={{
                  width: "38px", height: "38px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                  boxShadow: "0 0 20px rgba(37,99,235,0.3)",
                }}
              >H</div>
              <span className="font-bold text-[17px] tracking-tight text-white">
                Hostel<span style={{ color: "#60a5fa" }}>Hub</span>
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {["Features", "How it works", "Pricing"].map(l => (
                <a key={l} href="#" className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-150">{l}</a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >Sign in</button>
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 4px 16px rgba(37,99,235,0.25)",
                }}
              >Get started free →</button>
            </div>

            <button className="md:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: "rgba(5,10,20,0.98)", backdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "16px 24px 24px" }}>
            {["Features", "How it works", "Pricing"].map(l => (
              <a key={l} href="#" className="block py-3 text-slate-300 text-sm border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>{l}</a>
            ))}
            <div className="flex flex-col gap-3 mt-5">
              <button onClick={() => navigate("/login")} className="w-full py-3 text-sm font-medium text-white rounded-xl border" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>Sign in</button>
              <button onClick={() => navigate("/signup")} className="w-full py-3 text-sm font-semibold text-white rounded-xl" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>Get started free</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center text-center" style={{ paddingTop: "160px", paddingBottom: "100px", paddingLeft: "24px", paddingRight: "24px" }}>
        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-2.5 mb-7 rounded-full px-4 py-2"
          style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)" }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-blue-300 text-xs font-semibold tracking-wider uppercase">All-in-one Hostel SaaS Platform</span>
        </div>

        {/* Main heading */}
        <h1 style={{ fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.04em", maxWidth: "900px", marginBottom: "28px" }}>
          Manage your hostel<br />
          <span style={{ background: "linear-gradient(90deg, #60a5fa 0%, #818cf8 40%, #c084fc 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            like never before.
          </span>
        </h1>

        {/* Subheadline */}
        <p style={{ fontSize: "18px", color: "#94a3b8", lineHeight: 1.7, maxWidth: "540px", marginBottom: "44px" }}>
          Rooms, residents, kitchen, billing, payroll — unified in one beautiful, PostgreSQL-powered platform built for serious hostel operators.
        </p>

        {/* CTA Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/signup")}
            className="group flex items-center gap-2.5 font-semibold text-white rounded-2xl transition-all duration-200 hover:scale-[1.03] active:scale-95"
            style={{
              padding: "16px 32px", fontSize: "16px",
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(37,99,235,0.3), 0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            Start for free
            <svg className="group-hover:translate-x-0.5 transition-transform" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 font-medium transition-all duration-200 hover:text-white"
            style={{ padding: "16px 28px", fontSize: "15px", color: "#94a3b8", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }}
          >
            Sign in to dashboard
          </button>
        </div>

        <p style={{ fontSize: "13px", color: "#475569" }}>No credit card required · Setup in under 5 minutes</p>

        {/* ── DASHBOARD MOCKUP ── */}
        <div className="relative w-full mt-20" style={{ maxWidth: "1100px" }}>
          {/* Glow below card */}
          <div style={{ position: "absolute", bottom: "-40px", left: "50%", transform: "translateX(-50%)", width: "70%", height: "80px", background: "rgba(37,99,235,0.15)", filter: "blur(40px)", borderRadius: "50%", zIndex: 0 }} />

          {/* Card */}
          <div
            className="relative rounded-[28px] overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(15,25,50,0.9), rgba(10,18,38,0.95))",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <div className="flex gap-1.5">
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28c840" }} />
              </div>
              <div className="flex-1 flex justify-center">
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "8px", padding: "4px 20px", fontSize: "11px", color: "#64748b" }}>
                  app.hostelhub.io/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard UI */}
            <div className="flex" style={{ height: "420px" }}>
              {/* Sidebar */}
              <div style={{ width: "64px", background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.04)", padding: "16px 10px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, marginBottom: "12px" }}>H</div>
                {[
                  { color: "#3b82f6", active: true },
                  { color: "#64748b" }, { color: "#64748b" }, { color: "#64748b" }, { color: "#64748b" }, { color: "#64748b" },
                ].map((item, i) => (
                  <div key={i} style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    background: item.active ? "rgba(59,130,246,0.15)" : "transparent",
                    border: item.active ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: item.color, opacity: item.active ? 1 : 0.35 }} />
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div style={{ flex: 1, padding: "20px", overflow: "hidden" }}>
                {/* Top row header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#f1f5f9", marginBottom: "2px" }}>Good morning, Admin 👋</div>
                    <div style={{ fontSize: "11px", color: "#475569" }}>Here's what's happening today</div>
                  </div>
                  <div className="flex gap-2">
                    {["Export", "New Resident"].map((t, i) => (
                      <div key={i} style={{
                        padding: "6px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: 600,
                        background: i === 1 ? "linear-gradient(135deg,#2563eb,#7c3aed)" : "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.07)", color: i === 1 ? "#fff" : "#94a3b8",
                      }}>{t}</div>
                    ))}
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Total Residents", value: "247", delta: "+12", col: "#3b82f6" },
                    { label: "Rooms Occupied", value: "92%", delta: "+3%", col: "#10b981" },
                    { label: "Monthly Revenue", value: "₹4.8L", delta: "+18%", col: "#8b5cf6" },
                    { label: "Pending Dues", value: "₹23k", delta: "-5%", col: "#f59e0b" },
                  ].map((card, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "14px" }}>
                      <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{card.label}</div>
                      <div style={{ fontSize: "22px", fontWeight: 800, color: "#f1f5f9", marginBottom: "6px" }}>{card.value}</div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, color: card.col, background: `${card.col}18`, padding: "2px 8px", borderRadius: "20px" }}>
                        {card.delta}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Chart area */}
                  <div style={{ gridColumn: "span 2", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "14px" }}>
                    <div className="flex items-center justify-between mb-3">
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8" }}>Revenue Trend</span>
                      <span style={{ fontSize: "10px", color: "#475569" }}>Last 12 months</span>
                    </div>
                    <div className="flex items-end gap-1.5" style={{ height: "80px" }}>
                      {[30, 50, 40, 65, 55, 75, 60, 80, 70, 90, 78, 100].map((h, i) => (
                        <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "4px 4px 0 0", background: i === 11 ? "linear-gradient(180deg,#3b82f6,#7c3aed)" : "rgba(59,130,246,0.15)", transition: "height 0.3s ease" }} />
                      ))}
                    </div>
                  </div>

                  {/* Activity */}
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "14px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", marginBottom: "12px" }}>Live Activity</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {[
                        { text: "Room 204 allocated", dot: "#3b82f6", time: "2m" },
                        { text: "Invoice #1892 paid", dot: "#10b981", time: "15m" },
                        { text: "180 meals logged", dot: "#f59e0b", time: "1h" },
                        { text: "Payroll processed", dot: "#8b5cf6", time: "3h" },
                      ].map((a, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.dot, flexShrink: 0 }} />
                          <span style={{ fontSize: "10px", color: "#64748b", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.text}</span>
                          <span style={{ fontSize: "10px", color: "#334155" }}>{a.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS STRIP ── */}
      <div className="relative z-10 py-10" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <p className="text-center mb-8" style={{ fontSize: "12px", color: "#334155", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>Trusted by hostel operators across India</p>
        <div className="flex flex-wrap justify-center items-center gap-10 px-6">
          {["SkyNest PG", "Urban Stays", "ColiveHub", "DormPro", "NestEasy", "BedBase", "QuickStay"].map((name) => (
            <span key={name} style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b", letterSpacing: "0.05em" }}>{name}</span>
          ))}
        </div>
      </div>

      {/* ── FEATURES BENTO GRID ── */}
      <section className="relative z-10 py-28 px-6">
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(37,99,235,0.07)", border: "1px solid rgba(37,99,235,0.15)", color: "#60a5fa" }}>
              Platform Capabilities
            </div>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "16px" }}>
              Everything in one place
            </h2>
            <p style={{ color: "#64748b", fontSize: "17px", maxWidth: "480px", margin: "0 auto" }}>
              Replace your scattered spreadsheets and manual processes with a single powerful platform.
            </p>
          </div>

          {/* Bento grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { icon: "🏢", title: "Room & Bed Management", desc: "Allocate and track rooms across all branches. Real-time occupancy overview with color-coded status.", col: "span 1", row: "span 2", accent: "#3b82f6" },
              { icon: "💳", title: "Automated Billing", desc: "Monthly rent invoices auto-generated, due alerts, advance adjustments.", col: "span 2", row: "span 1", accent: "#8b5cf6" },
              { icon: "👥", title: "Resident Manager", desc: "Full resident lifecycle — onboarding to exit.", col: "span 1", row: "span 1", accent: "#10b981" },
              { icon: "🍽️", title: "Kitchen Operations", desc: "Track meal counts, manage menu and food inventory daily.", col: "span 1", row: "span 1", accent: "#f59e0b" },
              { icon: "📈", title: "Staff & Payroll", desc: "Attendance, shifts, salary processing and advance stubs.", col: "span 1", row: "span 1", accent: "#ec4899" },
              { icon: "🔐", title: "Role-Based Access", desc: "Separate secure views for Admin, Warden, Chef, Staff.", col: "span 1", row: "span 1", accent: "#6366f1" },
            ].map((feat, i) => (
              <div
                key={i}
                className="group relative rounded-3xl p-7 overflow-hidden cursor-default transition-all duration-300"
                style={{
                  gridColumn: feat.col, gridRow: feat.row,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  minHeight: "160px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${feat.accent}30`;
                  e.currentTarget.style.background = `rgba(255,255,255,0.04)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${feat.accent}40, transparent)` }} />
                <div style={{ fontSize: "28px", marginBottom: "16px" }}>{feat.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f1f5f9", marginBottom: "8px" }}>{feat.title}</h3>
                <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-24 px-6">
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="text-center mb-16">
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "12px" }}>
              Up and running in <span style={{ color: "#60a5fa" }}>minutes</span>
            </h2>
            <p style={{ color: "#64748b", fontSize: "16px" }}>No lengthy onboarding. No consultants. Just sign up and go.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {[
              { n: "01", title: "Create your account", desc: "Sign up, set up your hostel profile, add branches and room categories in minutes." },
              { n: "02", title: "Add your residents & staff", desc: "Import existing data or manually add residents, assign rooms, configure billing cycles." },
              { n: "03", title: "Manage everything from one dashboard", desc: "Billing, kitchen, payroll, complaints, and analytics — all live and always in sync." },
            ].map((step, i) => (
              <div key={i} className="flex gap-8 items-start py-8" style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#1e3a8a", minWidth: "36px", paddingTop: "3px" }}>{step.n}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#f1f5f9", marginBottom: "8px" }}>{step.title}</h3>
                  <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.65 }}>{step.desc}</p>
                </div>
                <div style={{ fontSize: "28px", paddingTop: "4px" }}>
                  {["🚀", "📋", "🎯"][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="relative z-10 py-24 px-6">
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="text-center mb-14">
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="#fbbf24"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em" }}>
              Real operators. Real results.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            {[
              { name: "Suresh Kumar", role: "PG Owner, Hyderabad · 3 properties", text: "HostelHub completely transformed how I manage my PGs. Billing automation alone saves me 10+ hours every month.", init: "SK" },
              { name: "Priya Nair", role: "Hostel Warden, Bangalore", text: "Role-based access is perfect. My chef sees kitchen. My warden sees rooms. Zero confusion, maximum efficiency.", init: "PN" },
              { name: "Arun Mehta", role: "Operations Manager · 6 branches", text: "Payroll for 50+ staff used to take 2 days. Now it's done in under an hour. I can't imagine going back.", init: "AM" },
            ].map((t, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px", padding: "28px" }}>
                <p style={{ fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, marginBottom: "24px" }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "12px", fontSize: "13px", fontWeight: 800, color: "#fff",
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{t.init}</div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#f1f5f9" }}>{t.name}</p>
                    <p style={{ fontSize: "12px", color: "#475569" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-24 px-6 pb-32">
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <div
            className="rounded-[40px] relative overflow-hidden"
            style={{
              padding: "80px 48px",
              background: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(124,58,237,0.1) 50%, rgba(14,165,233,0.08) 100%)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            <div style={{ position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "300px", height: "200px", background: "radial-gradient(ellipse, rgba(37,99,235,0.2), transparent 70%)", filter: "blur(30px)" }} />
            <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "16px", position: "relative" }}>
              Ready to take control?
            </h2>
            <p style={{ color: "#64748b", fontSize: "17px", marginBottom: "40px", position: "relative" }}>
              Join hostel operators who run smarter with HostelHub. Start free, upgrade anytime.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4" style={{ position: "relative" }}>
              <button
                onClick={() => navigate("/signup")}
                className="font-semibold text-white rounded-2xl transition-all duration-200 hover:scale-[1.03] active:scale-95"
                style={{
                  padding: "16px 36px", fontSize: "16px",
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                  boxShadow: "0 8px 32px rgba(37,99,235,0.35), 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >Get started — it's free</button>
              <button
                onClick={() => navigate("/login")}
                className="font-medium transition-all duration-200 hover:text-white"
                style={{ padding: "16px 28px", fontSize: "15px", color: "#64748b", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" }}
              >Sign in to your account</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 px-6 pb-12" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", paddingTop: "40px" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800 }}>H</div>
              <span style={{ fontSize: "15px", fontWeight: 700 }}>HostelHub</span>
            </div>
            <div className="flex flex-wrap justify-center gap-7">
              {["Privacy", "Terms", "Support", "Docs", "Status"].map(l => (
                <a key={l} href="#" style={{ fontSize: "13px", color: "#334155" }} className="hover:text-slate-400 transition-colors">{l}</a>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "#1e293b" }}>&copy; {new Date().getFullYear()} HostelHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
