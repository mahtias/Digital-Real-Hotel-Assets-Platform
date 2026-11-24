import { useEffect, useState } from "react";
import { adminApi } from "../context/AdminAuthContext";
import { Empty, Loading, PageHeader, Pagination, StatWidget } from "../components/ui";
import { IconSearch } from "../components/Icons";

interface RevenueItem {
  hotelId: string;
  hotelName: string;
  totalRevenue: number;
  pending: number;
  paid: number;
  platformFees: number;
  investorYield: number;
  hotelNetRevenue: number;
}

const usd = (v: number) => `$${Number(v || 0).toFixed(2)}`;

export default function Revenue() {
  const [data, setData] = useState<RevenueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false,
  });

  const fetchRevenue = async () => {
    try {
      const res = await adminApi().get("/admin/revenue", { params: { page, search } });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Failed to fetch revenue:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRevenue(); }, [page, search]);

  const sum = (key: keyof RevenueItem) =>
    data.reduce((acc, item) => acc + Number(item[key] || 0), 0);

  const totalRevenue     = sum("totalRevenue");
  const totalPlatform    = sum("platformFees");
  const totalYield       = sum("investorYield");
  const totalNet         = sum("hotelNetRevenue");
  const totalPending     = sum("pending");
  const totalPaid        = sum("paid");

  return (
    <>
      <PageHeader
        title="Revenue Dashboard"
        subtitle="Monitor hotel booking revenue, platform fees, investor yield, and settlements."
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 mb-6">
        <StatWidget tone="success"   value={usd(totalRevenue)}  title="Total Revenue" />
        <StatWidget tone="primary"   value={usd(totalPlatform)} title="Platform Fees" />
        <StatWidget tone="info"      value={usd(totalYield)}    title="Investor Yield" />
        <StatWidget tone="danger"    value={usd(totalNet)}      title="Hotel Net" />
        <StatWidget tone="warning"   value={usd(totalPending)}  title="Pending Payouts" />
        <StatWidget tone="dark"      value={usd(totalPaid)}     title="Paid to Hotels" />
      </div>

      <div className="card">
        <div className="card-header">
          <span>Hotel revenue overview</span>
        </div>

        <div className="card-body border-b border-line">
          <div className="input-group max-w-md">
            <span className="input-group-text"><IconSearch size={16} /></span>
            <input
              type="text"
              placeholder="Search hotel name…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="form-control"
            />
          </div>
        </div>

        {loading ? (
          <Loading label="Loading revenue data…" />
        ) : data.length === 0 ? (
          <Empty>No revenue data available.</Empty>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-hover">
                <thead>
                  <tr>
                    {["Hotel", "Total", "Platform Fee", "Inv. Yield", "Hotel Net", "Pending", "Paid", "Status"].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((hotel) => {
                    const share = totalRevenue > 0 ? (Number(hotel.totalRevenue || 0) / totalRevenue) * 100 : 0;
                    return (
                      <tr key={hotel.hotelId}>
                        <td className="min-w-[12rem]">
                          <div className="font-medium">{hotel.hotelName}</div>
                          {/* CoreUI-style progress bar showing revenue share */}
                          <div className="flex items-center gap-2 mt-1">
                            <div className="h-1 flex-1 bg-light rounded overflow-hidden">
                              <div className="h-full bg-success" style={{ width: `${share}%` }} />
                            </div>
                            <span className="text-[0.7rem] text-medium-emphasis w-9 text-right">{share.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="font-semibold text-success">{usd(hotel.totalRevenue)}</td>
                        <td className="font-semibold text-primary">{usd(hotel.platformFees)}</td>
                        <td className="font-semibold text-info">{usd(hotel.investorYield)}</td>
                        <td className="font-semibold text-danger">{usd(hotel.hotelNetRevenue)}</td>
                        <td className="font-semibold text-warning">{usd(hotel.pending)}</td>
                        <td className="font-semibold">{usd(hotel.paid)}</td>
                        <td>
                          {Number(hotel.pending) > 0
                            ? <span className="badge badge-warning">Pending</span>
                            : <span className="badge badge-success">Paid</span>}
                        </td>
                      </tr>
                    );
                  })}
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
