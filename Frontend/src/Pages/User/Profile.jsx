import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  const [imageError, setImageError] = useState(false);
  return (
    <>
      <Navbar />

      {/* Breadcrumbs */}
      <div className="min-h-screen bg-gray-100 p-6 md:py-20">
        <div className="p-4 text-gray-600 text-sm max-w-5xl mx-auto">
          Home | My Account |{" "}
          <span className="text-gray-800 font-semibold">Kristin Watson</span>
        </div>

        {/* Profile Header */}
        <div className="bg-white max-w-5xl mx-auto rounded-lg shadow-md overflow-hidden">
          <div className="bg-teal-100 p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            {imageError ? (
              <FaUserCircle className="text-6xl text-gray-600" />
            ) : (
              <img
                src="https://via.placeholder.com/80" // Replace with actual image URL
                alt="Profile Image"
                className="w-20 h-20 rounded-full border-2 border-white"
                onError={() => setImageError(true)} // Show icon if image fails to load
              />
            )}
            <div className="ml-4 mt-3 md:mt-0">
              <h2 className="text-xl font-semibold text-gray-800">
                Kristin Watson
              </h2>
              <p className="text-gray-600">Student</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 px-6 py-4">
          <button className="px-4 py-2 bg-teal-400 text-white rounded-md text-sm">
            About
          </button>
          <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md text-sm text-center">
            About
          </button>
          {/* <Link to="" className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md text-sm text-center">
            Classroom
          </Link> */}
        </div>

        {/* Profile Details */}
        <div className="bg-gray-200 max-w-5xl mx-auto p-6 rounded-lg mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>Email:</strong>{" "}
              <a
                href="mailto:kristinwatson@gmail.com"
                className="text-teal-500"
              >
                kristinwatson@gmail.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong> 789654123
            </p>
            <p>
              <strong>Gender:</strong> Male
            </p>
            <p>
              <strong>DOB:</strong> 22-02-2005
            </p>
            <p>
              <strong>Place:</strong> America
            </p>
          </div>

          {/* Edit & Reset Buttons */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4 items-end justify-end">
            <button className="px-4 py-2 bg-teal-400 text-white rounded-md text-sm w-full md:w-40">
              Edit Details
            </button>
            <button className="px-4 py-2 bg-teal-400 text-white rounded-md text-sm w-full md:w-40">
              Reset Password
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
