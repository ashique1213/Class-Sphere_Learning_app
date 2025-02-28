import React from "react";
import { FaSearch, FaSignOutAlt } from "react-icons/fa";

const StudentsTable = () => {
  return (
    <>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Students</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search here..."
                className="border px-4 py-2 rounded-md"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
            <FaSignOutAlt className="text-lg cursor-pointer" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Name</th>
                <th className="p-2">ID</th>
                <th className="p-2">Date</th>
                <th className="p-2">Email</th>
                <th className="p-2">City</th>
                <th className="p-2">Contact</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">Samanta William</td>
                  <td className="p-2 text-teal-500">#123456789</td>
                  <td className="p-2">March 25, 2021</td>
                  <td className="p-2">Demo@gmail.com</td>
                  <td className="p-2">Jakarta</td>
                  <td className="p-2">8888888888</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              className="px-4 py-2 rounded-full bg-teal-500 text-white"
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default StudentsTable;
