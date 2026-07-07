import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

export const useCylinders = (year = "all", month = "all") => {
  const queryClient = useQueryClient();

  // ✅ GET cylinders with year & month
  const { data: cylinders = [], isLoading, isError } = useQuery({
    queryKey: ["cylinders", year, month], // 👈 important for refetch
    queryFn: async () => {
      const res = await axiosInstance.get(ApiRoutes.CYLINDER.GET_ALL, {
        params: {
          year,
          month,
        },
      });
      return res?.data?.data ?? [];
    },
    keepPreviousData: true,
  });

  const addCylinder = useMutation({
    mutationFn: (newData) =>
      axiosInstance.post(ApiRoutes.CYLINDER.ADD, newData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cylinders"] }),
  });

  const updateCylinder = useMutation({
    mutationFn: ({ id, updatedData }) =>
      axiosInstance.put(ApiRoutes.CYLINDER.UPDATE(id), updatedData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cylinders"] }),
  });

  const deleteCylinder = useMutation({
    mutationFn: (id) =>
      axiosInstance.delete(ApiRoutes.CYLINDER.DELETE(id)),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cylinders"] }),
  });

  return {
    cylinders,
    isLoading,
    isError,
    addCylinder,
    updateCylinder,
    deleteCylinder,
  };
};
