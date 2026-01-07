// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { login } from "../api/authApi.js";
import { showSuccessToast, showErrorToast } from "../components/Toast.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      showSuccessToast("Welcome back 👋");
      navigate("/");
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-xl border border-white shadow-2xl p-8 space-y-6">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center">
          <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            Welcome Back
          </span>
        </h2>

        <p className="text-center text-sm text-gray-500">
          Continue your learning journey 🚀
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold shadow hover:scale-[1.02] transition-all active:scale-95"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?
          <NavLink to="/signup" className="ml-2 font-semibold text-blue-600 hover:underline">
            Sign up
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
