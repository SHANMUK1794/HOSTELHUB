import { createSlice } from "@reduxjs/toolkit"

const AttendanceSlice = createSlice({
    name: "attendance",
    initialState: {
      attendance: [],
      attendanceCount: []
    },
    reducers: {
      setAttendance: (state, action) => {
        state.attendance = action.payload || [];
      },
      addAttendance: (state, action) => {
        state.attendance = [...state.attendance, action.payload]
      },
      setUserAttendanceCount: (state, action) => {
        state.attendanceCount = action.payload || [];
      }
    }  
},
);

export const { setAttendance, addAttendance, setUserAttendanceCount } = AttendanceSlice.actions;
export default AttendanceSlice.reducer;