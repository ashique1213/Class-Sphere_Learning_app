import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  FaUsers,
  FaSearch,
  FaClipboardList,
  FaVideo,
  FaCheckCircle,
  FaFileAlt,
} from "react-icons/fa";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { Link } from "react-router-dom";
import CreateClassForm from "../../Components/Createclassform";
import { FaSpinner } from "react-icons/fa";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ClassDetails = () => {
  const { slug } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const authToken = useSelector((state) => state.auth.authToken);
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const message = localStorage.getItem("toastMessage");


  useEffect(() => {
    if (message) {
      toast.success(message);
      localStorage.removeItem("toastMessage"); 
    }
  }, []);

  useEffect(() => {
    if (!authToken) {
      console.error("No Auth Token Found!");
      setLoading(false);
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/classrooms/${slug}/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => {
        // console.log("Classroom Data:", response.data);
        setClassroom(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classroom:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, authToken]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseEditForm = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-teal-500 text-4xl" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ToastContainer/>
      <div className="min-h-screen bg-gray-50 p-6 sm:p-8 md:py-20 md:px-10 lg:px-40">
        {/* Breadcrumbs */}
        <div className="p-4 text-black text-sm max-w-6xl mx-auto">
          Home | My Account |{" "}
          <Link to={`/myclassrooms/${user?.username}`}>Classroom</Link> |{" "}
          <span className="font-bold">{classroom.name}</span>
        </div>

        {/* Header */}
        <div className="bg-white max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-6 sm:p-8 flex flex-col md:flex-row md:items-center text-center md:text-left">
            {/* Icon Section */}
            <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaUsers className="text-4xl sm:text-5xl" />
            </div>

            {/* Class Info Section */}
            <div className="flex-1 ml-4 mt-3 md:mt-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                {classroom.name} - {classroom.category}
              </h2>
              <p className="text-white sm:text-sm opacity-90 leading-relaxed break-words">
                {classroom.description || "No description available."}
              </p>
              <p className="text-white text-sm mt-2 capitalize">
                <strong>Teacher:</strong> {classroom.teacher || "Unknown"}
              </p>
            </div>

            {/* Button Section */}
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleEditClick}
                className="bg-white text-teal-600 px-4 py-2 rounded-md border border-teal-500 shadow-md hover:bg-gray-100"
              >
                Edit Class
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center bg-gray-200 rounded-lg overflow-hidden shadow-sm flex-grow">
            <input
              type="text"
              placeholder="Search students..."
              className="px-4 py-2 w-full border-none outline-none bg-transparent"
            />
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2">
              <FaSearch />
            </button>
          </div>

          {[
            { icon: <FaClipboardList />, label: "Assignments" },
            { icon: <FaVideo />, label: "Meetings" },
            { icon: <FaCheckCircle />, label: "Attendance" },
            { icon: <FaFileAlt />, label: "Exams" },
          ].map((item, index) => (
            <button
              key={index}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition"
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Show Form when Editing */}
        {isEditing && (
          <div className="p-2">
            <CreateClassForm
              onClose={handleCloseEditForm}
              existingClass={classroom}
            />
          </div>
        )}

        {/* Student List */}
        <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Students</h3>
          <div className="space-y-4">
            {classroom.students?.length > 0 ? (
              classroom.students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-500 capitalize text-white flex items-center justify-center rounded-full text-lg font-semibold">
                      {student.username.charAt(0)}
                    </div>
                    <span className="text-gray-800 font-medium capitalize">
                      {student.username}
                    </span>
                    <span className="text-gray-800 font-medium">
                      Email: {student.email}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-md">
                      Message
                    </button>
                    <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-md">
                      Video Chat
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No students enrolled yet.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ClassDetails;
