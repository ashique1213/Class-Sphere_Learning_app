import React, { useState } from "react";
import { FaUsers, FaClock, FaUserCircle } from "react-icons/fa";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

const Classroom = () => {
  const [activeTab, setActiveTab] = useState("About");
  const tabs = ["About", "Materials", "Assignments", "Exams", "Attendance"];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:py-20 md:px-10 lg:px-40">
        {/* Breadcrumbs */}
        <div className="p-4 text-gray-600 text-sm max-w-6xl mx-auto">
          Home | My Account | Classroom |{" "}
          <span className="font-bold">Teacher one</span>
        </div>

        {/* Classroom Header */}
        <div className="bg-white max-w-6xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8 relative">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left relative">
            <div className="w-28 h-28 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-white">
              <FaUserCircle className="text-6xl sm:text-8xl text-teal-500" />
            </div>
            <div className="ml-4 mt-3 md:mt-0 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Watson
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Founder & Mentor
              </p>
            </div>
            <div className="ml-auto flex flex-col gap-2">
              <button className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition">
                Join Now
              </button>
              <button className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition">
                Join Kritsin
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-4 overflow-x-auto pb-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md shadow-sm text-sm ${
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
        <div className="max-w-6xl mx-auto mt-6 bg-white p-6 rounded-lg shadow-md">
          {activeTab === "About" && (
            <>
              <h3 className="text-xl font-semibold text-gray-800">
                About Kritsin
              </h3>
              <p className="text-gray-600 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </>
          )}
          {activeTab === "Materials" && <p>Materials content goes here.</p>}
          {activeTab === "Assignments" && <p>Assignments content goes here.</p>}
          {activeTab === "Exams" && <p>Exams content goes here.</p>}
          {activeTab === "Attendance" && <p>Attendance content goes here.</p>}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Classroom;
