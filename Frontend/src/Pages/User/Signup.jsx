import React from "react";
import Login_image from "../../assets/Images/Login_image.png"

const Signup = () => {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden w-full  max-w-3xl min-h-[550px]">
          {/* Left Side - Image */}
          <div className="relative w-full md:w-1/2">
            <img
              src={Login_image}
              alt="Classroom"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-opacity-30 flex flex-col justify-end p-4">
              <h2 className="text-gray-900 text-lg font-semibold">Join Us</h2>
              <p className="text-gray-500 font-bold text-xs">
                Start your learning journey today
              </p>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-gray-700 text-center">
              Create an Account
            </h2>

            {/* Signup/Register Toggle */}
            <div className="flex justify-center gap-3 mt-3">
              <button className="px-4 py-1.5 bg-gray-200 text-gray-600 rounded-md text-sm">
                Login
              </button>
              <button className="px-4 py-1.5 bg-teal-400 text-white rounded-md text-sm">
                Sign Up
              </button>
            </div>

            {/* Google Sign-in */}
            <button className="flex items-center justify-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md mt-3 w-full text-sm">
              <span className="text-gray-600">G+</span> Sign up with Google
            </button>

            {/* Form Fields */}
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Username"
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400"
              />
              <input
                type="password"
                placeholder="Re-enter Password"
                className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {/* Forgot Password & Remember Me */}
            <div className="flex justify-between items-center mt-3 text-xs">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-teal-500 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Signup Button */}
            <button className="w-full mt-4 bg-teal-400 text-white py-2 rounded-md text-sm hover:bg-teal-500">
              Sign Up
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              Already have an account?{" "}
              <a href="#" className="text-teal-500 hover:underline">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
