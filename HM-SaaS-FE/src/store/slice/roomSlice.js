import { createSlice } from "@reduxjs/toolkit";

const roomSlice = createSlice({
  name: "rooms",
  initialState: {
    rooms: [],
  },
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    addRoom: (state, action) => {
      state.rooms.push(action.payload);
    },
    updateRoom: (state, action) => {
      const index = state.rooms.findIndex((r) => r._id === action.payload._id);
      if (index !== -1) state.rooms[index] = action.payload;
    },

    deleteRoom: (state, action) => {
      state.rooms = state.rooms.filter((room) => room._id !== action.payload);
    },
  },
});

export const { setRooms, addRoom, updateRoom, deleteRoom } = roomSlice.actions;
export default roomSlice.reducer;
