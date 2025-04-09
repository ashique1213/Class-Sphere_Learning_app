// chatapi.js
import api from "./api";

export const getRecentChats = async () => {
  const response = await api.get("/chat/recent/");
  return response.data;
};

export const getChatMessages = async (chatId) => {
  const response = await api.get(`/chat/messages/${chatId}/`);
  return response.data;
};

export const sendChatMessage = async (chatId, data) => {
  const response = await api.post("/chat/send/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getSubscribedUsers = async () => {
  const response = await api.get("/subscribed-users/");
  return response.data;
};

export const createOrGetChat = async (userId) => {
  const response = await api.post("/chat/create/", { user_id: userId });
  return response.data;
};