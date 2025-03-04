import React, { useState, useEffect } from "react";
import { HiOutlineUsers } from "react-icons/hi";
import { IoWalletOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Nav_logo.svg";

const Sidebar = () => {
  const [active, setActive] = useState("");
  const navigate = useNavigate(); // Use navigate for routing
  const location = useLocation(); // This will help in getting the current path

  const menuItems = [
    { name: "Dashboard", icon: <MdDashboard className="text-lg" />, path: "/admindashboard" },
    { name: "Students", icon: <HiOutlineUsers className="text-lg" />, path: "/students" },
    { name: "Teachers", icon: <HiOutlineUsers className="text-lg" />, path: "/teachers" },
    { name: "Finance", icon: <IoWalletOutline className="text-lg" />,},
  ];

  // Update active menu item based on current route
  useEffect(() => {
    setActive(location.pathname); // This will set the active state according to the path
  }, [location]);

  return (
    <div className="w-64 h-screen bg-black text-white p-6 fixed md:relative">
      <a href="#" className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="w-36 py-4" />
      </a>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={() => {
              navigate(item.path); // Navigate to the selected path
            }}
            className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-md transition ${
              active === item.path ? "bg-teal-500" : "hover:bg-gray-800"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
