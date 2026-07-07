// store/slice/complaintsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const complaintsSlice = createSlice({
  name: 'complaints',
  initialState: {
    data: [],
  },
  reducers: {
    setComplaintsData: (state, action) => {
      state.data = action.payload;
    },
    addComplaint: (state, action) => {
      state.data.push(action.payload);
    },
    updateComplaint: (state, action) => {
      const index = state.data.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteComplaint: (state, action) => {
      state.data = state?.data?.filter(item => item._id !== action.payload);
   
    }
  },
});

export const {
  setComplaintsData,
  addComplaint,
  updateComplaint,
  deleteComplaint,
} = complaintsSlice.actions;

export default complaintsSlice.reducer;
