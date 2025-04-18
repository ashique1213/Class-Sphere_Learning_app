import React, { useState, useEffect, useRef } from "react";
import logo from "../../assets/Nav_logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { persistor } from "../../redux/store";
import notificationApi from "../../api/notificationapi";
import { checkUserSubscription } from "../../api/subscriptionapi";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authToken, refreshToken } = useSelector((state) => state.auth);
  const isAuthenticated = !!authToken;
  const wsBaseUrl = import.meta.env.VITE_WS_URL;

  // Use ref to persist WebSocket instance across renders
  const wsRef = useRef(null);

  // Fetch initial notifications and subscription
  useEffect(() => {
    if (isAuthenticated && authToken) {
      fetchNotifications();
      fetchSubscriptionStatus();
    }
  }, [isAuthenticated, authToken]);

  // Separate WebSocket logic into its own effect
  useEffect(() => {
    if (!isAuthenticated || !authToken) return;

    // Only initialize if not already connected
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

    // Cleanup only when component unmounts or authToken changes
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket connection");
        wsRef.current.close();
      }
    };
  }, [authToken, isAuthenticated]); // Only re-run if authToken or isAuthenticated changes

  const fetchNotifications = async () => {
    try {
      const response = await notificationApi.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const subscriptionData = await checkUserSubscription(authToken);
      setCurrentSubscription(subscriptionData);
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
    }
  };

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        const response = await notificationApi.logout(refreshToken, authToken);
        toast.success("Logged out successfully");
      }
      dispatch(logout());
      localStorage.clear();
      setNotifications([]);
      setCurrentSubscription(null);
      if (wsRef.current) wsRef.current.close();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      dispatch(logout());
      localStorage.clear();
      setNotifications([]);
      setCurrentSubscription(null);
      if (wsRef.current) wsRef.current.close();
      navigate("/");
    }
  };

  // Handle Chat button click
  const handleChatClick = () => {
    const hasPaidPlan = currentSubscription?.subscribed && currentSubscription.subscription.plan.name !== "free";
    if (hasPaidPlan) {
      navigate("/chat");
    } else {
      toast.info("Chat is available only with a paid plan. Please upgrade.");
      navigate("/plans");
    }
  };

  return (
    <nav className="bg-teal-500 fixed w-full z-20 top-0 start-0 border-b border-teal-400 shadow-sm">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2.5">
        <a href="#" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-36" />
        </a>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 w-10 h-10 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            />
          </svg>
        </button>
        <div
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-teal-500 md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 ${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6 transition-all duration-300`}
        >
          <Link
            to="/"
            className="block md:inline-block text-white text-md font-bold hover:text-teal-900 transition py-2 md:py-0 border-b border-transparent hover:border-teal-200 md:hover:border-b"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block md:inline-block text-white text-md font-bold hover:text-teal-900 transition py-2 md:py-0 border-b border-transparent hover:border-teal-200 md:hover:border-b"
          >
            About Us
          </Link>
          {isAuthenticated && (
            <>
              <button
                onClick={handleChatClick}
                className="block md:inline-block text-white text-md font-bold hover:text-teal-900 transition py-2 md:py-0 border-b border-transparent hover:border-teal-200 md:hover:border-b w-full md:w-auto text-left"
              >
                Chat
              </button>
              <Link to="/" onClick={handleLogout}>
                <button className="block md:inline-block bg-teal-200 text-teal-800 px-4 py-1 rounded-full hover:bg-teal-300 transition duration-200 w-full md:w-auto mt-2 md:mt-0 font-medium">
                  Sign Out
                </button>
              </Link>
              <Link to="/notifications" className="relative block md:inline-block p-2 md:p-0">
                <svg
                  className="w-6 h-6 text-white hover:text-teal-900 transition duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {notifications.length > 0 && notifications.filter((n) => !n.is_read).length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.filter((n) => !n.is_read).length}
                  </span>
                )}
              </Link>
              <Link
                to="/Profile"
                className="block md:inline-block text-white text-md font-bold hover:text-teal-900 transition py-2 md:py-0 border-b border-transparent hover:border-teal-200 md:hover:border-b"
              >
                My Account
              </Link>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/signup?mode=signin">
                <button className="block md:inline-block bg-white text-teal-900 px-4 py-1 rounded-full hover:bg-gray-100 transition duration-200 w-full md:w-auto mt-2 md:mt-0 font-medium shadow-sm">
                  Sign In
                </button>
              </Link>
              <Link to="/signup?mode=signup">
                <button className="block md:inline-block bg-teal-200 text-teal-800 px-4 py-1 rounded-full hover:bg-teal-300 transition duration-200 w-full md:w-auto mt-2 md:mt-0 font-medium shadow-sm">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;