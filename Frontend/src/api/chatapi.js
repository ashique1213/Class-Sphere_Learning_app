import api from "./api";

export const getRecentChats = async () => {
  const response = await api.get("/chat/recent/");
  return response.data;
};

export const getChatMessages = async (chatId) => {
  const response = await api.get(`/chat/messages/${chatId}/`);
  return response.data;
};

export const sendChatMessage = async (chatId, message) => {
  const response = await api.post("/chat/send/", { chat_id: chatId, message });
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
