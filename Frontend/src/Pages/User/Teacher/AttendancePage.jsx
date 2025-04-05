import React, { useState, useEffect } from "react";
import { FaEye, FaClipboardList, FaUser,FaSpinner } from "react-icons/fa";
import Navbar from "../../../Components/Layouts/Navbar";
import Footer from "../../../Components/Layouts/Footer";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { fetchClassroom } from "../../../api/classroomapi";
import { fetchMeetings } from "../../../api/meetingsapi";

const AttendancePage = () => {
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, authToken } = useSelector((state) => state.auth);
  const { slug } = useParams();
  const [classroom, setClassroom] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!authToken) {
        console.error("No Auth Token Found!");
        setLoading(false);
        return;
      }
      try {
        const [classroomData, meetingsData] = await Promise.all([
          fetchClassroom(slug), 
          fetchMeetings(slug),
        ]);
        setClassroom(classroomData);
        setSessions(meetingsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, authToken]);

  const handleViewAttendance = (session) => {
    setSelectedSession(session);
  };

  // Function to format date as "March 25, 2025"
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 px-4 pt-16 sm:pt-20 md:pt-20">
        <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4 capitalize">
          Home | My Account |{" "}
          <Link to={`/myclassrooms/${user?.username}`} className="hover:underline">
            {user?.username}
          </Link>{" "}
          |{" "}
          <Link to={`/myclassrooms/${user?.username}`} className="hover:underline">
            Classroom
          </Link>{" "}
          |{" "}
          <Link to={`/classdetails/${slug}`} className="hover:underline">
            {classroom?.name}
          </Link>{" "}
          | <span className="font-bold">Attendance</span>
        </div>

        <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row md:items-center text-center md:text-left">
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaClipboardList className="text-3xl sm:text-4xl md:text-5xl" />
            </div>
            <div className="flex-1 mt-4 md:mt-0 md:ml-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                Conducted Sessions
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                View attendance records for each session.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-full sm:max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Attendance Records
          </h3>
          {loading ? (
             <div className="flex justify-center items-center py-16">
              <FaSpinner className="animate-spin text-teal-500 text-4xl" />
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.meeting_id}
                  className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm border gap-4"
                >
                  <div className="text-center sm:text-left">
                    <p className="text-gray-800 font-medium capitalize">{session.title}</p>
                    <span className="text-gray-500 text-sm">
                      {formatDate(session.created_at)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewAttendance(session)}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                  >
                    <FaEye /> View Attendance
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedSession && (
          <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
              <h3 className="text-sm font-semibold mb-4 text-center">
                Attendance for {selectedSession.title} (
                {formatDate(selectedSession.created_at)})
              </h3>
              <ul className="list-disc pl-5 text-gray-700 mb-4">
                {selectedSession.participants.map((participant, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <FaUser className="text-teal-500" />
                    <span className="capitalize">
                      {participant.user.username} - Joined:{" "}
                      {formatDate(participant.joined_at)}
                    </span>
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