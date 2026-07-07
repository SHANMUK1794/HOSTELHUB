import { createSlice } from "@reduxjs/toolkit";

const DashboardSlice = createSlice({
  name: "DashboardData",
  initialState: {
    dashBoardData: [],
  },
  reducers: {
    setDashboardData: (state, action) => {
      state.dashBoardData = action.payload;
    },
  },
});

export const { setDashboardData } = DashboardSlice.actions;

export default DashboardSlice.reducer;
