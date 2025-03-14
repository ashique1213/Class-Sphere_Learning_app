// profileapi.js
import api from "./api"; //Axios instance

export const fetchUserDetails = async (authToken) => {
  try {
    const response = await api.get("/profile/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error.response?.data || error;
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

    const response = await api.put("/profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error.response?.data || error;
  }
};