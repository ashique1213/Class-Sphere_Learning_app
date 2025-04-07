import api from "./api";

// Fetch all subscription plans
export const getAllSubscriptionPlans = async () => {
  try {
    const response = await api.get("/subscription/plans/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new subscription plan
export const createSubscriptionPlan = async (planData) => {
    try {
      const response = await api.post("/subscription/plans/", planData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error; // Throw detailed error
    }
  };

// Update an existing subscription plan
export const updateSubscriptionPlan = async (id, planData) => {
  try {
    const response = await api.put(`/subscription/plans/${id}/`, planData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// Toggle active/inactive status of a subscription plan
export const toggleActiveSubscriptionPlan = async (id) => {
  try {
    const response = await api.patch(`/subscription/plans/${id}/toggle-active/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const checkUserSubscription = async () => {
  try {
    const response = await api.get("/subscription/check-subscription/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createPaymentIntent = async (token, planId) => {
  try {
    const response = await api.post(
      "/subscription/create-payment-intent/",
      { plan_id: planId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const confirmPayment = async (token, paymentIntentId, planId) => {
  try {
    const response = await api.post(
      "/subscription/confirm-payment/",
      { payment_intent_id: paymentIntentId, plan_id: planId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


export const getSubscriptionHistory = async () => {
  try {
    const response = await api.get("/subscription/subscription-history/" );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// New function to fetch transaction history
export const getTransactionHistory = async () => {
  try {
    const response = await api.get("/subscription/transaction-history/" );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};