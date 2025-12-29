import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function KYCReviewDetails() {
  const { kycId } = useParams();
  const navigate = useNavigate();

  const [kyc, setKyc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // Load KYC Details
  useEffect(() => {
    if (!kycId) {
      setError("No KYC ID provided in URL");
      setLoading(false);
      return;
    }
    fetchKYC();
  }, [kycId]);

  const fetchKYC = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.get(
        `${API_URL}/api/v1/kyc/admin/details/${kycId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setKyc(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load KYC details");
    } finally {
      setLoading(false);
    }
  };

  // Approve KYC
  const handleApprove = async () => {
    if (!window.confirm("Approve this KYC?")) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      await axios.post(
        `${API_URL}/api/v1/kyc/admin/approve/${kycId}`,
        { level: kyc.level, notes: "Approved after review" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("KYC Approved!");
      navigate("/admin/kyc");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  // Reject KYC
  const handleReject = async () => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      await axios.post(
        `${API_URL}/api/v1/kyc/admin/reject/${kycId}`,
        { rejectionReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("KYC Rejected");
      navigate("/admin/kyc");
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to reject");
    } finally {
      setActionLoading(false);
    }
  };

  // UI States
  if (loading) return <p className="p-6">Loading KYC details...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!kyc) return <p className="p-6 text-gray-500">KYC not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">KYC Review Details</h2>

      <div className="border p-4 rounded bg-white shadow">
        <h3 className="text-xl font-semibold mb-2">{kyc.fullName}</h3>
        <p className="text-gray-600">{kyc.user?.email}</p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p><strong>Date of Birth:</strong> {kyc.dateOfBirth}</p>
            <p><strong>Nationality:</strong> {kyc.nationality}</p>
            <p><strong>Document Type:</strong> {kyc.documentType}</p>
            <p><strong>Document Number:</strong> {kyc.documentNumber}</p>
            <p><strong>Address:</strong> {kyc.address}</p>
          </div>

          <div>
            <p><strong>Status:</strong> {kyc.status}</p>
            <p><strong>Level:</strong> {kyc.level}</p>
            <p>
              <strong>Submitted:</strong>{" "}
              {new Date(kyc.submittedAt).toLocaleString()}
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-2">Documents</h3>

        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "documentFront", label: "Document Front" },
            { key: "documentBack", label: "Document Back" },
            { key: "selfieImage", label: "Selfie Image" },
            { key: "addressProof", label: "Address Proof" }
          ].map(({ key, label }) => (
            kyc[key] ? (
              <div key={key}>
                <p className="font-medium">{label}</p>
                <img
                  src={`${API_URL}/${kyc[key]}`}
                  alt={label}
                  className="w-full border rounded shadow"
                />
              </div>
            ) : (
              <p key={key} className="text-gray-400 italic">
                {label} not provided
              </p>
            )
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Approve
          </button>

          <button
            onClick={handleReject}
            disabled={actionLoading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reject
          </button>

          <button
            onClick={() => navigate("/admin/kyc")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
