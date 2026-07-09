import { useEffect, useState } from "react";
import { adminApi } from "../context/AdminAuthContext";

const STATUS_BADGE: Record<string, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  PENDING:   "bg-yellow-100 text-yellow-700",
  FAILED:    "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

const CHAIN_BADGE: Record<string, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  PENDING:   "bg-blue-100 text-blue-700",
  FAILED:    "bg-red-100 text-red-700",
};

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Investments</h1>
        <p className="text-gray-500 mt-1">Track all investments across hotel asset projects.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6 rounded-2xl shadow-md">
          <p className="text-sm font-semibold opacity-90 mb-1">Total Invested</p>
          <p className="text-3xl font-bold">${stats.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs opacity-70 mt-1">Across all hotel projects</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-6 rounded-2xl shadow-md">
          <p className="text-sm font-semibold opacity-90 mb-1">Total Investments</p>
          <p className="text-3xl font-bold">{stats.totalInvestments}</p>
          <p className="text-xs opacity-70 mt-1">All-time records</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-purple-700 text-white p-6 rounded-2xl shadow-md">
          <p className="text-sm font-semibold opacity-90 mb-1">Showing (filtered)</p>
          <p className="text-3xl font-bold">{pagination.total}</p>
          <p className="text-xs opacity-70 mt-1">Matching current filter</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search investor email or hotel name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Investment Records</h2>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading investments...</div>
        ) : investments.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No investments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {["Investor","Hotel","Amount (USDC)","Tokens","Status","Blockchain","Wallet","Date"].map(h => (
                    <th key={h} className="p-4 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {investments.map((inv) => (
                  <tr key={inv.id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {inv.user?.firstName || ""} {inv.user?.lastName || ""}
                      </div>
                      <div className="text-xs text-gray-400">{inv.user?.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{inv.hotelAsset?.name}</div>
                      <div className="text-xs text-gray-400">{inv.hotelAsset?.tokenSymbol}</div>
                    </td>
                    <td className="p-4 text-emerald-700 font-bold">
                      ${Number(inv.investedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-indigo-700 font-semibold">
                      {Number(inv.tokenAmount || 0).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[inv.status] || "bg-gray-100 text-gray-500"}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${CHAIN_BADGE[inv.blockchainStatus || ""] || "bg-gray-100 text-gray-500"}`}>
                        {inv.blockchainStatus || "—"}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-gray-400">
                      {inv.walletAddress
                        ? `${inv.walletAddress.slice(0,6)}...${inv.walletAddress.slice(-4)}`
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="p-4 text-gray-500 text-xs">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <p className="text-sm text-gray-400">
                Page {page} of {pagination.totalPages} — {pagination.total} records
              </p>
              <div className="flex gap-2">
                <button disabled={!pagination.hasPrevPage} onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm disabled:opacity-40">
                  Previous
                </button>
                <button disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm disabled:opacity-40">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
