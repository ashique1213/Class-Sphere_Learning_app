// examsapi.js
import api from "./api";

const fetchExams = async (slug) => {
  try {
    const response = await api.get(`/classrooms/${slug}/exams/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching exams:", error.response?.data || error.message);
    throw error;
  }
};

const fetchExam = async (examId) => {
    try {
      const response = await api.get(`/exams/${examId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching exam:", error.response?.data || error.message);
      throw error;
    }
  };

const createExam = async (slug, examData) => {
  try {
    const response = await api.post(`/classrooms/${slug}/exams/`, examData);
    return response.data;
  } catch (error) {
    console.error("Error creating exam:", error.response?.data || error.message);
    throw error;
  }
};

const updateExam = async (examId, examData) => {
  try {
    const response = await api.put(`/exams/${examId}/`, examData);
    return response.data;
  } catch (error) {
    console.error("Error updating exam:", error.response?.data || error.message);
    throw error;
  }
};

const deleteExam = async (examId) => {
  try {
    await api.delete(`/exams/${examId}/`);
  } catch (error) {
    console.error("Error deleting exam:", error.response?.data || error.message);
    throw error;
  }
};

const submitExam = async (examId, answers) => {
  try {
    const response = await api.post(`/exams/${examId}/submit/`, { answers });
    return response.data;
  } catch (error) {
    console.error("Error submitting exam:", error.response?.data || error.message);
    throw error;
  }
};

const fetchSubmissions = async (slug) => {
    try {
      const response = await api.get(`/classrooms/${slug}/submissions/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching submissions:", error.response?.data || error.message);
      throw error;
    }
};
  
const fetchExamSubmissionsForTeacher = async (examId) => {
  try {
    const response = await api.get(`/exams/${examId}/submissions/`);
    console.log("Teacher Fetch Submissions Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher submissions:", error.response?.data || error.message);
    throw error;
  }
};
export { fetchExams, fetchExam,fetchExamSubmissionsForTeacher, fetchSubmissions, createExam, updateExam, deleteExam, submitExam };