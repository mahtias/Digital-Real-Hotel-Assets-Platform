import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminKYCList() {
  const [kycList, setKycList] = useState([]);

  useEffect(() => {
    fetchAllKyc();
  }, []);

  const fetchAllKyc = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}/api/v1/kyc/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setKycList(res.data.data);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All KYC Applications</h1>

      <div className="space-y-4">
        {kycList.map((kyc) => (
          <div key={kyc.id} className="border p-4 rounded">
            <p><strong>Name:</strong> {kyc.fullName}</p>
            <p><strong>Status:</strong> {kyc.status}</p>

            <a
              href={`/admin/kyc/review/${kyc.userId}`}
              className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded"
            >
              Review
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
