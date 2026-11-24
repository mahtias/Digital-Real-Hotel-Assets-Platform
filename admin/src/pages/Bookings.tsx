import { useState, useEffect } from "react";
import { adminApi } from "../context/AdminAuthContext";
import { Empty, Loading, PageHeader, Pagination } from "../components/ui";

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

const STATUS_BADGE: Record<string, string> = {
  CONFIRMED: "badge-info",
  PAID:      "badge-success",
  COMPLETED: "badge-primary",
  CANCELLED: "badge-danger",
  PENDING:   "badge-warning",
};

export default function Bookings() {
  const [bookings, setBookings]   = useState<Booking[]>([]);
  const [page, setPage]           = useState(1);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [msg, setMsg]             = useState<Record<string, { ok: boolean; text: string }>>({});
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
      setMsg(p => ({ ...p, [id]: { ok: true, text: "✓ Paid — yield distributed" } }));
      fetch();
    } catch (e: any) {
      setMsg(p => ({ ...p, [id]: { ok: false, text: `✗ ${e.response?.data?.message ?? e.message}` } }));
    } finally { setMarkingId(null); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <PageHeader title="Bookings" subtitle="Hotel bookings, payment status and manual payment confirmation." />

      <div className="card">
        <div className="card-header">
          <span>All bookings</span>
          <span className="text-sm font-normal text-medium-emphasis">{total} total</span>
        </div>

        {loading ? (
          <Loading />
        ) : bookings.length === 0 ? (
          <Empty>No bookings found.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-hover">
              <thead>
                <tr>
                  {["Guest", "Hotel", "Check-in", "Check-out", "Total", "Status", "Action"].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>
                      <div className="font-medium">{b.user.firstName} {b.user.lastName}</div>
                      <div className="text-xs text-medium-emphasis">{b.user.email}</div>
                    </td>
                    <td>{b.hotelAsset?.name}</td>
                    <td className="whitespace-nowrap text-medium-emphasis">{new Date(b.checkInDate).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap text-medium-emphasis">{new Date(b.checkOutDate).toLocaleDateString()}</td>
                    <td className="font-semibold text-success">${Number(b.totalPrice).toFixed(2)}</td>
                    <td><span className={`badge ${STATUS_BADGE[b.status] ?? "badge-secondary"}`}>{b.status}</span></td>
                    <td>
                      {msg[b.id] ? (
                        <span className={`text-xs ${msg[b.id].ok ? "text-success" : "text-danger"}`}>{msg[b.id].text}</span>
                      ) : b.status !== "PAID" && b.status !== "COMPLETED" && b.status !== "CANCELLED" ? (
                        <button onClick={() => markAsPaid(b.id)} disabled={markingId === b.id} className="btn btn-sm btn-success">
                          {markingId === b.id ? "Processing…" : "Mark Paid"}
                        </button>
                      ) : (
                        <span className="text-xs text-medium-emphasis">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="card-footer">
            <Pagination page={page} totalPages={totalPages} onChange={setPage}
              summary={`Page ${page} of ${totalPages} (${total} total)`} />
          </div>
        )}
      </div>
    </>
  );
}
