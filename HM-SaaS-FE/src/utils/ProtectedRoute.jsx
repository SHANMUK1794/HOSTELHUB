import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation(); // Captures the route the user is trying to access

  // 1. Safely parse localStorage to prevent app crashes
  let localUser = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      localUser = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    // Optionally clear corrupted data: localStorage.removeItem("user");
  }

  // Get user role from Redux or localStorage safely
  const role = user?.role?.toLowerCase() || localUser?.role?.toLowerCase();

  // 2. If user is not logged in
  if (!token) {
    // Pass the attempted location in state so you can redirect them back after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. If route is restricted and user lacks the required role
  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    const roleBasedRedirects = {
      admin: "/Dashboard",
      warden: "/DashboardWarden", 
      chef: "/KitchenDashboard",
      staff: "/StaffDashboard",
    };

    // Redirect to their specific dashboard, or back to login if role is completely unknown
    const fallbackPath = roleBasedRedirects[role] || "/";

    return <Navigate to={fallbackPath} replace />;
  }

  // Access granted
  return children;
};

export default ProtectedRoute;

