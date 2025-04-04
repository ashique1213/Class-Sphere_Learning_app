import React, { useState, useEffect } from "react";
import { HiOutlineUsers } from "react-icons/hi";
import { IoWalletOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/Nav_logo.svg";
import { FaComment } from "react-icons/fa"; 

const Sidebar = () => {
  const [active, setActive] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard className="text-lg" />, path: "/admindashboard" },
    { name: "Students", icon: <HiOutlineUsers className="text-lg" />, path: "/students" },
    { name: "Teachers", icon: <HiOutlineUsers className="text-lg" />, path: "/teachers" },
    { name: "Reviews", icon: <FaComment className="text-lg" />, path: "/reviews" },
    { name: "Subscription", icon: <IoWalletOutline className="text-lg" />, path: "/subscription" }, // Added
    { name: "Finance", icon: <IoWalletOutline className="text-lg" /> },
  ];

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <div className="md:hidden flex justify-between items-center p-4 bg-black text-white">
        <img src={logo} alt="Logo" className="w-28" />
        <button onClick={() => setIsOpen(!isOpen)}>
          <FaBars className="text-xl" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`w-64 min-h-screen bg-black text-white p-5 fixed top-0 left-0 z-50 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:w-64`}
      >
        <a href="#" className="flex items-center space-x-3 mb-5">
          <img src={logo} alt="Logo" className="w-28 sm:w-32 md:w-36 py-1 h-auto" />
        </a>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => {
                navigate(item.path || "#");
                setIsOpen(false);
              }}
              className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-md transition ${
                active === item.path ? "bg-teal-500" : "hover:bg-gray-800"
              }`}
            >
              {item.icon}
              <span className="text-sm sm:text-base">{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;