import React, { useState, useEffect } from "react";
import { FaUsers, FaCalendarAlt, FaShareAlt, FaTrash } from "react-icons/fa";
import { MdOutlineTopic } from "react-icons/md";
import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";
import Createclassform from "../../../Components/Teacher/Createclassform"
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchClasses, deleteClassroom } from "../../../api/classroomapi";

const Createclass = () => {
  const { teachername } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const authToken = useSelector((state) => state.auth.authToken);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const data = await fetchClasses(teachername, authToken);
        setClassrooms(data);
      } catch (error) {
        toast.error("Failed to fetch classrooms");
      }
    };

    if (authToken) {
      loadClasses();
    }
  }, [authToken, teachername]);

  const confirmDelete = (id) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteClassroom(deleteId, authToken);
      setClassrooms((prevClassrooms) =>
        prevClassrooms.filter((classItem) => classItem.id !== deleteId)
      );
      setDeleteId(null);
      toast.success("Classroom deleted successfully!");
    } catch (error) {
      console.error("Error deleting classroom:", error);
      toast.error("Failed to delete classroom. Please try again.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Classroom link copied!");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-4 pt-16 sm:pt-20 md:pt-20">
        {/* Breadcrumbs */}
        <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4">
          Home |{" "}
          <Link to="/profile" className="text-black hover:underline">
            My Account
          </Link>{" "}
          |{" "}
          <Link to="/profile" className="capitalize hover:underline">
            {teachername}
          </Link>{" "}
          |<span className="font-bold"> Class Rooms</span>
        </div>

        {/* Header */}
        <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaUsers className="text-3xl sm:text-4xl md:text-5xl" />
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                Class Rooms
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Browse and join classes from different teachers
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
              <button
                className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition w-full md:w-auto"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Close Form" : "Create Class"}
              </button>
            </div>
          </div>
        </div>

        {/* Show Create Class Form */}
        {showForm && (
          <div className="max-w-full sm:max-w-4xl mx-auto mb-6 px-4">
            <Createclassform
              onClose={() => setShowForm(false)}
              refreshClasses={fetchClasses}
            />
          </div>
        )}

        {/* Classroom Cards */}
        {classrooms.length === 0 ? (
          <div className="text-center text-gray-600 mt-4 text-sm sm:text-base">
            No classrooms available.
          </div>
        ) : (
          <>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-6">
              Available Classrooms
            </h2>
            <div className="max-w-full sm:max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
              {classrooms.map((classItem) => (
                <div
                  key={classItem.id}
                  className="relative bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition flex flex-col items-center text-center"
                >
                  {/* Floating Icon */}
                  <div className="absolute -top-5 sm:-top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-teal-500 text-white flex items-center justify-center rounded-full shadow-md">
                    <FaUsers className="text-xl sm:text-2xl md:text-3xl" />
                  </div>

                  {/* Delete Icon */}
                  <button
                    onClick={() => confirmDelete(classItem.id)}
                    className="absolute top-3 right-7 sm:right-9 text-gray-500 hover:text-red-700 transition"
                    title="Delete Classroom"
                  >
                    <FaTrash className="text-sm sm:text-base" />
                  </button>

                  {/* Share Icon */}
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${window.location.origin}/classroom/${classItem.slug}`
                      )
                    }
                    className="absolute top-3 right-2 sm:right-3 text-gray-500 hover:text-gray-700 transition"
                    title="Copy Classroom Link"
                  >
                    <FaShareAlt className="text-sm sm:text-base" />
                  </button>

                  {/* Classroom Name */}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mt-8 sm:mt-10 md:mt-12">
                    {classItem.name}
                  </h3>

                  {/* Category */}
                  <div className="flex items-center justify-center text-gray-600 mt-2 sm:mt-3">
                    <MdOutlineTopic className="text-teal-500 mr-2 text-sm sm:text-base" />
                    <p className="text-xs sm:text-sm font-medium">
                      Topic: {classItem.category}
                    </p>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center justify-center text-gray-600 mt-1 sm:mt-2">
                    <FaCalendarAlt className="text-teal-500 mr-2 text-sm sm:text-base" />
                    <p className="text-xs sm:text-sm">
                      {new Date(classItem.start_datetime).toLocaleDateString()}{" "}
                      - {new Date(classItem.end_datetime).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Participants Count */}
                  <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">
                    <strong>Participants:</strong> {classItem.max_participants}
                  </p>

                  {/* View Class Button */}
                  <Link
                    to={`/classdetails/${classItem.slug}`}
                    className="mt-3 sm:mt-4 w-full px-4 py-2 bg-teal-500 text-white text-xs sm:text-sm rounded-md hover:bg-teal-600 transition"
                  >
                    View Class
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-100">
            <h3 className="text-base sm:text-lg font-semibold">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 my-2 sm:my-3 text-sm sm:text-base">
              Are you sure you want to delete this classroom?
            </p>
            <div className="flex justify-center gap-2 sm:gap-4 mt-3 sm:mt-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-red-600 text-sm sm:text-base"
              >
                Delete
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

      <Footer />
    </>
  );
};

export default Createclass;
