import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "../../hooks/useNotification";
import {
  setSelectedBranch,
  setTenantBranches as setTenantBranchesAction,
} from "../../store/slice/BranchSlice";
import { logout } from "../../store/slice/LoginSlice";
import Notification from "./Notification";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { useTheme } from "../../hooks/ThemeContext";
import axiosInstance from "../../utils/AxiosInstance";

const Header = () => {
  const { theme } = useTheme();
  const { data: notifications = [] } = useNotifications();
  const user = useSelector((state) => state.auth?.user || null);
  const selectedBranch = useSelector(
    (state) => state.branch?.selectedBranch || "",
  );
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // ── States ──
  const [tenantBranches, setTenantBranches] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [isAddingBranch, setIsAddingBranch] = useState(false);

  // ── User ──
  const userRole = user?.role || "";
  const hideNotification = userRole === "Chef" || userRole === "Staff";
  const username = user?.name || localStorage.getItem("username") || "Unknown";
  const hasUnread = notifications.some((note) =>
    userRole === "Admin" ? !note.adminSeen : !note.wardenSeen,
  );

  const showKitchenPages = [
    "/Dashboard",
    "/Attendance",
    "/UsersAndRoles",
    "/Complaints",
    "/Certificates",
    "/staffAttendance",
    "/employee",
    "/payroll",
    "/AdvancePayments",
    "/dailyExpense",
    "/Amount",
  ];

  const hiddenTabPages = [
    "/StoreRoom",
    "/StoreRoomInventory",
    "/FinanceAndUtilities",
    "/AchievementView",
    "/StaffDashboard",
  ];
  const allowedRoles = ["Admin", "Staff"];
  const shouldShowTabs =
    allowedRoles.includes(userRole) &&
    !hiddenTabPages.includes(location.pathname);

  // ── Fetch branches ──
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const response = await axiosInstance.get("/api/tenant/v1/me");
        if (response.data.success && response.data.data?.branches) {
          let branches = response.data.data.branches.filter(
            (b) => b !== "Kitchen branch" && b !== "Office",
          );
          if (userRole !== "Admin" && user?.branchName) {
            branches = branches.filter((b) => b === user.branchName);
          }
          setTenantBranches(branches);
          dispatch(setTenantBranchesAction(branches));
          if (branches.length > 0) {
            const savedBranch = localStorage.getItem("activeBranch");
            const currentBranch = selectedBranch || savedBranch;
            if (!currentBranch || !branches.includes(currentBranch)) {
              dispatch(setSelectedBranch(branches[0]));
              localStorage.setItem("activeBranch", branches[0]);
            } else {
              dispatch(setSelectedBranch(currentBranch));
              localStorage.setItem("activeBranch", currentBranch);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch tenant", err);
      }
    };
    if (userRole) fetchTenant();
  }, [userRole, dispatch]);

  const allTabs = tenantBranches.map((branch, index) => ({
    id: index + 1,
    label: branch,
    value: branch,
  }));

  const tabs = allTabs.filter((tab) => {
    if (tab.value === "Kitchen branch")
      return showKitchenPages.includes(location.pathname);
    return true;
  });

  useEffect(() => {
    if (
      selectedBranch === "Kitchen branch" &&
      !showKitchenPages.includes(location.pathname)
    ) {
      if (tenantBranches.length > 0)
        dispatch(setSelectedBranch(tenantBranches[0]));
      else dispatch(setSelectedBranch(null));
    }
  }, [location.pathname, selectedBranch, dispatch, tenantBranches]);

  // ── Logout ──
  const handleLogout = () => {
    setShowConfirmModal(false);
    setShowLogoutPopup(false);
    queryClient.clear();
    dispatch(logout());
    navigate("/");
  };

  // ── Add branch ──
  const handleAddBranch = async () => {
    if (!newBranchName.trim()) return;
    try {
      setIsAddingBranch(true);
      const response = await axiosInstance.get("/api/tenant/v1/me");
      if (response.data.success && response.data.data) {
        const currentBranches = response.data.data.branches || [];
        if (currentBranches.includes(newBranchName.trim())) {
          alert("Branch already exists");
          setIsAddingBranch(false);
          return;
        }
        const updatedBranches = [...currentBranches, newBranchName.trim()];
        await axiosInstance.put("/api/tenant/v1/update", {
          branches: updatedBranches,
        });
        const filteredBranches = updatedBranches.filter(
          (b) => b !== "Kitchen branch" && b !== "Office",
        );
        setTenantBranches(filteredBranches);
        dispatch(setTenantBranchesAction(filteredBranches));
        dispatch(setSelectedBranch(newBranchName.trim()));
        localStorage.setItem("activeBranch", newBranchName.trim());
        setNewBranchName("");
        setShowAddBranchModal(false);
        setBranchDropdownOpen(false);
      }
    } catch (err) {
      console.error("Failed to add branch", err);
      alert("Failed to add branch");
    } finally {
      setIsAddingBranch(false);
    }
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 sm:left-[70px] lg:left-[220px] h-[87px] z-[9999] border-b rounded-bl-3xl rounded-br-3xl shadow-md px-3 sm:px-4 lg:px-6 transition-all duration-300"
      style={{
        backgroundColor: "var(--theme-card-bg)",
        borderColor: "var(--theme-filter-bg)",
      }}
    >
      <div className="flex items-center justify-end h-full">
        {/* ══════════════════════════════════════════
            MOBILE ONLY (< sm, under 640px)
            — User icon pinned to the RIGHT.
            — Clicking opens a dropdown menu with
              branch switcher + settings + logout.
            — No hamburger icon anywhere.
        ══════════════════════════════════════════ */}
        <div className="flex sm:hidden items-center gap-3 relative">
          {/* Notification bell */}
          {!hideNotification && (
            <button
              className="relative"
              onClick={() => setShowNotification(!showNotification)}
            >
              <img
                src={theme.images.notification}
                alt="notification"
                className="w-6 h-6"
                style={{ filter: theme?.darkMode ? "invert(1)" : "none" }}
              />
              {hasUnread && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full" />
              )}
            </button>
          )}

          {/* User icon — clicking opens the options dropdown */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <HiOutlineUserCircle
              className="w-10 h-10"
              style={{ color: "var(--theme-accent)" }}
            />
          </button>

          {/* Mobile dropdown — branch + settings + logout */}
          {mobileMenuOpen && (
            <div
              className="absolute top-14 right-0 w-[240px] rounded-[20px] shadow-xl z-50 border py-3"
              style={{
                backgroundColor: "var(--theme-card-bg)",
                borderColor: "var(--theme-filter-bg)",
              }}
            >
              {/* Username header */}
              <div
                className="flex items-center gap-3 px-4 pb-3 border-b"
                style={{ borderColor: "var(--theme-filter-bg)" }}
              >
                <HiOutlineUserCircle
                  className="w-8 h-8 flex-shrink-0"
                  style={{ color: "var(--theme-accent)" }}
                />
                <div className="overflow-hidden">
                  <p
                    className="font-semibold truncate"
                    style={{
                      color: "var(--theme-primary-text)",
                      fontSize: "var(--theme-font-body)",
                      fontFamily: "var(--theme-font-family-primary)",
                    }}
                  >
                    {username}
                  </p>
                  <p
                    className="text-[12px]"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    {userRole}
                  </p>
                </div>
              </div>

              {/* Branch list */}
              {shouldShowTabs && tabs.length > 0 && (
                <div className="px-3 pt-3 pb-1">
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wide px-1 mb-1"
                    style={{ color: "var(--theme-muted-text)" }}
                  >
                    Branch
                  </p>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        dispatch(setSelectedBranch(tab.value));
                        localStorage.setItem("activeBranch", tab.value);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium hover:opacity-80 transition"
                      style={{
                        color:
                          selectedBranch === tab.value
                            ? "var(--theme-accent)"
                            : "var(--theme-primary-text)",
                        backgroundColor:
                          selectedBranch === tab.value
                            ? "var(--theme-filter-bg)"
                            : "transparent",
                        fontFamily: "var(--theme-font-family-primary)",
                        fontSize: "var(--theme-font-body)",
                      }}
                    >
                      {tab.label}
                      {selectedBranch === tab.value && (
                        <span
                          className="text-xs"
                          style={{ color: "var(--theme-accent)" }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                  {userRole === "Admin" && (
                    <button
                      onClick={() => {
                        setShowAddBranchModal(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-3 py-2 rounded-xl font-semibold border mt-1 hover:opacity-80 transition"
                      style={{
                        color: "var(--theme-accent)",
                        borderColor: "var(--theme-accent)",
                        backgroundColor: "var(--theme-secondary-button-bg)",
                        fontFamily: "var(--theme-font-family-primary)",
                        fontSize: "var(--theme-font-body)",
                      }}
                    >
                      + Add New Branch
                    </button>
                  )}
                  <div
                    className="h-px mt-3"
                    style={{ backgroundColor: "var(--theme-filter-bg)" }}
                  />
                </div>
              )}

              {/* Settings */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/settings");
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:opacity-80 transition"
                style={{ color: "var(--theme-primary-text)" }}
              >
                <IoSettingsOutline
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "var(--theme-accent)" }}
                />
                <span
                  className="font-medium"
                  style={{
                    fontSize: "15px",
                    fontFamily: "var(--theme-font-family-primary)",
                  }}
                >
                  Settings
                </span>
              </button>

              {/* Logout */}
              <button
                onClick={() => {
                  setShowConfirmModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 transition"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--theme-filter-bg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <MdLogout className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span
                  className="font-medium text-red-500"
                  style={{
                    fontSize: "15px",
                    fontFamily: "var(--theme-font-family-primary)",
                  }}
                >
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            TABLET (sm → lg, 640px–1023px)
            — Full inline nav, no hamburger.
            — Branch dropdown + notification + user.
        ══════════════════════════════════════════ */}
        <div className="hidden sm:flex lg:hidden items-center gap-3 md:gap-4 relative">
          {/* Branch dropdown */}
          {shouldShowTabs && (
            <div className="relative">
              <button
                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                className="flex items-center justify-center font-medium w-[160px] md:w-[200px] h-[40px] rounded-[10px] px-3 gap-2"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                }}
              >
                <span
                  className="font-semibold truncate"
                  style={{
                    fontSize: "var(--theme-font-body)",
                    fontFamily: "var(--theme-font-family-primary)",
                  }}
                >
                  {selectedBranch || "Select Hostel"}
                </span>
                <img
                  src="https://asset.techjose.com/Hostelos/sidebarimages/vector.png"
                  alt="Dropdown"
                  className="w-3 h-3 flex-shrink-0"
                />
              </button>

              {branchDropdownOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-[220px] rounded-[20px] border shadow-lg z-[10000] overflow-hidden"
                  style={{
                    backgroundColor: "var(--theme-card-bg)",
                    borderColor: "var(--theme-filter-bg)",
                  }}
                >
                  {tabs
                    .filter((tab) => tab.value !== selectedBranch)
                    .map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          dispatch(setSelectedBranch(tab.value));
                          localStorage.setItem("activeBranch", tab.value);
                          setBranchDropdownOpen(false);
                        }}
                        className="block mx-auto my-2 w-[190px] h-[42px] rounded-3xl font-medium hover:opacity-80 transition"
                        style={{
                          color: "var(--theme-primary-text)",
                          fontSize: "var(--theme-font-body)",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  {userRole === "Admin" && (
                    <button
                      onClick={() => {
                        setShowAddBranchModal(true);
                        setBranchDropdownOpen(false);
                      }}
                      className="block mx-auto my-2 w-[190px] h-[42px] rounded-3xl font-semibold border transition hover:opacity-80"
                      style={{
                        color: "var(--theme-accent)",
                        borderColor: "var(--theme-accent)",
                        backgroundColor: "var(--theme-secondary-button-bg)",
                        fontSize: "var(--theme-font-body)",
                        fontFamily: "var(--theme-font-family-primary)",
                      }}
                    >
                      + Add New Branch
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Notification */}
          {!hideNotification && (
            <button
              className="relative"
              onClick={() => setShowNotification(!showNotification)}
            >
              <img
                src={theme.images.notification}
                alt="notification"
                className="w-6 h-6"
                style={{ filter: theme?.darkMode ? "invert(1)" : "none" }}
              />
              {hasUnread && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full" />
              )}
            </button>
          )}

          {/* User button */}
          <button
            className="flex items-center gap-2"
            onClick={() => setShowLogoutPopup(!showLogoutPopup)}
          >
            <HiOutlineUserCircle
              className="w-8 h-8"
              style={{ color: "var(--theme-accent)" }}
            />
            <p
              className="font-medium max-w-[100px] truncate"
              style={{
                fontSize: "var(--theme-font-body)",
                color: "var(--theme-primary-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              {username}
            </p>
          </button>

          {/* Tablet user dropdown */}
          {showLogoutPopup && (
            <div
              className="absolute top-14 right-0 w-[210px] rounded-[20px] flex flex-col items-center gap-1 py-3 shadow-lg z-[10000] border animate-fadeIn"
              style={{
                backgroundColor: "var(--theme-card-bg)",
                borderColor: "var(--theme-filter-bg)",
              }}
            >
              <button
                className="flex items-center gap-3 w-[175px] h-[42px] justify-center rounded-xl"
                style={{ color: "var(--theme-primary-text)" }}
              >
                <FaRegUser
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "var(--theme-accent)" }}
                />
                <span
                  className="font-semibold truncate"
                  style={{
                    fontFamily: "var(--theme-font-family-primary)",
                    fontSize: "var(--theme-font-small)",
                  }}
                >
                  {username}
                </span>
              </button>
              <div
                className="w-[150px] h-px my-1"
                style={{ backgroundColor: "var(--theme-filter-bg)" }}
              />
              <button
                onClick={() => {
                  setShowLogoutPopup(false);
                  navigate("/settings");
                }}
                className="flex items-center gap-3 w-[175px] h-[42px] justify-center rounded-xl hover:opacity-80 transition"
                style={{ color: "var(--theme-primary-text)" }}
              >
                <IoSettingsOutline
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color: "var(--theme-accent)" }}
                />
                <span
                  className="font-semibold"
                  style={{
                    fontFamily: "var(--theme-font-family-primary)",
                    fontSize: "var(--theme-font-small)",
                  }}
                >
                  Settings
                </span>
              </button>
              <button
                onClick={() => {
                  setShowLogoutPopup(false);
                  setShowConfirmModal(true);
                }}
                className="flex items-center gap-3 w-[175px] h-[42px] justify-center rounded-xl transition"
                style={{ color: "#ef4444" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--theme-filter-bg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <MdLogout className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span
                  className="font-semibold text-red-500"
                  style={{
                    fontFamily: "var(--theme-font-family-primary)",
                    fontSize: "var(--theme-font-small)",
                  }}
                >
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            DESKTOP (lg+)
            — Full nav unchanged.
        ══════════════════════════════════════════ */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          {/* Branch dropdown */}
          {shouldShowTabs && (
            <div className="relative">
              <button
                onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                className="flex items-center justify-center font-medium w-[200px] xl:w-[241px] h-[42px] xl:h-[45px] rounded-[10px] px-[15px] gap-2"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                }}
              >
                <span
                  className="font-semibold truncate"
                  style={{
                    fontSize: "var(--theme-font-body)",
                    fontFamily: "var(--theme-font-family-primary)",
                  }}
                >
                  {selectedBranch || "Select Hostel"}
                </span>
                <img
                  src="https://asset.techjose.com/Hostelos/sidebarimages/vector.png"
                  alt="Dropdown"
                  className="w-3 h-3 flex-shrink-0"
                />
              </button>

              {branchDropdownOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 mt-2 w-[260px] rounded-[20px] border shadow-lg z-[10000] overflow-hidden"
                  style={{
                    backgroundColor: "var(--theme-card-bg)",
                    borderColor: "var(--theme-filter-bg)",
                  }}
                >
                  {tabs
                    .filter((tab) => tab.value !== selectedBranch)
                    .map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          dispatch(setSelectedBranch(tab.value));
                          localStorage.setItem("activeBranch", tab.value);
                          setBranchDropdownOpen(false);
                        }}
                        className="block mx-auto my-2 w-[230px] h-[45px] rounded-3xl font-medium hover:opacity-80 transition"
                        style={{
                          color: "var(--theme-primary-text)",
                          fontSize: "var(--theme-font-body)",
                          fontFamily: "var(--theme-font-family-primary)",
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  {userRole === "Admin" && (
                    <button
                      onClick={() => {
                        setShowAddBranchModal(true);
                        setBranchDropdownOpen(false);
                      }}
                      className="block mx-auto my-2 w-[230px] h-[45px] rounded-3xl font-semibold border transition hover:opacity-80"
                      style={{
                        color: "var(--theme-accent)",
                        borderColor: "var(--theme-accent)",
                        backgroundColor: "var(--theme-secondary-button-bg)",
                        fontSize: "var(--theme-font-body)",
                        fontFamily: "var(--theme-font-family-primary)",
                      }}
                    >
                      + Add New Branch
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Notification + user area */}
          <div className="flex items-center gap-4 xl:gap-6 relative">
            {!hideNotification && (
              <button
                className="relative"
                onClick={() => setShowNotification(!showNotification)}
              >
                <img
                  src={theme.images.notification}
                  alt="notification"
                  className="w-7 h-7"
                  style={{ filter: theme?.darkMode ? "invert(1)" : "none" }}
                />
                {hasUnread && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full" />
                )}
              </button>
            )}

            {/* Username button */}
            <button
              className="flex items-center gap-2"
              onClick={() => setShowLogoutPopup(!showLogoutPopup)}
            >
              <HiOutlineUserCircle
                className="w-8 h-8"
                style={{ color: "var(--theme-accent)" }}
              />
              <p
                className="font-medium max-w-[120px] truncate"
                style={{
                  fontSize: "var(--theme-font-body)",
                  color: "var(--theme-primary-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              >
                {username}
              </p>
            </button>

            {/* Desktop user dropdown */}
            {showLogoutPopup && (
              <div
                className="absolute top-14 right-0 w-[220px] rounded-[20px] flex flex-col items-center gap-1 py-3 shadow-lg z-[10000] border animate-fadeIn"
                style={{
                  backgroundColor: "var(--theme-card-bg)",
                  borderColor: "var(--theme-filter-bg)",
                }}
              >
                <button
                  className="flex items-center gap-3 w-[180px] h-[42px] justify-center rounded-xl hover:opacity-80 transition"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  <FaRegUser
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: "var(--theme-accent)" }}
                  />
                  <span
                    className="font-semibold truncate"
                    style={{
                      fontFamily: "var(--theme-font-family-primary)",
                      fontSize: "var(--theme-font-small)",
                    }}
                  >
                    {username}
                  </span>
                </button>
                <div
                  className="w-[160px] h-px my-1"
                  style={{ backgroundColor: "var(--theme-filter-bg)" }}
                />
                <button
                  onClick={() => {
                    setShowLogoutPopup(false);
                    navigate("/settings");
                  }}
                  className="flex items-center gap-3 w-[180px] h-[42px] justify-center rounded-xl hover:opacity-80 transition"
                  style={{ color: "var(--theme-primary-text)" }}
                >
                  <IoSettingsOutline
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: "var(--theme-accent)" }}
                  />
                  <span
                    className="font-semibold"
                    style={{
                      fontFamily: "var(--theme-font-family-primary)",
                      fontSize: "var(--theme-font-small)",
                    }}
                  >
                    Settings
                  </span>
                </button>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="flex items-center gap-3 w-[180px] h-[42px] justify-center rounded-xl transition"
                  style={{ color: "#ef4444" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "var(--theme-filter-bg)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <MdLogout className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span
                    className="font-semibold text-red-500"
                    style={{
                      fontFamily: "var(--theme-font-family-primary)",
                      fontSize: "var(--theme-font-small)",
                    }}
                  >
                    Logout
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Notification popup ── */}
      {showNotification && (
        <div
          className="fixed inset-0 z-[10000]"
          onClick={() => setShowNotification(false)}
        >
          <div
            className="absolute top-[90px] right-3 sm:right-5"
            onClick={(e) => e.stopPropagation()}
          >
            <Notification />
          </div>
        </div>
      )}

      {/* ── Logout confirm modal ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-brightness-75 px-4 sm:px-6">
          <div
            className="relative w-full max-w-sm sm:max-w-md rounded-2xl p-5 sm:p-6 md:p-8 text-center shadow-2xl border"
            style={{
              backgroundColor: "var(--theme-card-bg)",
              borderColor: "var(--theme-filter-bg)",
            }}
          >
            <img
              src="https://asset.techjose.com/Hostelos/logoutImage.png"
              alt="Logout"
              className="w-16 sm:w-20 md:w-24 h-auto mx-auto mb-4 object-contain"
            />
            <h2
              className="text-[20px] font-bold"
              style={{
                color: "var(--theme-primary-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              Are you sure you want to logout?
            </h2>
            <p
              className="mt-2 text-sm sm:text-base"
              style={{ color: "var(--theme-muted-text)" }}
            >
              You will be returned to the login screen.
            </p>
            <div className="mt-6 flex justify-center gap-10">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setShowLogoutPopup(false);
                }}
                className="rounded-2xl border py-2 px-8 font-bold shadow-[0px_4px_8px_rgba(0,0,0,0.25)] hover:opacity-80 transition-all"
                style={{
                  backgroundColor: "var(--theme-secondary-button-bg)",
                  color: "var(--theme-secondary-button-text)",
                  borderColor: "var(--theme-filter-bg)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="rounded-full py-2 px-8 font-bold hover:opacity-90 shadow-[0px_4px_8px_rgba(0,0,0,0.35)] transition-all"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add branch modal ── */}
      {showAddBranchModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] backdrop-blur-sm bg-black/40">
          <div
            className="rounded-[20px] p-6 w-[90%] max-w-md shadow-xl border"
            style={{
              backgroundColor: "var(--theme-card-bg)",
              borderColor: "var(--theme-filter-bg)",
            }}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{
                color: "var(--theme-primary-text)",
                fontFamily: "var(--theme-font-family-primary)",
              }}
            >
              Add New Branch
            </h2>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--theme-muted-text)" }}
            >
              Enter the name of your new Hostel or PG branch.
            </p>
            <input
              type="text"
              placeholder="e.g. Royal Residency PG"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddBranch()}
              className="w-full h-[45px] rounded-xl border px-4 outline-none mb-6"
              style={{
                fontFamily: "var(--theme-font-family-primary)",
                borderColor: "var(--theme-filter-bg)",
                backgroundColor: "var(--theme-filter-bg)",
                color: "var(--theme-primary-text)",
              }}
              autoFocus
            />
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddBranchModal(false);
                  setNewBranchName("");
                }}
                className="px-5 py-2 rounded-xl font-medium transition-colors hover:opacity-80"
                style={{
                  color: "var(--theme-muted-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
                disabled={isAddingBranch}
              >
                Cancel
              </button>
              <button
                onClick={handleAddBranch}
                disabled={isAddingBranch || !newBranchName.trim()}
                className="px-5 py-2 rounded-xl font-medium hover:opacity-90 transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: "var(--theme-button-bg)",
                  color: "var(--theme-button-text)",
                  fontFamily: "var(--theme-font-family-primary)",
                }}
              >
                {isAddingBranch ? "Adding..." : "Add Branch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
