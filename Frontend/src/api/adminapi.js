// adminapi.js
import api from "./api"; // Axios instance


export const adminLogin = async (email, password) => {
  try {
    const response = await api.post("/adminlogin/", {
      email,
      password,
    });

    const data = response.data;

    if (!response.ok) {
      throw new Error(data.error || "Login failed.");
    }

    return data; 
  } catch (error) {
    throw new Error(error.message || "Admin login failed.");
  }
};
