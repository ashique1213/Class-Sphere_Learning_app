import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../Components/Layouts/Navbar";
import Footer from "../../Components/Layouts/Footer";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import { useSelector } from "react-redux";
import { fetchUserDetails, updateUserProfile } from "../../api/profileapi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

const Profile = () => {
  const authToken = useSelector((state) => state.auth.authToken);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
      return;
    }

    const loadUserDetails = async () => {
      try {
        const userData = await fetchUserDetails(authToken);
        setUser(userData);
        setEditedUser(userData);
        if (userData.profile_image) {
          setImagePreview(getCloudinaryUrl(userData.profile_image));
        }
      } catch (error) {
        toast.error("Failed loading user details", error);
      }
    };

    loadUserDetails();
  }, [authToken, navigate]);

  const getCloudinaryUrl = (profileImage) => {
    if (!profileImage) return null;
    if (profileImage.startsWith("http")) return profileImage;
    return `https://res.cloudinary.com/dajeitt4m/image/upload/${profileImage}`;
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUser({ ...editedUser, profile_image: file });
      setImagePreview(URL.createObjectURL(file));
      setImageError(false);
    }
  };

  const handleSubmit = async () => {
    if (editedUser.phone && !/^\d{10}$/.test(editedUser.phone)) {
      toast.error("Phone number must be 10 digits.");
      return;
    }

    if (
      editedUser.gender &&
      !["Male", "Female", "Other"].includes(editedUser.gender)
    ) {
      toast.error("Invalid gender selected.");
      return;
    }

    if (editedUser.dob && isNaN(new Date(editedUser.dob).getTime())) {
      toast.error("Invalid date of birth.");
      return;
    }

    if (editedUser.place && editedUser.place.length < 3) {
      toast.error("Place must be at least 3 characters long.");
      return;
    }

    try {
      const updatedUserData = await updateUserProfile(authToken, editedUser);
      setUser(updatedUserData);
      if (updatedUserData.profile_image) {
        setImagePreview(getCloudinaryUrl(updatedUserData.profile_image));
      }
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <>
      <Navbar />
      {/* Main Content with padding-top to avoid overlap */}
      <div className="min-h-screen bg-gray-100 px-4 pt-16 sm:pt-20 md:pt-24">
        {/* Breadcrumbs */}
        <div className="text-sm text-black max-w-full sm:max-w-5xl  mx-auto">
          Home | My Account |{" "}
          <span className="text-gray-800  font-bold capitalize">
            {user.username}
          </span>
        </div>

        {/* Profile Header */}
        <div className="bg-white max-w-full sm:max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden mt-4 capitalize">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-6 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            <div className="relative group">
              {imageError || (!imagePreview && !user.profile_image) ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center shadow-md">
                  <FaUserCircle className="text-4xl sm:text-5xl text-teal-500" />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview || user.profile_image}
                    alt="Profile"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md"
                    onError={() => setImageError(true)}
                  />
                </div>
              )}
              {isEditing && (
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 bg-white text-teal-600 p-1 sm:p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-100 transition"
                  title="Change profile picture"
                >
                  <FaCamera className="text-sm sm:text-base" />
                  <input
                    type="file"
                    id="profileImage"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <div className="mt-4 md:mt-0 md:ml-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
                {user.username}
              </h2>
              <p className="text-white text-sm opacity-90">
                {user.role || "Student"}
              </p>
            </div>
            {/* Verification Button */}
            {user?.role == "teacher" && (
              <div className="w-full md:w-auto mt-4 md:mt-0 flex justify-center md:justify-end ml-auto">
                <button
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-semibold shadow-md transition 
                ${
                  user?.is_verified
                    ? "bg-teal-400 text-white hover:bg-teal-600"
                    : "bg-red-600 text-white hover:bg-red-800"
                }`}
                >
                  {user?.is_verified ? (
                    <>
                      <FaCheckCircle className="text-sm" />
                      Verified
                    </>
                  ) : (
                    <>
                      <FaHourglassHalf className="text-sm" />
                      Verification Pending...
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-full sm:max-w-5xl mx-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 px-4 sm:px-6 py-4 ">
          <Link
            to="/Profile"
            className="px-4 py-2 bg-teal-400 text-white rounded-md text-sm w-full sm:w-auto text-center"
          >
            About
          </Link>

          {user?.role === "teacher" && user?.is_verified && (
            <Link
              to={`/myclassrooms/${user?.username}`}
              className="px-4 py-2 bg-gray-300 text-black rounded-md text-sm w-full sm:w-auto text-center hover:bg-gray-400 transition"
            >
              My Classrooms
            </Link>
          )}

          {user?.role === "student" && (
            <Link
              to={`/classrooms/${user?.username}`}
              className="px-4 py-2 bg-gray-300 text-black rounded-md text-sm w-full sm:w-auto text-center hover:bg-gray-400 transition"
            >
              Your Classrooms
            </Link>
          )}
        </div>

        {/* Profile Details */}
        <div className="bg-white max-w-full sm:max-w-5xl mx-auto p-4 sm:p-6  rounded-lg mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-black">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <strong className="text-sm sm:text-base">Email:</strong>
              <a
                href={`mailto:${user.email}`}
                className="text-teal-500 text-sm sm:text-base break-all"
              >
                {user.email}
              </a>
            </div>

            <div className="flex items-center space-x-2 capitalize">
              <strong className="text-sm sm:text-base">Role:</strong>
              <span className="text-sm sm:text-base">
                {user.role || "None"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <strong className="text-sm sm:text-base">Gender:</strong>
              {isEditing ? (
                <select
                  name="gender"
                  value={editedUser.gender || ""}
                  onChange={handleInputChange}
                  className="border rounded-md px-2 py-1 w-full sm:flex-1 text-sm sm:text-base"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span className="text-sm sm:text-base">
                  {user.gender || "None"}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <strong className="text-sm sm:text-base">DOB:</strong>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={editedUser.dob || ""}
                  onChange={handleInputChange}
                  className="border rounded-md px-2 py-1 w-full sm:flex-1 text-sm sm:text-base"
                />
              ) : (
                <span className="text-sm sm:text-base">
                  {user.dob || "None"}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <strong className="text-sm sm:text-base">Phone:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={editedUser.phone || ""}
                  onChange={handleInputChange}
                  className="border rounded-md px-2 py-1 w-full sm:flex-1 text-sm sm:text-base"
                />
              ) : (
                <span className="text-sm sm:text-base">
                  {user.phone || "None"}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <strong className="text-sm sm:text-base">Place:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="place"
                  value={editedUser.place || ""}
                  onChange={handleInputChange}
                  className="border rounded-md px-2 py-1 w-full sm:flex-1 text-sm sm:text-base"
                />
              ) : (
                <span className="text-sm sm:text-base">
                  {user.place || "None"}
                </span>
              )}
            </div>
          </div>

          {/* Edit & Reset Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 justify-end">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUser(user);
                    setImagePreview(getCloudinaryUrl(user.profile_image));
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md text-sm w-full sm:w-32 hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-teal-400 text-white rounded-md text-sm w-full sm:w-32 hover:bg-teal-500 transition"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-teal-400 text-white rounded-md text-sm w-full sm:w-32 hover:bg-teal-500 transition"
              >
                Edit Details
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
