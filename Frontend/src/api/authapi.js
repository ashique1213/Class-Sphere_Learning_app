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
  

export const sendOtp = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/password-reset/request/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle non-200 status codes
      return {
        success: false,
        message: data.error || "Failed to send OTP"
      };
    }

    return {
      success: true,
      message: data.message || "OTP sent successfully"
    };
  } catch (error) {
    console.error("Send OTP Error:", error);
    return {
      success: false,
      message: "Network error. Please try again."
    };
  }
};

export const verifyotp = async (email, otp) => {
  try {
    const response = await fetch(`${BASE_URL}/password-reset/verify-otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Failed to verify OTP"
      };
    }

    return {
      success: true,
      message: data.message || "OTP verified successfully"
    };
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return {
      success: false,
      message: "Network error. Please try again."
    };
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await fetch(`${BASE_URL}/password-reset/reset/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email, 
        otp, 
        new_password: newPassword 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.error || "Failed to reset password"
      };
    }

    return {
      success: true,
      message: data.message || "Password reset successfully"
    };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return {
      success: false,
      message: "Network error. Please try again."
    };
  }
};