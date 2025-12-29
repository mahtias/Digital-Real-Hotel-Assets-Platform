import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AdminKYCReview = () => {
  const [pendingKYCs, setPendingKYCs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingKYCs();
  }, []);

  // --------------------------------------------------------------------
  // FETCH PENDING KYC
  // --------------------------------------------------------------------
  const fetchPendingKYCs = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/v1/kyc/admin/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPendingKYCs(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch pending KYCs");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------
  // APPROVE KYC
  // --------------------------------------------------------------------
  const handleApprove = async (kycId: string, level: string) => {
    if (!window.confirm("Approve this KYC?")) return;

    setActionLoading(kycId);

    try {
      const token = localStorage.getItem("authToken");

      await axios.post(
        `${API_URL}/api/v1/kyc/admin/approve/${kycId}`,
        { level, notes: "Approved after review" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("KYC Approved!");
      fetchPendingKYCs();
    } catch (err: any) {
      alert(err.response?.data?.error || "Approval failed");
    } finally {
      setActionLoading(null);
    }
  };

  // --------------------------------------------------------------------
  // REJECT KYC
  // --------------------------------------------------------------------
  const handleReject = async (kycId: string) => {
    const reason = window.prompt("Enter rejection reason:");

    if (!reason || reason.trim().length < 2) {
      alert("Rejection reason required");
      return;
    }

    setActionLoading(kycId);

    try {
      const token = localStorage.getItem("authToken");

      await axios.post(
        `${API_URL}/api/v1/kyc/admin/reject/${kycId}`,
        { rejectionReason: reason },  
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("KYC Rejected");
      fetchPendingKYCs();
    } catch (err: any) {
      alert(err.response?.data?.error || "Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

  // --------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------
  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading pending KYCs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Pending KYC Applications</h2>
      <p className="text-gray-600 mb-6">Review and take action on user KYC submissions.</p>

      {pendingKYCs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No pending KYCs</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingKYCs.map((kyc) => (
            <div
              key={kyc.id}
              className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{kyc.fullName}</h3>
                  <p className="text-sm text-gray-600">{kyc.email}</p>

                  <div className="mt-2 text-sm text-gray-500 space-x-4">
                    <span>Level: <b>{kyc.level}</b></span>
                    <span>Submitted: <b>{new Date(kyc.submittedAt).toLocaleDateString()}</b></span>
                  </div>
                </div>

                <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-700 font-medium">
                  {kyc.status}
                </span>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => navigate(`/admin/kyc/review/${kyc.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Review Details
                </button>

                <button
                  onClick={() => handleApprove(kyc.id, kyc.level)}
                  disabled={actionLoading === kyc.id}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-300"
                >
                  {actionLoading === kyc.id ? "Processing..." : "Approve"}
                </button>

                <button
                  onClick={() => handleReject(kyc.id)}
                  disabled={actionLoading === kyc.id}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-300"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminKYCReview;
