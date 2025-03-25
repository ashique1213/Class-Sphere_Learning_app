import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Layouts/Navbar";
import Footer from "../../Components/Layouts/Footer";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "New message received",
      time: "2 minutes ago",
      isRead: false,
    },
    {
      id: 2,
      message: "Profile update successful",
      time: "1 hour ago",
      isRead: true,
    },
    {
      id: 3,
      message: "System maintenance scheduled",
      time: "3 hours ago",
      isRead: false,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-4 pt-16 sm:pt-20 md:pt-20">
        <div className="text-sm text-black max-w-full sm:max-w-5xl  mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-teal-800">
                Notifications
              </h2>
              <button
                onClick={clearAll}
                className="text-sm text-teal-600 hover:text-teal-800 transition duration-200"
                disabled={notifications.length === 0}
              >
                Clear All
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No notifications to display</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      notif.isRead ? "bg-gray-50" : "bg-teal-50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          notif.isRead ? "bg-gray-300" : "bg-teal-500"
                        }`}
                      />
                      <div>
                        <p
                          className={`${
                            notif.isRead
                              ? "text-gray-600"
                              : "text-teal-800 font-medium"
                          }`}
                        >
                          {notif.message}
                        </p>
                        <p className="text-sm text-gray-500">{notif.time}</p>
                      </div>
                    </div>
                    {!notif.isRead && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-sm text-teal-600 hover:text-teal-800 transition duration-200"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-teal-600 hover:text-teal-800 transition duration-200 font-medium"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Notifications;
