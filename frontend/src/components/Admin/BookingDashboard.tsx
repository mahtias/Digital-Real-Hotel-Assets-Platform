import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;
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
  const [page, setPage] = useState(1);
const [limit] = useState(20);

const [pagination, setPagination] = useState({
  total: 0,totalPages: 0,hasNextPage: false,hasPrevPage: false,});

const [search, setSearch] = useState("");
const [paymentStatus, setPaymentStatus] = useState("");
const [hotelId, setHotelId] = useState("");
const [markingPaid, setMarkingPaid] = useState<string | null>(null);
const [paidMsg, setPaidMsg] = useState<Record<string, string>>({});

  // ========================================
  // FETCH BOOKINGS
  // ========================================

  const fetchBookings = async () => {
    try {

      const token = localStorage.getItem("authToken");

     const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/v1/admin/bookings`,
  {
    params: {
  page,
  limit,
  search,
  paymentStatus,
  hotelId,
   },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      setBookings(res.data.data);
setPagination(res.data.pagination);

    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchBookings();
}, [page, search, paymentStatus, hotelId]);

  // ========================================
  // MARK AS PAID → triggers yield distribution
  // ========================================
  const markAsPaid = async (bookingId: string) => {
    setMarkingPaid(bookingId);
    setPaidMsg((prev) => ({ ...prev, [bookingId]: "" }));
    try {
      await axios.post(
        `${API}/api/v1/webhook/qlo`,
        { event: "PAYMENT_CONFIRMED", bookingId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      setPaidMsg((prev) => ({ ...prev, [bookingId]: "Paid — yield distributed!" }));
      fetchBookings();
    } catch (err: any) {
      setPaidMsg((prev) => ({
        ...prev,
        [bookingId]: err.response?.data?.message ?? "Failed",
      }));
    } finally {
      setMarkingPaid(null);
    }
  };

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
            {pagination.total}
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

      <div className="bg-white p-4 rounded-xl border mb-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    {/* Search */}
    <input
      type="text"
      placeholder="Search booking code, email, guest..."
      value={search}
      onChange={(e) => {
        setPage(1);
        setSearch(e.target.value);
      }}
      className="border rounded-lg px-3 py-2"
    />

    {/* Payment Status */}
    <select
      value={paymentStatus}
      onChange={(e) => {
        setPage(1);
        setPaymentStatus(e.target.value);
      }}
      className="border rounded-lg px-3 py-2"
    >
      <option value="">All Payments</option>
      <option value="SUCCESS">Paid</option>
      <option value="PENDING">Pending</option>
      <option value="FAILED">Failed</option>
    </select>

    {/* Reset */}
    <button
      onClick={() => {
        setSearch("");
        setPaymentStatus("");
        setHotelId("");
        setPage(1);
      }}
      className="bg-gray-100 border rounded-lg px-3 py-2"
    >
      Reset Filters
    </button>

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

                  <th className="text-left p-4 font-semibold text-gray-700">
                    Actions
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

                    {/* ACTIONS */}
                    <td className="p-4">
                      {booking.paymentStatus !== "SUCCESS" ? (
                        <div>
                          <button
                            onClick={() => markAsPaid(booking.id)}
                            disabled={markingPaid === booking.id}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition"
                          >
                            {markingPaid === booking.id ? "Processing..." : "Mark as Paid"}
                          </button>
                          {paidMsg[booking.id] && (
                            <p className={`text-xs mt-1 ${paidMsg[booking.id].includes("Failed") ? "text-red-500" : "text-emerald-600"}`}>
                              {paidMsg[booking.id]}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

        <div className="flex items-center justify-between p-4 border-t">

  <div className="text-sm text-gray-500">
    Page {page} of {pagination.totalPages}
  </div>

  <div className="flex gap-2">

    <button
      disabled={!pagination.hasPrevPage}
      onClick={() => setPage((p) => p - 1)}
      className="px-4 py-2 border rounded disabled:opacity-50"
    >
      Previous
    </button>

    <button
      disabled={!pagination.hasNextPage}
      onClick={() => setPage((p) => p + 1)}
      className="px-4 py-2 border rounded disabled:opacity-50"
    >
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