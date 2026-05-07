import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
interface RevenueItem {
  hotelId: string;
  hotelName: string;
  totalRevenue: number;
  pending: number;
  paid: number;
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

  const totalRevenue = data.reduce(
    (sum, item) => sum + Number(item.totalRevenue),
    0
  );

  const totalPending = data.reduce(
    (sum, item) => sum + Number(item.pending),
    0
  );

  const totalPaid = data.reduce(
    (sum, item) => sum + Number(item.paid),
    0
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
        <div className="container mx-auto px-0 py-0">
        <button
        onClick={() => navigate(-1)}>Back
                </button>
              </div>
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Revenue Dashboard
        </h1>

        <p className="text-gray-600">
          Monitor hotel booking revenue, pending settlements, and completed
          blockchain payouts.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Total Revenue</h2>
          <p className="text-4xl font-bold">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Pending Payouts</h2>
          <p className="text-4xl font-bold">
            ${totalPending.toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Paid to Hotels</h2>
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
                    <td className="p-4 font-medium text-gray-900">
                      {hotel.hotelName}
                    </td>

                    <td className="p-4 text-emerald-700 font-semibold">
                      ${Number(hotel.totalRevenue).toFixed(2)}
                    </td>

                    <td className="p-4 text-orange-600 font-semibold">
                      ${Number(hotel.pending).toFixed(2)}
                    </td>

                    <td className="p-4 text-cyan-700 font-semibold">
                      ${Number(hotel.paid).toFixed(2)}
                    </td>

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