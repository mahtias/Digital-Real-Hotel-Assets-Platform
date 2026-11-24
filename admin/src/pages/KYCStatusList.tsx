import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../context/AdminAuthContext";
import { Empty, Loading, PageHeader } from "../components/ui";

const STATUS_BADGE: Record<string, string> = {
  APPROVED:     "badge-success",
  REJECTED:     "badge-danger",
  PENDING:      "badge-warning",
  UNDER_REVIEW: "badge-info",
};

const STATUS_BORDER: Record<string, string> = {
  APPROVED:     "border-success",
  REJECTED:     "border-danger",
  PENDING:      "border-warning",
  UNDER_REVIEW: "border-info",
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

  return (
    <>
      <PageHeader title="KYC Status Overview" subtitle="Monitor KYC applications across all investors." />

      {/* Status counters (click to filter) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {["APPROVED", "PENDING", "REJECTED", "UNDER_REVIEW"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? "" : s)}
            className={`card text-left px-4 py-3 border-l-4 ${STATUS_BORDER[s]} transition-shadow hover:shadow-md ${
              filter === s ? "ring-4 ring-primary/25" : ""
            }`}
          >
            <div className="text-xs uppercase tracking-wide text-medium-emphasis">{s.replace("_", " ")}</div>
            <div className="text-2xl font-semibold">{loading ? "—" : counts[s] || 0}</div>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span>KYC records</span>
          {filter && (
            <button onClick={() => setFilter("")} className="btn btn-sm btn-outline-secondary">
              Clear filter: {filter.replace("_", " ")}
            </button>
          )}
        </div>

        {loading ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <Empty>No KYC records{filter ? ` with status "${filter}"` : ""}.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((kyc) => (
                  <tr key={kyc.id}>
                    <td className="font-medium">{kyc.fullName || "Not provided"}</td>
                    <td className="text-medium-emphasis">{kyc.user?.email || "Not provided"}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[kyc.status] || "badge-secondary"}`}>
                        {kyc.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="text-right">
                      <button onClick={() => navigate(`/kyc/${kyc.id}`)} className="btn btn-sm btn-primary">
                        View details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
