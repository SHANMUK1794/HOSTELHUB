import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const kitchenDashboardSlice = createSlice({
  name: "kitchenDashboard",
  initialState,
  reducers: {
    setKitchenDashboardData: (state, action) => {
      state.data = action.payload;
    },
    clearKitchenDashboardData: (state) => {
      state.data = null;
    },
  },
});

export const { setKitchenDashboardData, clearKitchenDashboardData } =
  kitchenDashboardSlice.actions;

export default kitchenDashboardSlice.reducer;
