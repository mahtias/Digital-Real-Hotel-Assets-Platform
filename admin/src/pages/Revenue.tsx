import { useEffect, useState } from "react";
import { adminApi } from "../context/AdminAuthContext";

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Revenue Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Monitor hotel booking revenue, platform fees, investor yield, and settlements.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total Revenue",    value: totalRevenue,  color: "from-emerald-500 to-emerald-700" },
          { label: "Platform Fees",    value: totalPlatform, color: "from-purple-500 to-indigo-700" },
          { label: "Investor Yield",   value: totalYield,    color: "from-cyan-500 to-blue-700" },
          { label: "Hotel Net",        value: totalNet,      color: "from-pink-500 to-rose-700" },
          { label: "Pending Payouts",  value: totalPending,  color: "from-orange-400 to-orange-600" },
          { label: "Paid to Hotels",   value: totalPaid,     color: "from-green-500 to-teal-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} text-white p-5 rounded-2xl shadow-lg`}>
            <p className="text-sm font-semibold mb-1 opacity-90">{label}</p>
            <p className="text-2xl font-bold">${value.toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 p-4 mb-6">
        <input
          type="text"
          placeholder="Search hotel name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Hotel Revenue Overview</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading revenue data...</div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No revenue data available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700 text-gray-300">
                <tr>
                  {["Hotel","Total","Platform Fee","Inv. Yield","Hotel Net","Pending","Paid","Status"].map(h => (
                    <th key={h} className="text-left p-4 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((hotel) => (
                  <tr key={hotel.hotelId} className="border-t border-gray-700 hover:bg-gray-750 transition text-gray-200">
                    <td className="p-4 font-medium text-white">{hotel.hotelName}</td>
                    <td className="p-4 text-emerald-400 font-semibold">${Number(hotel.totalRevenue || 0).toFixed(2)}</td>
                    <td className="p-4 text-purple-400 font-semibold">${Number(hotel.platformFees || 0).toFixed(2)}</td>
                    <td className="p-4 text-cyan-400 font-semibold">${Number(hotel.investorYield || 0).toFixed(2)}</td>
                    <td className="p-4 text-pink-400 font-semibold">${Number(hotel.hotelNetRevenue || 0).toFixed(2)}</td>
                    <td className="p-4 text-orange-400 font-semibold">${Number(hotel.pending || 0).toFixed(2)}</td>
                    <td className="p-4 text-green-400 font-semibold">${Number(hotel.paid || 0).toFixed(2)}</td>
                    <td className="p-4">
                      {Number(hotel.pending) > 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs bg-orange-900/50 text-orange-300 font-medium">Pending</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs bg-emerald-900/50 text-emerald-300 font-medium">Paid</span>
                      )}
                    </td>
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
