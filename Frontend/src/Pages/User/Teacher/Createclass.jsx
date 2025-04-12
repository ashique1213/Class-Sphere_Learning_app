import React, { useState, useEffect } from "react";
import { FaUsers, FaCalendarAlt, FaShareAlt, FaToggleOn, FaToggleOff, FaSpinner } from "react-icons/fa";
import { MdOutlineTopic } from "react-icons/md";
import Navbar from "../../../Components/Layouts/Navbar";
import Footer from "../../../Components/Layouts/Footer";
import Createclassform from "../../../Components/Teacher/Createclassform";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchClasses, toggleClassroomActive } from "../../../api/classroomapi";
import { checkUserSubscription } from "../../../api/subscriptionapi";
import ConfirmationModal from "../../../Components/Layouts/ConfirmationModal";

const Createclass = () => {
  const { teachername } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [toggleId, setToggleId] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const authToken = useSelector((state) => state.auth.authToken);
  const message = localStorage.getItem("toastMessage");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (message) {
      toast.success(message);
      localStorage.removeItem("toastMessage");
    }
  }, []);

  useEffect(() => {
    const loadClassesAndSubscription = async () => {
      setLoading(true);
      try {
        // Fetch classrooms
        const classData = await fetchClasses(teachername);
        setClassrooms(classData);

        // Fetch subscription status
        const subscriptionData = await checkUserSubscription();
        setSubscriptionPlan(subscriptionData);
      } catch (error) {
        toast.error("Failed to fetch data: " + (error.error || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };
  
    if (authToken) {
      loadClassesAndSubscription();
    }
  }, [authToken, teachername]);
  

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <FaSpinner className="animate-spin text-teal-500 text-4xl" />
        </div>
        <Footer />
      </>
    );
  }

  const confirmToggle = (id) => {
    setToggleId(id);
  };

  const handleToggle = async () => {
    if (!toggleId) return;

    try {
      await toggleClassroomActive(toggleId);
      setClassrooms((prevClassrooms) =>
        prevClassrooms.map((classItem) =>
          classItem.id === toggleId
            ? { ...classItem, is_active: !classItem.is_active }
            : classItem
        )
      );
      setToggleId(null);
      toast.success(`Classroom ${classrooms.find(c => c.id === toggleId).is_active ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      toast.error("Failed to toggle classroom status. Please try again.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.info("Classroom link copied!");
  };

  const handleCreateClick = () => {
    if (!subscriptionPlan || !subscriptionPlan.subscribed || subscriptionPlan.subscription.plan.name === "free") {
      if (classrooms.length >= 2) {
        toast.error(
          <div>
            You have reached the limit of 2 classrooms with a free plan.{" "}
            <Link to="/plans" className="text-teal-600 underline">
              Upgrade Now
            </Link>{" "}
            to create more.
          </div>,
          { autoClose: 5000 }
        );
        return;
      }
    }
    // If paid plan or less than 2 classrooms on free plan, show form
    setShowForm(true);
  };

  const handleFormSubmit = async (teacherUsername, token) => {
    try {
      const data = await fetchClasses(teacherUsername, token);
      setClassrooms(data);
      setShowForm(false);
      toast.success("Classroom created successfully!");
    } catch (error) {
      if (
        error.error ===
        "You have reached the limit of 2 classrooms with a free plan. Upgrade to a paid plan to create more."
      ) {
        toast.error(
          <div>
            {error.error}{" "}
            <Link to="/plans" className="text-teal-600 underline">
              Upgrade Now
            </Link>
          </div>,
          { autoClose: 5000 }
        );
      } else {
        toast.error("Failed to save classroom: " + (error.error || "Unknown error"));
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 px-4 pt-16 sm:pt-20 md:pt-20">
        {/* Breadcrumbs */}
        <div className="text-sm text-black max-w-full sm:max-w-5xl mx-auto py-4">
          Home |{" "}
          <Link to="/profile" className="text-black hover:underline">
            My Account
          </Link>{" "}
          |{" "}
          <Link to="/profile" className="capitalize hover:underline">
            {teachername}
          </Link>{" "}
          |<span className="font-bold"> Class Rooms</span>
        </div>

        {/* Header */}
        <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-4 sm:p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center text-teal-500 shadow-md">
              <FaUsers className="text-3xl sm:text-4xl md:text-5xl" />
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                Class Rooms
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                Create and manage your classes (inactive classes remain accessible to joined students)
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
              <button
                className="bg-white text-teal-600 font-semibold px-4 py-2 rounded-md shadow-md hover:bg-gray-100 transition w-full md:w-auto"
                onClick={handleCreateClick}
              >
                {showForm ? "Close Form" : "Create Class"}
              </button>
            </div>
          </div>
        </div>

        {/* Show Create Class Form */}
        {showForm && (
          <div className="max-w-full sm:max-w-4xl mx-auto mb-6 px-4">
            <Createclassform
              onClose={() => setShowForm(false)}
              refreshClasses={handleFormSubmit}
              teachername={teachername}
              authToken={authToken}
            />
          </div>
        )}

        {/* Classroom Cards */}
        {classrooms.length === 0 ? (
          <div className="text-center text-gray-600 mt-4 text-sm sm:text-base">
            No classrooms available.
          </div>
        ) : (
          <>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center mb-6">
              Available Classrooms
            </h2>
            <div className="max-w-full sm:max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
              {classrooms.map((classItem) => (
                <div
                  key={classItem.id}
                  className="relative bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition flex flex-col items-center text-center"
                >
                  {/* Floating Icon */}
                  <div className="absolute -top-5 sm:-top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-teal-500 text-white flex items-center justify-center rounded-full shadow-md">
                    <FaUsers className="text-xl sm:text-2xl md:text-3xl" />
                  </div>

                  {/* Delete Icon */}
                  <button
                    onClick={() => confirmToggle(classItem.id)}
                    className="absolute top-3 right-7 sm:right-9 text-gray-500 hover:text-blue-700 transition"
                    title={classItem.is_active ? "Deactivate Classroom" : "Activate Classroom"}
                  >
                    {classItem.is_active ? (
                      <FaToggleOn className="text-md sm:text-base" />
                    ) : (
                      <FaToggleOff className="text-md sm:text-base" />
                    )}
                  </button>

                  {/* Share Icon */}
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${window.location.origin}/classroom/${classItem.slug}`
                      )
                    }
                    className="absolute top-3 right-2 sm:right-3 text-gray-500 hover:text-gray-700 transition"
                    title="Copy Classroom Link"
                  >
                    <FaShareAlt className="text-sm sm:text-base" />
                  </button>

                  {/* Classroom Name */}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mt-8 sm:mt-10 md:mt-12">
                    {classItem.name}
                  </h3>

                  {/* Category */}
                  <div className="flex items-center justify-center text-gray-600 mt-2 sm:mt-3">
                    <MdOutlineTopic className="text-teal-500 mr-2 text-sm sm:text-base" />
                    <p className="text-xs sm:text-sm font-medium">
                      Topic: {classItem.category}
                    </p>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center justify-center text-gray-600 mt-1 sm:mt-2">
                    <FaCalendarAlt className="text-teal-500 mr-2 text-sm sm:text-base" />
                    <p className="text-xs sm:text-sm">
                      {new Date(classItem.start_datetime).toLocaleDateString()}{" "}
                      - {new Date(classItem.end_datetime).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Participants Count */}
                  <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">
                    <strong>Participants:</strong> {classItem.max_participants}
                  </p>

                  <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">
                    <strong>Status:</strong> {classItem.is_active ? "Active" : "Inactive"}
                  </p>

                  <Link
                    to={`/classdetails/${classItem.slug}`}
                    className="mt-3 sm:mt-4 w-full px-4 py-2 bg-teal-500 text-white text-xs sm:text-sm rounded-md hover:bg-teal-600 transition"
                  >
                    View Class
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!toggleId}
        onConfirm={handleToggle}
        onClose={() => setToggleId(null)}
        title="Toggle Classroom Status"
        message={
          <>
            Are you sure you want to{" "}
            {classrooms.find(c => c.id === toggleId)?.is_active ? "deactivate" : "activate"} this classroom?
            {classrooms.find(c => c.id === toggleId)?.is_active ? (
              <span> Deactivating will prevent new students from joining, but current students can still access it.</span>
            ) : (
              <span> Activating will allow new students to join.</span>
            )}
          </>
        }
        confirmText="Confirm"
        cancelText="Cancel"
      />

      <Footer />
    </>
  );
};

export default Createclass;
