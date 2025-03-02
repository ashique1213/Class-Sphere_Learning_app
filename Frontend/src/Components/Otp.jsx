import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Otp = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(60); 
  const [isExpired, setIsExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      setError("No email found. Please try signing up again.");
    }
  }, [email]);

  // Start timer countdown
  useEffect(() => {
    if (timer > 0 && !isExpired) {
      const interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0) {
      setIsExpired(true); // Timer expired
    }
  }, [timer, isExpired]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only digits
    setOtp(value);
    setError(null);
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://127.0.0.1:8000/api/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });
  
      const data = await response.json();
      setLoading(false);
  
      if (response.ok) {
        setSuccess(true);
        const authToken = data.access_token;  
        if (authToken) {
          localStorage.setItem("authToken", authToken);  
          onSuccess();  // Proceed with successful login or navigation
        } else {
          setError("Failed to get auth token.");
        }
      } else {
        setError(data.error || "Invalid OTP, try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Try again!");
    }
  };
  
  

  const handleResendOtp = async () => {
    if (isExpired) {
      try {
        // Request a new OTP here
        setLoading(true);
        setError(null);
        const response = await fetch("http://127.0.0.1:8000/api/resend-otp/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email }), // Sending the email to resend OTP
        });

        const data = await response.json();
        setLoading(false);

        if (response.ok) {
          setTimer(60); // Reset timer
          setIsExpired(false); // Reset expiration
          setOtp(""); // Clear OTP input
          setSuccess(false); // Reset success
        } else {
          setError(data.error || "Failed to resend OTP.");
        }
      } catch (err) {
        setLoading(false);
        setError("Something went wrong. Try again!");
      }
    }
  };

  // Redirect to signup page if OTP expires or user is unsuccessful after resend
  useEffect(() => {
    if (isExpired) {
      navigate("/signup"); // Redirect to signup if time expires
    }
  }, [isExpired, navigate]);

  return (
    <div className="flex flex-col items-center gap-3 w-full mt-4">
      <h2 className="text-lg font-semibold text-gray-700 text-center">Verify OTP</h2>
      {email && <p className="text-xs text-gray-500">OTP sent to: {email}</p>}
      <input
        type="text"
        value={otp}
        onChange={handleChange}
        placeholder="Enter OTP"
        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400 text-center"
        maxLength={6}
        autoFocus
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {success && <p className="text-green-500 text-xs">OTP Verified Successfully!</p>}
      <div className="text-xs text-gray-500 mt-2">
        {isExpired ? (
          <span>OTP expired. Please resend.</span>
        ) : (
          <span>Time remaining: {timer}s</span>
        )}
      </div>
      <button
        onClick={handleVerify}
        className="w-full bg-teal-400 text-white py-2 rounded-md text-sm hover:bg-teal-500"
        disabled={loading || isExpired}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      {isExpired && (
        <button
          onClick={handleResendOtp}
          className="w-full bg-gray-400 text-white py-2 rounded-md text-sm hover:bg-gray-500 mt-3"
          disabled={loading}
        >
          {loading ? "Resending..." : "Resend OTP"}
        </button>
      )}
    </div>
  );
};

export default Otp;
