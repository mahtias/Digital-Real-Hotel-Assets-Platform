import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminSettlements() {

  const navigate = useNavigate();

  const [hotelAssets, setHotelAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {

    async function fetchHotelAssets() {

      setLoading(true);

      try {

        // HOTELS
        const hotelRes = await axios.get(
          `${API_URL}/api/v1/hotels`
        );

        // REVENUE DATA
        const revenueRes = await axios.get(
          `${API_URL}/api/v1/admin/revenue`
        );

        const hotels = hotelRes.data;
        const revenue = Array.isArray(revenueRes.data)
          ? revenueRes.data
          : revenueRes.data.data || [];

        // MERGE DATA
        const merged = hotels.map((hotel: any) => {

          const revenueInfo = revenue.find(
            (r: any) => r.hotelId === hotel.id
          );

          return {
            ...hotel,

            pending: revenueInfo?.pending || 0,
            paid: revenueInfo?.paid || 0,
            totalRevenue: revenueInfo?.totalRevenue || 0,
          };
        });

        setHotelAssets(merged);

      } catch (err) {

        console.error("Error fetching settlements", err);

      } finally {

        setLoading(false);
      }
    }

    fetchHotelAssets();

  }, []);

  const handleProcessSettlement = async (
    hotelAssetId: string
  ) => {

    setLoading(true);

    try {

      await axios.post(
        `${API_URL}/api/v1/settlements/process/${hotelAssetId}`
      );

      alert("Settlement processed successfully");

      window.location.reload();

    } catch (err) {

      console.error("Settlement error", err);

      alert("Settlement failed");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Settlements & Payouts
        </h1>

        <p className="text-gray-600 text-lg">
          Manage weekly hotel payouts and blockchain treasury settlements.
        </p>
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading settlement data...
        </div>
      )}

      {/* HOTEL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {hotelAssets.map((asset: any) => (

          <div
            key={asset.id}
            className="rounded-3xl overflow-hidden shadow-xl border bg-white"
          >

            {/* TOP SECTION */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6">

              <h2 className="text-2xl font-bold mb-1">
                {asset.name}
              </h2>

              <p className="text-orange-100">
                {asset.location}
              </p>

            </div>

            {/* BODY */}
            <div className="p-6 space-y-4">

              {/* REVENUE */}
              <div className="grid grid-cols-3 gap-4">

                <div className="bg-emerald-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-500">
                    Total Revenue
                  </p>

                  <p className="text-xl font-bold text-emerald-700">
                    ${Number(asset.totalRevenue).toFixed(2)}
                  </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-500">
                    Pending
                  </p>

                  <p className="text-xl font-bold text-orange-600">
                    ${Number(asset.pending).toFixed(2)}
                  </p>
                </div>

                <div className="bg-cyan-50 p-4 rounded-2xl">
                  <p className="text-sm text-gray-500">
                    Paid
                  </p>

                  <p className="text-xl font-bold text-cyan-700">
                    ${Number(asset.paid).toFixed(2)}
                  </p>
                </div>

              </div>

              {/* WALLET */}
              <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-sm text-gray-500 mb-1">
                  Hotel Wallet
                </p>

                <p className="text-sm font-mono break-all text-gray-700">
                  {asset.walletAddress || "No wallet assigned"}
                </p>
              </div>

              {/* STATUS */}
              <div>
                {Number(asset.pending) > 0 ? (
                  <span className="px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold">
                    Pending Settlement
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                    Fully Paid
                  </span>
                )}
              </div>

              {/* BUTTON */}
              <button
                disabled={Number(asset.pending) <= 0 || loading}
                onClick={() =>
                  handleProcessSettlement(asset.id)
                }
                className={`w-full py-3 rounded-2xl font-semibold transition duration-300 ${
                  Number(asset.pending) > 0
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {Number(asset.pending) > 0
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