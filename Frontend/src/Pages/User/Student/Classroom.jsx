import React, { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa";
import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchMeetings, joinMeeting } from "../../../api/meetingsapi";
import { fetchExams, fetchSubmissions } from "../../../api/examsapi";
import { fetchMaterials } from "../../../api/materialsapi"; // Updated import
import { toast } from "react-toastify";
import { fetchClassroom } from "../../../api/classroomapi";
import MeetingCard from "../../../Components/MeetingCard";
import MaterialsTab from "../../../Components/Student/MaterialsTab";
import AssignmentTab from "../../../Components/Student/AssignmentTab";
import AttendanceTab from "../../../Components/Student/AttendanceTab";
import ExamTab from "../../../Components/Student/ExamTab";

const Classroom = () => {
    const [activeTab, setActiveTab] = useState("About");
    const [classroom, setClassroom] = useState(null);
    const [meetings, setMeetings] = useState([]);
    const [exams, setExams] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [hasActiveMeeting, setHasActiveMeeting] = useState(false);
    const { slug } = useParams();
    const { authToken, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const fetchData = async () => {
        if (!authToken) return;
        try {
            const [classroomData, meetingsData, examsData, submissionsData, materialsData] = await Promise.all([
                fetchClassroom(slug),
                fetchMeetings(slug),
                fetchExams(slug),
                fetchSubmissions(slug),
                fetchMaterials(slug),  // Updated to use separate materials endpoint
            ]);
            setClassroom(classroomData);
            setMeetings(meetingsData);
            setExams(Array.isArray(examsData) ? examsData : []);
            setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
            setMaterials(Array.isArray(materialsData) ? materialsData : []);
            setHasActiveMeeting(meetingsData.some((m) => m.is_active));
        } catch (error) {
            toast.error("Failed to fetch classroom details.");
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

    const tabs = ["About", "Materials", "Assignments", "Exams", "Submissions", "Attendance", "Meetings"];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 px-4 pt-16 sm:pt-20 md:pt-16">
                <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4">
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

                {classroom ? (
                    <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
                        <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-white">
                                <FaBook className="text-3xl sm:text-4xl md:text-5xl text-teal-500" />
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-4 flex-1">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                                    {classroom.name}
                                </h2>
                                <p className="text-white text-sm sm:text-base opacity-90">
                                    {classroom.category}
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-4 flex flex-col gap-2 w-full md:w-auto">
                                {hasActiveMeeting && (
                                    <div className="flex flex-col gap-2">
                                        {meetings
                                            .filter((m) => m.is_active)
                                            .map((m) => (
                                                <button
                                                    key={m.meeting_id}
                                                    onClick={() => joinMeetingHandler(m.meeting_id)}
                                                    className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition w-full text-center"
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
                    <p className="text-center text-gray-500 text-sm sm:text-base">
                        Loading classroom details...
                    </p>
                )}

                <div className="max-w-full sm:max-w-5xl mx-auto flex flex-wrap items-center gap-2 sm:gap-4 mb-6 px-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md shadow-sm text-xs sm:text-sm ${
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

                <div className="max-w-full sm:max-w-5xl mx-auto mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    {activeTab === "About" && (
                        <>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                                About {classroom?.name}
                            </h3>
                            <p className="text-gray-600 mt-2 text-sm sm:text-base">
                                {classroom?.description}
                            </p>
                        </>
                    )}
                    {activeTab === "Materials" && <MaterialsTab materials={materials.map(m => ({
                        id: m.id,
                        name: m.topic,
                        url: m.file_url,
                        type: m.material_type,
                        date: new Date(m.created_at).toLocaleDateString(),
                        description: ""
                    }))} />}
                    {activeTab === "Assignments" && <AssignmentTab assignments={dummyAssignments} />}
                    {activeTab === "Exams" && <ExamTab exams={exams} />}
                    {activeTab === "Attendance" && (
                        <AttendanceTab attendanceRecords={dummyAttendanceRecords} />
                    )}
                    {activeTab === "Submissions" && (
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                                My Submissions
                            </h3>
                            {submissions.length === 0 ? (
                                <p className="text-gray-500">No submissions yet.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {submissions.map((submission) => {
                                        const studentName = `${submission.student.first_name || ""} ${
                                            submission.student.last_name || ""
                                        }`.trim() || submission.student.username;
                                        return (
                                            <li
                                                key={submission.id}
                                                className="p-2 bg-gray-100 rounded-md flex justify-between items-center"
                                            >
                                                <span className="text-gray-700">
                                                    {studentName} (Submitted on{" "}
                                                    {new Date(submission.submitted_at).toLocaleString()})
                                                </span>
                                                <span className="text-teal-600 font-medium">
                                                    Score: {submission.score || "N/A"}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    )}
                    {activeTab === "Meetings" && (
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
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
                                <p className="text-gray-500 text-sm">No meetings available.</p>
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