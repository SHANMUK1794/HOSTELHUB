import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const WelcomeSplash = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Start a 2-second timer as soon as this component loads
    const timer = setTimeout(() => {
      if (user?.role === "Warden") {
        navigate("/DashboardWarden", { replace: true });
      } else if (user?.role === "Kitchen branch" || user?.role === "Chef") {
        navigate("/KitchenDashboard", { replace: true });
      } else if (user?.role === "Staff") {
        navigate("/StaffDashboard", { replace: true });
      } else {
        // Admin / Owner
        if (!user?.tenantId) {
          navigate("/onboard", { replace: true });
        } else {
          navigate("/Dashboard", { replace: true });
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, user]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-900 to-indigo-900 font-sans">
      <div className="text-center z-10">
        <div className="text-6xl font-extrabold tracking-widest text-white animate-pulse bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent mb-4">
          HostelHub
        </div>
        <p className="text-teal-200 text-xl font-medium">Your workspace is loading...</p>
        <div className="mt-8 flex justify-center">
          <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSplash;
