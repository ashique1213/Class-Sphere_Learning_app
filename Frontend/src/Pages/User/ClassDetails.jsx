import React from "react";
import { FaUsers, FaSearch, FaClipboardList, FaVideo, FaCheckCircle, FaFileAlt } from "react-icons/fa";

const ClassDetails = () => {
  const students = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Robert Brown" },
    { id: 4, name: "Emily Johnson" },
    { id: 5, name: "Michael Williams" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8 md:py-16 md:px-10 lg:px-40">
      {/* Breadcrumbs */}
      <div className="p-4 text-gray-600 text-sm max-w-6xl mx-auto">
        Home | My Account | <span className="font-bold">Class 1</span>
      </div>

      
    {/* Header */}
      <div className="bg-white max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
            <FaUsers className="text-4xl sm:text-5xl" />
          </div>
          <div className="ml-4 mt-3 md:mt-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              Class Details
            </h2>
            <p className="text-white text-sm sm:text-base opacity-90">
              View student list, manage assignments, and more
            </p>
          </div>
          <div className="ml-auto">
            <button className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition">
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

      {/* Student List */}
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Students</h3>
        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm border"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-500 text-white flex items-center justify-center rounded-full text-lg font-semibold">
                  {student.name.charAt(0)}
                </div>
                <span className="text-gray-800 font-medium">{student.name}</span>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
