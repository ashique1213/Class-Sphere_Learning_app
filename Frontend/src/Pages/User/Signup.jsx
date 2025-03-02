import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import Login_image from "../../assets/Images/Login_image.png";
import Otp from "../../Components/Otp";

const Signup = () => {
  const [userType, setUserType] = useState(null);
  const [isSignUp, setIsSignUp] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: userType ? userType.toLowerCase() : "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync role with formData when userType changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, role: userType ? userType : "" }));
  }, [userType]);

  // Handle mode change (signup/login)
  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "signup");
  }, [searchParams]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!userType) {
      setError("Please select whether you are a Student or a Teacher.");
      return;
    }
  
    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
  
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: userType.toLowerCase(),
      };
  
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://127.0.0.1:8000/api/signup/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
        setLoading(false);
  
        if (response.ok) {
          localStorage.setItem("email", formData.email);
          console.log("Email stored in localStorage:", formData.email);
  
          setIsOtpSent(true); // Show OTP input
        } else {
          setError(data.error || "Signup failed");
        }
      } catch (err) {
        setLoading(false);
        setError("Something went wrong. Try again!");
      }
    }
  };

  // Handle OTP Success (After OTP verification, navigate)
  const handleOtpSuccess = () => {
    navigate("/"); // Redirect after successful OTP verification
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="relative flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden w-full max-w-3xl min-h-[550px]">
        {/* Home Icon Positioned at Top Right */}
        <Link to="/" className="absolute top-4 right-4">
          <FaHome className="text-black text-2xl hover:text-gray-300 transition" />
        </Link>

        {/* Left Side - Image */}
        <div className="relative w-full md:w-1/2">
          <img src={Login_image} alt="Classroom" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-opacity-30 flex flex-col justify-end p-4">
            <h2 className="text-gray-900 text-lg font-semibold">Join Us</h2>
            <p className="text-black font-bold text-xs pb-3">Start your learning journey today</p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          {!userType ? (
            <>
              <h2 className="text-lg font-semibold text-gray-700 text-center">Are you joining as a Student or a Teacher?</h2>
              <button onClick={() => setUserType("Student")} className="w-full mt-4 bg-teal-500 text-white py-2 rounded-md text-sm hover:bg-teal-600">
                I am a <span className="font-bold">STUDENT</span>
              </button>
              <button onClick={() => setUserType("Teacher")} className="w-full mt-4 bg-teal-700 text-white py-2 rounded-md text-sm hover:bg-teal-600">
                I am a <span className="font-bold">TEACHER</span>
              </button>
            </>
          ) : (
            <>
              {!isOtpSent ? (
                <>
                  <h2 className="text-lg font-semibold text-gray-700 text-center">
                    {isSignUp ? `Create ${userType} Account` : "Sign In"}
                  </h2>
                  <div className="flex justify-center gap-3 mt-3">
                    <button
                      className={`px-4 py-1.5 rounded-md text-sm ${!isSignUp ? "bg-teal-400 text-white" : "bg-gray-200 text-gray-600"}`}
                      onClick={() => setIsSignUp(false)}
                    >
                      Login
                    </button>
                    <button
                      className={`px-4 py-1.5 rounded-md text-sm ${isSignUp ? "bg-teal-400 text-white" : "bg-gray-200 text-gray-600"}`}
                      onClick={() => setIsSignUp(true)}
                    >
                      Sign Up
                    </button>
                  </div>
                  <button className="flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md mt-3 w-full text-sm">
                    <span className="text-gray-600">G+</span> {isSignUp ? "Sign up with Google" : "Sign in with Google"}
                  </button>
                  <div className="mt-4 space-y-3">
                    {isSignUp && (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400"
                      />
                    )}
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400"
                    />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400"
                    />
                    {isSignUp && (
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter Password"
                        className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400"
                      />
                    )}
                  </div>
                  {error && <p className="text-red-500 text-xs">{error}</p>}

                  <button
                    onClick={handleSubmit}
                    className="w-full mt-4 bg-teal-400 text-white py-2 rounded-md text-sm hover:bg-teal-500"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-3">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span onClick={() => setIsSignUp(!isSignUp)} className="text-teal-500 hover:underline cursor-pointer">
                      {isSignUp ? "Login here" : "Sign up here"}
                    </span>
                  </p>
                </>
              ) : (
                <Otp email={formData.email} onSuccess={handleOtpSuccess} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
