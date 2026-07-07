import { createSlice } from "@reduxjs/toolkit";



const MenuSlice = createSlice({
  name: "kitchenmenu",
  initialState: {
    menu: [],
    status: "loading",
  },
  reducers: {
    setMenu: (state, action) => {
      state.menu = action.payload;
    },
    deleteMenu: (state, action) => {
      state.menu = state.menu.filter(
        (kitchenmenu) => kitchenmenu._id !== action.payload
      );
    },
  },
});
export const { setMenu } = MenuSlice.actions;
export default MenuSlice.reducer;
