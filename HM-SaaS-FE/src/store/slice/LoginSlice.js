import { createSlice } from '@reduxjs/toolkit';

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

const initialState = {
  token: localStorage.getItem('token') || null,
  user: getStoredUser(),
};

const LoginSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});


export const { setCredentials, logout } = LoginSlice.actions;
export default LoginSlice.reducer;
