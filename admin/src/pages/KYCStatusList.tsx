import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../context/AdminAuthContext";

const STATUS_COLORS: Record<string, string> = {
  APPROVED:      "bg-emerald-900/50 text-emerald-300",
  REJECTED:      "bg-red-900/50 text-red-300",
  PENDING:       "bg-yellow-900/50 text-yellow-300",
  UNDER_REVIEW:  "bg-blue-900/50 text-blue-300",
};

export default function KYCStatusList() {
  const [kycs, setKycs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    adminApi().get("/kyc/all")
      .then((res) => setKycs(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? kycs.filter((k) => k.status === filter)
    : kycs;

  const counts = kycs.reduce((acc: Record<string, number>, k) => {
    acc[k.status] = (acc[k.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <div className="p-6 text-center text-gray-400 mt-10">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">KYC Status Overview</h1>
        <p className="text-gray-400 mt-1">Monitor KYC applications across all investors.</p>
      </div>

      {/* Status counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {["APPROVED","PENDING","REJECTED","UNDER_REVIEW"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? "" : s)}
            className={`p-4 rounded-2xl border text-left transition ${
              filter === s ? "ring-2 ring-blue-500 border-blue-500" : "border-gray-700"
            } bg-gray-800 hover:border-gray-500`}
          >
            <p className="text-2xl font-bold text-white">{counts[s] || 0}</p>
            <p className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full inline-block ${STATUS_COLORS[s] || "text-gray-400"}`}>
              {s.replace("_", " ")}
            </p>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-2xl border border-gray-700 text-gray-400">
            No KYC records{filter ? ` with status "${filter}"` : ""}.
          </div>
        ) : (
          filtered.map((kyc) => (
            <div key={kyc.id} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 flex justify-between items-center hover:border-gray-600 transition">
              <div>
                <h3 className="font-semibold text-white">{kyc.fullName || "Not provided"}</h3>
                <p className="text-sm text-gray-400">{kyc.user?.email || "Not provided"}</p>
                <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[kyc.status] || "text-gray-300"}`}>
                  {kyc.status}
                </span>
              </div>
              <button
                onClick={() => navigate(`/kyc/${kyc.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
