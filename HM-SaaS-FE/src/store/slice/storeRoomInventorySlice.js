import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  inventoryData: [],
  inventoryHistory: [],
};

const storeRoomInventorySlice = createSlice({
  name: "storeRoomInventory",
  initialState,
  reducers: {
    setInventoryData: (state, action) => {
      state.inventoryData = action.payload;
    },
    setInventoryHistory: (state, action) => {
      state.inventoryHistory = action.payload;
    },
    addInventoryItem: (state, action) => {
      state.inventoryData.push(action.payload);
    },
    updateInventoryItem: (state, action) => {
      const index = state.inventoryData.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.inventoryData[index] = action.payload;
      }
    },
    deleteInventoryItem: (state, action) => {
      state.inventoryData = state.inventoryData.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const {
  setInventoryData,
  setInventoryHistory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} = storeRoomInventorySlice.actions;

export default storeRoomInventorySlice.reducer;
