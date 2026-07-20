// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, differenceInDays } from "date-fns";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, CheckCircle } from "lucide-react";
import { Dialog } from "@headlessui/react";

import { useLanguage } from "@/components/common/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { web3Service } from "@/services/web3Service";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Booking() {
  const { t } = useLanguage();
  const { authFetch, user } = useAuth();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
  const [roomType, setRoomType] = useState("standard");
  const [guests, setGuests] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState("usdc");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState("");
  const [signer, setSigner] = useState(null);
  const [walletReady, setWalletReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const [isGalleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);

  // ----------- Wallet setup -----------
  useEffect(() => {
    const setupSigner = async () => {
      if (!walletClient || !user) return;
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signerInstance = await provider.getSigner();
      setSigner(signerInstance);
      web3Service.setSigner(signerInstance);
      setWalletReady(true);
    };
    setupSigner();
  }, [walletClient, user]);

  const isWalletReady = isConnected && address && signer;

  // ----------- Fetch hotels -----------
  const { data: hotels = [] } = useQuery({
    queryKey: ["booking-hotels"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/hotels`);
      if (!res.ok) throw new Error("Failed to fetch hotels");
      const data = await res.json();
      return Array.isArray(data) ? data : data.hotels || [];
    },
  });

  // ----------- Fetch user bookings -----------
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const res = await authFetch(`${API_URL}/api/v1/bookings/my`);
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data.data || []);
      } catch (err) {
        console.error("Failed to fetch user bookings:", err);
      }
    };
    fetchBookings();
  }, [user]);

  // ----------- Fetch user investments -----------
  const { data: investments = [] } = useQuery({
    queryKey: ["user-investments", user?.email],
    enabled: !!user,
    queryFn: async () => {
      const res = await authFetch(`${API_URL}/api/v1/investments`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : data.investments || [];
    },
  });

  const hotel = hotels.find((h) => String(h.id) === String(selectedHotel));
  const userHasTokens = investments.some(
    (inv) => inv.hotel_asset_id === selectedHotel && inv.token_amount > 0
  );

  const roomPrices = { standard: 25, deluxe: 50, suite: 100 };
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const basePrice = nights * roomPrices[roomType];
  const discount = userHasTokens
    ? basePrice * 0.15
    : paymentMethod === "dra_token"
    ? basePrice * 0.05
    : 0;
  const totalPrice = basePrice - discount;

  const openGallery = (images) => {
    setGalleryImages(images);
    setActiveImage(0);
    setGalleryOpen(true);
  };

  // ----------- Booking success modal -----------
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-900/80 border-slate-800 p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t("booking.bookingSuccess")}</h2>
          <p className="text-slate-400 mb-6">{t("booking.confirmationCode")}</p>
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <p className="text-3xl font-mono font-bold text-amber-400">{bookingCode}</p>
          </div>
          <div className="text-left bg-slate-800/50 rounded-lg p-4 space-y-3 mb-6">
            <h4 className="text-white font-semibold text-sm mb-2">Booking Information</h4>
            <p className="text-slate-400 text-sm">Name: <span className="text-white">{user?.name || user?.email || "Guest"}</span></p>
            <p className="text-slate-400 text-sm">Hotel: <span className="text-white">{hotel?.name}</span></p>
            <p className="text-slate-400 text-sm">Room: <span className="text-white capitalize">{roomType}</span></p>
            <p className="text-slate-400 text-sm">Guests: <span className="text-white">{guests}</span></p>
            <p className="text-slate-400 text-sm">Check-in: <span className="text-white">{format(checkIn, "yyyy/MM/dd")}</span></p>
            <p className="text-slate-400 text-sm">Check-out: <span className="text-white">{format(checkOut, "yyyy/MM/dd")}</span></p>
            <div className="h-px bg-slate-700 my-2" />
            <p className="text-slate-400 text-sm">Total Paid: <span className="text-emerald-400 font-semibold">${totalPrice.toFixed(2)}</span></p>
            <span className="text-white">Check your mail to see your booking information! Thanks.</span>
          </div>
          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900"
            onClick={() => {
              setBookingSuccess(false);
              setCheckIn(null);
              setCheckOut(null);
            }}
          >
            {t("booking.continueBooking")}
          </Button>
        </Card>
      </div>
    );
  }

  // ----------- Booking Page -----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Title + My Bookings Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t("booking.title")}</h1>
            <p className="text-slate-400">{t("booking.subtitle")}</p>
          </div>

          <Button
            className="relative bg-amber-500 hover:bg-amber-600 text-slate-900"
            onClick={() => navigate("/my-bookings")}
          >
            {t("booking.myBookings")}
            {bookings.length > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {bookings.length}
              </span>
            )}
          </Button>
        </div>

        {/* --- Hotel Gallery --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {hotels.map((h) => (
            <Card key={h.id} className={`bg-slate-900/70 border-slate-800 p-2 cursor-pointer ${selectedHotel === h.id ? "border-amber-500" : ""}`}>
              <img
                src={h.imageUrl || `https://source.unsplash.com/400x300/?hotel,${h.id}`}
                alt={h.name}
                className="w-full h-48 object-cover rounded-lg"
                onClick={() => setSelectedHotel(h.id)}
              />
              <div className="p-2">
                <h3 className="text-white font-semibold">{h.name}</h3>
                <p className="text-slate-400 text-sm">{h.location}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(h.star_rating || 4)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Button
                  className="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-slate-900"
                 onClick={() => navigate(`/book-hotel/${h.id}`)}
                >
                  {t("booking.bookNow")}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* --- Booking Form + Summary --- */}
        {selectedHotel && hotel && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Form Cards */}
            </div>
            <div>
              <Card className="bg-slate-900/80 border-slate-800 p-6 sticky top-4">
                {/* Order Summary & Confirm Button */}
              </Card>
            </div>
          </div>
        )}

        {/* --- Image Gallery Modal --- */}
        <Dialog open={isGalleryOpen} onClose={() => setGalleryOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <Dialog.Panel className="relative">
            <img src={galleryImages[activeImage]} className="max-h-[90vh] max-w-[90vw]" />
            <Button className="absolute top-2 right-2" onClick={() => setGalleryOpen(false)}>Close</Button>
          </Dialog.Panel>
        </Dialog>
      </div>
    </div>
  );
}