import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  staffData: [],
  attendanceCount: [],
  isSubmitting: false,
  isSuccess: false,
  isError: false,
  errorMessage: "",
};

const staffAttendanceSlice = createSlice({
  name: "staffAttendance",
  initialState,
  reducers: {
    setStaffData: (state, action) => {
      state.staffData = action.payload || [];
    },

    setStaffAttendanceCount: (state, action) => {
       state.attendanceCount = action.payload || [];
    },

    updateAttendance: (state, action) => {
      state.staffData = [...state.staffData, action.payload]
    },

    startSubmit: (state) => {
      state.isSubmitting = true;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = "";
    },
    submitSuccess: (state) => {
      state.isSubmitting = false;
      state.isSuccess = true;
    },
    submitFailure: (state, action) => {
      state.isSubmitting = false;
      state.isError = true;
      state.errorMessage = action.payload || "Submission failed";
    },
  },
});

export const {
  setStaffData,
  setStaffAttendanceCount,
  updateAttendance,
  startSubmit,
  submitSuccess,
  submitFailure,
} = staffAttendanceSlice.actions;

export default staffAttendanceSlice.reducer;

