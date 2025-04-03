import { createSlice } from "@reduxjs/toolkit";

// Assuming SIMPLE_JWT ACCESS_TOKEN_LIFETIME is 10 minutes 
const ACCESS_TOKEN_LIFETIME = 10 * 60 * 1000; 

const initialState = {
  user: null,
  authToken: null,
  refreshToken: null,
  email: null,
  role: null,
  is_active: null,
  isLoading: false,
  error: null,
  tokenExpiry: null,
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
      state.user = action.payload.user || null;
      state.authToken = action.payload.authToken || null;
      state.refreshToken = action.payload.refreshToken || null;
      state.email = action.payload.email || null;
      state.role = action.payload.role || null;
      state.is_active = action.payload.is_active ?? true;
      state.tokenExpiry = action.payload.authToken
        ? new Date().getTime() + ACCESS_TOKEN_LIFETIME
        : null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload || "Login failed";
    },
    logout: (state) => {
      return { ...initialState }; // Reset to initial state
    },
    updateUserInfo: (state, action) => {
      if (action.payload.user) state.user = action.payload.user;
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.role) state.role = action.payload.role;
    },
    updateTokens: (state, action) => {
      if (action.payload.authToken) {
        state.authToken = action.payload.authToken;
        state.tokenExpiry = new Date().getTime() + ACCESS_TOKEN_LIFETIME;
      }
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserInfo,
  updateTokens,
} = authSlice.actions;

export default authSlice.reducer;
