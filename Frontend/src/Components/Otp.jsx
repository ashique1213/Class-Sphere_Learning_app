import React, { useState, useEffect } from "react";

const Otp = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      setError("No email found. Please try signing up again.");
    }
  }, [email]);

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
        onSuccess(); // Navigate to profile after OTP verification
      } else {
        setError(data.error || "Invalid OTP, try again.");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Try again!");
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full mt-4">
      <h2 className="text-lg font-semibold text-gray-700 text-center">
        Verify OTP
      </h2>
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
      {success && (
        <p className="text-green-500 text-xs">OTP Verified Successfully!</p>
      )}
      <button
        onClick={handleVerify}
        className="w-full bg-teal-400 text-white py-2 rounded-md text-sm hover:bg-teal-500"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </div>
  );
};

export default Otp;
