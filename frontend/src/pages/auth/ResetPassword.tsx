// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '@/api/auth';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Extract token from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('token');
    if (!t) {
      setError('Invalid or missing reset token.');
    } else {
      setToken(t);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword(token, password);

      if (res.success) {
        setMessage('Password successfully reset! Redirecting...');

        setTimeout(() => {
          navigate('/login');
        }, 1200);
      } else {
        setError(res.message || 'Invalid or expired token.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Reset Password</h1>
      <p className="text-gray-600 mb-6">
        Enter a new password for your account.
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
            New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
        >
          {loading ? 'Updating...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
