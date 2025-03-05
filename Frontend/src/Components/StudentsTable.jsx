import React, { useState, useEffect } from "react";
import { FaSearch, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { logout } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 7;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get auth token from Redux store
  const authToken = useSelector((state) => state.auth.authToken);

  // Create an axios instance with default headers
  const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/adminlogin");
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get("students/");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);

      // If unauthorized, logout
      if (error.response && error.response.status === 401) {
        dispatch(logout());
        navigate("/adminlogin");
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Block student functionality
  const handleBlockUser = async (userId) => {
    try {
      await axiosInstance.post(`block/${userId}/`);
      fetchStudents();
    } catch (error) {
      console.error("Error blocking user:", error);

      if (error.response && error.response.status === 401) {
        dispatch(logout());
        navigate("/adminlogin");
      }

      // Show error message
      alert(error.response?.data?.message || "Failed to block user");
    }
  };

  // Unblock student functionality
  const handleUnblockUser = async (userId) => {
    try {
      await axiosInstance.post(`unblock/${userId}/`);
      // Refresh the students list
      fetchStudents();
    } catch (error) {
      console.error("Error unblocking user:", error);

      // If unauthorized, logout
      if (error.response && error.response.status === 401) {
        dispatch(logout());
        navigate("/adminlogin");
      }

      // Show error message
      alert(error.response?.data?.message || "Failed to unblock user");
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="flex-1 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Students</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search here..."
              className="border px-4 py-2 rounded-md pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <FaSignOutAlt
            onClick={handleLogout}
            className="text-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Profile</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Gender</th>
              <th className="p-2">DOB</th>
              <th className="p-2">Phone</th>
              <th className="p-2">City</th>
              <th className="p-2">Verified</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student.id} className="border-b">
                  <td className="p-2">{student.id}</td>
                  <td className="p-2">
                    {student.profile_image ? (
                      <img
                        src={student.profile_image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <FaUserCircle className="w-10 h-10 text-gray-400" />
                    )}
                  </td>
                  <td className="p-2 capitalize">{student.username}</td>
                  <td className="p-2">{student.email}</td>
                  <td className="p-2 capitalize">{student.role}</td>
                  <td className="p-2">{student.gender || "None"}</td>
                  <td className="p-2">{student.dob || "None"}</td>
                  <td className="p-2">{student.phone || "None"}</td>
                  <td className="p-2">{student.place || "None"}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-sm font-bold rounded ${
                        student.is_block
                          ? "bg-teal-400 text-white"
                          : "bg-red-400 text-white"
                      }`}
                    >
                      {student.is_block ? "Block" : "UnBlock"}
                    </span>
                  </td>
                  <td className="p-2 text-sm font-bold">
                    {student.is_block ? (
                      <button
                        onClick={() => handleBlockUser(student.id)}
                        className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-800"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnblockUser(student.id)}
                        className="bg-teal-400 text-white px-3 py-1 rounded hover:bg-teal-800"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="p-4 text-center">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded-full ${
              currentPage === index + 1
                ? "bg-teal-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentsTable;
