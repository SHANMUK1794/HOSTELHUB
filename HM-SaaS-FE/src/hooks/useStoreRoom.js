

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  addExpense,
  deleteExpense,
  setExpenses,
  updateExpense,
} from "../store/slice/StoreRoomSlice";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

// GET
export const useGetStoreRoom = (yearMonth, branchName) => {
  const dispatch = useDispatch();
  const [year, month] = yearMonth.split(/[-\s]/);

  return useQuery({
    queryKey: ["storeRoom", yearMonth, branchName],
    queryFn: async () => {
      const res = await axiosInstance.get(ApiRoutes.STORE_ROOM.GET(year, month, branchName));
      const items = res.data.data;
      dispatch(setExpenses(items));
      return items;
    },
    enabled: !!branchName,
    staleTime: 0,
  });
};

// POST
export const useAddItem = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem) => {
      const res = await axiosInstance.post(ApiRoutes.STORE_ROOM.ADD, newItem);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(addExpense(data));
      queryClient.invalidateQueries({ queryKey: ["storeRoom"] });
    },
  });
};

// PUT
export const useUpdateItem = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedItem) => {
      const res = await axiosInstance.put(ApiRoutes.STORE_ROOM.UPDATE(updatedItem._id), updatedItem);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(updateExpense(data));
      queryClient.invalidateQueries({ queryKey: ["storeRoom"] });
    },
  });
};

// DELETE
export const useDeleteItem = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(ApiRoutes.STORE_ROOM.DELETE(id));
      return id;
    },
    onSuccess: (id) => {
      dispatch(deleteExpense(id));
      queryClient.invalidateQueries({ queryKey: ["storeRoom"] });
    },
  });
};
