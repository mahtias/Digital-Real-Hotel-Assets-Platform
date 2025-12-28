import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AdminKYCReview = () => {
  const [pendingKYCs, setPendingKYCs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchPendingKYCs();
  }, []);

  const fetchPendingKYCs = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/api/v1/kyc/admin/pending`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setPendingKYCs(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch pending KYCs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (kycId, level) => {
    if (!window.confirm('Are you sure you want to approve this KYC?')) return;

    setActionLoading(kycId);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${API_URL}/api/v1/kyc/admin/approve/${kycId}`,
        { level, notes: 'Approved after review' },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      alert(' KYC approved successfully!');
      fetchPendingKYCs(); 
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve KYC');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (kycId) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;

    setActionLoading(kycId);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${API_URL}/api/v1/kyc/admin/reject/${kycId}`,
        { reason },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      alert(' KYC rejected');
      fetchPendingKYCs(); 
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject KYC');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 rounded p-4">
           {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Pending KYC Applications</h2>
        <p className="text-gray-600 mt-1">Review and approve or reject KYC submissions</p>
      </div>
      
      {pendingKYCs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-6xl mb-4"></div>
          <p className="text-gray-500 text-lg">No pending KYC applications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingKYCs.map((kyc) => (
            <div key={kyc.id} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{kyc.fullName}</h3>
                  <p className="text-sm text-gray-600">{kyc.email || 'No email'}</p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>Level: <span className="font-medium">{kyc.level}</span></span>
                    <span>Submitted: <span className="font-medium">
                      {new Date(kyc.submittedAt).toLocaleDateString()}
                    </span></span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {kyc.status}
                </span>
              </div>

              <div className="flex gap-3 flex-wrap">
                          <button
              onClick={() => navigate(`/admin/kyc/review/${kyc.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Review KYC Details
            </button>
                
                {/* <button
                  onClick={() => handleApprove(kyc.id, kyc.level)}
                  disabled={actionLoading === kyc.id}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading === kyc.id ? ' Processing...' : ' Approve'}
                </button>
                <button
                  onClick={() => handleReject(kyc.id)}
                  disabled={actionLoading === kyc.id}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                   Reject
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminKYCReview;
