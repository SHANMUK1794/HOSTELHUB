import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import axiosInstance from "../utils/AxiosInstance";

import { setInventory, setinventorystore } from "../store/slice/InventorySlice";
import ApiRoutes from "../utils/ApiRoutes";

const FetchInventoryList = async (yearMonth = "all-all") => {
  const [year, month] = yearMonth.split("-");
  
  const res = await axiosInstance.get(
    ApiRoutes.INVENTORY.GET_ALL(year, month)
  );

  return res.data.data;
};


// Fetch history by year-month
const fetchInventoryHistory = async (yearMonth) => {
  const [year, month] = yearMonth.split(/[-\s]/);
  const res = await axiosInstance.get(
    ApiRoutes.INVENTORY.GET_HISTORY(year, month)
  );
 return res.data?.items || [];
};

export const useInventory = (yearMonth, { showToast } = {}) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // Current inventory
  const inventoryQuery = useQuery({
      queryKey: ["inventory", yearMonth],
    queryFn: async () => {
  const inventory = await FetchInventoryList(yearMonth);
  dispatch(setInventory(inventory));
  return inventory;
},

  });

  // Inventory history
  const historyQuery = useQuery({
    queryKey: ["inventoryHistory", yearMonth],
    queryFn: async () => {
      const history = await fetchInventoryHistory(yearMonth);
      dispatch(setinventorystore(history));
      return history;
    },
  });

  // Delete by ID (for History of Inventory)
  const deleteInventories = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(ApiRoutes.INVENTORY.DELETE(id));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["inventoryHistory"]);
      if (showToast) showToast("Item deleted successfully", "success");
    },
    onError: (error) => {
      if (showToast) {
        showToast(error?.response?.data?.message || "Failed to delete item", "error");
      }
    },
  });

  // Delete by Item Name (for Kitchen Inventory table)
  const deleteInventoryByName = useMutation({
    mutationFn: async (itemName) => {
      const res = await axiosInstance.delete(ApiRoutes.INVENTORY.DELETE_BY_NAME(itemName));
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["inventory"]);
      if (showToast) showToast("Item deleted successfully", "success");
    },
    onError: (error) => {
      if (showToast) {
        showToast(error?.response?.data?.message || "Failed to delete item", "error");
      }
    },
  });



  // Add
  const addInventory = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post(ApiRoutes.INVENTORY.ADD, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["inventoryHistory"]);
      if (showToast) showToast("Item usage recorded successfully", "success");
    },
    onError: (error) => {
      if (showToast) {
        showToast(error?.response?.data?.message || "Failed to record item usage", "error");
      }
    },
  });

  // Update
  const updateInventory = useMutation({
    mutationFn: async (value) => {
      const res = await axiosInstance.put(
        ApiRoutes.INVENTORY.UPDATE(value.id),
        value.data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["inventoryHistory"]);
      if (showToast) showToast("Kitchen usage record updated successfully", "success");
    },
    onError: (error) => {
      if (showToast) {
        showToast(error?.response?.data?.message || "Failed to update item", "error");
      }
    },
  });

  return {
    inventoryQuery,
    historyQuery,
    deleteInventories,
    deleteInventoryByName,
    addInventory,
    updateInventory,
    refetch: historyQuery.refetch, // correct refetch
  };
};
