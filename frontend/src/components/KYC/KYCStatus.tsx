import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const KYCStatus = () => {
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please login first');

      const response = await axios.get(`${API_URL}/api/kyc/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setKycData(response.data.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No KYC application found');
      } else {
        setError(err.response?.data?.error || err.message || 'Failed to fetch KYC status');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-300';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-300';
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return '';
      case 'PENDING': return '';
      case 'UNDER_REVIEW': return '';
      case 'REJECTED': return '';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error.includes('No KYC')) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center bg-blue-50 border rounded-lg">
        <p className="text-gray-700 text-lg mb-4">You haven't submitted a KYC application yet.</p>
        <a href="/kyc/submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Submit KYC Application
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 rounded p-4">
          {error}
        </div>
      </div>
    );
  }

  if (!kycData) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">KYC Application Status</h2>

      <div className={`p-6 rounded-lg border-2 mb-6 ${getStatusColor(kycData.status)}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{getStatusIcon(kycData.status)}</span>
          <h3 className="text-xl font-bold">{kycData.status.replace('_', ' ')}</h3>
        </div>

        <p className="text-sm font-medium">Level: {kycData.level}</p>
        <p className="text-sm">
          Submitted: {new Date(kycData.submittedAt).toLocaleDateString()}
        </p>

        {kycData.rejectionReason && (
          <div className="mt-4 p-4 bg-white rounded border border-red-300">
            <p className="font-medium text-red-800 mb-2">Rejection Reason:</p>
            <p className="text-sm text-red-700">{kycData.rejectionReason}</p>
          </div>
        )}

        {kycData.status === 'PENDING' && (
          <p className="mt-4 text-sm"> Your application is being reviewed.</p>
        )}

        {kycData.status === 
// @ts-ignore
        'APPROVED'  (
          <p className="mt-4 text-sm"> Your account is fully verified.</p>
        )}
      </div>

      {/* Personal info */}
      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <h3 className="font-bold mb-4 text-lg">Personal Information</h3>

        <div className="space-y-3 text-sm">
          <p><strong>Full Name:</strong> {kycData.fullName}</p>
          <p><strong>Date of Birth:</strong> {new Date(kycData.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Nationality:</strong> {kycData.nationality}</p>
          <p><strong>ID Number:</strong> {kycData.documentNumber}</p>
        </div>
      </div>

      {/* Resubmit option */}
      {kycData.status === 'REJECTED' && (
        <div className="mt-6 text-center p-6 bg-orange-50 border rounded-lg">
          <p className="mb-4">Please update your information and resubmit.</p>
          <a href="/kyc/submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Resubmit KYC
          </a>
        </div>
      )}
    </div>
  );
};

export default KYCStatus;
