import axios from "axios";
import store from "../redux/store";
import { refreshToken,logout } from "../redux/authSlice";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensure cookies are sent
});

// Helper to get CSRF token from cookies
const getCsrfToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; csrftoken=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const authToken = state.auth.authToken;
    const tokenExpiry = state.auth.tokenExpiry;

    if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    // Add CSRF token for POST, PUT, DELETE requests
    if (["post", "put", "delete"].includes(config.method.toLowerCase())) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { authToken } = await store.dispatch(refreshToken()).unwrap();
        originalRequest.headers.Authorization = `Bearer ${authToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;