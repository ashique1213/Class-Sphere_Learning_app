import React, { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa";
import Navbar from "../../../Components/Layouts/Navbar";
import Footer from "../../../Components/Layouts/Footer";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchMeetings, joinMeeting } from "../../../api/meetingsapi";
import { fetchExams, fetchSubmissions } from "../../../api/examsapi";
import { fetchMaterials } from "../../../api/materialsapi";
import { fetchAssignments, submitAssignment } from "../../../api/assignmentsapi";
import { toast } from "react-toastify";
import { fetchClassroom } from "../../../api/classroomapi";
import MeetingCard from "../../../Components/Layouts/MeetingCard";
import MaterialsTab from "../../../Components/Student/MaterialsTab";
import AssignmentTab from "../../../Components/Student/AssignmentTab";
import AttendanceTab from "../../../Components/Student/AttendanceTab";
import ExamTab from "../../../Components/Student/ExamTab";
import SubmissionTab from "../../../Components/Student/SubmissionTab";

const Classroom = () => {
  const [activeTab, setActiveTab] = useState("About");
  const [classroom, setClassroom] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [hasActiveMeeting, setHasActiveMeeting] = useState(false);
  const { slug } = useParams();
  const { authToken, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!authToken) {
      toast.error("Authentication required.");
      return;
    }
    try {
      const [classroomData, meetingsData, examsData, submissionsData, materialsData, assignmentsData] = await Promise.all([
        fetchClassroom(slug),
        fetchMeetings(slug),
        fetchExams(slug),
        fetchSubmissions(slug),
        fetchMaterials(slug),
        fetchAssignments(slug),
      ]);
      setClassroom(classroomData);
      setMeetings(meetingsData);
      setExams(Array.isArray(examsData) ? examsData : []);
      setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
      setMaterials(Array.isArray(materialsData) ? materialsData : []);
      setAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
      setHasActiveMeeting(meetingsData.some((m) => m.is_active));
    } catch (error) {
      toast.error("Failed to fetch classroom details.");
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug, authToken]);

  const joinMeetingHandler = async (meetingId) => {
    try {
      await joinMeeting(meetingId);
      navigate(`/join/${meetingId}`, { state: { slug, role: "student" } });
    } catch (error) {
      toast.error(error?.message || "Failed to join meeting");
    }
  };

  const handleEndMeeting = (meetingId) => {
    toast.error("Students cannot end meetings.");
  };

  const handleSubmitAssignment = async (assignmentId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await submitAssignment(slug, assignmentId, formData);
      toast.success("Assignment submitted successfully!");
      const updatedAssignments = await fetchAssignments(slug);
      setAssignments(updatedAssignments);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to submit assignment.");
    }
  };

  const userSubmissions = [
    ...assignments.flatMap((assignment) =>
      (assignment.submissions || []).map((submission) => ({
        ...submission,
        type: "assignment",
        topic: assignment.topic,
      }))
    ),
    ...submissions.map((submission) => {
      const matchedExam = exams.find((exam) => String(exam.id) === String(submission.exam));
      return {
        ...submission,
        type: "exam",
        topic: matchedExam?.title || matchedExam?.topic || `Exam ID ${submission.exam}` || "Unknown Exam",
      };
    }),
  ].filter((submission) => {
    const studentIdentifier = submission.student_name || submission.student?.username;
    return studentIdentifier === user?.username;
  });

  // Function to format date as "March 25, 2025"
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Transform meetings into attendance records for the current student
  const attendanceRecords = meetings.map((meeting) => {
    const participant = meeting.participants.find(
      (p) => p.user.username === user?.username
    );
    return {
      topic: meeting.title,
      date: formatDate(meeting.created_at),
      joinedDate: participant ? formatDate(participant.joined_at) : null,
    };
  });

  const tabs = ["About", "Materials", "Assignments", "Exams", "Submissions", "Attendance", "Meetings"];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-4 pt-16 sm:pt-20 md:pt-20">
        {/* Breadcrumb */}
        <div className="text-xs sm:text-sm text-black max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto py-2 sm:py-4 overflow-x-auto whitespace-nowrap">
          Home |{" "}
          <Link to={`/profile`} className="capitalize hover:underline">
            My Account
          </Link>{" "}
          |{" "}
          <Link to={`/profile`} className="capitalize hover:underline">
            {user?.username}
          </Link>{" "}
          |{" "}
          <Link to={`/classrooms/${user?.username}`} className="hover:underline">
            Classrooms
          </Link>{" "}
          | <span className="font-bold">{classroom?.name || "Loading..."}</span>
        </div>

        {/* Classroom Header */}
        {classroom ? (
          <div className="bg-white max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-white flex-shrink-0">
                <FaBook className="text-3xl sm:text-4xl md:text-5xl text-teal-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white truncate">
                  {classroom.name}
                </h2>
                <p className="text-white text-sm sm:text-base opacity-90">
                  {classroom.category}
                </p>
              </div>
              <div className="w-full md:w-auto flex flex-col gap-2">
                {hasActiveMeeting && (
                  <div className="flex flex-col gap-2">
                    {meetings
                      .filter((m) => m.is_active)
                      .map((m) => (
                        <button
                          key={m.meeting_id}
                          onClick={() => joinMeetingHandler(m.meeting_id)}
                          className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition w-full text-sm sm:text-base truncate"
                        >
                          Join {m.title}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm sm:text-base py-4">
            Loading classroom details...
          </p>
        )}

        {/* Tabs */}
        <div className="max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 mb-4 sm:mb-6 px-2 sm:px-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-2 py-1 sm:px-3 sm:py-2 rounded-md shadow-sm text-xs sm:text-sm font-medium whitespace-nowrap ${
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
        <div className="max-w-full sm:max-w-3xl lg:max-w-5xl mx-auto mt-4 sm:mt-6 bg-white p-2 sm:p-4 lg:p-6 rounded-lg shadow-md">
          {activeTab === "About" && (
            <>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                About {classroom?.name}
              </h3>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                {classroom?.description}
              </p>
            </>
          )}
          {activeTab === "Materials" && (
            <MaterialsTab
              materials={materials.map((m) => ({
                id: m.id,
                name: m.topic,
                url: m.file_url,
                type: m.material_type,
                date: new Date(m.created_at).toLocaleDateString(),
                description: "",
              }))}
            />
          )}
          {activeTab === "Assignments" && (
            <AssignmentTab assignments={assignments} onSubmit={handleSubmitAssignment} />
          )}
          {activeTab === "Exams" && <ExamTab exams={exams} />}
          {activeTab === "Attendance" && <AttendanceTab attendanceRecords={attendanceRecords} />}
          {activeTab === "Submissions" && <SubmissionTab submissions={userSubmissions} />}
          {activeTab === "Meetings" && (
            <div className="grid grid-cols-1 gap-4">
              {meetings.length > 0 ? (
                meetings.map((meet) => (
                  <MeetingCard
                    key={meet.meeting_id}
                    meet={meet}
                    user={user}
                    joinMeeting={joinMeetingHandler}
                    handleEndMeeting={handleEndMeeting}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm sm:text-base text-center">
                  No meetings available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Classroom;