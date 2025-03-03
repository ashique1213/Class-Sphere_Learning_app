import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";

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

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUser(response.data);
        setEditedUser(response.data);
        if (response.data.profile_image) {
          // For Cloudinary, we need to get the URL from the profile_image field
          setImagePreview(getCloudinaryUrl(response.data.profile_image));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [authToken, navigate]);

  // Helper function to get Cloudinary URL from public_id
  // Ensure this function correctly returns the Cloudinary image URL
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
    try {
      const formData = new FormData();
      formData.append("gender", editedUser.gender || "");
      formData.append("phone", editedUser.phone || "");
      formData.append("place", editedUser.place || "");
      formData.append("dob", editedUser.dob || "");
      if (editedUser.profile_image instanceof File) {
        formData.append("profile_image", editedUser.profile_image);
      }

      const response = await axios.put(
        "http://127.0.0.1:8000/api/profile/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data);
      // Update image preview with the Cloudinary URL
      if (response.data.profile_image) {
        setImagePreview(getCloudinaryUrl(response.data.profile_image));
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  return (
    <>
      <Navbar />
      {/* Breadcrumbs */}
      <div className="min-h-screen bg-gray-100 p-6 md:py-20">
        <div className="p-4 text-gray-600 text-sm max-w-5xl mx-auto">
          Home | My Account |{" "}
          <span className="text-gray-800 font-semibold capitalize">
            {user.username}
          </span>
        </div>

        {/* Profile Header */}
        <div className="bg-white max-w-5xl mx-auto rounded-lg shadow-md overflow-hidden">
          <div className="bg-teal-100 p-6 flex flex-col md:flex-row capitalize items-center md:items-start text-center md:text-left">
            <div className="relative group">
              {imageError || (!imagePreview && !user.profile_image) ? (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUserCircle className="text-5xl text-gray-500" />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview || user.profile_image}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-white"
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
                  className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-teal-600 transition"
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
              <h2 className="text-xl font-semibold text-gray-800">
                {user.username}
              </h2>
              <p className="text-gray-600">{user.role || "Student"}</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 px-6 py-4">
          <button className="px-4 py-2 bg-teal-400 text-white rounded-md text-sm">
            About
          </button>
          <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md text-sm text-center">
            Classroom
          </button>
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
              <span>{user.role || "N/A"}</span>
            </div>

            <div className="flex items-center space-x-2">
              <strong>Phone:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={editedUser.phone || ""}
                  onChange={handleInputChange}
                  className="border rounded-md px-2 py-1 flex-1"
                />
              ) : (
                <span>{user.phone || "N/A"}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
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
                <span>{user.gender || "N/A"}</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <strong>DOB:</strong>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={editedUser.dob || ""}
                  onChange={handleInputChange}
                  className="border rounded-md px-2 py-1 flex-1"
                />
              ) : (
                <span>{user.dob || "N/A"}</span>
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
                <span>{user.place || "N/A"}</span>
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
            <button
              className="px-4 py-2 bg-red-400 text-white rounded-md text-sm w-full md:w-40 hover:bg-red-400 transition"
              onClick={() => navigate("")}
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
