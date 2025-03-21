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



// Remove extraReducers if using Axios interceptors for token refresh
// Otherwise, define refreshToken as a thunk (example below)

// Optional: Define refreshToken thunk if you keep extraReducers
/*
import { createAsyncThunk } from "@reduxjs/toolkit";
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, dispatch }) => {
    const refreshToken = getState().auth.refreshToken;
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) throw new Error("Token refresh failed");

    const data = await response.json();
    dispatch(updateTokens({
      authToken: data.access,
      refreshToken: data.refresh || refreshToken, // Use new refresh if provided
    }));
    return { authToken: data.access, refreshToken: data.refresh || refreshToken };
  }
);
*/

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const BASE_URL = import.meta.env.VITE_BASE_URL; 

// export const refreshToken = createAsyncThunk(
//   "auth/refreshToken",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const refreshToken = state.auth.refreshToken;
      
//       if (!refreshToken) {
//         return rejectWithValue("No refresh token available");
//       }

//       const response = await fetch(`${BASE_URL}/token/refresh/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ refresh: refreshToken }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to refresh token");
//       }

//       return {
//         authToken: data.access,  // Match SIMPLE_JWT default key
//         refreshToken: data.refresh,  // Capture new refresh token
//       };
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const initialState = {
//   user: null,
//   authToken: null,
//   refreshToken: null,
//   email: null,
//   role: null,
//   is_active: null,
//   isLoading: false,
//   error: null,
//   tokenExpiry: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     loginStart: (state) => {
//       state.isLoading = true;
//       state.error = null;
//     },
//     loginSuccess: (state, action) => {
//       state.isLoading = false;
//       state.user = action.payload.user;
//       state.authToken = action.payload.authToken;
//       state.refreshToken = action.payload.refreshToken;
//       state.email = action.payload.email;
//       state.role = action.payload.role;
//       state.is_active = action.payload.is_active ?? true;
      
//       // Align with SIMPLE_JWT ACCESS_TOKEN_LIFETIME (30 minutes)
//       const expiryTime = new Date().getTime() + 30 * 60 * 1000;
//       state.tokenExpiry = expiryTime;
//     },
//     loginFailure: (state, action) => {
//       state.isLoading = false;
//       state.error = action.payload;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.authToken = null;
//       state.refreshToken = null;
//       state.email = null;
//       state.role = null;
//       state.tokenExpiry = null;
//       state.is_active = null;
//     },
//     updateUserInfo: (state, action) => {
//       if (action.payload.user) state.user = action.payload.user;
//       if (action.payload.email) state.email = action.payload.email;
//       if (action.payload.role) state.role = action.payload.role;
//     },
//     updateTokens: (state, action) => {
//       if (action.payload.authToken) {
//         state.authToken = action.payload.authToken;
//         const expiryTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes
//         state.tokenExpiry = expiryTime;
//       }
//       if (action.payload.refreshToken) {
//         state.refreshToken = action.payload.refreshToken;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(refreshToken.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(refreshToken.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.authToken = action.payload.authToken;
//         state.refreshToken = action.payload.refreshToken; // Update refresh token
//         const expiryTime = new Date().getTime() + 30 * 60 * 1000; // 30 minutes
//         state.tokenExpiry = expiryTime;
//       })
//       .addCase(refreshToken.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload;
//         state.user = null;
//         state.authToken = null;
//         state.refreshToken = null;
//         state.email = null;
//         state.role = null;
//         state.is_active = null;
//         state.tokenExpiry = null;
//       });
//   },
// });

// export const { 
//   loginStart, 
//   loginSuccess, 
//   loginFailure, 
//   logout, 
//   updateUserInfo,
//   updateTokens
// } = authSlice.actions;

// export default authSlice.reducer;