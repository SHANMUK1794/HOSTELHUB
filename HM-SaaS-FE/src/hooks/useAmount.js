import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiRoutes from "../utils/ApiRoutes";
import axiosInstance from "../utils/AxiosInstance";
import { useSelector } from "react-redux";

const useAmount = (page = 1, limit = 10, search = "", yearMonth = "") => {
  const queryClient = useQueryClient();
  const branchName = useSelector((state) => state.branch.selectedBranch);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["amounts", branchName, page, limit, search, yearMonth],
    queryFn: async () => {
      const [year, month] = yearMonth
        ? yearMonth.split(/[-\s]/)
        : [];

      let url = ApiRoutes.AMOUNT.GET_ALL(branchName, year, month);

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (search) params.append("search", search);

      const queryString = params.toString();
      if (queryString) url += `&${queryString}`;

      const response = await axiosInstance.get(url);
      return response.data;
    },
    enabled: !!branchName && !!yearMonth,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await axiosInstance.delete(ApiRoutes.AMOUNT.DELETE(id));
        },
        onSuccess: () => {
            // 1. Clears the active Payment History list instantly
            queryClient.invalidateQueries({ queryKey: ["amounts"] }); 

            // 2. 👉 NEW: Force-clears the global Recycle Bin cache!
            queryClient.invalidateQueries({ queryKey: ["deletedItems"] }); 
            // Note: If your useDelete.js hook uses a different root word (like "trashData"), replace "deletedItems" with that word!
        }
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (newData) => {
            return await axiosInstance.post(ApiRoutes.AMOUNT.CREATE, newData);
        },
        // 👉 FIXED
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["amounts"] });
        }
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, updatedData }) => {
            return await axiosInstance.put(ApiRoutes.AMOUNT.UPDATE(id), updatedData);
        },
        // 👉 FIXED
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["amounts"] });
        }
    });

    return {
        data,
        isLoading,
        isError,
        error,
        deleteMutation,
        createMutation,
        updateMutation,
        refetchAmounts: refetch
    };
};

export default useAmount;