import { createSlice } from "@reduxjs/toolkit";

const cylinderSlice = createSlice({
  name: "cylinder",
  initialState: {
    selectedCylinder: null,
    isPopupOpen: false,
  },
  reducers: {
    setSelectedCylinder: (state, action) => {
      state.selectedCylinder = action.payload;
    },
    openPopup: (state) => {
      state.isPopupOpen = true;
    },
    closePopup: (state) => {
      state.isPopupOpen = false;
    },
  },
});

export const { setSelectedCylinder, openPopup, closePopup } = cylinderSlice.actions;
export default cylinderSlice.reducer;
