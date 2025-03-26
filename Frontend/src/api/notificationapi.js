// notificationapi.js
import api from "./api";

// Notification API service
const notificationApi = {
  // Get all notifications
  getNotifications: (token) =>
    api.get("/notifications/", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Mark a notification as read
  markAsRead: (id, token) =>
    api.post(
      `/notifications/${id}/mark-as-read/`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),

  // Clear all notifications
  clearAll: (token) =>
    api.post(
      "/notifications/clear/",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),

  // Create a test notification (optional, for testing purposes)
  createTestNotification: (message, token) =>
    api.post(
      "/notifications/",
      { message },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),
};

export default notificationApi;