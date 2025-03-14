import api from "./api";

export const adminLogin = async (email, password) => {
  try {
    const response = await api.post("/adminlogin/", { email, password });
    return response.data;
  
  } catch (error) {
    console.error("Admin Login Error:", error.response?.data || error);
    throw new Error(error.response?.data?.error || "Admin login failed.");
  }
};

export const verifyTeacher = async (userId) => {
  try {
    const response = await api.post(`/verify/${userId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to verify teacher";
  }
};

export const fetchStudents = async () => {
  try {
    const response = await api.get("/students/");
    return response.data;
  } catch (error) {
    console.error("Fetch Students Error:", error.response?.data || error);
    throw new Error(error.response?.data?.error || "Failed to fetch students");
  }
};

export const fetchTeachers = async () => {
  try {
    const response = await api.get("/teachers/");
    return response.data;
  } catch (error) {
    console.error("Fetch Teachers Error:", error.response?.data || error);
    throw new Error(error.response?.data?.error || "Failed to fetch teachers");
  }
};

export const blockUser = async (userId) => {
  try {
    const response = await api.post(`/block/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Block User Error:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Failed to block user");
  }
};

export const unblockUser = async (userId) => {
  try {
    const response = await api.post(`/unblock/${userId}/`);
    return response.data;
  } catch (error) {
    console.error("Unblock User Error:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Failed to unblock user");
  }
};