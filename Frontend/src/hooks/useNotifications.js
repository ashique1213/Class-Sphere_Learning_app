import { useState, useEffect, useRef } from "react";
import notificationApi from "../api/notificationapi";

const useNotifications = (isAuthenticated, authToken, wsBaseUrl) => {
  const [notifications, setNotifications] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && authToken) {
      fetchNotifications();
    }
  }, [isAuthenticated, authToken]);

  useEffect(() => {
    if (!isAuthenticated || !authToken) return;

    if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
      const websocket = new WebSocket(
        `${wsBaseUrl}/notifications/?token=${authToken}`
      );

      websocket.onopen = () => {
        console.log("WebSocket connected successfully");
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNotifications((prev) => [
          {
            id: data.id,
            message: data.message,
            notification_type: data.notification_type,
            time_ago: data.time_ago,
            is_read: data.is_read,
          },
          ...prev,
        ]);
      };

      websocket.onclose = () => {
        console.log("WebSocket disconnected");
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current = websocket;
    }

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket connection");
        wsRef.current.close();
      }
    };
  }, [authToken, isAuthenticated, wsBaseUrl]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationApi.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const closeWebSocket = () => {
    if (wsRef.current) wsRef.current.close();
  };

  return { notifications, clearNotifications, closeWebSocket };
};

export default useNotifications;
