import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  expenses: [],
};

const storeRoomSlice = createSlice({
  name: "storeRoomExpense",
  initialState,
  reducers: {
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteExpense: (state, action) => {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
    },
  },
});

export const { setExpenses, addExpense, updateExpense, deleteExpense } =
  storeRoomSlice.actions;
export default storeRoomSlice.reducer;
