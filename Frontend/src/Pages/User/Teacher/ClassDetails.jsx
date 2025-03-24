import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaUsers,
  FaSearch,
  FaClipboardList,
  FaVideo,
  FaCheckCircle,
  FaFileAlt,
  FaSpinner,
} from "react-icons/fa";
import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";
import CreateClassForm from "../../../Components/Teacher/Createclassform";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchClassroom } from "../../../api/classroomapi";

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
    const loadClassroom = async () => {
      if (!authToken) {
        console.error("No Auth Token Found!");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchClassroom(slug);
        setClassroom(data);
      } catch {
        toast.error("Failed to fetch classroom details.");
      } finally {
        setLoading(false);
      }
    };

    loadClassroom();
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
      <div className="min-h-screen bg-gray-50 px-4 pt-16 sm:pt-20 md:pt-20">
        {/* Breadcrumbs */}
        <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4">
          Home |{" "}
          <Link to="/profile" className="capitalize hover:underline">
            My Account
          </Link>{" "}
          |{" "}
          <Link to="/profile" className="capitalize hover:underline">
            {user?.username}
          </Link>{" "}
          |{" "}
          <Link
            to={`/myclassrooms/${user?.username}`}
            className="hover:underline"
          >
            Class Rooms
          </Link>{" "}
          | <span className="font-bold">{classroom?.name}</span>
        </div>

        {/* Header */}
        <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row md:items-center text-center md:text-left">
            {/* Icon Section */}
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaUsers className="text-3xl sm:text-4xl md:text-5xl" />
            </div>

            {/* Class Info Section */}
            <div className="flex-1 mt-4 md:mt-0 md:ml-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                {classroom.name} - {classroom.category}
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90 leading-relaxed break-words">
                {classroom.description || "No description available."}
              </p>
              <p className="text-white text-sm sm:text-base mt-2 capitalize">
                <strong>Teacher:</strong> {classroom.teacher || "Unknown"}
              </p>
            </div>

            {/* Button Section */}
            <div className="mt-4 md:mt-0 md:ml-4">
              <button
                onClick={handleEditClick}
                className="bg-white text-teal-600 px-4 py-2 rounded-md border border-teal-500 shadow-md hover:bg-gray-100 w-full md:w-auto"
              >
                Edit Class
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="max-w-full sm:max-w-5xl mx-auto flex flex-col sm:flex-row flex-wrap items-center gap-2 sm:gap-4 mb-6 px-4">
          <div className="flex items-center bg-gray-200 rounded-lg overflow-hidden shadow-sm w-full sm:flex-1">
            <input
              type="text"
              placeholder="Search students..."
              className="px-4 py-2 w-full border-none outline-none bg-transparent text-sm sm:text-base"
            />
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-3">
              <FaSearch className="text-sm sm:text-base" />
            </button>
          </div>

          {[
            {
              icon: <FaClipboardList />,
              label: "Assignments",
              path: `/assignments/${classroom.slug}`,
            },
            {
              icon: <FaClipboardList />,
              label: "Materials",
              path: `/materials/${classroom.slug}`,
            },
            {
              icon: <FaVideo />,
              label: "Meetings",
              path: `/meetings/${classroom.slug}`,
            },
            { icon: <FaCheckCircle />, label: "Attendance" },
            {
              icon: <FaFileAlt />,
              label: "Exams",
              path: `/exams/${classroom.slug}`,
            },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition w-full sm:w-auto"
            >
              {item.icon}{" "}
              <span className="text-sm sm:text-base">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Show Form when Editing */}
        {isEditing && (
          <div className="max-w-full sm:max-w-5xl mx-auto p-4">
            <CreateClassForm
              onClose={handleCloseEditForm}
              existingClass={classroom}
            />
          </div>
        )}

        {/* Student List */}
        <div className="max-w-full sm:max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Students
          </h3>
          <div className="space-y-4">
            {classroom.students?.length > 0 ? (
              classroom.students.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm border gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500 capitalize text-white flex items-center justify-center rounded-full text-base sm:text-lg font-semibold flex-shrink-0">
                      {student.username.charAt(0)}
                    </div>
                    <div className="flex flex-col text-center sm:text-left">
                      <span className="text-gray-800 font-medium capitalize text-sm sm:text-base">
                        {student.username}
                      </span>
                      <span className="text-gray-600 text-xs sm:text-sm break-all">
                        Email: {student.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center sm:justify-end gap-2 w-full sm:w-auto">
                    <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm w-full sm:w-auto">
                      Message
                    </button>
                    <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm w-full sm:w-auto">
                      Video Chat
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm w-full sm:w-auto">
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">
                No students enrolled yet.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ClassDetails;
