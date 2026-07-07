
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

// FETCH ALL Vacations

const fetchVacations = async (branchName) => {
  const token = localStorage.getItem("token");

  try {
    const response = await axiosInstance.get(
      ApiRoutes.VACATIONFORM.GET_ALL,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          branchName: branchName,
          filter: "all"
        }
      }
    );
    
    console.log("Full API Response:", response);
    console.log("Response data:", response.data);
    
    // Return based on actual structure
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error("Error fetching vacations:", error);
    throw error;
  }
};

// useVacation  Fetch Hook

export const useVacation = (options = {}) => {
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  return useQuery({
    queryKey: ["vacations", branchName],
    queryFn: () => fetchVacations(branchName),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!branchName,
    ...options,
  });
};


// Create Vacation
export const useCreateVacation = () => {
  const qc = useQueryClient();
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  return useMutation({
    mutationFn: (payload) => {
      const token = localStorage.getItem("token");
      return axiosInstance.post(ApiRoutes.VACATIONFORM.CREATE, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries(["vacations", branchName]);
    },
    onError: (error) => {
      console.error(
        "Error creating vacation:",
        error?.response?.data || error
      );
    },
  });
};

//Update Vacation
export const useUpdateVacation = () => {
  const qc = useQueryClient();
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  return useMutation({
    mutationFn: ({ id, payload }) => {
      const token = localStorage.getItem("token");
      return axiosInstance.put(ApiRoutes.VACATIONFORM.UPDATE(id), payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries(["vacations", branchName]);
    },
    onError: (error) => {
      console.error("Error updating vacation:", error);
    },
  });
};

//Delete Vacation
export const useDeleteVacation = () => {
  const qc = useQueryClient();
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  return useMutation({
    mutationFn: (id) => {
      const token = localStorage.getItem("token");
      return axiosInstance.delete(ApiRoutes.VACATIONFORM.DELETE(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries(["vacations", branchName]);
    },
    onError: (error) => {
      console.error("Error deleting vacation:", error);
    },
  });
};

export default useVacation;