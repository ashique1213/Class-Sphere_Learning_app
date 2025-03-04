import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../api/adminapi"; // Import API function
import logo from "../../assets/Nav_logo.svg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const data = await adminLogin(email, password);

      // Check user role
      if (data.user.role !== "admin" && data.user.role !== "staff") {
        throw new Error("Unauthorized access.");
      }

      dispatch(
        loginSuccess({
          user: data.user,
          email: data.user.email,
          role: data.user.role,
          authToken: data.access_token,
          refreshToken: data.refresh_token,
        })
      );

      navigate("/admindashboard"); // Redirect after successful login
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-800">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-20 mb-3" />
          <h2 className="text-2xl font-semibold text-gray-100">Admin Login</h2>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-400 mb-2 text-sm">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2 text-sm">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 active:scale-95 text-white py-3 rounded-lg transition font-medium shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          &copy; 2025 ClassSphere. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
