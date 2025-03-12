import React, { useState, useEffect } from "react";
import { FaSearch, FaUsers, FaClock, FaBook, FaPlus } from "react-icons/fa";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const Classrooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [classInput, setClassInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const authToken = useSelector((state) => state.auth.authToken);
  const { studentname } = useParams();

  useEffect(() => {
    if (authToken) {
      const fetchJoinedClasses = async () => {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/joined-classes/",
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );

          setJoinedClasses(response.data);
        } catch (error) {
          console.error("Error fetching joined classrooms:", error);
        }
      };

      fetchJoinedClasses();
    }
  }, [authToken]);

  // Handle joining a class
  const handleJoinClass = async () => {
    try {
      const slug = classInput.split("/").pop();

      if (!slug) {
        alert("Invalid class link! Please enter a valid class URL.");
        return;
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/api/join-class/",
        { class_id: slug },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setJoinedClasses((prev) => [response.data.classroom, ...prev]);
      setClassInput("");
      setShowInput(false);
    } catch (error) {
      console.error("Error joining class:", error);
      alert("Failed to join class. Please try again.");
    }
  };

  // Filter classrooms based on search
  const filteredClassrooms = joinedClasses.filter(
    (classroom) =>
      classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:py-20 md:px-10 lg:px-40">
        {/* Breadcrumbs */}
        <div className="p-4 text-black text-sm max-w-5xl mx-auto">
          Home | <Link to="/profile">My Account |</Link>{" "}
          <span className="font-semibold capitalize"> {studentname} </span>
          <span className="font-semibold">| Classroom</span>
        </div>

        {/* Classroom Header */}
        <div className="bg-white max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaBook className="text-4xl sm:text-5xl" />
            </div>
            <div className="ml-4 mt-3 md:mt-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                My Classrooms
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Join a new class by entering its link
              </p>
            </div>
            <div className="ml-auto">
              <button
                className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition flex items-center gap-2"
                onClick={() => setShowInput(!showInput)}
              >
                <FaPlus /> Join a Class
              </button>
            </div>
          </div>
        </div>

        {/* Join Class Input Field */}
        {showInput && (
          <div className="max-w-6xl mx-auto mb-6 px-4">
            <div className="relative flex">
              <input
                type="text"
                placeholder="Paste class link here..."
                className="px-4 py-2 w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-l-md shadow-sm outline-none"
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
              />
              <button
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-r-md"
                onClick={handleJoinClass}
              >
                Join
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto mb-6 px-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search joined classrooms..."
              className="pl-10 py-2 w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-md shadow-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Joined Classroom List */}
        <div className="max-w-6xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {filteredClassrooms.length > 0 ? (
            filteredClassrooms.map((classroom) => (
              <div
                key={classroom.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {classroom.name}
                </h3>
                <p className="text-sm text-gray-500">{classroom.category}</p>
                <Link
                  to={`/classroom/${classroom.slug}`} 
                  className="mt-4 block w-full text-center bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
                >
                  View Class
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-2">
              No joined classrooms. Paste a link to join one!
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Classrooms;
