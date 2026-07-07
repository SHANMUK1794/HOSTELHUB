import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Import all dashboards
import Dashboard from "./Dashboard";
import DashboardWarden from "./DashboardWarden";
import KitchenDashboard from "./KitchenDashboard";
import StaffDashboard from "./StaffDashboard";

const DashboardController = () => {
  // Get the real user from Redux
  const { user } = useSelector((state) => state.auth);

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Normalize the role for the switch statement (prevents capitalization bugs)
  const activeRole = user?.role?.toLowerCase();

  // Render the correct dashboard based on the user's actual role
  const renderDashboard = () => {
    switch (activeRole) {
      case "admin":
        return <Dashboard />;
      case "warden":
        return <DashboardWarden />;
      case "chef":
      case "kitchen branch":
        return <KitchenDashboard />;
      case "staff":
        return <StaffDashboard />;
      default:
        return (
          <div className="flex justify-center items-center h-screen text-xl font-bold text-red-500 bg-white dark:bg-gray-950">
            Unauthorized Role: {user?.role || "Unknown"}. Please contact Admin.
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen">
      {renderDashboard()}
    </div>
  );
};

export default DashboardController;