import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staffData: [], // List of staff objects
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaffData: (state, action) => {
      state.staffData = action.payload || [];
    },
  },
});

export const { setStaffData } = staffSlice.actions;
export default staffSlice.reducer;
