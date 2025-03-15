import React, { useState, useEffect } from "react";
import { FaUsers, FaClock, FaBook } from "react-icons/fa";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchClassroom } from "../../api/classroomapi";
import { toast } from "react-toastify";

const Classroom = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [classroom, setClassroom] = useState(null);
  const { slug } = useParams();
  const authToken = useSelector((state) => state.auth.authToken);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadClassroom = async () => {
      if (!authToken) return;
      try {
        const data = await fetchClassroom(slug, authToken);
        setClassroom(data);
      } catch {
        toast.error("Failed to fetch classroom details.");
      }
    };

    loadClassroom();
  }, [slug, authToken]);

  const tabs = ["About", "Materials", "Assignments", "Exams", "Attendance"];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-4 pt-16 sm:pt-20 md:pt-20">
        {/* Breadcrumbs */}
        <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4">
          Home | My Account |{" "}
          <Link to={`/classrooms/${user?.username}`}>Classroom</Link> |{" "}
          <span className="font-bold">
            {classroom?.name || "Loading..."}
          </span>
        </div>

        {/* Classroom Header */}
        {classroom ? (
          <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-white">
                <FaBook className="text-3xl sm:text-4xl md:text-5xl text-teal-500" />
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                  {classroom.name}
                </h2>
                <p className="text-white text-sm sm:text-base opacity-90">
                  {classroom.category}
                </p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 flex flex-col gap-2 w-full md:w-auto">
                <button className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition w-full">
                  Join Now
                </button>
                <button className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition w-full">
                  Join Kritsin
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm sm:text-base">
            Loading classroom details...
          </p>
        )}

        {/* Tabs */}
        <div className="max-w-full sm:max-w-5xl mx-auto flex flex-wrap items-center gap-2 sm:gap-4 mb-6 px-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow-sm text-xs sm:text-sm ${
                activeTab === tab
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="max-w-full sm:max-w-5xl mx-auto mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          {activeTab === "About" && (
            <>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                About {classroom?.name}
              </h3>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                {classroom?.description}
              </p>
            </>
          )}
          {activeTab === "Materials" && (
            <p className="text-sm sm:text-base">Materials content goes here.</p>
          )}
          {activeTab === "Assignments" && (
            <p className="text-sm sm:text-base">Assignments content goes here.</p>
          )}
          {activeTab === "Exams" && (
            <p className="text-sm sm:text-base">Exams content goes here.</p>
          )}
          {activeTab === "Attendance" && (
            <p className="text-sm sm:text-base">Attendance content goes here.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Classroom;