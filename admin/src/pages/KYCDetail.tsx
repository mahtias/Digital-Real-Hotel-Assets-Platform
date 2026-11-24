import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../context/AdminAuthContext";
import { Loading, PageHeader } from "../components/ui";
import { IconArrowLeft, IconCamera } from "../components/Icons";

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

  const back = (
    <button onClick={() => navigate("/kyc")} className="btn btn-outline-secondary">
      <IconArrowLeft size={16} /> Back to KYC Management
    </button>
  );

  if (loading) return <div className="card"><Loading label="Loading KYC details…" /></div>;
  if (error)   return <><PageHeader title="KYC Review Details" actions={back} /><div className="alert alert-danger">{error}</div></>;
  if (!kyc)    return <><PageHeader title="KYC Review Details" actions={back} /><div className="alert alert-warning">KYC not found.</div></>;

  const docs = [
    { key: "documentFront", label: "Document Front" },
    { key: "documentBack",  label: "Document Back" },
    { key: "selfieImage",   label: "Selfie" },
    { key: "addressProof",  label: "Address Proof" },
  ];

  const statusBadge =
    kyc.status === "APPROVED" ? "badge-success" :
    kyc.status === "REJECTED" ? "badge-danger"  : "badge-warning";

  return (
    <>
      <PageHeader title="KYC Review Details" actions={back} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Applicant */}
        <div className="card xl:col-span-1 self-start">
          <div className="card-header">
            <span>Applicant</span>
            <span className={`badge ${statusBadge}`}>{kyc.status}</span>
          </div>
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold">
                {(kyc.fullName || "?").split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
              </span>
              <div className="min-w-0">
                <div className="text-lg font-medium truncate">{kyc.fullName}</div>
                <div className="text-sm text-medium-emphasis truncate">{kyc.user?.email}</div>
              </div>
            </div>

            <dl className="divide-y divide-line text-sm">
              {[
                ["Date of Birth",    kyc.dateOfBirth],
                ["Nationality",      kyc.nationality],
                ["Document Type",    kyc.documentType],
                ["Document Number",  kyc.documentNumber],
                ["Address",          kyc.address],
                ["Level",            kyc.level],
                ["Submitted",        new Date(kyc.submittedAt).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2">
                  <dt className="text-medium-emphasis">{label}</dt>
                  <dd className="font-medium text-right break-words">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="card-footer flex gap-2">
            <button onClick={handleApprove} disabled={actionLoading} className="btn btn-success flex-1">
              {actionLoading ? "Processing…" : "Approve"}
            </button>
            <button onClick={handleReject} disabled={actionLoading} className="btn btn-danger flex-1">
              Reject
            </button>
          </div>
        </div>

        {/* Documents */}
        <div className="card xl:col-span-2">
          <div className="card-header">Documents</div>
          <div className="card-body grid grid-cols-1 sm:grid-cols-2 gap-4">
            {docs.map(({ key, label }) =>
              kyc[key] ? (
                <figure key={key} className="border border-line rounded-md overflow-hidden">
                  <figcaption className="px-3 py-2 text-sm font-medium bg-light border-b border-line">{label}</figcaption>
                  <img src={`/api/v1/${kyc[key]}`} alt={label} className="w-full" />
                </figure>
              ) : (
                <div key={key} className="border border-dashed border-line-input rounded-md p-6 flex flex-col items-center justify-center text-medium-emphasis min-h-[10rem]">
                  <IconCamera size={28} className="mb-2 opacity-60" />
                  <span className="text-sm italic">{label} not provided</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
