import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminKYCStatusDetail() {
  const { kycId } = useParams();
  const [kyc, setKyc] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchKycDetail();
  }, []);

  const fetchKycDetail = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/api/v1/kyc/${kycId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setKyc(res.data.data);
    } catch (e) {
      console.log(e);
    }
  };

  if (!kyc)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="p-4">

      <h2 className="text-2xl font-bold mb-4">KYC Details</h2>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}
        <div className="border p-5 rounded bg-white space-y-3">
          <p><strong>Name:</strong> {kyc.fullName}</p>
          <p><strong>Email:</strong> {kyc.user?.email || "Not connected"}</p>
          <p><strong>Wallet Address:</strong> {kyc.user?.walletAddress || "Not connected"}</p>

          <p><strong>Address:</strong> {kyc.address}</p>
          <p><strong>Date of Birth:</strong> {kyc.dateOfBirth}</p>
          <p><strong>Nationality:</strong> {kyc.nationality}</p>

          <p><strong>Document Type:</strong> {kyc.documentType}</p>
          <p><strong>Document Number:</strong> {kyc.documentNumber}</p>

          <p>
            <strong>Status:</strong>
            <span
              className={`ml-2 px-3 py-1 rounded text-white ${
                kyc.status === "APPROVED"
                  ? "bg-green-600"
                  : kyc.status === "REJECTED"
                  ? "bg-red-600"
                  : "bg-yellow-500"
              }`}
            >
              {kyc.status}
            </span>
          </p>

          {kyc.status === "REJECTED" && (
            <p>
              <strong>Rejection Reason:</strong>{" "}
              {kyc.rejectionReason || "No reason provided"}
            </p>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="border p-5 rounded bg-white space-y-3">
          <h3 className="text-xl font-semibold mb-4">Additional Information</h3>

          <p><strong>City:</strong> {kyc.city}</p>
          <p><strong>State:</strong> {kyc.state}</p>
          <p><strong>Postal Code:</strong> {kyc.postalCode}</p>
          <p><strong>Country:</strong> {kyc.country}</p>

          <p><strong>Submitted At:</strong> {kyc.submittedAt}</p>
          <p><strong>Reviewed At:</strong> {kyc.reviewedAt || "Not reviewed yet"}</p>
          <p><strong>Reviewed By:</strong> {kyc.reviewedBy || "N/A"}</p>

          <h3 className="text-xl font-semibold mt-4">Uploaded Documents:</h3>

          <div className="grid grid-cols-2 gap-4">
            {kyc.documentFront && (
              <div>
                <p className="font-medium mb-1">Document Front</p>
                <img
                  src={`${API_URL}/uploads/kyc/${kyc.documentFront}`}
                  className="w-full border rounded"
                />
              </div>
            )}

            {kyc.documentBack && (
              <div>
                <p className="font-medium mb-1">Document Back</p>
                <img
                  src={`${API_URL}/uploads/kyc/${kyc.documentBack}`}
                  className="w-full border rounded"
                />
              </div>
            )}

            {kyc.selfieImage && (
              <div>
                <p className="font-medium mb-1">Selfie Image</p>
                <img
                  src={`${API_URL}/uploads/kyc/${kyc.selfieImage}`}
                  className="w-full border rounded"
                />
              </div>
            )}

            {kyc.addressProof && (
              <div>
                <p className="font-medium mb-1">Address Proof</p>
                <img
                  src={`${API_URL}/uploads/kyc/${kyc.addressProof}`}
                  className="w-full border rounded"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-5 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
      >
        Back
      </button>
    </div>
  );
}
