import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../context/AdminAuthContext";

export default function KYCManagement() {
  const [pendingKYCs, setPendingKYCs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPendingKYCs = async () => {
    try {
      const res = await adminApi().get("/kyc/admin/pending");
      setPendingKYCs(res.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch pending KYCs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPendingKYCs(); }, []);

  const handleApprove = async (kycId: string) => {
    if (!window.confirm("Approve this KYC?")) return;
    setActionLoading(kycId);
    try {
      await adminApi().post(`/kyc/admin/approve/${kycId}`, {});
      alert("KYC Approved!");
      fetchPendingKYCs();
    } catch (err: any) {
      alert(err.response?.data?.error || "Approval failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (kycId: string) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason || reason.trim().length < 2) { alert("Rejection reason required"); return; }
    setActionLoading(kycId);
    try {
      await adminApi().post(`/kyc/admin/reject/${kycId}`, { rejectionReason: reason });
      alert("KYC Rejected");
      fetchPendingKYCs();
    } catch (err: any) {
      alert(err.response?.data?.error || "Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading pending KYCs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">KYC Management</h1>
        <p className="text-gray-400 mt-1">Review and take action on pending investor KYC applications.</p>
      </div>

      {pendingKYCs.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700">
          <p className="text-4xl mb-4">✅</p>
          <p className="text-gray-300 text-lg font-semibold">No pending KYCs</p>
          <p className="text-gray-500 text-sm mt-1">All applications have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingKYCs.map((kyc) => (
            <div key={kyc.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-white">{kyc.fullName}</h3>
                  <p className="text-sm text-gray-400">{kyc.email}</p>
                  <div className="mt-2 text-sm text-gray-500 flex gap-4">
                    <span>Level: <span className="text-gray-300 font-medium">{kyc.level}</span></span>
                    <span>Submitted: <span className="text-gray-300 font-medium">{new Date(kyc.submittedAt).toLocaleDateString()}</span></span>
                  </div>
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-yellow-900/50 text-yellow-300 font-medium">
                  {kyc.status}
                </span>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => navigate(`/kyc/${kyc.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Review Details
                </button>
                <button
                  onClick={() => handleApprove(kyc.id)}
                  disabled={actionLoading === kyc.id}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 text-sm font-medium"
                >
                  {actionLoading === kyc.id ? "Processing..." : "Approve"}
                </button>
                <button
                  onClick={() => handleReject(kyc.id)}
                  disabled={actionLoading === kyc.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium"
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
}
