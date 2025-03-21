import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi";
import { IoWalletOutline } from "react-icons/io5";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboardcontent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/adminlogin");
  };

  return (
    <div className="flex-1 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Dashboard</h2>
        <div className="flex items-center space-x-4">
          <FaSignOutAlt
            onClick={handleLogout}
            className="text-lg sm:text-xl cursor-pointer"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <HiOutlineUsers className="text-3xl sm:text-4xl text-teal-500 mr-3 sm:mr-4" />
          <div>
            <p className="text-gray-500 text-sm sm:text-base">Students</p>
            <p className="text-lg sm:text-xl font-bold">932</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <HiOutlineUsers className="text-3xl sm:text-4xl text-orange-500 mr-3 sm:mr-4" />
          <div>
            <p className="text-gray-500 text-sm sm:text-base">Teachers</p>
            <p className="text-lg sm:text-xl font-bold">754</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <IoWalletOutline className="text-3xl sm:text-4xl text-yellow-500 mr-3 sm:mr-4" />
          <div>
            <p className="text-gray-500 text-sm sm:text-base">Finance</p>
            <p className="text-lg sm:text-xl font-bold">40</p>
          </div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h3 className="text-base sm:text-lg font-semibold mb-4">User Performance</h3>
        <div className="w-full h-48 sm:h-64">
          <p className="text-gray-400 text-center text-sm sm:text-base">Graph Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboardcontent;