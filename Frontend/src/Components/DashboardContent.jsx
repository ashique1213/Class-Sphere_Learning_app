import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { HiOutlineUsers } from "react-icons/hi";
import { IoWalletOutline } from "react-icons/io5";
import { logout } from "../redux/authSlice";
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
    <div className="flex-1 p-6 overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <FaSignOutAlt
            onClick={handleLogout}
            className="text-lg cursor-pointer"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <HiOutlineUsers className="text-4xl text-teal-500 mr-4" />
          <div>
            <p className="text-gray-500">Students</p>
            <p className="text-xl font-bold">932</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <HiOutlineUsers className="text-4xl text-orange-500 mr-4" />
          <div>
            <p className="text-gray-500">Teachers</p>
            <p className="text-xl font-bold">754</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
          <IoWalletOutline className="text-4xl text-yellow-500 mr-4" />
          <div>
            <p className="text-gray-500">Finance</p>
            <p className="text-xl font-bold">40</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">User Performance</h3>
        <div className="w-full h-64">
          {" "}
          {/* Placeholder for the graph */}
          <p className="text-gray-400 text-center">Graph Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboardcontent;
