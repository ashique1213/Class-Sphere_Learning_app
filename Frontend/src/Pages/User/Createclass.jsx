import React, { useState, useEffect } from "react";
import { FaUsers, FaCalendarAlt, FaShareAlt, FaTrash } from "react-icons/fa";
import { MdOutlineTopic } from "react-icons/md";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Createclassform from "../../Components/Createclassform";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://127.0.0.1:8000/api/classrooms/";

const Createclass = () => {
  const { teachername } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const authToken = useSelector((state) => state.auth.authToken);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch classrooms from API
  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_URL}?teacher=${teachername}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      setClassrooms(response.data);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id); // Set the ID of the classroom to be deleted
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(
        `http://localhost:8000/api/classrooms/${deleteId}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setClassrooms((prevClassrooms) =>
        prevClassrooms.filter((classItem) => classItem.id !== deleteId)
      );

      setDeleteId(null); // Close modal
      toast.success("Classroom deleted successfully!");
    } catch (error) {
      console.error("Error deleting classroom:", error);
      alert("Failed to delete classroom. Please try again.");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [authToken]); // Runs when authToken changes

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // alert("Classroom link copied!");
    toast.info("Classroom link copied!");
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:py-20 md:px-10 lg:px-40">
        {/* Breadcrumbs */}
        <div className="p-4 text-black text-sm max-w-5xl mx-auto">
          Home |{" "}
          <Link to="/profile" className="text-black">
            My Account
          </Link>{" "}
          |<span className="font-bold capitalize"> {teachername}</span> |
          <span className="font-bold"> Class Rooms</span>
        </div>

        {/* Header */}
        <div className="bg-white max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaUsers className="text-4xl sm:text-5xl" />
            </div>
            <div className="ml-4 mt-3 md:mt-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Class Rooms
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Browse and join classes from different teachers
              </p>
            </div>
            <div className="ml-auto">
              <button
                className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Close Form" : "Create Class"}
              </button>
            </div>
          </div>
        </div>

        {/* Show Create Class Form */}
        {showForm && (
          <div className="max-w-4xl mx-auto mb-6">
            <Createclassform
              onClose={() => setShowForm(false)}
              refreshClasses={fetchClasses}
            />
          </div>
        )}

        {/* Classroom Cards */}
        {classrooms.length === 0 ? (
          <div className="text-center text-gray-600 mt-4">
            No classrooms available.
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-7">
              Available Classrooms
            </h2>
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {classrooms.map((classItem) => (
                <div
                  key={classItem.id}
                  className="relative bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition flex flex-col items-center text-center"
                >
                  {/* Floating Icon */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 sm:w-16 sm:h-16 bg-teal-500 text-white flex items-center justify-center rounded-full shadow-md">
                    <FaUsers className="text-2xl sm:text-3xl" />
                  </div>

                  {/* Delete Icon */}
                  <button
                    onClick={() => confirmDelete(classItem.id)}
                    className="absolute top-3 right-9 text-gray-500 hover:text-red-700 transition"
                    title="Delete Classroom"
                  >
                    <FaTrash className="text-sm sm:text-md" />
                  </button>

                  {/* Share Icon */}
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${window.location.origin}/classroom/${classItem.slug}`
                      )
                    }
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
                    title="Copy Classroom Link"
                  >
                    <FaShareAlt className="text-md sm:text-md" />
                  </button>
                  

                  {/* Classroom Name */}
                  <h3 className="text-lg font-semibold text-gray-800 mt-10 sm:mt-12">
                    {classItem.name}
                  </h3>

                  {/* Category */}
                  <div className="flex items-center justify-center text-gray-600 mt-3">
                    <MdOutlineTopic className="text-teal-500 mr-2" />
                    <p className="text-sm font-medium">
                      Topic: {classItem.category}
                    </p>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center justify-center text-gray-600 mt-2">
                    <FaCalendarAlt className="text-teal-500 mr-2" />
                    <p className="text-sm">
                      {new Date(classItem.start_datetime).toLocaleDateString()}{" "}
                      - {new Date(classItem.end_datetime).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Participants Count */}
                  <p className="text-gray-600 mt-2 text-sm">
                    <strong>Participants:</strong> {classItem.max_participants}
                  </p>

                  {/* View Class Button */}
                  <Link
                    to={`/classdetails/${classItem.slug}`}
                    className="mt-4 w-full sm:w-auto px-6 py-2 bg-teal-500 text-white text-sm sm:text-base rounded-md hover:bg-teal-600 transition"
                  >
                    View Class
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="text-gray-600 my-3">
              Are you sure you want to delete this classroom?
            </p>

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
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
