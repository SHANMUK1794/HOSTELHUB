import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { setNotifications, clearNotifications } = NotificationSlice.actions;

export default NotificationSlice.reducer;
