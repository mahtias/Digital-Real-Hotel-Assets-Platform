import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../context/AdminAuthContext";

export default function KYCDetail() {
  const { kycId } = useParams<{ kycId: string }>();
  const navigate = useNavigate();

  const [kyc, setKyc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!kycId) { setError("No KYC ID in URL"); setLoading(false); return; }
    adminApi().get(`/kyc/admin/details/${kycId}`)
      .then((res) => setKyc(res.data.data))
      .catch((err: any) => setError(err.response?.data?.error || "Failed to load KYC details"))
      .finally(() => setLoading(false));
  }, [kycId]);

  const handleApprove = async () => {
    if (!window.confirm("Approve this KYC?")) return;
    setActionLoading(true);
    try {
      await adminApi().post(`/kyc/admin/approve/${kycId}`, {
        level: kyc.level, notes: "Approved after review",
      });
      alert("KYC Approved!");
      navigate("/kyc");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;
    setActionLoading(true);
    try {
      await adminApi().post(`/kyc/admin/reject/${kycId}`, { rejectionReason: reason });
      alert("KYC Rejected");
      navigate("/kyc");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to reject");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading KYC details...</div>;
  if (error)   return <div className="p-6 text-red-400">{error}</div>;
  if (!kyc)    return <div className="p-6 text-gray-400">KYC not found.</div>;

  const docs = [
    { key: "documentFront", label: "Document Front" },
    { key: "documentBack",  label: "Document Back" },
    { key: "selfieImage",   label: "Selfie" },
    { key: "addressProof",  label: "Address Proof" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/kyc")}
        className="mb-6 text-sm text-gray-400 hover:text-white transition"
      >
        ← Back to KYC Management
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">KYC Review Details</h1>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">{kyc.fullName}</h2>
            <p className="text-gray-400">{kyc.user?.email}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            kyc.status === "APPROVED" ? "bg-emerald-900/50 text-emerald-300" :
            kyc.status === "REJECTED" ? "bg-red-900/50 text-red-300" :
            "bg-yellow-900/50 text-yellow-300"
          }`}>
            {kyc.status}
          </span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            ["Date of Birth",    kyc.dateOfBirth],
            ["Nationality",      kyc.nationality],
            ["Document Type",    kyc.documentType],
            ["Document Number",  kyc.documentNumber],
            ["Address",          kyc.address],
            ["Level",            kyc.level],
            ["Submitted",        new Date(kyc.submittedAt).toLocaleString()],
          ].map(([label, value]) => (
            <div key={label} className="bg-gray-700 rounded-xl p-3">
              <p className="text-gray-400 text-xs mb-1">{label}</p>
              <p className="text-white font-medium">{value || "—"}</p>
            </div>
          ))}
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Documents</h3>
          <div className="grid grid-cols-2 gap-4">
            {docs.map(({ key, label }) =>
              kyc[key] ? (
                <div key={key}>
                  <p className="text-sm font-medium text-gray-300 mb-2">{label}</p>
                  <img
                    src={`/api/v1/${kyc[key]}`}
                    alt={label}
                    className="w-full border border-gray-600 rounded-xl"
                  />
                </div>
              ) : (
                <div key={key} className="bg-gray-700 rounded-xl p-4 flex items-center justify-center">
                  <p className="text-gray-500 text-sm italic">{label} not provided</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 font-medium"
          >
            {actionLoading ? "Processing..." : "Approve"}
          </button>
          <button
            onClick={handleReject}
            disabled={actionLoading}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
