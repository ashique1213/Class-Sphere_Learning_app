import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  authToken: localStorage.getItem("authToken") || null,
  email: localStorage.getItem("email") || null,
  role: localStorage.getItem("role") || null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.authToken = action.payload.authToken;
      state.email = action.payload.email;
      state.role = action.payload.role;
      localStorage.setItem("authToken", action.payload.authToken);
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("role", action.payload.role);
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.authToken = null;
      state.email = null;
      state.role = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
    },
    updateUserInfo: (state, action) => {
      if (action.payload.user) state.user = action.payload.user;
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.role) state.role = action.payload.role;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;