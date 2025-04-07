import React, { useState, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import notificationApi from "../../api/notificationapi";
import Navbar from "../../Components/Layouts/Navbar";
import Footer from "../../Components/Layouts/Footer";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { authToken } = useSelector((state) => state.auth);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (authToken) {
      fetchNotifications();
    }else {
      navigate("/signup"); 
    }
  }, [authToken]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      toast.error("Failed to fetch notifications");
      console.error(error);
    }finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <FaSpinner className="animate-spin text-teal-500 text-4xl" />
        </div>
        <Footer />
      </>
    );
  }
  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(
        notifications.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
      console.error(error);
    }
  };

  const clearAll = async () => {
    try {
      await notificationApi.clearAll();
      setNotifications([]);
      toast.success("All notifications cleared");
    } catch (error) {
      toast.error("Failed to clear notifications");
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-4 pt-5 pb-10">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-black">
            <Link to="/" className="transition-colors hover:underline">
              Home
            </Link>
            <span className="mx-1">|</span>
            <span className="font-medium">Notifications</span>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Notifications
                </h2>
                <button
                  onClick={clearAll}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    notifications.length === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-teal-600 hover:text-teal-800 hover:bg-teal-50"
                  }`}
                  disabled={notifications.length === 0}
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mb-4">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">
                  No notifications to display
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      notif.is_read ? "bg-white" : "bg-teal-50/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            notif.is_read ? "bg-gray-300" : "bg-teal-500"
                          }`}
                        />
                        <div>
                          <p
                            className={`text-base ${
                              notif.is_read
                                ? "text-gray-600"
                                : "text-gray-800 font-medium"
                            }`}
                          >
                            {notif.message}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {notif.time_ago} ago
                          </p>
                        </div>
                      </div>
                      {!notif.is_read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-sm font-medium text-teal-600 hover:text-teal-800 hover:bg-teal-100 px-3 py-1 rounded-md transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-teal-600 hover:text-teal-800 font-medium transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Notifications;