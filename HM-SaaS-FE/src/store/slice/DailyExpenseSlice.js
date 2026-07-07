import { createSlice } from "@reduxjs/toolkit";

const DailyExpenseSlice = createSlice({
    name: "dailyExpense",
    initialState: {
       expense: [], 
    },
    reducers: {
        setExpense: (state, action) => {
            state.expense = action.payload || [];
        },
        addExpense: (state, action) => {
            state.expense = [...state.expense, action.payload]
        },
        editExpense: (state, action) => {
           const index = state.expense.findIndex(
             (e) => e.id === action.payload.id 
           );
           if (index !== -1) state.expense[index] = action.payload;    
        },
        deleteExpense: (state, action) => {
            state.expense = state.expense.filter(
                (e) => e.id !== action.payload.id 
            );
        }                            
    }
});

export const { setExpense, addExpense, editExpense, deleteExpense } = DailyExpenseSlice.actions;
export default DailyExpenseSlice.reducer;