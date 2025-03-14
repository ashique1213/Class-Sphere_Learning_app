import React, { useState, useEffect } from "react";
import { FaSearch, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { fetchStudents, blockUser, unblockUser } from "../api/adminapi";

const StudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blockUserId, setBlockUserId] = useState(null);
  const studentsPerPage = 7;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.auth.authToken);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/adminlogin");
  };

  // Fetch students
  const getStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (error) {
      console.error("Error in getStudents:", error.message);
      // Rely on api.js interceptor for 401 handling
    }
  };

  // Block/Unblock student
  const handleBlockUnblockUser = async () => {
    try {
      const user = students.find((t) => t.id === blockUserId);
      if (user.is_active) {
        await blockUser(blockUserId);
      } else {
        await unblockUser(blockUserId);
      }
      await getStudents(); // Refresh list
      setBlockUserId(null);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (authToken) {
      getStudents();
    } else {
      navigate("/adminlogin");
    }
  }, [authToken]);

  // Filter and Pagination Logic
  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
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
          <FaSignOutAlt onClick={handleLogout} className="text-lg cursor-pointer" />
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
              <th className="p-2">Status</th>
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
                        student.is_active ? "text-teal-400" : "text-red-500"
                      }`}
                    >
                      {student.is_active ? "Unblocked" : "Blocked"}
                    </span>
                  </td>
                  <td className="p-2 text-sm font-bold">
                    {student.is_active ? (
                      <button
                        onClick={() => setBlockUserId(student.id)}
                        className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-800"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => setBlockUserId(student.id)}
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
                <td colSpan="11" className="p-4 text-center">No students found</td>
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
              currentPage === index + 1 ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Block/Unblock Confirmation Modal */}
      {blockUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h3 className="text-lg font-semibold">Confirm Action</h3>
            <p className="text-gray-600 my-3">
              Are you sure you want to{" "}
              {students.find((t) => t.id === blockUserId)?.is_active ? "block" : "unblock"}{" "}
              this user?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleBlockUnblockUser}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setBlockUserId(null)}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsTable;