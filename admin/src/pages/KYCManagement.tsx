import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../context/AdminAuthContext";
import { Empty, Loading, PageHeader } from "../components/ui";
import { IconCheck } from "../components/Icons";

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

  return (
    <>
      <PageHeader title="KYC Management" subtitle="Review and take action on pending investor KYC applications." />

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <div className="card">
        <div className="card-header">
          <span>Pending applications</span>
          {!loading && <span className="badge badge-warning">{pendingKYCs.length}</span>}
        </div>

        {loading ? (
          <Loading label="Loading pending KYCs…" />
        ) : pendingKYCs.length === 0 ? (
          <Empty>
            <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-success-subtle text-success flex items-center justify-center">
              <IconCheck size={24} />
            </div>
            <div className="font-medium text-body">No pending KYCs</div>
            <div>All applications have been reviewed.</div>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Level</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingKYCs.map((kyc) => (
                  <tr key={kyc.id}>
                    <td>
                      <div className="font-medium">{kyc.fullName}</div>
                      <div className="text-xs text-medium-emphasis">{kyc.email}</div>
                    </td>
                    <td>{kyc.level}</td>
                    <td className="whitespace-nowrap">{new Date(kyc.submittedAt).toLocaleDateString()}</td>
                    <td><span className="badge badge-warning">{kyc.status}</span></td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <button onClick={() => navigate(`/kyc/${kyc.id}`)} className="btn btn-sm btn-outline-primary">
                          Review
                        </button>
                        <button onClick={() => handleApprove(kyc.id)} disabled={actionLoading === kyc.id} className="btn btn-sm btn-success">
                          {actionLoading === kyc.id ? "Processing…" : "Approve"}
                        </button>
                        <button onClick={() => handleReject(kyc.id)} disabled={actionLoading === kyc.id} className="btn btn-sm btn-danger">
                          Reject
                        </button>
                      </div>
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
