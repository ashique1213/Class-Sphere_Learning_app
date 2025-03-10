import React, { useState } from "react";
import { FaSearch, FaUsers, FaClock, FaBook } from "react-icons/fa";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";

const classroomsData = [
  {
    id: 1,
    subject: "Mathematics",
    title: "Advanced Calculus",
    teacherName: "Dr. Sarah Johnson",
    students: 24,
    schedule: "Mon, Wed, Fri - 10:00 AM",
  },
  {
    id: 2,
    subject: "Computer Science",
    title: "Data Structures & Algorithms",
    teacherName: "Prof. Michael Chen",
    students: 32,
    schedule: "Tue, Thu - 2:00 PM",
  },
  {
    id: 3,
    subject: "Physics",
    title: "Quantum Mechanics",
    teacherName: "Dr. Robert Wilson",
    students: 18,
    schedule: "Mon, Wed - 1:00 PM",
  },
];

const Classrooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [joinedClasses, setJoinedClasses] = useState([]);

  const handleJoinClass = (classId) => {
    setJoinedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  const filteredClassrooms = classroomsData.filter(
    (classroom) =>
      classroom.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:py-20 md:px-10 lg:px-40">
        {/* Breadcrumbs */}
        <div className="p-4 text-gray-600 text-sm max-w-6xl mx-auto">
          Home | My Account |{" "}
          <span className="text-gray-800 font-semibold">Classroom</span>
        </div>

        {/* Classroom Header */}
        <div className="bg-white max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaBook className="text-4xl sm:text-5xl" />
            </div>
            <div className="ml-4 mt-3 md:mt-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Available Classrooms
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Browse and join classes from different teachers
              </p>
            </div>
            <div className="ml-auto">
              <button className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition">
                Join a Class
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto mb-6 px-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Search classrooms..."
              className="pl-10 py-2 w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-md shadow-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Classroom List */}
        <div className="max-w-6xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 gap-6 px-4">
          {filteredClassrooms.length > 0 ? (
            filteredClassrooms.map((classroom) => {
              const isJoined = joinedClasses.includes(classroom.id);

              return (
                <div
                  key={classroom.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {classroom.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {classroom.teacherName}
                  </p>
                  <div className="flex flex-wrap items-center text-sm text-gray-500 mt-2">
                    <FaUsers className="mr-2 text-teal-500" />
                    <span>{classroom.students} Students</span>
                    <span className="mx-2 hidden sm:inline">|</span>
                    <FaClock className="mr-2 text-teal-500 hidden sm:inline" />
                    <span className="hidden sm:inline">
                      {classroom.schedule}
                    </span>
                  </div>
                  <button
                    className={`mt-4 w-full py-2 text-white rounded-md transition-all ${
                      isJoined
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-teal-500 hover:bg-teal-600"
                    }`}
                    onClick={() => handleJoinClass(classroom.id)}
                  >
                    {isJoined ? "Leave Class" : "Join Class"}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 col-span-2">
              No classrooms found matching your search.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Classrooms;
