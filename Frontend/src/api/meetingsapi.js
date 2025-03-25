// meetingsapi.js
import api from "./api";

export const createMeeting = async (slug, meetingData) => {
  try {
    const response = await api.post(`/meetings/create/${slug}/`, meetingData);
    return response.data;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error.response?.data || error;
  }
};

export const fetchMeetings = async (slug) => {
  try {
    const response = await api.get(`/meetings/list/${slug}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error.response?.data || error;
  }
};

export const joinMeeting = async (meetingId) => {
  try {
    const response = await api.post(`/meetings/join/${meetingId}/`, {});
    return response.data;
  } catch (error) {
    console.error("Error joining meeting:", error);
    throw error.response?.data || error;
  }
};

export const endMeeting = async (meetingId) => {
  try {
    const response = await api.post(`/meetings/end/${meetingId}/`, {});
    return response.data;
  } catch (error) {
    console.error("Error ending meeting:", error);
    throw error.response?.data || error;
  }
};