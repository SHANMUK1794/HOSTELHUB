import { createSlice } from "@reduxjs/toolkit";


const birthdaySlice = createSlice({
    name : "birthday",
    initialState : {
        birthdays : [],
    },
    reducers: {
        setBirthdays : (state, action)=>{
            state.birthdays = action.payload
        }
    }
})

export const { setBirthdays } = birthdaySlice.actions;
export default birthdaySlice.reducer;