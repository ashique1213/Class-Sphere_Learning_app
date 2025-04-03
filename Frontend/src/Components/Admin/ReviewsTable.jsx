import React, { useState, useEffect } from "react";
import { FaSearch, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { Star} from "lucide-react";
import {getAdminAllReviews,approveReview,deleteReview} from "../../api/reviewapi";

const ReviewsTable = () => {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [approveId, setApproveId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const reviewsPerPage = 7;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.auth.authToken);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/adminlogin");
  };

  const fetchReviews = async () => {
    try {
      const data = await getAdminAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
    }
  };

  const handleApproveReview = async () => {
    try {
      await approveReview(approveId);
      await fetchReviews();
      setApproveId(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await deleteReview(deleteId);
      await fetchReviews();
      setDeleteId(null);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchReviews();
    } else {
      navigate("/adminlogin");
    }
  }, [authToken]);

  const filteredReviews = reviews.filter((review) =>
    review.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  return (
    <div className="flex-1 p-4 sm:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold">Reviews</h2>
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search by name..."
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
              <th className="p-2">Role</th>
              <th className="p-2">Content</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.length > 0 ? (
              currentReviews.map((review) => (
                <tr key={review.id} className="border-b text-xs sm:text-sm">
                  <td className="p-2">{review.id}</td>
                  <td className="p-2">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt="Profile"
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      />
                    ) : (
                      <FaUserCircle className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    )}
                  </td>
                  <td className="p-2 capitalize">{review.name}</td>
                  <td className="p-2 capitalize">{review.role}</td>
                  <td className="p-2 break-all">{review.content}</td>
                  <td className="p-2">
                    <div className="flex text-teal-500">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </td>
                  <td className="p-2">
                    <span
                      className={`py-1 rounded text-xs sm:text-sm font-bold ${
                        review.is_approved ? "text-teal-500" : "text-red-500"
                      }`}
                    >
                      {review.is_approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    {!review.is_approved && (
                      <button
                        onClick={() => setApproveId(review.id)}
                        className="bg-teal-400 text-white px-2 sm:px-3 py-1 rounded hover:bg-teal-600 text-xs sm:text-sm"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteId(review.id)}
                      className="bg-red-400 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-600 text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-sm sm:text-base">
                  No reviews found
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

      {/* Approve Modal */}
      {approveId && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50">
          <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-100">
            <h3 className="text-base sm:text-lg font-semibold">Confirm Approval</h3>
            <p className="text-gray-600 my-2 sm:my-3 text-sm sm:text-base">
              Are you sure you want to approve this review?
            </p>
            <div className="flex justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
              <button
                onClick={handleApproveReview}
                className="bg-teal-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-teal-600 text-sm sm:text-base"
              >
                Confirm
              </button>
              <button
                onClick={() => setApproveId(null)}
                className="bg-gray-300 px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-gray-400 text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50">
          <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-100">
            <h3 className="text-base sm:text-lg font-semibold">Confirm Deletion</h3>
            <p className="text-gray-600 my-2 sm:my-3 text-sm sm:text-base">
              Are you sure you want to delete this review?
            </p>
            <div className="flex justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
              <button
                onClick={handleDeleteReview}
                className="bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-600 text-sm sm:text-base"
              >
                Confirm
              </button>
              <button
                onClick={() => setDeleteId(null)}
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

export default ReviewsTable;