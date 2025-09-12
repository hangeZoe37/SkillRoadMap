// src/pages/SignUp.js
import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { signup } from "../api/authApi.js";
import {showErrorToast,showSuccessToast} from "../components/Toast.jsx";
const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      showSuccessToast("User registered successfully!Please Log in")
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      showErrorToast(err.response?.data?.message || "Signup failed")
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <div className="p-10 border-4 rounded-2xl bg-white/40 border-white shadow-2xl w-full max-w-sm flex flex-col space-y-6">
        {/* Title */}
        <h2 className="text-3xl p-1 font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          SignUp
        </h2>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <input
            type="text"
            placeholder="Name"
            className="border p-3 bg-pink-50 rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-3 bg-pink-50 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 bg-pink-50 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-pink-400 text-white py-2.5 rounded-md cursor-pointer transition-transform active:scale-95"
          >
            SignUp
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <NavLink to="/login">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 px-3 py-1 text-white ml-2 rounded-md transition-transform active:scale-95">
              Login
            </span>
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
