import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSubmitting: false,
  submitSuccess: false,
  error: null,
};

const ebDataSlice = createSlice({
  name: "ebData",
  initialState,
  reducers: {
    startSubmit: (state) => {
      state.isSubmitting = true;
      state.submitSuccess = false;
      state.error = null;
    },
    submitSuccess: (state) => {
      state.isSubmitting = false;
      state.submitSuccess = true;
    },
    submitFailure: (state, action) => {
      state.isSubmitting = false;
      state.submitSuccess = false;
      state.error = action.payload;
    },
    resetStatus: (state) => {
      state.isSubmitting = false;
      state.submitSuccess = false;
      state.error = null;
    },
  },
});

export const { startSubmit, submitSuccess, submitFailure, resetStatus } =
  ebDataSlice.actions;
export default ebDataSlice.reducer;
