import React from "react";
import { HiOutlineUsers } from "react-icons/hi";
import { IoWalletOutline } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import logo from '../assets/Nav_logo.svg'

const Sidebar = () => {
  return (
    <>
      <div className="w-64 h-screen bg-black text-white p-6 fixed md:relative">
        {/* <h1 className="text-xl font-bold text-white mb-6">ClassSphere</h1> */}
        <a href="#" className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-36 py-4" />
        </a>
        <ul className="space-y-4">
          <li className="flex items-center space-x-2 cursor-pointer bg-teal-500 px-3 py-2 rounded-md">
            <MdDashboard className="text-lg" />
            <span>Dashboard</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer">
            <HiOutlineUsers className="text-lg" />
            <span>Students</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer">
            <HiOutlineUsers className="text-lg" />
            <span>Teachers</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer">
            <IoWalletOutline className="text-lg" />
            <span>Finance</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
