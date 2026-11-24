import { useEffect, useState } from "react";
import { adminApi } from "../context/AdminAuthContext";
import { Empty, Loading, PageHeader, Pagination, StatWidget, shortAddr } from "../components/ui";
import { IconExternal, IconSearch } from "../components/Icons";

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
    <>
      <PageHeader title="Settlement History" subtitle="Audit all blockchain payouts sent from DRA treasury to hotel wallets." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatWidget tone="primary" value={pagination.total}             title="Total Settlements" />
        <StatWidget tone="success" value={`$${totalPaid.toFixed(2)}`}   title="Total Paid" />
        <StatWidget tone="info"    value="Base Sepolia"                 title="Blockchain Network" />
      </div>

      <div className="card">
        <div className="card-header">Payout ledger</div>

        <div className="card-body border-b border-line grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="input-group">
            <span className="input-group-text"><IconSearch size={16} /></span>
            <input
              type="text"
              placeholder="Search booking code, tx hash, hotel…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-select">
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
            className="form-control"
          />
        </div>

        {loading ? (
          <Loading label="Loading settlements…" />
        ) : data.length === 0 ? (
          <Empty>No settlements found.</Empty>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-hover">
                <thead>
                  <tr>
                    {["Hotel", "Booking", "Amount", "Wallet", "Status", "TX Hash", "Date"].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="font-medium">{item.hotelName}</div>
                        <div className="text-xs text-medium-emphasis">{item.hotelLocation}</div>
                      </td>
                      <td className="font-medium">{item.bookingCode}</td>
                      <td className="font-semibold text-success">${Number(item.amount).toFixed(2)}</td>
                      <td className="font-mono text-xs text-medium-emphasis">{shortAddr(item.hotelWallet)}</td>
                      <td>
                        {item.status === "COMPLETED"
                          ? <span className="badge badge-success">Completed</span>
                          : <span className="badge badge-warning">Pending</span>}
                      </td>
                      <td>
                        {item.txHash ? (
                          <a
                            href={`https://sepolia.basescan.org/tx/${item.txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs hover:underline"
                          >
                            View TX <IconExternal size={12} />
                          </a>
                        ) : (
                          <span className="text-medium-emphasis">—</span>
                        )}
                      </td>
                      <td className="text-xs text-medium-emphasis whitespace-nowrap">{new Date(item.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-footer">
              <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
