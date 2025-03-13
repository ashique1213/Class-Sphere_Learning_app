// classroomapi.js

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchClasses = async (teachername, authToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/classrooms/?teacher=${teachername}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    throw error;
  }
};

export const deleteClassroom = async (id, authToken) => {
  try {
    await axios.delete(`${BASE_URL}/classrooms/${id}/delete/`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    return true;
  } catch (error) {
    console.error("Error deleting classroom:", error);
    throw error;
  }
};


export const fetchJoinedClasses = async (authToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/joined-classes/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching joined classrooms:", error);
      throw error;
    }
  };
  
  export const joinClass = async (classLink, authToken) => {
    try {
      const slug = classLink.split("/").pop();
  
      if (!slug) throw new Error("Invalid class link!");
  
      const response = await axios.post(
        `${BASE_URL}/join-class/`,
        { class_id: slug },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
  
      return response.data.classroom;
    } catch (error) {
      console.error("Error joining class:", error);
      throw error;
    }
  };
  

  export const fetchClassroom = async (slug, authToken) => {
    try {
      const response = await axios.get(`${BASE_URL}/classrooms/${slug}/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching classroom details:", error);
      throw error;
    }
};
  

export const createClassroom = async (formData, authToken, userEmail) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/classrooms/`,
        { ...formData, teacher_email: userEmail },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating classroom:", error);
      throw error;
    }
  };
  
export const updateClassroom = async (classId, formData, authToken) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/classrooms/${classId}/update/`,
        formData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating classroom:", error);
      throw error;
    }
  };
  
  

