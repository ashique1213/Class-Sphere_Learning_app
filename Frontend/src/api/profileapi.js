// profileapi.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchUserDetails = async (authToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/profile/`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

export const updateUserProfile = async (authToken, editedUser) => {
  try {
    const formData = new FormData();
    formData.append("gender", editedUser.gender || "");
    formData.append("phone", editedUser.phone || "");
    formData.append("place", editedUser.place || "");
    formData.append("dob", editedUser.dob || "");
    if (editedUser.profile_image instanceof File) {
      formData.append("profile_image", editedUser.profile_image);
    }

    const response = await axios.put(`${BASE_URL}/profile/`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
