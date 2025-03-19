import React from "react";
import { FaVideo, FaUsers, FaArrowLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar"; // Adjust path
import Footer from "../Components/Footer"; // Adjust path

const MeetingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
    const { meet, slug } = location.state || {};
    
    console.log(meet)

  if (!meet || !slug) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <p className="text-red-500 text-lg">Meeting details not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-4 pt-16 sm:pt-20 md:pt-20">
        <div className="max-w-full sm:max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="text-sm text-black py-4">
            <span
              onClick={() => navigate("/")}
              className="cursor-pointer hover:underline text-gray-600"
            >
              Home
            </span>{" "}
            |{" "}
            <span
              onClick={() => navigate(`/meetings/${slug}`)}
              className="cursor-pointer hover:underline text-gray-600"
            >
              Meetings
            </span>{" "}
            | <span className="font-bold text-teal-600">{meet.title}</span>
          </div>

          {/* Meeting Info Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Meeting Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <strong className="text-gray-700">Description:</strong>{" "}
                <span className="text-gray-600">{meet.description || "No description provided."}</span>
              </p>
              <p>
                <strong className="text-gray-700">Created:</strong>{" "}
                <span className="text-gray-600">{new Date(meet.created_at).toLocaleString()}</span>
              </p>
              <p>
                <strong className="text-gray-700">Duration:</strong>{" "}
                <span className="text-gray-600">{meet.duration} minutes</span>
              </p>
              <p>
                <strong className="text-gray-700">Status:</strong>{" "}
                <span className={`text-${meet.is_active ? "green" : "red"}-500 font-semibold`}>
                  {meet.is_active ? "Active" : "Ended"}
                </span>
              </p>
            </div>
          </div>

          {/* Participants */}
          {meet.participants.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUsers className="text-teal-500" /> Participants ({meet.participants.length})
              </h3>
              <div className="overflow-hidden border rounded-lg">
                <table className="w-full text-sm text-gray-600">
                  <thead className="bg-gray-100 border-b text-gray-700">
                    <tr>
                      <th className="p-3 text-left">Name</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Joined At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {meet.participants.map((participant) => (
                      <tr key={participant.user.id} className="hover:bg-gray-50">
                        <td className="p-3 capitalize">{participant.user.username}</td>
                        <td className="p-3">{participant.user.email}</td>
                        <td className="p-3">{new Date(participant.joined_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-6 flex justify-start">
            <button
              onClick={() => navigate(`/meetings/${slug}`)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition"
            >
              <FaArrowLeft /> Back to Meetings
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MeetingDetails;
