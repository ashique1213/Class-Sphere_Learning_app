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
      <div className="min-h-screen bg-gray-50 p-6 sm:p-8 md:px-20 lg:px-40">
        {/* Breadcrumbs */}
        <div className="p-4 text-black text-sm max-w-5xl mx-auto">
          Home | Class Room | <span className="font-bold">Class 1</span>
        </div>

        {/* Header */}
        <div className="bg-white max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-600 to-teal-600 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            {/* Icon Section */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center text-teal-600 shadow-md">
              <FaVideo className="text-4xl sm:text-5xl" />
            </div>

            {/* Title Section */}
            <div className="ml-4 mt-3 md:mt-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Classroom Meetings
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Stay connected and join live discussions with your class.
              </p>
            </div>
          </div>
        </div>

        {/* Search & Add Button */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Search Bar */}
          <div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg overflow-hidden flex-grow shadow-sm">
            <input
              type="text"
              placeholder="Search meetings..."
              className="px-4 py-2 w-full border-none outline-none bg-transparent text-gray-700"
            />
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 transition-all">
              <FaSearch className="text-lg" />
            </button>
          </div>

          {/* Add Meeting Button */}
          <button className="bg-gradient-to-r from-teal-500 to-teal-500 hover:opacity-90 text-white px-5 py-2 rounded-lg shadow-md transition-all">
            + Add Meeting
          </button>
        </div>

        {/* Meetings List */}
        <div className="space-y-4">
          {meetings.map((meet) => (
            <div
              key={meet.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border"
            >
              <div className="flex items-center gap-4">
                <FaVideo className="text-teal-500 text-2xl" />
                <span className="text-gray-800 font-medium">
                  Topic: {meet.topic}
                </span>
              </div>
              <div className="text-gray-600">
                Date: {meet.date} | Time: {meet.time}
              </div>
              <button
                className={`px-4 py-2 rounded-md text-white ${
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
