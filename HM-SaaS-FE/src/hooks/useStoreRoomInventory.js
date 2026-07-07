

///
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  setInventoryData,
  setInventoryHistory
} from "../store/slice/storeRoomInventorySlice";
import axiosInstance from "../utils/AxiosInstance";
import ApiRoutes from "../utils/ApiRoutes";

const fetchStoreRoomInventoryHistory = async (yearMonth = "all-all", branchName) => {
  const [year, month] = yearMonth.split("-");

  const res = await axiosInstance.get(
    ApiRoutes.STORE_ROOM_INVENTORY.GET_ALL(year, month, branchName)
  );

  const inventory = res.data.data;
  if (!inventory) throw new Error("Store Room Inventory history not found");
  return inventory;
};


const fetchStoreRoomInventory = async (yearMonth, branchName) => {
  const [year, month] = yearMonth.split(/[-\s]/);
  const res = await axiosInstance.get(
    ApiRoutes.STORE_ROOM_INVENTORY.GET_HISTORY(year, month, branchName)
  );
  const history = res.data.data;
  if (!history) throw new Error("Store Room Inventory not found");
  return history;
};

export const useStoreRoomInventory = (yearMonth, branchName) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

 const inventoryQuery = useQuery({
  queryKey: ["storeRoomInventory", yearMonth, branchName],
  queryFn: async () => {
    const storeRoomInventory = await fetchStoreRoomInventoryHistory(yearMonth, branchName);
    dispatch(setInventoryData(storeRoomInventory));
    return storeRoomInventory;
  },
  enabled: !!branchName,
  staleTime: 0,
});

  const historyQuery = useQuery({
    queryKey: ["storeRoomInventoryHistory", yearMonth, branchName],
    queryFn: async () => {
      const storeRoomInventoryHistory = await fetchStoreRoomInventory(yearMonth, branchName);
      dispatch(setInventoryHistory(storeRoomInventoryHistory));
      return storeRoomInventoryHistory;
    },
    enabled: !!branchName,
    staleTime: 0,
  });

  const addItem = useMutation({
    mutationFn: async (newItem) => {
      const res = await axiosInstance.post(
        ApiRoutes.STORE_ROOM_INVENTORY.ADD,
        newItem
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["storeRoomInventoryHistory"]);
    },
  });

  const editItem = useMutation({
    mutationFn: async (updatedItem) => {
      const { id, ...rest } = updatedItem;
      const res = await axiosInstance.put(
        ApiRoutes.STORE_ROOM_INVENTORY.UPDATE(id),
        rest
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["storeRoomInventoryHistory"]);
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(
        ApiRoutes.STORE_ROOM_INVENTORY.DELETE(id)
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["storeRoomInventoryHistory"]);
    },
  });
  const deleteItemByName = useMutation({
  mutationFn: async (itemName) => {
    const res = await axiosInstance.delete(
      ApiRoutes.STORE_ROOM_INVENTORY.DELETE_ITEM(itemName)
    );
    return res.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["storeRoomInventory"]);
  },
});


  return {
    inventoryQuery,
    historyQuery,
    addItem,
    editItem,
    deleteItem,
    deleteItemByName,
  };
};
