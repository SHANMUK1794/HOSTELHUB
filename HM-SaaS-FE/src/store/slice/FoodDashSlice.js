import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  day: "",
  dish: "",
  totalVeg: 0,
  totalNonVeg: 0,
};

const FoodDashSlice = createSlice({
  name: "foodSummary",
  initialState,
  reducers: {
    setFoodSummary: (state, action) => {
      const { day, dish, totalVeg, totalNonVeg } = action.payload;
      state.day = day;
      state.dish = dish;
      state.totalVeg = totalVeg;
      state.totalNonVeg = totalNonVeg;
    },
  },
});

export const { setFoodSummary} = FoodDashSlice.actions;
export default FoodDashSlice.reducer;
