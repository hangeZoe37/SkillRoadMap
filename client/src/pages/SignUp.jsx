// src/pages/SignUp.js
import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { signup } from "../api/authApi.js";
import { showErrorToast, showSuccessToast } from "../components/Toast.jsx";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      showSuccessToast("Account created! Please login 👇");
      navigate("/login");
    } catch (err) {
      showErrorToast(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/70 backdrop-blur-xl border border-white shadow-2xl p-8 space-y-6">
        {/* Title */}
        <h2 className="text-3xl font-extrabold text-center">
          <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            Create Account
          </span>
        </h2>

        <p className="text-center text-sm text-gray-500">
          Start building your roadmap today ✨
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?
          <NavLink to="/login" className="ml-2 font-semibold text-blue-600 hover:underline">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
