import { createSlice } from "@reduxjs/toolkit";

const InventorySlice = createSlice({
  name: "inventory",
  initialState: {
    inventories: [],
  },
  reducers: {
    setInventory: (state, action) => {
      state.inventories = action.payload;
    },

    deleteInventory: (state, action) => {
      state.inventories = state.inventories.filter(
        (inventory) => inventory._id !== action.payload
      );
    },
    setinventorystore: (state, action) => {
      state.inventoryStore = action.payload;
    },
    addInventory: (state, action) => {
      state.inventories = state.inventories.push(
        (inventory) => inventory._id !== action.payload
      );
    },
  },
});

export const { setInventory, deleteInventory, setinventorystore } =
  InventorySlice.actions;
export default InventorySlice.reducer;
