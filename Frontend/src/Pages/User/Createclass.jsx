import React, { useState, useEffect } from "react";
import { FaUsers, FaCalendarAlt, FaShareAlt } from "react-icons/fa";
import { MdOutlineTopic } from "react-icons/md";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import Createclassform from "../../Components/Createclassform";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = "http://127.0.0.1:8000/api/classrooms/";

const Createclass = () => {
  const { teachername } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const authToken = useSelector((state) => state.auth.authToken);

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

  useEffect(() => {
    fetchClasses();
  }, [authToken]); // Runs when authToken changes

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Classroom link copied!");
  };

  return (
    <>
      <Navbar />
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
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {classrooms.map((classItem) => (
                <div
                  key={classItem.id}
                  className="relative bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition flex flex-col items-center"
                >
                  {/* Floating Icon */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-teal-500 text-white flex items-center justify-center rounded-full shadow-md">
                    <FaUsers className="text-3xl" />
                  </div>

                  {/* Classroom Name */}
                  <h3 className="text-lg font-semibold text-gray-800 mt-8 text-center">
                    {classItem.name}
                  </h3>

                  {/* Category */}
                  <div className="flex items-center text-gray-600 mt-3">
                    <MdOutlineTopic className="text-teal-500 mr-2" />
                    <p className="text-sm font-medium">
                      Topic: {classItem.category}
                    </p>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center text-gray-600 mt-2">
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
                    to={`/classroom/${classItem.slug}`}
                    className="mt-4 w-full text-center bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
                  >
                    View Class
                  </Link>

                  {/* Share Icon */}
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${window.location.origin}/classroom/${classItem.slug}`
                      )
                    }
                    className="mt-2 text-gray-500 hover:text-gray-700 transition"
                    title="Copy Classroom Link"
                  >
                    <FaShareAlt className="text-lg text-black-600 absolute top-3 right-3" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Createclass;
