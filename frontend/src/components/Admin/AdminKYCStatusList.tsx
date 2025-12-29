import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminKYCStatusList() {
  const [kycs, setKycs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAllKyc();
  }, []);

  const loadAllKyc = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_URL}/api/v1/kyc/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKycs(res.data.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All KYC Status</h2>

      <div className="space-y-4">
        {kycs.map((kyc) => (
          <div key={kyc.id} className="border p-4 rounded shadow-sm bg-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{kyc.fullName || "Not informed"}</h3>
                <p className="text-sm text-gray-500">{kyc.user?.email || "Not informed"}</p>

                <p className="text-sm mt-1 flex items-center">
                  Status:
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
              </div>

              <button
                onClick={() => navigate(`/admin/kyc/status/${kyc.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
