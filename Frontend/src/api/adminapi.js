// adminapi.js

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const adminLogin = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/adminlogin/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed.");
    }

    return data; 
  } catch (error) {
    throw new Error(error.message);
  }
};
