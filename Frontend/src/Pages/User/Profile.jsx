import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import { useSelector } from "react-redux";
import { fetchUserDetails, updateUserProfile } from "../../api/profileapi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

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
        // console.error("Error loading user details:", error);
        toast.error("Error loading user details:", error);
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
    //Validation
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
      // console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
    try {
      const updatedUserData = await updateUserProfile(authToken, editedUser);
      setUser(updatedUserData);
      if (updatedUserData.profile_image) {
        setImagePreview(getCloudinaryUrl(updatedUserData.profile_image));
      }
      setIsEditing(false);
    } catch (error) {
      // console.error("Error updating profile:", error);
      toast.error("Error updating profile:", error);
    }
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;
  return (
    <>
      <Navbar />
      {/* Breadcrumbs */}
      <div className="min-h-screen bg-gray-100 p-6 md:py-20">
        <div className="p-4 text-black text-sm max-w-5xl mx-auto">
          Home | My Account |{" "}
          <span className="text-gray-800 font-bold capitalize">
            {user.username}
          </span>
        </div>

        {/* Profile Header */}
        <div className="bg-white max-w-5xl mx-auto rounded-lg shadow-lg overflow-hidden capitalize">
          <div className="bg-gradient-to-r from-teal-400 to-teal-600 p-8 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
            <div className="relative group">
              {imageError || (!imagePreview && !user.profile_image) ? (
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-md">
                  <FaUserCircle className="text-5xl text-teal-500" />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview || user.profile_image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    onError={() => {
                      console.error(
                        "Image load error for:",
                        imagePreview || user.profile_image
                      );
                      setImageError(true);
                    }}
                  />
                </div>
              )}

              {isEditing && (
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 bg-white text-teal-600 p-2 rounded-full cursor-pointer shadow-md hover:bg-gray-100 transition"
                  title="Change profile picture"
                >
                  <FaCamera />
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
            <div className="ml-4 mt-3 md:mt-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                {user.username}
              </h2>
              <p className="text-white text-sm sm:text-base opacity-90">
                {user.role || "Student"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 px-6 py-4 font-bold">
          <Link
            to="/Profile"
            className="px-4 py-2 bg-teal-400 text-white rounded-md text-sm"
          >
            About
          </Link>
          <Link
            to={
              user?.role === "teacher"
                ? `/myclassrooms/${user?.username}`
                : `/classrooms/${user?.username}`
            }
            className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md text-sm text-center font-bold"
          >
            {user?.role === "teacher" ? "My Classrooms" : "Joined Classrooms"}
          </Link>
        </div>

        {/* Profile Details */}
        <div className="bg-gray-200 max-w-5xl mx-auto p-6 rounded-lg mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center space-x-2">
              <strong>Email:</strong>
              <a href={`mailto:${user.email}`} className="text-teal-500">
                {user.email}
              </a>
            </div>

            <div className="flex items-center space-x-2 capitalize">
              <strong>Role:</strong>
              <span>{user.role || "None"}</span>
            </div>

            <div className="flex items-center space-x-1">
              <strong>Gender:</strong>
              {isEditing ? (
                <select
                  name="gender"
                  value={editedUser.gender || ""}
                  onChange={handleInputChange}
                  className="border rounded-md px-2 py-1 flex-1"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span>{user.gender || "None"}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <strong>DOB :</strong>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={editedUser.dob || ""}
                  onChange={handleInputChange}
                  className="border rounded-md px-2 py-1 flex-1"
                />
              ) : (
                <span>{user.dob || "None"}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <strong>Phone :</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={editedUser.phone || ""}
                  onChange={handleInputChange}
                  className="border rounded-md px-2 py-1 flex-1"
                />
              ) : (
                <span>{user.phone || "None"}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <strong>Place:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="place"
                  value={editedUser.place || ""}
                  onChange={handleInputChange}
                  className="border rounded-md px-2 py-1 flex-1"
                />
              ) : (
                <span>{user.place || "None"}</span>
              )}
            </div>
          </div>

          {/* Edit & Reset Buttons */}
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4 items-end justify-end">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedUser(user);
                    setImagePreview(getCloudinaryUrl(user.profile_image));
                  }}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md text-sm w-full md:w-40 hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-teal-400 text-white rounded-md text-sm w-full md:w-40 hover:bg-teal-500 transition"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-teal-400 text-white rounded-md text-sm w-full md:w-40 hover:bg-teal-500 transition"
              >
                Edit Details
              </button>
            )}
            {/* <button
              className="px-4 py-2 bg-red-400 text-white rounded-md text-sm w-full md:w-40 hover:bg-red-400 transition"
              onClick={() => navigate("")}
            >
              Reset Password
            </button> */}
          </div>
        </div>
      </div>
      <ToastContainer />

      <Footer />
    </>
  );
};

export default Profile;
