// src/api/reviewapi.js
import api from "./api";

export const submitReview = async (reviewData) => {
  try {
    const response = await api.post("/reviews/", reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserReview = async () => {
  try {
    const response = await api.get("/reviews/user-review/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllReviews = async () => {
  try {
    const response = await api.get("/reviews/all/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAdminAllReviews = async () => {
  try {
    const response = await api.get("/admin/reviews/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const approveReview = async (reviewId) => {
  try {
    const response = await api.post(`/admin/reviews/approve/${reviewId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/admin/reviews/delete/${reviewId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};