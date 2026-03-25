// src/pages/MyBookings.tsx
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Star, MapPin } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function MyBookings() {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`${API_URL}/api/v1/bookings/my`);
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();
      setBookings(data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await authFetch(`${API_URL}/api/v1/bookings/${id}/cancel`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Cancel failed");
      toast.success("Booking cancelled");
      fetchBookings(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel booking");
    }
  };

  if (loading) return <p className="text-white p-6">Loading your bookings...</p>;

  if (bookings.length === 0)
    return <p className="text-white p-6">You have no bookings yet.</p>;
     
  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Back */}
         <Button onClick={() => navigate("/booking")}>← Back</Button>
        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
       
               
        {bookings.map((b) => (
          <Card
            key={b.id}
            className="p-4 bg-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            {/* Hotel & Booking Info */}
            <div className="flex items-start gap-4 text-white">
              {b.hotelAsset?.imageUrl && (
                <img
                  src={b.hotelAsset.imageUrl}
                  alt={b.hotelAsset.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="space-y-1">
                <p className="font-semibold text-lg">{b.hotelAsset?.name || "Unknown Hotel"}</p>
                {b.hotelAsset?.location && (
                  <p className="text-white/70 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {b.hotelAsset.location}
                  </p>
                )}
                {b.hotelAsset?.star_rating && (
                  <div className="flex items-center gap-1">
                    {[...Array(b.hotelAsset.star_rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                )}
                <p>
                  <span className="font-semibold">Check-in:</span>{" "}
                  {format(new Date(b.checkInDate), "yyyy/MM/dd")}
                </p>
                <p>
                  <span className="font-semibold">Check-out:</span>{" "}
                  {format(new Date(b.checkOutDate), "yyyy/MM/dd")}
                </p>
                <p>
                  <span className="font-semibold">Guests:</span> {b.guests}
                </p>
                <p>
                  <span className="font-semibold">Room:</span> {b.roomType}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={
                      b.status === "PAID"
                        ? "text-emerald-400"
                        : b.status === "CANCELLED"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }
                  >
                    {b.status}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Total Paid:</span> ${b.totalPrice}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-2 md:mt-0 flex flex-col gap-2">
              {b.status !== "CANCELLED" && (
                <Button
                  className="bg-red-600 hover:bg-red-500"
                  onClick={() => handleCancel(b.id)}
                >
                  Cancel Booking
                </Button>
              )}
              <Button
                className="bg-amber-500 hover:bg-amber-400"
                 onClick={() => navigate(`/booking/${b.id}`)}
              >
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}