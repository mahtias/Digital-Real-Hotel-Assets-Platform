// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Automatically switches between LOCAL and PRODUCTION
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function verify() {
      try {
        await axios.get(`${API_URL}/api/v1/auth/verify-email?token=${token}`);
        setSuccess(true);
        setStatus("Your email has been successfully verified!");
      } catch (err) {
        setError(true);
        setStatus("Invalid or expired verification link.");
      }
    }
    verify();
  }, [token]);

  return (
    <div className="max-w-md mx-auto p-6 text-center mt-20">
      {/* Status Message */}
      <h1 className="text-3xl font-bold mb-4">{status}</h1>

      {/* Success Button */}
      {success && (
        <button
          onClick={() => {
            // Tell homepage to open AuthModal on login tab
            localStorage.setItem("openAuthModal", "login");

            // Navigate back home where modal will open automatically
            navigate("/");
          }}
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg transition"
        >
          Go to Login
        </button>
      )}

      {/* Error => Back to Register */}
      {error && (
        <button
          onClick={() => {
            localStorage.setItem("openAuthModal", "register");
            navigate("/");
          }}
          className="mt-6 bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-lg transition"
        >
          Register Again
        </button>
      )}
    </div>
  );
}
