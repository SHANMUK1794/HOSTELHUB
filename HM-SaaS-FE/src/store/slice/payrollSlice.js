import { createSlice } from '@reduxjs/toolkit';

const payrollSlice = createSlice({
  name: 'payroll',
  initialState: {
    isOpenDelete: false,
    isOpenForm: false,
    editingIndex: null,
    deleteIndex: null,
  },
  reducers: {
    openForm: (state, action) => {
      state.editingIndex = action.payload;
      state.isOpenForm = true;
    },
    closeForm: (state) => {
      state.editingIndex = null;
      state.isOpenForm = false;
    },
    openDelete: (state, action) => {
      state.deleteIndex = action.payload;
      state.isOpenDelete = true;
    },
    closeDelete: (state) => {
      state.deleteIndex = null;
      state.isOpenDelete = false;
    },
  },
});

export const { openForm, closeForm, openDelete, closeDelete } = payrollSlice.actions;
export default payrollSlice.reducer;
