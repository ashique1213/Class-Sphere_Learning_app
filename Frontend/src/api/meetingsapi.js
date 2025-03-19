import api from "./api";

export const createMeeting = async (slug, meetingData, authToken) => {
  try {
    const response = await api.post(`/meetings/create/${slug}/`, meetingData, {
      headers: { Authorization: `Token ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error.response?.data || error;
  }
};

export const fetchMeetings = async (slug, authToken) => {
  try {
    const response = await api.get(`/meetings/list/${slug}/`, {
      headers: { Authorization: `Token ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    throw error.response?.data || error;
  }
};

export const joinMeeting = async (meetingId, authToken) => {
  try {
    const response = await api.post(`/meetings/join/${meetingId}/`, {}, {
      headers: { Authorization: `Token ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error joining meeting:", error);
    throw error.response?.data || error;
  }
};

export const endMeeting = async (meetingId, authToken) => {
  try {
    const response = await api.post(`/meetings/end/${meetingId}/`, {}, {
      headers: { Authorization: `Token ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error ending meeting:", error);
    throw error.response?.data || error;
  }
};