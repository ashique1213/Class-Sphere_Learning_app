import React, { useState, useEffect } from "react";
import { sendOtp, verifyotppass, resetPassword } from "../../api/authapi";
import { toast } from 'react-toastify';

const ResetPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stage, setStage] = useState("email"); // 'email', 'otp', 'reset'
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval;
    if (stage === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [stage, timer]);

  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);
        const data = await sendOtp(email);
        console.log(data)

      if (data.success) {
        setStage("otp");
        setError("");
        setTimer(60);
        setOtp(""); // Clear previous OTP
        toast.success(data.message || "OTP sent to your email!");
      } else {
        setError(data.message || "Failed to send OTP. Try again.");
        toast.error(data.message || "Failed to send OTP. Try again.");
      }
    } catch (error) {
      setError("Network error. Try again.");
      toast.error("Network error. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Enter a 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const data = await verifyotppass(email, otp);

      if (data.success) {
        setStage("reset");
        setError("");
        toast.success(data.message || "OTP verified successfully!");
      } else {
        setError(data.message || "Invalid OTP. Try again.");
        toast.error(data.message || "Invalid OTP. Try again.");
      }
    } catch (error) {
      setError("Network error. Try again.");
      toast.error("Network error. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);
      const data = await resetPassword(email, otp, newPassword);

      if (data.success) {
        setSuccess("Password reset successfully!");
        toast.success(data.message || "Password reset successfully!");
        setTimeout(onClose, 2000);
      } else {
        setError(data.message || "Reset failed. Try again.");
        toast.error(data.message || "Reset failed. Try again.");
      }
    } catch (error) {
      setError("Network error. Try again.");
      toast.error("Network error. Try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer === 0) {
      await handleSendOtp();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full mt-4">
      <h2 className="text-lg font-semibold text-gray-700 text-center">
        {stage === "email" && "Reset Password"}
        {stage === "otp" && "Verify OTP"}
        {stage === "reset" && "Create New Password"}
      </h2>

      {stage === "email" && (
        <>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => {
              setEmail(e.target.value);
              setError(""); // Clear any previous errors
            }} 
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400" 
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button 
            onClick={handleSendOtp} 
            className="w-full bg-teal-400 text-white py-2 rounded-md text-sm hover:bg-teal-500" 
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      )}

      {stage === "otp" && (
        <>
          <div className="text-sm text-gray-600 mb-2">
            OTP sent to {email}
          </div>
          <input 
            type="text" 
            value={otp} 
            onChange={(e) => {
              // Only allow numeric input
              const numericValue = e.target.value.replace(/\D/g, '');
              setOtp(numericValue);
              setError(""); // Clear any previous errors
            }} 
            placeholder="Enter 6-digit OTP"
            maxLength={6} 
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400 text-center" 
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="text-xs text-gray-500 mt-2">
            {timer > 0 ? (
              <span>Time remaining: {timer}s</span>
            ) : (
              <span 
                className="text-teal-500 cursor-pointer hover:underline" 
                onClick={handleResendOtp}
              >
                Resend OTP
              </span>
            )}
          </div>
          <button 
            onClick={handleVerifyOtp} 
            className="w-full bg-teal-400 text-white py-2 rounded-md text-sm hover:bg-teal-500"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {stage === "reset" && (
        <>
          <input 
            type="password" 
            value={newPassword} 
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError(""); // Clear any previous errors
            }} 
            placeholder="New Password"
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400" 
          />
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError(""); // Clear any previous errors
            }} 
            placeholder="Confirm Password"
            className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400" 
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          {success && <p className="text-green-500 text-xs">{success}</p>}
          <button 
            onClick={handleResetPassword} 
            className="w-full bg-teal-400 text-white py-2 rounded-md text-sm hover:bg-teal-500"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </>
      )}
    </div>
  );
};

export default ResetPassword;