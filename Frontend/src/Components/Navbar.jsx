import React, { useState } from "react";
import logo from "../assets/Nav_logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { persistor } from "../redux/store";
import api from "../api/api";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authToken, refreshToken } = useSelector((state) => state.auth); // Get refreshToken
  const isAuthenticated = !!authToken;

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await api.post(
          "/logout/",
          { refresh: refreshToken },
          {
            headers: { Authorization: `Bearer ${authToken}` },
            withCredentials: true,
          }
        );
        toast.success(response.data.message || "Logged out successfully");
      }

      dispatch(logout()); // Clear Redux state
      await persistor.flush(); // Persist cleared state
      navigate("/"); 
      // window.location.reload(); 
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      dispatch(logout());
      await persistor.flush();
      navigate("/");
      // window.location.reload();
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
            to="/"
            className="block md:inline-block text-white text-md font-bold hover:text-teal-900 transition py-2 md:py-0 border-b border-transparent hover:border-teal-200 md:hover:border-b"
          >
            About Us
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/"
                className="block md:inline-block text-white text-md font-bold hover:text-teal-900 transition py-2 md:py-0 border-b border-transparent hover:border-teal-200 md:hover:border-b"
              >
                Chat
              </Link>
              <Link to="/" onClick={handleLogout}>
                <button className="block md:inline-block bg-teal-200 text-teal-800 px-4 py-1 rounded-full hover:bg-teal-300 transition duration-200 w-full md:w-auto mt-2 md:mt-0 font-medium">
                  Sign Out
                </button>
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