import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

export const useNotifications = () => {
  const role = useSelector((state) => state.auth?.user?.role);

  const selectedBranch = useSelector(
    (state) => state.branch?.selectedBranch
  );

  const userBranch = useSelector(
    (state) => state.auth?.user?.branchName
  );

  const branchName =
    role === "Admin"
      ? selectedBranch
      : userBranch;

  const queryClient = useQueryClient();

  const fetchNotifications = async () => {
    if (!branchName) return [];

    const url =
      role === "Admin"
        ? ApiRoutes.NOTIFY.GET_BY_BRANCH(branchName)
        : ApiRoutes.NOTIFY.GET_ALL;

    const response = await axiosInstance.get(url);

    const notifications = response?.data?.data || [];

    return notifications.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
  };

  const query = useQuery({
    queryKey: ["notifications", role, branchName],
    queryFn: fetchNotifications,
    enabled: !!role && !!branchName,

    // Refresh notifications automatically
    refetchInterval: 30000, // 30 sec
    refetchIntervalInBackground: true,

    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,

    staleTime: 0,
  });

  const markSingleSeen = useMutation({
    mutationFn: (id) =>
      axiosInstance.put(
        ApiRoutes.NOTIFY.SEEN_SINGLE(id)
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "notifications",
          role,
          branchName,
        ],
      });
    },
  });

  const markAllSeen = useMutation({
    mutationFn: () =>
      axiosInstance.put(
        ApiRoutes.NOTIFY.SEEN_ALL(branchName)
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "notifications",
          role,
          branchName,
        ],
      });
    },
  });

  return {
    ...query,
    markSingleSeen,
    markAllSeen,
  };
};