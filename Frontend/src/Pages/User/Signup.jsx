import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../redux/authSlice";
import Login_image from "../../assets/Images/Login_image.png";
import Otp from "../../Components/Layouts/Otp";
import { signup, signin } from "../../api/authapi";
import ResetPassword from "../../Components/Layouts/Resetpassword";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleSignIn from "../../Components/Layouts/GoogleSignIn";

const Signup = () => {
  const [userType, setUserType] = useState(null);
  const [isSignUp, setIsSignUp] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.authToken);

  useEffect(() => {
    if (authToken) {
      navigate("/");
    }
  }, [authToken, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userType) {
      setFormData((prev) => ({ ...prev, role: userType.toLowerCase() }));
    }
  }, [userType]);

  // Handle mode change (signup/login)
  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "signup");
  }, [searchParams]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear errors when user types
  };

  // Validate form fields
  const validateForm = () => {
    if (!userType) {
      setError("Please select whether you are a Student or a Teacher.");
      toast.error("Please select whether you are a Student or a Teacher.");
      return false;
    }

    if (isSignUp) {
      if (!formData.username || formData.username.trim() === "") {
        setError("Username is required.");
        toast.error("Username is required.");
        return false;
      }

      if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
        setError("Username must be 3-20 chars, only letters, numbers");
        toast.error("Username must be 3-20 chars, only letters, numbers");
        return false;
      }

      if (!formData.email || formData.email.trim() === "") {
        setError("Email is required.");
        toast.error("Email is required.");
        return false;
      }

      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        setError("Invalid email format.");
        toast.error("Invalid email format.");
        return false;
      }

      if (!formData.password) {
        setError("Password is required.");
        toast.error("Password is required.");
        return false;
      }

      if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(
          formData.password
        )
      ) {
        setError("Password must be 6+ chars with A-Z, a-z, 0-9 & symbol.");
        toast.error("Password must be 6+ chars with A-Z, a-z, 0-9 & symbol.");

        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        toast.error("Passwords do not match.");
        return false;
      }
    } else {
      if (!formData.email || formData.email.trim() === "") {
        setError("Email is required.");
        toast.error("Email is required.");
        return false;
      }

      if (!formData.password) {
        setError("Password is required.");
        toast.error("Password is required.");
        return false;
      }
    }

    setError(null); // Clear any previous errors
    return true;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    if (isSignUp) {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: userType.toLowerCase(),
      };
  
      try {
        dispatch(loginStart());
        setLoading(true);
        setError(null);
        const data = await signup(payload); // Now returns response.data
  
        setLoading(false);
  
        if (data.success) {
          dispatch(
            loginSuccess({
              user: { username: formData.username },
              email: formData.email,
              role: userType.toLowerCase(),
              authToken: false, // Will be updated after OTP verification
            })
          );
          setIsOtpSent(true); // Show OTP input
          toast.success(data.message || "OTP sent successfully! Please verify.");
        } else {
          dispatch(loginFailure(data.error || "Signup failed"));
          setError(data.error || "Signup failed");
          toast.error(data.error || "Signup failed");
        }
      } catch (err) {
        setLoading(false);
        dispatch(loginFailure(err.error || "Something went wrong. Try again!"));
        setError(err.error || "Something went wrong. Try again!");
        toast.error(err.error || "Something went wrong. Try again!");
      }
    } else {
      // Sign in logic
      const payload = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: userType.toLowerCase(),
      };
      console.log("Signin payload:", payload);
      try {
        dispatch(loginStart());
        setLoading(true);
        setError(null);
  
        const data = await signin(payload); // Now returns response.data
        setLoading(false);
  
        console.log("Signin Response:", data);
  
        if (data.success) {
          const authToken = data.access_token;
          const refreshToken = data.refresh_token;
  
          if (!authToken || !refreshToken) {
            throw new Error("Missing tokens in response");
          }
  
          dispatch(
            loginSuccess({
              user: data.user || { email: formData.email },
              email: formData.email,
              role: userType.toLowerCase(),
              authToken,
              refreshToken,
              is_active: data.user?.is_active ?? true,
            })
          );
          navigate("/");
        } else {
          const errorMsg = data.error || "Login failed";
          dispatch(loginFailure(errorMsg));
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        setLoading(false);
        const errorMsg = err.error || err.message || "Something went wrong. Try again!";
        dispatch(loginFailure(errorMsg));
        setError(errorMsg);
        toast.error(errorMsg);
      }
    }
  };

  const handleOtpSuccess = () => {
    toast.success("Login Successful!");
    navigate("/");
  };

  const handleForgotPassword = () => {
    setIsResetPassword(true);
  };

  const handleResetPasswordClose = () => {
    setIsResetPassword(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <div className="relative flex flex-col md:flex-row bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl min-h-[600px] border border-white/50 z-10">
        {/* Home Icon Positioned at Top Right */}
        <Link to="/" className="absolute top-6 right-6 z-20 bg-white/50 p-2 rounded-full backdrop-blur-sm hover:bg-teal-50 transition-all duration-300 shadow-sm">
          <FaHome className="text-teal-700 text-xl" />
        </Link>

        {/* Left Side - Image */}
        <div className="relative w-full md:w-5/12 hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-900/40 to-transparent z-10"></div>
          <img
            src={Login_image}
            alt="Classroom"
            className="w-full h-full object-cover transform scale-105"
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 text-white">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Join Us</h2>
            <p className="text-teal-100 font-medium text-sm pb-4">
              Start your learning journey today with our cutting-edge platform.
            </p>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white">
          {isResetPassword ? (
            <ResetPassword onClose={handleResetPasswordClose} />
          ) : userType === null ? (
            <div className="max-w-sm mx-auto w-full text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome</h2>
              <p className="text-gray-500 text-sm mb-8">Are you joining as a Student or a Teacher?</p>
              
              <button
                onClick={() => setUserType("Student")}
                className="w-full mb-4 bg-teal-50 text-teal-700 border border-teal-200 py-4 rounded-xl text-lg font-medium hover:bg-teal-600 hover:text-white hover:border-teal-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                I am a <span className="font-bold">STUDENT</span>
              </button>
              <button
                onClick={() => setUserType("Teacher")}
                className="w-full bg-teal-700 text-white py-4 rounded-xl text-lg font-medium shadow-md hover:bg-teal-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                I am a <span className="font-bold">TEACHER</span>
              </button>
            </div>
          ) : !isOtpSent ? (
            <div className="max-w-sm mx-auto w-full">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                {isSignUp ? `Create ${userType} Account` : `Welcome Back, ${userType}`}
              </h2>
              {/* Auth Toggle Switch */}
              <div className="flex bg-gray-100 p-1 rounded-full mb-6 relative">
                <div
                  className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                    isSignUp ? "translate-x-full" : "translate-x-0"
                  }`}
                ></div>
                <button
                  className={`flex-1 py-2 text-sm font-medium z-10 transition-colors duration-300 ${
                    !isSignUp ? "text-teal-700" : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setIsSignUp(false)}
                >
                  Login
                </button>
                <button
                  className={`flex-1 py-2 text-sm font-medium z-10 transition-colors duration-300 ${
                    isSignUp ? "text-teal-700" : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setIsSignUp(true)}
                >
                  Sign Up
                </button>
              </div>
              {/* <button className="flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md mt-3 w-full text-sm">
                <span className="text-gray-600">G+</span>{" "}
                {isSignUp ? "Sign up with Google" : "Sign in with Google"}
              </button> */}
              <GoogleSignIn isSignUp={isSignUp} userType={userType} />

              <div className="mt-6 space-y-4">
                {isSignUp && (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
                    required
                  />
                )}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
                  required
                />
                <div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
                    required
                  />
                  {!isSignUp && (
                    <div className="flex justify-end mt-2">
                      <span
                        onClick={handleForgotPassword}
                        className="text-xs font-medium text-teal-600 hover:text-teal-700 hover:underline cursor-pointer transition-colors"
                      >
                        Forgot Password?
                      </span>
                    </div>
                  )}
                </div>

                {isSignUp && (
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter Password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
                    required
                  />
                )}
              </div>
              
              {error && <p className="text-red-500 text-xs font-medium mt-3 px-1">{error}</p>}

              <button
                onClick={handleSubmit}
                className="w-full mt-6 bg-teal-600 text-white py-3.5 rounded-xl text-sm font-semibold shadow-lg hover:shadow-teal-500/30 hover:bg-teal-700 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : isSignUp ? "Sign Up" : "Sign In"}
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-6 font-medium">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <span
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-teal-600 hover:text-teal-700 hover:underline cursor-pointer transition-colors"
                >
                  {isSignUp ? "Log in here" : "Sign up here"}
                </span>
              </p>
            </div>
          ) : (
            <Otp email={formData.email} onSuccess={handleOtpSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
