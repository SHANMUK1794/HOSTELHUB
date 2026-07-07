import axiosInstance from "../utils/AxiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const useDashboard = () => {
  const queryClient = useQueryClient();

  // ✅ Safe destructuring (prevents null crash)
  const user = useSelector((state) => state.auth?.user || {});
  const selectedBranch = useSelector((state) => state.branch?.selectedBranch || null);

  // ✅ Determine the branchName cleanly
  const branchName =
    user?.role === "Admin"
      ? selectedBranch
      : user?.branchName || null;

  // ✅ React Query fetcher (never conditional)
  const fetchDashboardData = async () => {
    const currentBranch = branchName || "Default Branch"; // fallback
    const url = `/api/v1/dashboard/?branchName=${encodeURIComponent(currentBranch)}`;
    const response = await axiosInstance.get(url);
    return response.data;
  };

  // ✅ Always define useQuery once (no condition)
  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ["dashboardData", branchName],
    queryFn: fetchDashboardData,
    enabled: !!branchName, // Safe flag
  });

  return {
    data,
    refetch,
    isLoading,
    isError,
  };
};

export default useDashboard;
