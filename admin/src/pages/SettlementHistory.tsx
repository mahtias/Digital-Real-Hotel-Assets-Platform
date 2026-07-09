import { useEffect, useState } from "react";
import { adminApi } from "../context/AdminAuthContext";

interface Settlement {
  id: string;
  hotelName: string;
  hotelLocation: string;
  bookingCode: string;
  amount: number;
  currency: string;
  hotelWallet: string;
  status: string;
  txHash: string;
  createdAt: string;
}

export default function SettlementHistory() {
  const [data, setData] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [hotelId, setHotelId] = useState("");
  const [pagination, setPagination] = useState({
    total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false,
  });

  const fetchSettlements = async () => {
    try {
      const res = await adminApi().get("/settlements/history", {
        params: { page, limit: 20, search, status, hotelId },
      });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Settlement fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettlements(); }, [page, search, status, hotelId]);
  useEffect(() => { setPage(1); }, [search, status, hotelId]);

  const totalPaid = data.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settlement History</h1>
        <p className="text-gray-400 mt-1">Audit all blockchain payouts sent from DRA treasury to hotel wallets.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-6 rounded-2xl shadow-lg">
          <p className="text-sm font-semibold mb-1 opacity-90">Total Settlements</p>
          <p className="text-4xl font-bold">{pagination.total}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6 rounded-2xl shadow-lg">
          <p className="text-sm font-semibold mb-1 opacity-90">Total Paid</p>
          <p className="text-4xl font-bold">${totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 text-white p-6 rounded-2xl shadow-lg">
          <p className="text-sm font-semibold mb-1 opacity-90">Blockchain Network</p>
          <p className="text-2xl font-bold">Base Sepolia</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search booking code, tx hash, hotel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 placeholder-gray-400"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2"
          >
            <option value="">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <input
            type="text"
            placeholder="Hotel Asset ID"
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Payout Ledger</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading settlements...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No settlements found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  {["Hotel","Booking","Amount","Wallet","Status","TX Hash","Date"].map(h => (
                    <th key={h} className="p-4 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-750 transition text-gray-300">
                    <td className="p-4">
                      <div className="font-semibold text-white">{item.hotelName}</div>
                      <div className="text-xs text-gray-400">{item.hotelLocation}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-200">{item.bookingCode}</td>
                    <td className="p-4 text-emerald-400 font-bold">${Number(item.amount).toFixed(2)}</td>
                    <td className="p-4 text-xs text-gray-400 font-mono">
                      {item.hotelWallet.slice(0, 6)}...{item.hotelWallet.slice(-4)}
                    </td>
                    <td className="p-4">
                      {item.status === "COMPLETED" ? (
                        <span className="px-3 py-1 rounded-full text-xs bg-emerald-900/50 text-emerald-300 font-medium">Completed</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs bg-orange-900/50 text-orange-300 font-medium">Pending</span>
                      )}
                    </td>
                    <td className="p-4">
                      {item.txHash ? (
                        <a
                          href={`https://sepolia.basescan.org/tx/${item.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline text-xs"
                        >
                          View TX
                        </a>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400 text-xs">{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between p-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">Page {page} of {pagination.totalPages}</p>
              <div className="flex gap-2">
                <button disabled={!pagination.hasPrevPage} onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg disabled:opacity-40">
                  Previous
                </button>
                <button disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg disabled:opacity-40">
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
