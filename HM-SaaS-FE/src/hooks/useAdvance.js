import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

// ✅ Fetch all advances
export const useGetAdvances = (selectedBranch) => {
  return useQuery({
    queryKey: ["advances", selectedBranch],
    queryFn: async () => {
      if (!selectedBranch) return [];

      console.log("Fetching advances for branch:", selectedBranch);

      // ✅ Pass branch name as query param to backend
      const res = await axiosInstance.get(
        `${ApiRoutes.ADVANCE.GET_ALL}?branchName=${encodeURIComponent(selectedBranch)}`
      );

      return res.data?.advances || [];
    },
    enabled: !!selectedBranch, // only run when branch is selected
  });
};


// ✅ Add new advance
export const useAddAdvance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAdvance) => {
      try {
        const { data } = await axiosInstance.post(ApiRoutes.ADVANCE.ADD, newAdvance);
        return data;
      } catch (error) {
        // Log exact backend response for debugging
        console.error("Error adding advance:", error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["advances"] }),
  });
};

// ✅ Edit advance
export const useEditAdvance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ advanceId, updatedData }) => {
      try {
        const { data } = await axiosInstance.put(
          ApiRoutes.ADVANCE.UPDATE(advanceId),
          updatedData
        );
        return data;
      } catch (error) {
        console.error("Error updating advance:", error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["advances"] }),
  });
};


// ✅ Delete advance
export const useDeleteAdvance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (advanceId) => {
      const { data } = await axiosInstance.delete(ApiRoutes.ADVANCE.DELETE(advanceId));
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["advances"] }),
  });
};

// ✅ Fetch advance history
export const useAdvanceHistory = (employeeId) =>
  useQuery({
    queryKey: ["advanceHistory", employeeId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(ApiRoutes.ADVANCE.HISTORY(employeeId));
      // Return full response data, not only dueTrackers
      return data;
    },
    enabled: !!employeeId,
  });
