import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Shield, 
  Users, 
  Building, 
  Coffee, 
  DollarSign, 
  TrendingUp,
  ChevronRight,
  Zap,
  CheckCircle
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Building,
      title: "Room & Bed Allocation",
      desc: "Isolated multi-branch setups to easily view, allocate, and manage rooms and PG categories."
    },
    {
      icon: Users,
      title: "Resident Manager",
      desc: "Onboard residents, track join dates, upload IDs, and manage food preference schedules."
    },
    {
      icon: Coffee,
      title: "Kitchen & Meal Logs",
      desc: "Live meal summary trackers, veg vs non-veg indicators, and detailed kitchen stock logs."
    },
    {
      icon: DollarSign,
      title: "Automated Billing & Fees",
      desc: "Automatic monthly rent invoices, due tracking, and transparent daily expense reports."
    },
    {
      icon: TrendingUp,
      title: "Staff & Payroll Manager",
      desc: "Track employee shifts, record daily attendance, and process payroll with advance stubs."
    },
    {
      icon: Shield,
      title: "Role-Based Access Control",
      desc: "Completely secure custom access views for Admins, Wardens, Chefs, and Staff members."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-indigo-950 text-white font-sans overflow-x-hidden selection:bg-teal-500 selection:text-white">
      {/* ── Navbar ── */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-900 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-teal-500/20">
            H
          </div>
          <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-teal-200 to-teal-400 bg-clip-text text-transparent">
            HostelHub
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/login")}
            className="text-teal-300 font-semibold hover:text-white px-4 py-2 rounded-xl transition-all duration-300 active:scale-95"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-teal-400/20 hover:scale-[1.03] transition-all duration-300 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Hero */}
          <div className="lg:col-span-7 flex flex-col space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-1.5 rounded-full w-fit">
              <Zap size={16} className="text-teal-400 animate-pulse" />
              <span className="text-sm font-semibold text-teal-300 tracking-wide">
                Next-Gen PostgreSQL SaaS
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-white">
              Hostel Management, <br />
              <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Redefined.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed">
              HostelHub provides a modern, fast, and secure PostgreSQL-powered workspace to manage residents, rooms, inventory, and finances in one beautifully integrated dashboard.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => navigate("/signup")}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-900 font-bold px-8 py-4 rounded-2xl shadow-xl shadow-teal-500/25 hover:shadow-teal-400/35 hover:scale-[1.03] transition-all duration-300 flex items-center gap-2 active:scale-95 group"
              >
                <span>Launch Your Hub</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate("/login")}
                className="bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 font-bold px-8 py-4 rounded-2xl transition-all duration-300 active:scale-95 text-white flex items-center gap-2"
              >
                <span>Administrator Login</span>
                <ChevronRight size={18} className="text-slate-400" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
              <div>
                <p className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">50+</p>
                <p className="text-sm text-slate-400 mt-1">Hubs Active</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">10k+</p>
                <p className="text-sm text-slate-400 mt-1">Residents Managed</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">99.9%</p>
                <p className="text-sm text-slate-400 mt-1">Uptime SLA</p>
              </div>
            </div>
          </div>

          {/* Right Hero: Floating Cards Simulation */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] aspect-[4/5] bg-gradient-to-tr from-teal-500/10 to-indigo-500/10 border border-white/10 rounded-[40px] p-6 backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-2xl">
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/25 rounded-full filter blur-[60px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/25 rounded-full filter blur-[60px]" />

              <div className="flex justify-between items-start z-10">
                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
                  <Building className="text-teal-400" size={28} />
                </div>
                <span className="bg-teal-500/20 text-teal-300 font-semibold px-3 py-1 rounded-full text-xs">
                  Active Subscription
                </span>
              </div>

              <div className="space-y-4 z-10">
                <p className="text-xs font-semibold text-teal-400 tracking-widest uppercase">Live Workspace</p>
                <h3 className="text-3xl font-bold tracking-tight">HostelHub Dashboard</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <CheckCircle size={18} className="text-teal-400" />
                    <span className="text-sm text-slate-200">92% Average Occupancy Rate</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <CheckCircle size={18} className="text-teal-400" />
                    <span className="text-sm text-slate-200">Meal summaries compiled for Warden</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <CheckCircle size={18} className="text-teal-400" />
                    <span className="text-sm text-slate-200">Payroll stubs auto-generated</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4 z-10">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs font-bold">A</div>
                  <div className="w-8 h-8 rounded-full bg-teal-600 border-2 border-slate-900 flex items-center justify-center text-xs font-bold">W</div>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-xs font-bold">C</div>
                </div>
                <span className="text-xs text-slate-400">Manage multiple branches</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Features Grid ── */}
        <section className="pt-32 pb-16">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              One Platform. Every Workflow.
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Everything you need to manage your PG or hostel operations, optimized for Postgres speed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white/5 border border-white/5 hover:border-teal-500/25 p-8 rounded-3xl hover:bg-white/[0.08] transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="bg-teal-500/10 text-teal-400 p-3 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mt-6 mb-3 text-white">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-12 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} HostelHub. Prepared for the Hackathon.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
