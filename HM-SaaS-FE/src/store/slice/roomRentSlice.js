import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedRoomRent: null,
};

const roomRentSlice = createSlice({
  name: "roomRent",
  initialState,
  reducers: {
    setSelectedRoomRent: (state, action) => {
      state.selectedRoomRent = action.payload;
    },
    clearSelectedRoomRent: (state) => {
      state.selectedRoomRent = null;
    },
  },
});

export const { setSelectedRoomRent, clearSelectedRoomRent } =
  roomRentSlice.actions;
export default roomRentSlice.reducer;
