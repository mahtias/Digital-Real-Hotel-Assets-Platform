import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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

export default function RevenueDashboard() {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<RevenueItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/revenue`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);

    } catch (err) {

      console.error("Failed to fetch revenue:", err);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  // =========================================
  // TOTALS
  // =========================================

  const totalRevenue = data.reduce(
    (sum, item) => sum + Number(item.totalRevenue || 0),
    0
  );

  const totalPending = data.reduce(
    (sum, item) => sum + Number(item.pending || 0),
    0
  );

  const totalPaid = data.reduce(
    (sum, item) => sum + Number(item.paid || 0),
    0
  );

  const totalPlatformFees = data.reduce(
    (sum, item) => sum + Number(item.platformFees || 0),
    0
  );

  const totalInvestorYield = data.reduce(
    (sum, item) => sum + Number(item.investorYield || 0),
    0
  );

  const totalHotelNet = data.reduce(
    (sum, item) => sum + Number(item.hotelNetRevenue || 0),
    0
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* BACK */}
      <div className="container mx-auto px-0 py-0 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Revenue Dashboard
        </h1>

        <p className="text-gray-600 text-lg">
          Monitor hotel booking revenue, platform treasury earnings,
          investor yield distribution, and blockchain settlements.
        </p>

      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 mb-8">

        {/* TOTAL REVENUE */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold mb-2">
            Total Revenue
          </h2>

          <p className="text-4xl font-bold">
            ${totalRevenue.toFixed(2)}
          </p>

        </div>

        {/* PLATFORM FEES */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-700 text-white p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold mb-2">
            Platform Fees
          </h2>

          <p className="text-4xl font-bold">
          ${totalPlatformFees.toFixed(2)}
        </p>

        <p className="text-sm opacity-80 mt-1">
          5% platform fee
        </p>

        </div>

        {/* INVESTOR YIELD */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold mb-2">
            Investor Yield
          </h2>

          <p className="text-4xl font-bold">
            ${totalInvestorYield.toFixed(2)}
          </p>

          <p className="text-sm opacity-80 mt-1">
            10% yield distributed
          </p>

        </div>

        {/* HOTEL NET */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-700 text-white p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold mb-2">
            Hotel Net Revenue
          </h2>

          <p className="text-4xl font-bold">
            ${totalHotelNet.toFixed(2)}
          </p>

        </div>

        {/* PENDING */}
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold mb-2">
            Pending Payouts
          </h2>

          <p className="text-4xl font-bold">
            ${totalPending.toFixed(2)}
          </p>

        </div>

        {/* PAID */}
        <div className="bg-gradient-to-br from-green-500 to-teal-700 text-white p-6 rounded-2xl shadow-lg">

          <h2 className="text-lg font-semibold mb-2">
            Paid to Hotels
          </h2>

          <p className="text-4xl font-bold">
            ${totalPaid.toFixed(2)}
          </p>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold text-gray-800">
            Hotel Revenue Overview
          </h2>

        </div>

        {loading ? (

          <div className="p-8 text-center text-gray-500">
            Loading revenue data...
          </div>

        ) : data.length === 0 ? (

          <div className="p-8 text-center text-gray-500">
            No revenue data available.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Hotel
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Total Revenue
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Platform Fee
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Investor Yield
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Hotel Net
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Pending
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Paid
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {data.map((hotel) => (

                  <tr
                    key={hotel.hotelId}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    {/* HOTEL */}
                    <td className="p-4 font-medium text-gray-900">
                      {hotel.hotelName}
                    </td>

                    {/* TOTAL */}
                    <td className="p-4 text-emerald-700 font-semibold">
                      ${Number(hotel.totalRevenue || 0).toFixed(2)}
                    </td>

                    {/* PLATFORM */}
                    <td className="p-4 text-purple-700 font-semibold">
                      ${Number(hotel.platformFees || 0).toFixed(2)}
                      <span className="text-xs text-gray-500 ml-1">
                        (5%)
                      </span>
                    </td>

                    {/* YIELD */}
                    <td className="p-4 text-cyan-700 font-semibold">
                      ${Number(hotel.investorYield || 0).toFixed(2)}
                      <span className="text-xs text-gray-500 ml-1">
                        (10%)
                      </span>
                    </td>

                    {/* NET */}
                    <td className="p-4 text-pink-700 font-semibold">
                      ${Number(hotel.hotelNetRevenue || 0).toFixed(2)}
                    </td>

                    {/* PENDING */}
                    <td className="p-4 text-orange-600 font-semibold">
                      ${Number(hotel.pending || 0).toFixed(2)}
                    </td>

                    {/* PAID */}
                    <td className="p-4 text-green-700 font-semibold">
                      ${Number(hotel.paid || 0).toFixed(2)}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">

                      {Number(hotel.pending) > 0 ? (

                        <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700 font-medium">
                          Pending Settlement
                        </span>

                      ) : (

                        <span className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700 font-medium">
                          Fully Paid
                        </span>

                      )}

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>
    </div>
  );
}