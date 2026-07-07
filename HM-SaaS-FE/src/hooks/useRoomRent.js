

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

// Fetch Room Rent Data
export const useRoomRentData = (yearMonth) => {
  const [year, month] = yearMonth.split(/[-\s]/);
  const role = JSON.parse(localStorage.getItem("user"))?.role;
  const branchName = useSelector((state) => state.branch.selectedBranch);

  return useQuery({
    queryKey: ["roomRentData", branchName, yearMonth],
    queryFn: async () => {
      const url = ApiRoutes.ROOM_RENT.GET(branchName, year, month, role);
      const response = await axiosInstance.get(url);
      return response.data.data || [];
    },
    enabled: !!role && (role !== "Admin" || !!branchName),
  });
};

// Add/Edit Room Rent Entry
export const useSaveRoomRent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, isEdit }) => {
      if (isEdit) {
        const { _id, ...rest } = payload;
        if (!_id || typeof _id !== "string" || _id.length !== 24) {
          throw new Error("Invalid _id provided for room rent update.");
        }
        const response = await axiosInstance.put(ApiRoutes.ROOM_RENT.UPDATE(_id), rest);
        return response.data;
      } else {
        const response = await axiosInstance.post(ApiRoutes.ROOM_RENT.CREATE, payload);
        return response.data;
      }
    },
    // 👉 FIXED: Explicitly invalidating the root query key prefix
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomRentData"] }); // ✨ Refreshes table instantly
    },
  });
};

// Delete Room Rent Entry
export const useDeleteRoomRent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      if (!id || typeof id !== "string" || id.length !== 24) {
        throw new Error("Invalid room rent ID format.");
      }
      const response = await axiosInstance.delete(ApiRoutes.ROOM_RENT.DELETE(id));
      return response.data;
    },
    // 👉 FIXED: Explicitly invalidating the root query key prefix
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roomRentData"] }); // ✨ Clears all cache matching this prefix instantly
    },
  });
};

// export const useDeleteRoomRent = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (id) => {
//       if (!id || typeof id !== "string" || id.length !== 24) {
//         throw new Error("Invalid room rent ID format.");
//       }
//       const response = await axiosInstance.delete(ApiRoutes.ROOM_RENT.DELETE(id));
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         predicate: (query) => query.queryKey[0] === "roomRentData",
//       });
//       toast.success("Payment deleted successfully!");
//     },
//     onError: () => {
//       toast.error("Failed to delete payment!");
//     },
//   });
// };

