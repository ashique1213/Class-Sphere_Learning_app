import React, { useState } from "react";
import { FaEye, FaClipboardList, FaUser } from "react-icons/fa";
import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";

const AttendancePage = () => {
  const [selectedSession, setSelectedSession] = useState(null);

  const sessions = [
    { id: 1, date: "March 20, 2025", topic: "Mathematics - Algebra", students: ["Alice", "Bob", "Charlie"] },
    { id: 2, date: "March 18, 2025", topic: "Physics - Motion", students: ["David", "Eve", "Frank"] },
    { id: 3, date: "March 15, 2025", topic: "Chemistry - Acids & Bases", students: ["George", "Hannah", "Ian"] }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 pt-16 sm:pt-20 md:pt-20">
        <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4">
          Home | My Account | <span className="font-bold">Attendance</span>
        </div>

        <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row md:items-center text-center md:text-left">
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaClipboardList className="text-3xl sm:text-4xl md:text-5xl" />
            </div>
            <div className="flex-1 mt-4 md:mt-0 md:ml-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Conducted Sessions</h2>
              <p className="text-white text-sm sm:text-base opacity-90">View attendance records for each session.</p>
            </div>
          </div>
        </div>

        <div className="max-w-full sm:max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Attendance Records</h3>
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm border gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-gray-800 font-medium">{session.topic}</p>
                  <span className="text-gray-500 text-sm">{session.date}</span>
                </div>
                <button
                  onClick={() => setSelectedSession(session)}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                >
                  <FaEye /> View Attendance
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedSession && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-sm font-semibold mb-4 text-center">Attendance for {selectedSession.topic} ({selectedSession.date})</h3>
              <ul className="list-disc pl-5 text-gray-700 mb-4">
                {selectedSession.students.map((student, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FaUser className="text-teal-500" /> {student}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedSession(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-md w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AttendancePage;