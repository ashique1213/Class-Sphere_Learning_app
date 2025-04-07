// notificationapi.js
import api from "./api";

// Notification API service
const notificationApi = {
  // Get all notifications
  getNotifications: (token) =>
    api.get("/notifications/" ),

  // Mark a notification as read
  markAsRead: (id) =>
    api.post(
      `/notifications/${id}/mark-as-read/`,
      {},
    ),

  // Clear all notifications
  clearAll: () =>
    api.post(
      "/notifications/clear/",
      {},
    ),

  // Create a test notification (optional, for testing purposes)
  createTestNotification: (message) =>
    api.post(
      "/notifications/",
      { message },
    ),

    logout: (refreshToken) =>
      api.post(
        "/logout/",
        { refresh: refreshToken },
        {
          withCredentials: true,
        }
      ),
};

export default notificationApi;