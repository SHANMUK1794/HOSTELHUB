import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

// Fetch worker employees
const fetchWorkerEmployees = async (branchName) => {
  if (!branchName) return []; 

  try {
    const { data } = await axiosInstance.get(ApiRoutes.WORKEREMPLOYEE.GET_ALL, {
      params: { branchName },
    });

    console.log("Fetched worker employees data:", data);

    if (!data) return [];
    
    // Handle nested data structure
    if (data.data && Array.isArray(data.data)) return data.data;
    if (Array.isArray(data)) return data;
    if (data.employees && Array.isArray(data.employees)) return data.employees;

    return [];
  } catch (error) {
    console.error("Error fetching worker employees:", error);
    throw error;
  }
};

export const useEmployeeAttendanceStats = (empId) => {
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  return useQuery({
    queryKey: ["employeeStats", empId, branchName],
    queryFn: async () => {
      // 🚀 Using your newly defined ApiRoute!
      const { data } = await axiosInstance.get(
        ApiRoutes.WORKEREMPLOYEE.GET_STATS(empId), 
        { params: { branchName } }
      );
      return data;
    },
    enabled: !!empId && !!branchName,
    
    // Fail fast if there's an error so it doesn't hang on "Loading..."
    retry: false, 
    
    // Force a fresh network request every time you open the eye icon
    staleTime: 0, 
  });
};

// Hook to get worker employees
export const useEmployees = (options = {}) => {
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  return useQuery({
    queryKey: ["workerEmployees", branchName],
    queryFn: () => fetchWorkerEmployees(branchName),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!branchName,
    ...options,
  });
};

// Create worker employee
export const useCreateEmployee = () => {
  const qc = useQueryClient();
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  return useMutation({
    mutationFn: (payload) =>
      axiosInstance.post(ApiRoutes.WORKEREMPLOYEE.CREATE, payload),
    onSuccess: () => {
      qc.invalidateQueries(["workerEmployees", branchName]);
    },
    onError: (error) => {
      console.error("Create worker employee error:", error);
    },
  });
};


export const useUpdateEmployee = () => {
  const qc = useQueryClient();
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axiosInstance.put(ApiRoutes.WORKEREMPLOYEE.UPDATE(id), payload);
      return data;
    },

    onSuccess: (updatedEmployee, { id, payload }) => {
      qc.setQueryData(["workerEmployees", branchName], (oldData) => {
        if (!oldData) return oldData;

        
        const employeesArray = Array.isArray(oldData) ? oldData : oldData.data;

        if (!employeesArray) return oldData;

        const newEmployees = employeesArray.map((emp) =>
          emp._id === id ? { ...emp, ...payload } : emp
        );

        
        return Array.isArray(oldData)
          ? newEmployees
          : { ...oldData, data: newEmployees };
      });
    },

    onError: (error) => {
      console.error("Update worker employee error:", error);
    },
  });
};



export const useDeleteEmployee = () => {
  const qc = useQueryClient();
  const rawBranchName = useSelector((state) => state.branch.selectedBranch);
  const branchName = rawBranchName?.replace(/'/g, "").replace(/\s+/g, " ");

  return useMutation({
    mutationFn: (id) =>
      axiosInstance.delete(ApiRoutes.WORKEREMPLOYEE.DELETE(id)),
    onSuccess: () => {
      qc.invalidateQueries(["workerEmployees", branchName]);
    },
    onError: (error) => {
      console.error("Delete worker employee error:", error);
    },
  });
};
