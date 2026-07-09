import { useState, useEffect } from "react";
import { adminApi } from "../context/AdminAuthContext";

interface Booking {
  id: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  checkInDate: string;
  checkOutDate: string;
  guestName: string;
  user: { email: string; firstName: string; lastName: string };
  hotelAsset: { name: string };
}

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: "bg-blue-900 text-blue-300",
  PAID:      "bg-green-900 text-green-300",
  COMPLETED: "bg-emerald-900 text-emerald-300",
  CANCELLED: "bg-red-900 text-red-300",
  PENDING:   "bg-yellow-900 text-yellow-300",
};

export default function Bookings() {
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [page, setPage]           = useState(1);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [msg, setMsg]             = useState<Record<string, string>>({});
  const api = adminApi();
  const limit = 15;

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/bookings?page=${page}&limit=${limit}`);
      setBookings(res.data.data ?? []);
      setTotal(res.data.pagination?.total ?? 0);
    } catch { setBookings([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page]);

  const markAsPaid = async (id: string) => {
    setMarkingId(id);
    try {
      await api.post(`/bookings/${id}/confirm-payment`, {
        txHash: `admin-manual-${Date.now()}`,
        stablecoinSymbol: "USDC",
      });
      setMsg(p => ({ ...p, [id]: "✓ Paid — yield distributed" }));
      fetch();
    } catch (e: any) {
      setMsg(p => ({ ...p, [id]: `✗ ${e.response?.data?.message ?? e.message}` }));
    } finally { setMarkingId(null); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Bookings</h1>

      {loading ? (
        <div className="text-gray-400">Loading…</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
              <tr>
                {["Guest","Hotel","Check-in","Check-out","Total","Status","Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-white">
                    {b.user.firstName} {b.user.lastName}
                    <div className="text-xs text-gray-500">{b.user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{b.hotelAsset?.name}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(b.checkInDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(b.checkOutDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-emerald-400">${Number(b.totalPrice).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[b.status] ?? "bg-gray-700 text-gray-300"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {msg[b.id] ? (
                      <span className="text-xs text-green-400">{msg[b.id]}</span>
                    ) : b.status !== "PAID" && b.status !== "COMPLETED" && b.status !== "CANCELLED" ? (
                      <button
                        onClick={() => markAsPaid(b.id)}
                        disabled={markingId === b.id}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs rounded-lg transition-colors"
                      >
                        {markingId === b.id ? "Processing…" : "Mark Paid"}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-3 mt-4 text-sm text-gray-400">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
            className="px-3 py-1 bg-gray-800 rounded disabled:opacity-40 hover:bg-gray-700">Prev</button>
          <span>Page {page} of {totalPages} ({total} total)</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
            className="px-3 py-1 bg-gray-800 rounded disabled:opacity-40 hover:bg-gray-700">Next</button>
        </div>
      )}
    </div>
  );
}
