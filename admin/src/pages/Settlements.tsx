import { useState, useEffect } from "react";
import { adminApi } from "../context/AdminAuthContext";

export default function Settlements() {
  const [hotelAssets, setHotelAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const api = adminApi();
      const [hotelRes, revenueRes] = await Promise.all([
        api.get("/hotels"),
        api.get("/admin/revenue"),
      ]);

      const hotels = hotelRes.data;
      const revenue = Array.isArray(revenueRes.data)
        ? revenueRes.data
        : revenueRes.data.data || [];

      const merged = hotels.map((hotel: any) => {
        const rev = revenue.find((r: any) => r.hotelId === hotel.id);
        return {
          ...hotel,
          pending:      rev?.pending      || 0,
          paid:         rev?.paid         || 0,
          totalRevenue: rev?.totalRevenue || 0,
        };
      });

      setHotelAssets(merged);
    } catch (err) {
      console.error("Error fetching settlements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleProcessSettlement = async (hotelAssetId: string) => {
    if (!window.confirm("Process payout for this hotel now?")) return;
    setProcessing(hotelAssetId);
    try {
      await adminApi().post(`/settlements/process/${hotelAssetId}`);
      alert("Settlement processed successfully");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Settlement failed");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Payout Control</h1>
        <p className="text-gray-400 mt-1">
          Trigger blockchain USDC payouts from DRA treasury to hotel wallets.
        </p>
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-400">Loading settlement data...</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotelAssets.map((asset: any) => (
          <div key={asset.id} className="rounded-3xl overflow-hidden shadow-xl border border-gray-700 bg-gray-800">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6">
              <h2 className="text-2xl font-bold mb-1">{asset.name}</h2>
              <p className="text-orange-100 text-sm">{asset.location}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-2xl">
                  <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
                  <p className="text-lg font-bold text-emerald-400">${Number(asset.totalRevenue).toFixed(2)}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-2xl">
                  <p className="text-xs text-gray-400 mb-1">Pending</p>
                  <p className="text-lg font-bold text-orange-400">${Number(asset.pending).toFixed(2)}</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-2xl">
                  <p className="text-xs text-gray-400 mb-1">Paid</p>
                  <p className="text-lg font-bold text-cyan-400">${Number(asset.paid).toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-2xl">
                <p className="text-xs text-gray-400 mb-1">Hotel Wallet</p>
                <p className="text-sm font-mono break-all text-gray-300">
                  {asset.walletAddress || "No wallet assigned"}
                </p>
              </div>

              <div>
                {Number(asset.pending) > 0 ? (
                  <span className="px-4 py-2 rounded-full bg-orange-900/50 text-orange-300 text-sm font-semibold">
                    Pending Settlement
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-full bg-emerald-900/50 text-emerald-300 text-sm font-semibold">
                    Fully Paid
                  </span>
                )}
              </div>

              <button
                disabled={Number(asset.pending) <= 0 || processing === asset.id}
                onClick={() => handleProcessSettlement(asset.id)}
                className={`w-full py-3 rounded-2xl font-semibold transition ${
                  Number(asset.pending) > 0
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                {processing === asset.id
                  ? "Processing..."
                  : Number(asset.pending) > 0
                    ? `Process Payout ($${Number(asset.pending).toFixed(2)})`
                    : "No Pending Payout"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
