import React, { useState, useEffect } from "react";
import { FaSearch, FaUsers, FaClock, FaBook, FaPlus } from "react-icons/fa";
import Navbar from "../../../Components/Layouts/Navbar";
import Footer from "../../../Components/Layouts/Footer";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchJoinedClasses, joinClass } from "../../../api/classroomapi";
import { checkUserSubscription } from "../../../api/subscriptionapi"; // Import subscription check
import { toast } from "react-toastify";
import ConfirmationModal from "../../../Components/Layouts/ConfirmationModal";

const Classrooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [classInput, setClassInput] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null); // Store subscription status
  const authToken = useSelector((state) => state.auth.authToken);
  const { studentname } = useParams();

  useEffect(() => {
    const loadJoinedClassesAndSubscription = async () => {
      if (!authToken) return;
      try {
        // Fetch joined classes
        const classData = await fetchJoinedClasses(authToken); // Pass authToken if required
        setJoinedClasses(classData);

        // Fetch subscription status
        const subscriptionData = await checkUserSubscription(authToken);
        setCurrentSubscription(subscriptionData);
      } catch (error) {
        toast.error("Failed to fetch data: " + (error.message || "Unknown error"));
      }
    };

    loadJoinedClassesAndSubscription();
  }, [authToken]);

  // Handle initiating the join process (show modal)
  const initiateJoinClass = () => {
    if (!classInput.trim()) {
      toast.error("Please enter a class link.");
      return;
    }

    // Check subscription and class limit
    const currentPlanName = currentSubscription?.subscribed ? currentSubscription.subscription.plan.name : null;
    if ((!currentPlanName || currentPlanName === "free") && joinedClasses.length >= 2) {
      toast.error(
        <div>
          You have reached the limit of 2 classes on a free plan.{" "}
          <Link to="/plans" className="text-teal-600 underline">
            Upgrade Now
          </Link>{" "}
          to join more classes.
        </div>,
        { autoClose: 5000 }
      );
      return;
    }

    setShowModal(true); // Show confirmation modal if limit not exceeded
  };

  // Handle confirmed join class action
  const handleJoinClass = async () => {
    try {
      const newClass = await joinClass(classInput, authToken);

      const isAlreadyJoined = joinedClasses.some((cls) => cls.id === newClass.id);

      if (isAlreadyJoined) {
        toast.info("You have already joined this class.");
      } else {
        setJoinedClasses((prev) => [newClass, ...prev]);
        toast.success("Class joined successfully!");
      }

      setClassInput("");
      setShowInput(false);
      setShowModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to join class.");
      setShowModal(false);
    }
  };

  // Filter classrooms based on search
  const filteredClassrooms = joinedClasses.filter(
    (classroom) =>
      classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-4 pt-16 sm:pt-20 md:pt-20">
        {/* Breadcrumbs */}
        <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4 capitalize">
          Home |{" "}
          <Link to="/profile" className="hover:underline">
            My Account |
          </Link>{" "}
          <Link to="/profile" className="hover:underline">
            {studentname}
          </Link>{" "}
          <span className="font-semibold">| Classrooms</span>
        </div>

        {/* Classroom Header */}
        <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaBook className="text-3xl sm:text-4xl md:text-5xl" />
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                My Classrooms
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Join a new class by entering its link
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
              <button
                className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition flex items-center gap-2 w-full md:w-auto justify-center"
                onClick={() => setShowInput(!showInput)}
              >
                <FaPlus /> Join a Class
              </button>
            </div>
          </div>
        </div>

        {/* Join Class Input Field */}
        {showInput && (
          <div className="max-w-full sm:max-w-5xl mx-auto mb-6 px-4">
            <div className="relative flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="text"
                placeholder="Paste class link here..."
                className="px-4 py-2 w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-md sm:rounded-l-md sm:rounded-r-none shadow-sm outline-none text-sm sm:text-base"
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
              />
              <button
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md w-full sm:w-auto"
                onClick={initiateJoinClass}
              >
                Join
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleJoinClass}
          title="Confirm Join Class"
          message={
            <>
              Are you sure you want to join the class with the link:{" "}
              <span className="font-medium break-all">{classInput}</span>?
            </>
          }
          confirmText="Join"
          cancelText="Cancel"
        />

        {/* Search Bar */}
        <div className="max-w-full sm:max-w-5xl mx-auto mb-6 px-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base" />
            <input
              type="text"
              placeholder="Search joined classrooms..."
              className="pl-10 py-2 w-full bg-white border border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-md shadow-sm outline-none text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Joined Classroom List */}
        <div className="max-w-full sm:max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 px-4">
          {filteredClassrooms.length > 0 ? (
            filteredClassrooms.map((classroom) => (
              <div
                key={classroom.id}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  {classroom.name}
                </h3>
                <p className="text-sm text-gray-700 capitalize font-bold">
                  Tutor: {classroom.teacher}
                </p>
                <p className="text-sm text-gray-700">
                  Topic: {classroom.category}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 pt-1">
                  {classroom.description.length > 200
                    ? classroom.description.slice(0, 200) + "....."
                    : classroom.description}
                </p>
                <Link
                  to={`/classroom/${classroom.slug}`}
                  className="mt-4 block w-full text-center bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition text-sm sm:text-base"
                >
                  View Class
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full text-sm sm:text-base">
              No joined classrooms. Paste a link to join one!
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Classrooms;