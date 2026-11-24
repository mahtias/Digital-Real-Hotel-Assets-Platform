import { useEffect, useState } from "react";
import { adminApi } from "../context/AdminAuthContext";
import { Empty, Loading, PageHeader, Pagination, StatWidget, shortAddr } from "../components/ui";
import { IconSearch } from "../components/Icons";

const STATUS_BADGE: Record<string, string> = {
  CONFIRMED: "badge-success",
  PENDING:   "badge-warning",
  FAILED:    "badge-danger",
  CANCELLED: "badge-secondary",
};

const CHAIN_BADGE: Record<string, string> = {
  CONFIRMED: "badge-success",
  PENDING:   "badge-info",
  FAILED:    "badge-danger",
};

const money = (v: number) =>
  `$${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Investments() {
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]               = useState(1);
  const [pagination, setPagination]   = useState({
    total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false,
  });
  const [stats, setStats] = useState({ totalInvestments: 0, totalInvested: 0 });

  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const res = await adminApi().get("/admin/investments", {
        params: { page, search, status: statusFilter, limit: 20 },
      });
      setInvestments(res.data.data);
      setPagination(res.data.pagination);
      setStats(res.data.stats);
    } catch (err) {
      console.error("Failed to fetch investments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvestments(); }, [page, search, statusFilter]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  return (
    <>
      <PageHeader title="Investments" subtitle="Track all investments across hotel asset projects." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatWidget tone="success" value={money(stats.totalInvested)} title="Total invested · across all hotel projects" />
        <StatWidget tone="primary" value={stats.totalInvestments}     title="Total investments · all-time records" />
        <StatWidget tone="info"    value={pagination.total}           title="Showing · matching current filter" />
      </div>

      <div className="card">
        <div className="card-header">Investment records</div>

        <div className="card-body border-b border-line grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="input-group">
            <span className="input-group-text"><IconSearch size={16} /></span>
            <input
              type="text"
              placeholder="Search investor email or hotel name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-select">
            <option value="">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <Loading label="Loading investments…" />
        ) : investments.length === 0 ? (
          <Empty>No investments found.</Empty>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-hover">
                <thead>
                  <tr>
                    {["Investor", "Hotel", "Amount (USDC)", "Tokens", "Status", "Blockchain", "Wallet", "Date"].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {investments.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <div className="font-medium">{inv.user?.firstName || ""} {inv.user?.lastName || ""}</div>
                        <div className="text-xs text-medium-emphasis">{inv.user?.email}</div>
                      </td>
                      <td>
                        <div className="font-medium">{inv.hotelAsset?.name}</div>
                        <div className="text-xs text-medium-emphasis">{inv.hotelAsset?.tokenSymbol}</div>
                      </td>
                      <td className="font-semibold text-success">{money(inv.investedAmount)}</td>
                      <td className="font-semibold text-primary">{Number(inv.tokenAmount || 0).toLocaleString()}</td>
                      <td><span className={`badge ${STATUS_BADGE[inv.status] || "badge-light"}`}>{inv.status}</span></td>
                      <td><span className={`badge ${CHAIN_BADGE[inv.blockchainStatus || ""] || "badge-light"}`}>{inv.blockchainStatus || "—"}</span></td>
                      <td className="font-mono text-xs text-medium-emphasis">{shortAddr(inv.walletAddress)}</td>
                      <td className="text-xs text-medium-emphasis whitespace-nowrap">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-footer">
              <Pagination
                page={page}
                totalPages={pagination.totalPages}
                onChange={setPage}
                summary={`Page ${page} of ${Math.max(pagination.totalPages, 1)} — ${pagination.total} records`}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
