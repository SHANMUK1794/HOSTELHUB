import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/ThemeContext";
import {
  LayoutDashboard,
  FileText,
  Home,
  Utensils,
  ClipboardCheck,
  CalendarCheck,
  Plane,
  TrendingUp,
  Users,
  AlertTriangle,
  Cake,
  Boxes,
  Award,
  Trophy,
  Trash2,
  Menu,
  X
} from "lucide-react";

const Sidebar = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [isTabletMode, setIsTabletMode] = useState(
    window.innerWidth > 555 && window.innerWidth < 1024,
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 555);
  const location = useLocation();
  const { theme } = useTheme();

  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);

  const sidebarRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  let authUser = useSelector((state) => state.auth.user);
  let user = authUser;
  if (!user) {
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      console.error("Error parsing user from localStorage", error);
    }
  }

  const userRole = user?.role;
  const userName = user?.staffName || user?.username || "H";
  const userInitial = userName.charAt(0).toUpperCase();

  const allMenuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path:
        userRole?.toLowerCase() === "warden"
          ? "/DashboardWarden"
          : userRole?.toLowerCase() === "chef"
            ? "/KitchenDashboard"
            : userRole?.toLowerCase() === "staff"
              ? "/StaffDashboard"
              : "/Dashboard",
      roles: ["admin", "warden", "chef", "staff"],
    },
    {
      name: "Register",
      icon: FileText,
      path: "/StudentDetails",
      roles: ["admin", "warden"],
    },
    {
      name: "Rooms",
      icon: Home,
      path: "/RoomsAndResidents",
      roles: ["admin", "warden"],
    },
    {
      name: "Kitchen",
      icon: Utensils,
      path: "/KitchenLanding",
      roles: ["chef", "admin", "staff"],
    },
    {
      name: "Staff Attendance",
      icon: ClipboardCheck,
      path: "/staffAttendance",
      roles: ["chef", "staff"],
    },
    {
      name: "Attendance",
      icon: CalendarCheck,
      path: "/Attendance",
      roles: ["admin", "warden", ""],
    },
    {
      name: "Vacation",
      icon: Plane,
      path: "/Vacation",
      roles: ["admin", "warden"],
    },
    {
      name: "Finance",
      icon: TrendingUp,
      path: "/FinanceAndUtilities",
      roles: ["admin", "warden", "chef"],
    },
    {
      name: "Users & Roles",
      icon: Users,
      path: "/UsersAndRoles",
      roles: ["admin"],
    },
    {
      name: "Complaints",
      icon: AlertTriangle,
      path: "/Complaints",
      roles: ["admin", "warden", "chef", "staff"],
    },
    {
      name: "Birthdays",
      icon: Cake,
      path: "/Reminders",
      roles: ["admin", "warden"],
    },
    {
      name: "Store Room",
      icon: Boxes,
      path: "/StoreRoom",
      roles: ["admin", "staff"],
    },
    {
      name: "Certificates",
      icon: Award,
      path: "/Certificates",
      roles: ["admin", "chef"],
    },
    {
      name: "Achievements",
      icon: Trophy,
      path: "/Achievements",
      roles: ["admin", "warden"],
    },
    {
      name: "Recycle Bin",
      icon: Trash2,
      path: "/recycleBin",
      roles: ["admin"],
    },
  ];

  const menuItems = allMenuItems.filter((item) =>
    userRole ? item.roles.includes(userRole.toLowerCase()) : true,
  );

  const handleResize = () => {
    const width = window.innerWidth;
    const desktop = width >= 1024;
    const tablet = width > 555 && width < 1024;
    const mobile = width <= 555;

    setIsDesktop(desktop);
    setIsTabletMode(tablet);
    setIsMobile(mobile);

    if (desktop) {
      setIsCollapsed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (isTabletMode || isMobile) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !isCollapsed
      ) {
        setIsCollapsed(true);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCollapsed, isTabletMode, isMobile]);

  return (
    <div
      ref={sidebarRef}
      className={`
        fixed top-0 left-0
        ${!(isMobile && isCollapsed) ? "bottom-0 shadow-xl" : "bg-transparent"}
        flex flex-col
        transition-all duration-300 ease-in-out
        z-[9999]
        border-r border-white/5
        ${
          isDesktop
            ? "w-[220px] 2xl:w-[210px]"
            : isCollapsed
              ? isMobile
                ? "w-auto h-auto"
                : "w-[70px]"
              : "w-[240px] h-full"
        }
      `}
      style={{ backgroundColor: "var(--theme-sidebar-bg)" }}
    >
      <nav className="mt-2 px-1 flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-4">
        {/* Toggle Button */}
        {(isTabletMode || isMobile) && (
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-end"
            } px-4 py-3`}
          >
            <button
              onClick={handleCollapse}
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 active:scale-95 text-white/80 hover:text-white"
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>
        )}

        {/* ── Logo ── */}
        {!(isMobile && isCollapsed) && (
          <div
            className={`flex items-center justify-center transition-all duration-300 ${
              isCollapsed ? "px-2 py-4" : "px-4 py-5"
            }`}
          >
            {isCollapsed ? (
              <span className="text-xl font-bold text-white tracking-wider bg-teal-600 w-8 h-8 rounded-lg flex items-center justify-center">HH</span>
            ) : (
              <span className="text-xl font-extrabold tracking-widest text-white flex items-center gap-1.5">
                <span className="bg-teal-600 text-white w-7 h-7 rounded flex items-center justify-center text-sm font-bold">H</span>
                <span>ostelHub</span>
              </span>
            )}
          </div>
        )}
        {isDesktop && <div className="shrink-0 h-2" /> }

        {/* Menu Items */}
        {!(isMobile && isCollapsed) &&
          menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.name} to={item.path} className="shrink-0">
                {({ isActive }) => (
                  <div
                    className="group relative text-[16px] 2xl:text-[15px] flex items-center gap-3 w-full mb-1 py-2 px-3 rounded-[10px] transition-colors duration-300 ease-in-out"
                    style={{
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.18)"
                        : hoveredItem === item.name
                          ? "rgba(255,255,255,0.10)"
                          : "transparent",
                      color: "#FFFFFF",
                    }}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Icon className="w-5 h-5 2xl:w-4 2xl:h-4 text-white opacity-85 group-hover:opacity-100 transition-opacity" />
                    {!isCollapsed && (
                      <span
                        className="text-sm 2xl:text-[13px] font-medium"
                        style={{
                          fontFamily: "var(--theme-font-family-primary)",
                          color: "#FFFFFF",
                        }}
                      >
                        {item.name}
                      </span>
                    )}
                    {isCollapsed && (isTabletMode || isMobile) && (
                      <span
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
                        style={{
                          backgroundColor: "var(--theme-sidebar-bg)",
                          color: "#FFFFFF",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        {item.name}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
      </nav>
    </div>
  );
};

export default Sidebar;
