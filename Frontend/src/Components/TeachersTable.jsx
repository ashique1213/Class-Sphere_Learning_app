import React, { useState, useEffect } from "react";
import { FaSearch, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import {
  fetchTeachers,
  verifyTeacher,
  blockUser,
  unblockUser,
} from "../api/adminapi";

const TeachersTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [verifyId, setVerifyId] = useState(null);
  const [blockUserId, setBlockUserId] = useState(null);
  const teachersPerPage = 7;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.auth.authToken);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/adminlogin");
  };

  const getTeachers = async () => {
    try {
      const data = await fetchTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Error in getTeachers:", error.message);
    }
  };

  const handleVerifyUser = async () => {
    try {
      await verifyTeacher(verifyId);
      await getTeachers();
      setVerifyId(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleBlockUnblockUser = async () => {
    try {
      const user = teachers.find((t) => t.id === blockUserId);
      if (user.is_active) {
        await blockUser(blockUserId);
      } else {
        await unblockUser(blockUserId);
      }
      await getTeachers();
      setBlockUserId(null);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (authToken) {
      getTeachers();
    } else {
      navigate("/adminlogin");
    }
  }, [authToken]);

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  return (
    <div className="flex-1 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Teachers</h2>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search here..."
              className="border px-3 py-2 rounded-md pr-10 w-full text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-sm sm:text-base" />
          </div>
          <FaSignOutAlt
            onClick={handleLogout}
            className="text-lg sm:text-xl cursor-pointer flex-shrink-0"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b text-left text-xs sm:text-sm">
              <th className="p-2">ID</th>
              <th className="p-2">Profile</th>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Gender</th>
              <th className="p-2">DOB</th>
              <th className="p-2">Phone</th>
              <th className="p-2">City</th>
              <th className="p-2">User-Status</th>
              <th className="p-2">Actions</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {currentTeachers.length > 0 ? (
              currentTeachers.map((teacher) => (
                <tr key={teacher.id} className="border-b text-xs sm:text-sm">
                  <td className="p-2">{teacher.id}</td>
                  <td className="p-2">
                    {teacher.profile_image ? (
                      <img
                        src={teacher.profile_image}
                        alt="Profile"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      />
                    ) : (
                      <FaUserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    )}
                  </td>
                  <td className="p-2 capitalize">{teacher.username}</td>
                  <td className="p-2 break-all">{teacher.email}</td>
                  <td className="p-2 capitalize">{teacher.role}</td>
                  <td className="p-2">{teacher.gender || "None"}</td>
                  <td className="p-2">{teacher.dob || "None"}</td>
                  <td className="p-2">{teacher.phone || "None"}</td>
                  <td className="p-2">{teacher.place || "None"}</td>
                  <td className="p-2">
                    <span
                      className={`py-1 rounded text-xs sm:text-sm font-bold ${
                        teacher.is_active ? "text-teal-500" : "text-red-500"
                      }`}
                    >
                      {teacher.is_active ? "Unblocked" : "Blocked"}
                    </span>
                  </td>
                  <td className="p-2">
                    {teacher.is_active ? (
                      <button
                        onClick={() => setBlockUserId(teacher.id)}
                        className="bg-red-400 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-800 text-xs sm:text-sm"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => setBlockUserId(teacher.id)}
                        className="bg-teal-400 text-white px-2 sm:px-3 py-1 rounded hover:bg-teal-800 text-xs sm:text-sm"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() =>
                        !teacher.is_verified && setVerifyId(teacher.id)
                      }
                      className={`flex items-center gap-1 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-md shadow-md transition-all duration-300 ${
                        teacher.is_verified
                          ? "bg-teal-400 text-white cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-white border-red-600"
                      }`}
                      disabled={teacher.is_verified}
                    >
                      {teacher.is_verified ? (
                        <>
                          <CheckCircle size={16} /> Verified
                        </>
                      ) : (
                        <>
                          <XCircle size={16} /> Verify
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="p-4 text-center text-sm sm:text-base">
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center mt-4 space-x-2 flex-wrap gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm ${
              currentPage === index + 1 ? "bg-teal-500 text-white" : "bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Verification Modal */}
      {verifyId && !teachers.find((t) => t.id === verifyId)?.is_verified && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-100">
            <h3 className="text-base sm:text-lg font-semibold">Confirm Verification</h3>
            <p className="text-gray-600 my-2 sm:my-3 text-sm sm:text-base">
              Are you sure you want to verify this user?
            </p>
            <div className="flex justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
              <button
                onClick={handleVerifyUser}
                className="bg-teal-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-teal-600 text-sm sm:text-base"
              >
                Confirm
              </button>
              <button
                onClick={() => setVerifyId(null)}
                className="bg-gray-300 px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-gray-400 text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block/Unblock Confirmation Modal */}
      {blockUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-100">
            <h3 className="text-base sm:text-lg font-semibold">Confirm Action</h3>
            <p className="text-gray-600 my-2 sm:my-3 text-sm sm:text-base">
              Are you sure you want to{" "}
              {teachers.find((t) => t.id === blockUserId)?.is_active ? "block" : "unblock"}{" "}
              this user?
            </p>
            <div className="flex justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
              <button
                onClick={handleBlockUnblockUser}
                className="bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-600 text-sm sm:text-base"
              >
                Confirm
              </button>
              <button
                onClick={() => setBlockUserId(null)}
                className="bg-gray-300 px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-gray-400 text-sm sm:text-base"
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

export default TeachersTable;