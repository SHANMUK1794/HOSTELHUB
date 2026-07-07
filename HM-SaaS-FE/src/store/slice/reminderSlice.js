import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/AxiosInstance";

// FETCH BIRTHDAYS
export const fetchBirthdays = createAsyncThunk(
  "reminder/fetchBirthdays",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        "/api/birthday/v1/getbirthday"
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to fetch birthdays"
      );
    }
  }
);

// SEND CUSTOM MESSAGE
export const sendCustomMessage = createAsyncThunk(
  "reminder/sendCustomMessage",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        "/api/birthday/v1/sendmessage",
        payload
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to send"
      );
    }
  }
);

const reminderSlice = createSlice({
  name: "reminder",

  initialState: {
    birthdays: [],
    loading: false,
    error: null,

    // custom message
    message: "",

    messageSending: false,
    response: null,
  },

  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },

    clearReminderState: (state) => {
      state.response = null;
      state.error = null;
      state.messageSending = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH BIRTHDAYS
      .addCase(
        fetchBirthdays.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchBirthdays.fulfilled,
        (state, action) => {
          state.loading = false;
          state.birthdays = action.payload;
        }
      )

      .addCase(
        fetchBirthdays.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // SEND MESSAGE
      .addCase(
        sendCustomMessage.pending,
        (state) => {
          state.messageSending = true;
          state.response = null;
          state.error = null;
        }
      )

      .addCase(
        sendCustomMessage.fulfilled,
        (state, action) => {
          state.messageSending = false;
          state.response = action.payload;
        }
      )

      .addCase(
        sendCustomMessage.rejected,
        (state, action) => {
          state.messageSending = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  setMessage,
  clearReminderState,
} = reminderSlice.actions;

export default reminderSlice.reducer;