// @ts-nocheck
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function VerifyEmailSent() {
  const navigate = useNavigate();
  const location = useLocation();

  // email passed from Register.tsx
  const email = location.state?.email || '';

  return (
    <div className="max-w-md mx-auto p-6 text-center mt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Verify Your Email
      </h1>

      <p className="text-gray-700 mb-4">
        We sent a verification link to:
      </p>

      <p className="text-orange-600 font-semibold text-lg mb-6">
        {email || 'your email'}
      </p>

      <p className="text-gray-600 mb-8">
        Please check your inbox and click the link to activate your account.
      </p>

      <button
        onClick={() => navigate('/login')}
        className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
      >
        Back to Login
      </button>

      <p className="text-sm text-gray-500 mt-4">
        Didn’t receive the email?
        <br />
        Check your spam folder or try again later.
      </p>
    </div>
  );
}
