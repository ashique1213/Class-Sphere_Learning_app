import React from "react";
import logo from "../assets/Nav_logo.svg";

const Navbar = () => {
  return (
    <div>
      <nav className="bg-teal-500 fixed w-full z-20 top-0 start-0 border-b border-teal-400">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2.5">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={logo} alt="Logo" className="w-36" />
          </a>
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-white text-md hover:text-teal-900 transition"
            >
              Home
            </a>
            <a
              href="#"
              className="text-white text-md hover:text-teal-900 transition"
            >
              About Us
            </a>
            <button
              type="button"
              className="bg-white opacity-90 text-sm text-teal-900 px-4 py-1 rounded-full hover:opacity-100 transition"
            >
              Sign In
            </button>
            <button
              type="button"
              className="bg-teal-200 opacity-90 text-sm text-teal-800 px-4 py-1 rounded-full hover:opacity-100 transition"
            >
              Sign Up
            </button>
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
