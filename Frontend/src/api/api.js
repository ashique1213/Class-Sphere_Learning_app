import axios from "axios";
import store from "../redux/store"; 
import { updateTokens, logout } from "../redux/authSlice"; 
import { persistor } from "../redux/store";

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to refresh access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = store.getState().auth.refreshToken;
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/token/refresh/`,
      { refresh: refreshToken }
    );

    const { access, refresh } = response.data;

    // Update Redux store with new tokens
    store.dispatch(
      updateTokens({
        authToken: access,
        refreshToken: refresh || refreshToken, // Use new refresh token if provided
      })
    );

    return access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    await persistor.purge(); // Purge persisted state
    localStorage.clear(); // Clear local storage
    store.dispatch(logout()); // Logout if refresh fails
    throw error;
  }
};

// Request Interceptor: Attach access token to headers
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.authToken;
    const tokenExpiry = store.getState().auth.tokenExpiry;

    // Attach token if it exists and hasn’t expired
    if (token && tokenExpiry) {
      const now = new Date().getTime();
      if (now >= tokenExpiry) {
        // Token expired, don’t attach it (response interceptor will refresh)
        return config;
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 errors and refresh token
api.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors and retry with refreshed token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      store.getState().auth.refreshToken
    ) {
      originalRequest._retry = true; // Prevent infinite loops
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // Pass other errors through
  }
);

export default api;


// import axios from "axios";
// import store from "../redux/store";
// import { refreshToken,logout } from "../redux/authSlice";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // Ensure cookies are sent
// });

// // Helper to get CSRF token from cookies
// const getCsrfToken = () => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; csrftoken=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
//   return null;
// };

// api.interceptors.request.use(
//   (config) => {
//     const state = store.getState();
//     const authToken = state.auth.authToken;
//     const tokenExpiry = state.auth.tokenExpiry;

//     if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
//       config.headers.Authorization = `Bearer ${authToken}`;
//     }

//     // Add CSRF token for POST, PUT, DELETE requests
//     if (["post", "put", "delete"].includes(config.method.toLowerCase())) {
//       const csrfToken = getCsrfToken();
//       if (csrfToken) {
//         config.headers["X-CSRFToken"] = csrfToken;
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const { authToken } = await store.dispatch(refreshToken()).unwrap();
//         originalRequest.headers.Authorization = `Bearer ${authToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         store.dispatch(logout());
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;