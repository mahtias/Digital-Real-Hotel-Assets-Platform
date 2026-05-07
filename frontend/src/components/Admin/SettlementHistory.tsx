import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
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
const { id } = useParams<{ id: string }>();
const navigate = useNavigate();

  const [data, setData] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/v1/settlements/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);

    } catch (err) {
      console.error("Settlement fetch error:", err);

    } finally {
      setLoading(false);
    }
  };

  const totalPaid = data.reduce(
    (sum, item) => sum + Number(item.amount),
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
          Settlement History
        </h1>

        <p className="text-gray-600">
          Audit blockchain payouts sent from DRA treasury to hotel wallets.
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">
            Total Settlements
          </h2>

          <p className="text-4xl font-bold">
            {data.length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">
            Total Paid
          </h2>

          <p className="text-4xl font-bold">
            ${totalPaid.toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">
            Blockchain Network
          </h2>

          <p className="text-2xl font-bold">
            Base Sepolia
          </p>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Payout Ledger
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading settlements...
          </div>

        ) : data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No settlements found.
          </div>

        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>
                  <th className="p-4 text-left">Hotel</th>
                  <th className="p-4 text-left">Booking</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Wallet</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">TX Hash</th>
                  <th className="p-4 text-left">Date</th>
                </tr>

              </thead>

              <tbody>

                {data.map((item) => (

                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-4">
                      <div className="font-semibold text-gray-900">
                        {item.hotelName}
                      </div>

                      <div className="text-sm text-gray-500">
                        {item.hotelLocation}
                      </div>
                    </td>

                    <td className="p-4 font-medium text-gray-800">
                      {item.bookingCode}
                    </td>

                    <td className="p-4 text-emerald-700 font-bold">
                      ${Number(item.amount).toFixed(2)}
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {item.hotelWallet.slice(0, 6)}...
                      {item.hotelWallet.slice(-4)}
                    </td>

                    <td className="p-4">

                      {item.status === "COMPLETED" ? (
                        <span className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700 font-medium">
                          Completed
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700 font-medium">
                          Pending
                        </span>
                      )}

                    </td>

                    <td className="p-4 text-sm">

                      {item.txHash ? (
                        <a
                          href={`https://sepolia.basescan.org/tx/${item.txHash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View TX
                        </a>
                      ) : (
                        <span className="text-gray-400">
                          —
                        </span>
                      )}

                    </td>

                    <td className="p-4 text-gray-600 text-sm">
                      {new Date(item.createdAt).toLocaleString()}
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