import React from "react";
import { FaVideo, FaSearch } from "react-icons/fa";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

const Meetings = () => {
  const meetings = [
    {
      id: 1,
      topic: "xxxxxxxxxx",
      date: "00/00/00",
      time: "00:00:00",
      status: "active",
    },
    {
      id: 2,
      topic: "xxxxxxxxxx",
      date: "00/00/00",
      time: "00:00:00",
      status: "ended",
    },
    {
      id: 3,
      topic: "xxxxxxxxxx",
      date: "00/00/00",
      time: "00:00:00",
      status: "ended",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-4 pt-16 sm:pt-20 md:pt-20">
        {/* Breadcrumbs */}
        <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4">
          Home | Class Room | <span className="font-bold">Class 1</span>
        </div>

        {/* Header */}
        <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            {/* Icon Section */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-teal-600 shadow-md">
              <FaVideo className="text-3xl sm:text-4xl md:text-5xl" />
            </div>

            {/* Title Section */}
            <div className="mt-4 md:mt-0 md:ml-4 flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                Classroom Meetings
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Stay connected and join live discussions with your class.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Add Button */}
        <div className="max-w-full sm:max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg overflow-hidden shadow-sm w-full sm:flex-1">
            <input
              type="text"
              placeholder="Search meetings..."
              className="px-4 py-2 w-full border-none outline-none bg-transparent text-gray-700 text-sm sm:text-base"
            />
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-3 transition-all">
              <FaSearch className="text-sm sm:text-lg" />
            </button>
          </div>

          {/* Add Meeting Button */}
          <button className="bg-gradient-to-r from-teal-500 to-teal-500 hover:opacity-90 text-white px-4 sm:px-5 py-2 rounded-lg shadow-md transition-all w-full sm:w-auto text-sm sm:text-base">
            + Add Meeting
          </button>
        </div>

        {/* Meetings List */}
        <div className="max-w-full sm:max-w-5xl mx-auto space-y-4">
          {meetings.map((meet) => (
            <div
              key={meet.id}
              className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-sm border gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <FaVideo className="text-teal-500 text-xl sm:text-2xl flex-shrink-0" />
                <span className="text-gray-800 font-medium text-sm sm:text-base">
                  Topic: {meet.topic}
                </span>
              </div>
              <div className="text-gray-600 text-xs sm:text-sm text-center sm:text-left w-full sm:w-auto">
                Date: {meet.date} | Time: {meet.time}
              </div>
              <button
                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white text-xs sm:text-sm w-full sm:w-auto ${
                  meet.status === "active" ? "bg-teal-500" : "bg-gray-500"
                }`}
              >
                {meet.status === "active" ? "Meet link" : "Meet Ended"}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Meetings;