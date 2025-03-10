import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Create an async thunk for refreshing the token
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken;
      
      if (!refreshToken) {
        return rejectWithValue("No refresh token available");
      }

      const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to refresh token");
      }

      return {
        authToken: data.access_token || data.access,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
      state.user = action.payload.user;
      state.authToken = action.payload.authToken;
      state.refreshToken = action.payload.refreshToken;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.is_active = action.payload.is_active ?? true;
      
      // Calculate token expiry (assuming 15 minutes from now)
      const expiryTime = new Date().getTime() + 15 * 60 * 1000;
      state.tokenExpiry = expiryTime;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.authToken = null;
      state.refreshToken = null;
      state.email = null;
      state.role = null;
      state.tokenExpiry = null;
      state.is_active = null; 
    },
    updateUserInfo: (state, action) => {
      if (action.payload.user) state.user = action.payload.user;
      if (action.payload.email) state.email = action.payload.email;
      if (action.payload.role) state.role = action.payload.role;
    },
    updateTokens: (state, action) => {
      if (action.payload.authToken) {
        state.authToken = action.payload.authToken;
        
        // Update expiry time
        const expiryTime = new Date().getTime() + 15 * 60 * 1000;
        state.tokenExpiry = expiryTime;
      }
      
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authToken = action.payload.authToken;
        
        // Update expiry time
        const expiryTime = new Date().getTime() + 15 * 60 * 1000;
        state.tokenExpiry = expiryTime;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // On refresh failure, log the user out
        state.user = null;
        state.authToken = null;
        state.refreshToken = null;
        state.email = null;
        state.role = null;
        state.is_active = action.payload.is_active ?? state.is_active;
        state.tokenExpiry = null;
      });
  }
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateUserInfo,
  updateTokens
} = authSlice.actions;

export default authSlice.reducer;