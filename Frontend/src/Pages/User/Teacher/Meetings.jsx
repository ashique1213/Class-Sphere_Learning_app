import React, { useEffect, useState } from "react";
import { FaVideo, FaSearch, FaTimes, FaSpinner } from "react-icons/fa";
import Navbar from "../../../Components/Layouts/Navbar";
import Footer from "../../../Components/Layouts/Footer";
import { useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { fetchClassroom } from "../../../api/classroomapi";
import { toast } from "react-toastify";
import { createMeeting, fetchMeetings, endMeeting } from "../../../api/meetingsapi";
import MeetingCard from "../../../Components/Layouts/MeetingCard";

const Meetings = () => {
  const [showModal, setShowModal] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const authToken = useSelector((state) => state.auth.authToken);
  const { user } = useSelector((state) => state.auth);
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState(null);
  const navigate = useNavigate();

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
        setMeetings(meetingsData);
      } catch {
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting((prev) => ({
      ...prev,
      [name]: name === "is_one_to_one" ? value === "true" : value,
    }));
  };

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    duration: "",
    is_one_to_one: true,
  });

  const handleCreateMeeting = async () => {
    try {
      const meeting = await createMeeting(slug, newMeeting);
      setMeetings((prev) => [meeting, ...prev]);
      setShowModal(false);
      setNewMeeting({
        title: "",
        description: "",
        duration: "",
        is_one_to_one: true,
      });
      toast.success("Meeting created successfully!");
      navigate(`/meetings/${slug}`);
    } catch (error) {
      toast.error(error?.message || "Failed to create meeting.");
    }
  };

  const joinMeetingHandler = (meetingId) => {
    navigate(`/join/${meetingId}`, { state: { slug, role: "teacher" } });
  };

  const handleEndMeeting = async (meetingId) => {
    try {
      const updatedMeeting = await endMeeting(meetingId);
      setMeetings((prev) =>
        prev.map((m) => (m.meeting_id === meetingId ? updatedMeeting : m))
      );
      toast.success("Meeting ended successfully!");
      navigate(`/meetings/${slug}`);
    } catch (error) {
      toast.error(error?.message || "Failed to end meeting.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-4 pt-16 sm:pt-20 md:pt-20">
        <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4 capitalize">
          Home | My Account |{" "}
          <Link to={`/myclassrooms/${user?.username}`} className="hover:underline">{user?.username}</Link> |{" "}
          <Link to={`/myclassrooms/${user?.username}`} className="hover:underline" >Classroom</Link> |{" "}
          <Link to={`/classdetails/${slug}`} className="hover:underline">{classroom?.name}</Link> |{" "}
          <span className="font-bold">Meetings</span>
        </div>

        <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-teal-600 shadow-md">
              <FaVideo className="text-3xl sm:text-4xl md:text-5xl" />
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                Classroom Meetings
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Manage and control your class discussions.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-full sm:max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4 mb-6">
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
          {user.role === "teacher" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-teal-500 to-teal-500 hover:opacity-90 text-white px-4 sm:px-5 py-2 rounded-lg shadow-md transition-all w-full sm:w-auto text-sm sm:text-base"
            >
              + Add Meeting
            </button>
          )}
        </div>

        <div className="max-w-full sm:max-w-5xl mx-auto space-y-4">
          {loading ? (
           <div className="flex justify-center items-center py-16">
           <FaSpinner className="animate-spin text-teal-500 text-4xl" />
         </div>
          ) : meetings.length === 0 ? (
            <p>No meetings available.</p>
          ) : (
            meetings.map((meet) => (
              <MeetingCard
                key={meet.meeting_id}
                meet={meet}
                slug={slug}
                user={user}
                joinMeeting={joinMeetingHandler}
                handleEndMeeting={handleEndMeeting}
              />
            ))
          )}
        </div>

        {showModal && user.role === "teacher" && (
          <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                onClick={() => setShowModal(false)}
              >
                <FaTimes />
              </button>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Create a New Meeting
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Topic</label>
                  <input
                    type="text"
                    name="title"
                    value={newMeeting.title}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={newMeeting.description}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded h-20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={newMeeting.duration}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Meeting Type</label>
                  <select
                    name="is_one_to_one"
                    value={newMeeting.is_one_to_one}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 border rounded"
                  >
                    {/* <option value="true">One-to-One</option> */}
                    <option value="false">One-to-Many</option>
                  </select>
                </div>
                <button
                  onClick={handleCreateMeeting}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg mt-4"
                >
                  Create Meeting
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Meetings;