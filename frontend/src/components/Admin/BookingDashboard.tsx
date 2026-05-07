import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
interface Booking {
  id: string;
  bookingCode: string;
  status: string;
  totalPrice: number;
  paymentStatus: string;
  paymentToken: string;
  txHash: string;
  qloOrderId?: string;

  checkInDate: string;
  checkOutDate: string;

  user?: {
    email: string;
    firstName?: string;
    lastName?: string;
  };

  hotelAsset?: {
    name: string;
    location: string;
  };
}

export default function AdminBookingsPage() {

const { id } = useParams<{ id: string }>();
const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // ========================================
  // FETCH BOOKINGS
  // ========================================

  const fetchBookings = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(res.data);

    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ========================================
  // SUMMARY
  // ========================================

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + Number(b.totalPrice),
    0
  );

  const successfulPayments = bookings.filter(
    (b) => b.paymentStatus === "SUCCESS"
  ).length;

  const pendingBookings = bookings.filter(
    (b) => b.status === "PENDING"
  ).length;

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
          Booking Management
        </h1>

        <p className="text-gray-600">
          Monitor hotel bookings, blockchain payments, and PMS synchronization.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">
            Total Bookings
          </h2>

          <p className="text-4xl font-bold">
            {bookings.length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">
            Revenue Generated
          </h2>

          <p className="text-4xl font-bold">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-lg font-semibold mb-2">
            Pending Bookings
          </h2>

          <p className="text-4xl font-bold">
            {pendingBookings}
          </p>
        </div>

      </div>

      {/* BOOKINGS TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Booking Transactions
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No bookings found.
          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Booking
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Hotel
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Guest
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Amount
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Payment
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    PMS Sync
                  </th>

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Tx Hash
                  </th>

                </tr>

              </thead>

              <tbody>

                {bookings.map((booking, index) => (

                  <tr
                    key={booking.id || booking.bookingCode || index}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    {/* BOOKING */}
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">
                        {booking.bookingCode}
                      </div>

                      <div className="text-sm text-gray-500">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                        {" → "}
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                      </div>
                    </td>

                    {/* HOTEL */}
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {booking.hotelAsset?.name}
                      </div>

                      <div className="text-sm text-gray-500">
                        {booking.hotelAsset?.location}
                      </div>
                    </td>

                    {/* USER */}
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {booking.user?.firstName} {booking.user?.lastName}
                      </div>

                      <div className="text-sm text-gray-500">
                        {booking.user?.email}
                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td className="p-4 text-emerald-700 font-bold">
                      ${Number(booking.totalPrice).toFixed(2)}
                    </td>

                    {/* PAYMENT */}
                    <td className="p-4">

                      {booking.paymentStatus === "SUCCESS" ? (
                        <span className="px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700 font-medium">
                          Paid
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700 font-medium">
                          Pending
                        </span>
                      )}

                    </td>

                    {/* PMS */}
                    <td className="p-4">

                      {booking.qloOrderId ? (
                        <span className="px-3 py-1 rounded-full text-sm bg-cyan-100 text-cyan-700 font-medium">
                          Synced
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 font-medium">
                          Failed
                        </span>
                      )}

                    </td>

                    {/* TX HASH */}
                    <td className="p-4 max-w-xs truncate text-sm text-gray-500">
                      {booking.txHash || "-"}
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