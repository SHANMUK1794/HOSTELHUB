import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";
import { useSelector } from "react-redux";

// Fetch deleted items - UPDATED to accept branchName
const fetchDeletedItems = async (branchName) => {
  if (!branchName) return [];
  
  const { data } = await axiosInstance.get(ApiRoutes.REGISTERDELETE.GET_ALL, {
    params: { branchName }
  });
  return data?.data || [];
};

export const useDeletedItems = (branchName) => {
  return useQuery({
    queryKey: ["deletedItems", branchName],
    queryFn: () => fetchDeletedItems(branchName),
    staleTime: 0,
    enabled: !!branchName, // Only fetch when branchName is available
  });
};

// ---- MUTATIONS ----
export const useRecoverItem = () => {
  const queryClient = useQueryClient();
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  return useMutation({
    mutationFn: async ({ id, module }) => {
      return axiosInstance.get(ApiRoutes.REGISTERDELETE.RECOVER, { 
        params: { id, module, branchName } 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["deletedItems", branchName]);
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  return useMutation({
    mutationFn: async ({ id, module }) => {
      return axiosInstance.delete(ApiRoutes.REGISTERDELETE.DELETE, { 
        params: { id, module, branchName } 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["deletedItems", branchName]);
    },
  });
};

export const useSmartDeleteAll = () => {
  const queryClient = useQueryClient();
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  return useMutation({
    mutationFn: async (module) => {
      if (module) {
        // Module-specific delete
        return axiosInstance.delete(ApiRoutes.REGISTERDELETE.DELETE_ALL, {
          params: { module, branchName },
        });
      } else {
        // Universal delete
        return axiosInstance.delete(ApiRoutes.REGISTERDELETE.DELETE_ALL_UNIVERSAL, {
          params: { branchName },
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["deletedItems", branchName]);
    },
  });
};