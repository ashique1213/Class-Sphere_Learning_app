import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/profile/";

export const fetchUserDetails = async (authToken) => {
  try {
    const response = await axios.get(API_BASE_URL, {
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

    const response = await axios.put(API_BASE_URL, formData, {
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
