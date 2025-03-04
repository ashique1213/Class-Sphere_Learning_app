// authapi.js
const BASE_URL = "http://127.0.0.1:8000/api";

export const signup = async (payload) => {
    try {
      const response = await fetch(`${BASE_URL}/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
  
      return response; 
    } catch (error) {
      console.error("Signup request failed:", error);
      throw error;
    }
  };

export const signin = async (payload) => {
    try {
      const response = await fetch(`${BASE_URL}/signin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
  
      return response; 
    } catch (error) {
      console.error("Sign-in request failed:", error);
      throw error; 
    }
  };

  export const verifyOtp = async (payload) => {
    try {
      const response = await fetch(`${BASE_URL}/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
  
      return response; 
    } catch (error) {
      console.error("OTP verification request failed:", error);
      throw error;
    }
  };
  

  export const resendOtp = async (payload) => {
    try {
      const response = await fetch(`${BASE_URL}/resend-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
  
      return response;
    } catch (error) {
      console.error("Resend OTP request failed:", error);
      throw error;
    }
};
  

