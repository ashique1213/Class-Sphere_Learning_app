// authapi.js
import api from "./api"; //Axios instance


export const signup = async (payload) => {
    try {
      const response = await api.post("/signup/", payload, {
        withCredentials: true,
      });
  
      return response; 
    } catch (error) {
      console.error("Signup request failed:", error);
      throw error.response?.data || error;
    }
  };

export const signin = async (payload) => {
    try {
      const response = await api.post("/signin/", payload, {
        withCredentials: true,
      });
  
      return response; 
    } catch (error) {
      console.error("Sign-in request failed:", error);
      throw error.response?.data || error; 
    }
  };

export const verifyOtp = async (payload) => {
    try {
      const response = await api.post("/verify-otp/", payload, {
        withCredentials: true,
      });
  
      return response; 
    } catch (error) {
      console.error("OTP verification request failed:", error);
      throw error.response?.data || error;
    }
  };
  
export const resendOtp = async (payload) => {
    try {
      const response = await api.post("/resend-otp/", payload, {
        withCredentials: true,
      });
  
      return response;
    } catch (error) {
      console.error("Resend OTP request failed:", error);
      throw error.response?.data || error;
    }
};

export const sendOtp = async (email) => {
  try {
    const response = await api.post("/password-reset/request/", { email });

    const data = response.data;

    if (!response.ok) {
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
    const response = await api.post("/password-reset/verify-otp/", { email, otp });

    const data = response.data;

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
    const response = await api.post("/password-reset/reset/", { 
      email, 
      otp, 
      new_password: newPassword 
    });

    const data = response.data;

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

export const fetchGoogleUserInfo = async (accessToken) => {
  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch Google user info");
  }
};

export const authenticateWithGoogle = async (accessToken, userType, isSignUp) => {
  try {
    const payload = {
      access_token: accessToken,
      role: userType.toLowerCase(),
      is_signup: isSignUp,
    };
    const response = await api.post("/auth/social/google/", payload, {
      withCredentials: true,
    });

    return response.data; // Simply return the data
  } catch (error) {
    console.error("Google Auth Error:", error.response?.data || error);
    throw error.response?.data || new Error("Google login failed!");
  }
};