// src/pages/BookingDetails.tsx
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BookingDetails() {
  const { authFetch } = useAuth();
  const { id } = useParams(); // booking id
  const [booking, setBooking] = useState(null);
  const [hotelName, setHotelName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    try {
      setLoading(true);

      // 1️⃣ Fetch the booking
      const res = await authFetch(`${API_URL}/api/v1/bookings/${id}`);
      if (!res.ok) throw new Error("Failed to fetch booking");
      const data = await res.json();
      setBooking(data.data);

      // 2️⃣ Fetch hotel details to get the name
      if (data.data?.hotelAssetId) {
        const hotelRes = await fetch(`${API_URL}/api/v1/hotels/${data.data.hotelAssetId}`);
        if (hotelRes.ok) {
          const hotelData = await hotelRes.json();
          setHotelName(hotelData?.name || "Unknown Hotel");
        } else {
          setHotelName("Unknown Hotel");
        }
      }

    } catch (err) {
      console.error(err);
      setHotelName("Unknown Hotel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  if (loading) return <p className="text-white p-6">Loading booking details...</p>;
  if (!booking) return <p className="text-white p-6">Booking not found.</p>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="max-w-3xl mx-auto">
        <Button
          className="mt-4 bg-amber-500 hover:bg-amber-600 text-slate-900"
          onClick={() => window.history.back()}
        >
          Back
        </Button>

        <h2 className="text-2xl font-bold mb-4 mt-4">Booking Details</h2>
        <Card className="p-4 bg-slate-900/80 border-slate-800 space-y-2 text-white">
          <p><span className="font-semibold">Booking Code:</span> {booking.bookingCode}</p>
          <p><span className="font-semibold">Hotel:</span> {hotelName}</p>
          <p><span className="font-semibold">Check-in:</span> {format(new Date(booking.checkInDate), "yyyy/MM/dd")}</p>
          <p><span className="font-semibold">Check-out:</span> {format(new Date(booking.checkOutDate), "yyyy/MM/dd")}</p>
          <p><span className="font-semibold">Guests:</span> {booking.guests}</p>
          <p><span className="font-semibold">Room:</span> {booking.roomType}</p>
          <p><span className="font-semibold">Total Paid:</span> ${booking.totalPrice}</p>
          <p><span className="font-semibold">Status:</span> {booking.status}</p>
          <p><span className="font-semibold">Payment TX:</span> {booking.txHash || "N/A"}</p>
        </Card>
      </div>
    </div>
  );
}