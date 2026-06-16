// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '@/api/auth';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await forgotPassword(email);

      setMessage(
        res?.message ||
          'If that email exists in our system, a reset link has been sent.'
      );
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Forgot Password
      </h1>
      <p className="text-gray-600 mb-6">
        Enter your email and we will send you a password reset link.
      </p>

      {message && (
        <div className="mb-4 bg-green-50 text-green-700 border border-green-200 p-3 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 border border-red-200 p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="text-center text-sm mt-6">
        <button
          onClick={() => navigate(-1)}
          variant="ghost" 
          className="text-orange-500 hover:text-orange-600"
        >
          Back to DRA
        </button>
      </p>
    </div>
  );
}
