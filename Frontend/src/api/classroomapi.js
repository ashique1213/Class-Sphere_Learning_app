// classroomapi.js
import api from "./api"; 

export const fetchClasses = async (teachername, authToken) => {
  try {
    const response = await api.get(`/classrooms/?teacher=${teachername}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching classrooms:", error);
    throw error.response?.data || error;
  }
};

export const deleteClassroom = async (id, authToken) => {
  try {
    await api.delete(`/classrooms/${id}/delete/`);
    return true;
  } catch (error) {
    console.error("Error deleting classroom:", error);
    throw error.response?.data || error;
  }
};

export const fetchJoinedClasses = async (authToken) => {
    try {
      const response = await api.get("/joined-classes/");
      return response.data;
    } catch (error) {
      console.error("Error fetching joined classrooms:", error);
      throw error.response?.data || error;
    }
  };
  
export const joinClass = async (classLink, authToken) => {
    try {
      const slug = classLink.split("/").pop();
  
      if (!slug) throw new Error("Invalid class link!");
  
      const response = await api.post("/join-class/", { class_id: slug });
  
      return response.data.classroom;
    } catch (error) {
      console.error("Error joining class:", error);
      throw error.response?.data || error;
    }
  };
  
export const fetchClassroom = async (slug, authToken) => {
    try {
      const response = await api.get(`/classrooms/${slug}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching classroom details:", error);
      throw error.response?.data || error;
    }
};

export const createClassroom = async (formData, authToken, userEmail) => {
    try {
      const response = await api.post("/classrooms/", { ...formData, teacher_email: userEmail });
      return response.data;
    } catch (error) {
      console.error("Error creating classroom:", error);
      throw error.response?.data || error;
    }
  };
  
export const updateClassroom = async (classId, formData, authToken) => {
    try {
      const response = await api.put(`/classrooms/${classId}/update/`, formData);
      return response.data;
    } catch (error) {
      console.error("Error updating classroom:", error);
      throw error.response?.data || error;
    }
  };