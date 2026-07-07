import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedAdvance: null,
  showAdd: false,
  showEdit: false,
  showHistory: false,
  showAdvanceEdit: false,
};

const advanceSlice = createSlice({
  name: "advance",
  initialState,
  reducers: {
    setSelectedAdvance: (state, action) => {
      state.selectedAdvance = action.payload;
    },
    toggleAdd: (state) => {
      state.showAdd = !state.showAdd;
    },
    toggleEdit: (state) => {
      state.showEdit = !state.showEdit;
    },
    toggleHistory: (state) => {
      state.showHistory = !state.showHistory;
    },
    toggleAdvanceEdit: (state) => {
      state.showAdvanceEdit = !state.showAdvanceEdit;
    },
    resetModals: (state) => {
      state.showAdd = false;
      state.showEdit = false;
      state.showHistory = false;
      state.showAdvanceEdit = false;
    },
  },
});

export const {
  setSelectedAdvance,
  toggleAdd,
  toggleEdit,
  toggleHistory,
  toggleAdvanceEdit,
  resetModals,
} = advanceSlice.actions;

export default advanceSlice.reducer;
