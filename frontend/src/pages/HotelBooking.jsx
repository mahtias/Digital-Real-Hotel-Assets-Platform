// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { format, differenceInDays } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, CreditCard, Tag, CheckCircle } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { web3Service } from "@/services/web3Service";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BookingDetail() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const { authFetch, user } = useAuth();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
  const [roomType, setRoomType] = useState("standard");
  const [guests, setGuests] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState("usdc");

  const [signer, setSigner] = useState(null);
  const [walletReady, setWalletReady] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const [isGalleryOpen, setGalleryOpen] = useState(false);
const [bookingSuccess, setBookingSuccess] = useState(false);
const [bookingInfo, setBookingInfo] = useState(null);
 const today = new Date().toISOString().split("T")[0];
  // -------- Wallet setup --------
  useEffect(() => {
    const setup = async () => {
      if (!walletClient || !user) return;

      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signerInstance = await provider.getSigner();

      setSigner(signerInstance);
      web3Service.setSigner(signerInstance);
      setWalletReady(true);
    };

    setup();
  }, [walletClient, user]);

  // 🔐 KYC VERIFICATION
//const backendKycApproved = user?.kycStatus === 'APPROVED';

  // -------- Fetch hotels --------
  const { data: hotels = [] } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/hotels`);
      const data = await res.json();
      return data.hotels || data;
    },
  });

  const hotel = hotels.find((h) => String(h.id) === String(hotelId));
  //const stablecoin = hotel?.stablecoin || null;
  const stablecoin = {
  address:
    hotel?.stablecoin?.address ||
    hotel?.stablecoinAddress ||
    hotel?.stablecoin_address,
  decimals: hotel?.stablecoin?.decimals || 6,
  symbol: hotel?.stablecoin?.symbol || "USDC",
};

  // -------- Pricing --------
  const roomPrices = { standard: 0.5, deluxe: 1, executive: 1.5, suite: 2 };
  const nights = checkIn && checkOut ? Math.max(1, differenceInDays(checkOut, checkIn)): 0;
  const basePrice = nights * roomPrices[roomType];

  // Discount logic
  const discount = paymentMethod === "dra_token" ? basePrice * 0.05 : 0;
  const totalPrice = basePrice - discount;

// -------- Booking Payment --------
const handleBookingPayment = async () => {
  if (!user) return;

  if (!isConnected || !address) {
    toast.error("Wallet not connected.");
    return;
  }

  if (address.toLowerCase() !== user.walletAddress.toLowerCase()) {
    toast.error("Please connect your registered wallet");
    return;
  }

  if (!checkIn || !checkOut) {
    toast.error("Select dates first");
    return;
  }

  if (!stablecoin.address) {
  console.log("Hotel data:", hotel);
  toast.error("Stablecoin address missing for this hotel");
  return;
}
  // if (paymentMethod !== "usdc") {
  //   toast.error("Only USDC supported for now");
  //   return;
  // }
  

  setIsPaying(true);

  try {
    // 1️⃣ Create booking
    const createRes = await authFetch(`${API_URL}/api/v1/bookings`, {
      method: "POST",
      body: JSON.stringify({
        userId: user.id,
        hotelAssetId: hotelId,
        checkInDate: checkIn.toISOString(),
        checkOutDate: checkOut.toISOString(),
        totalPrice,
        roomType,
        guests,
        //paymentMethod,
        discountApplied: discount,
      }),
    });

    if (!createRes.ok) {
  const errorData = await createRes.json().catch(() => null);
  throw new Error(
    errorData?.message ||
    errorData?.error ||
    `Booking creation failed (${createRes.status})`
  );
}

    const bookingData = await createRes.json();
    const bookingId = bookingData.data.id;

    // 2️⃣ Payment intent
    const intentRes = await authFetch(`${API_URL}/api/v1/payments/intent`, {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    });

    if (!intentRes.ok) throw new Error("Failed to create payment intent");

    const intent = await intentRes.json();

    if (!intent.success) {
      throw new Error("Invalid payment intent");
    }

    const { intentId, amount, receiver, expiresAt } = intent;

    // ⏱ Expiry check
    if (new Date(expiresAt) < new Date()) {
      throw new Error("Payment session expired. Try again.");
    }

    if (!stablecoin.address) {
  toast.error("Stablecoin address missing for this hotel");
  return;
}

    // 3️⃣ Send USDC
  const txHash = await web3Service.sendStablecoin(
  receiver,
  Number(amount),
  {
    address: stablecoin.address,
    decimals: stablecoin.decimals,
  }
);

    // 4️⃣ Confirm
    const confirmRes = await authFetch(`${API_URL}/api/v1/payments/confirm`, {
      method: "POST",
      body: JSON.stringify({ intentId, txHash }),
    });

    if (!confirmRes.ok) throw new Error("Payment confirmation failed");

    // 5️⃣ UI success
    setBookingInfo({
      name: user?.name || user?.email || "Guest",
      hotel: hotel?.name,
      roomType,
      guests,
      checkIn,
      checkOut,
      totalPaid: amount.toFixed(2),
    });

    setBookingSuccess(true);
    toast.success("Booking confirmed!");

  } catch (err) {
    console.error(err);
    toast.error(err.message || "Booking failed");
  } finally {
    setIsPaying(false);
  }
};
  
  
    // -------- SUCCESS SCREEN --------
  if (bookingSuccess && bookingInfo) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-900 p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            Booking Successful
          </h2>

          {/* ✅ YOUR BLOCK */}
          <div className="text-left bg-slate-800/50 rounded-lg p-4 space-y-3 mb-4">
            <h4 className="text-white font-semibold text-sm mb-2">
              Booking Information
            </h4>

            <p className="text-slate-400 text-sm">
              Name: <span className="text-white">{bookingInfo.name}</span>
            </p>

            <p className="text-slate-400 text-sm">
              Hotel: <span className="text-white">{bookingInfo.hotel}</span>
            </p>

            <p className="text-slate-400 text-sm">
              Room:{" "}
              <span className="text-white capitalize">
                {bookingInfo.roomType}
              </span>
            </p>

            <p className="text-slate-400 text-sm">
              Guests: <span className="text-white">{bookingInfo.guests}</span>
            </p>

            <p className="text-slate-400 text-sm">
              Check-in:{" "}
              <span className="text-white">
                {format(bookingInfo.checkIn, "yyyy/MM/dd")}
              </span>
            </p>

            <p className="text-slate-400 text-sm">
              Check-out:{" "}
              <span className="text-white">
                {format(bookingInfo.checkOut, "yyyy/MM/dd")}
              </span>
            </p>

            <div className="h-px bg-slate-700 my-2" />

            <p className="text-slate-400 text-sm">
              Total Paid:{" "}
              <span className="text-emerald-400 font-semibold">
                ${bookingInfo.totalPaid}
              </span>
            </p>

            <span className="text-white">
              Check your mail to see your booking information! Thanks.
            </span>
          </div>

          <Button
            className="w-full bg-amber-500"
            onClick={() => navigate("/booking")}
          >
            Back to Booking
          </Button>
        </Card>
      </div>
    );
  }

  if (!hotel) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Back */}
        <Button onClick={() => navigate("/booking")}>← Back</Button>

        {/* Hotel Info */}
        <Card className="p-6 bg-slate-900">
          <img
            src={hotel.imageUrl}
            className="w-full h-64 object-cover rounded-lg cursor-pointer"
            onClick={() => setGalleryOpen(true)}
          />
          <h2 className="text-2xl font-bold mt-4 text-white">{hotel.name}</h2>
          <p className="text-white/90 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {hotel.location}
          </p>
          <div className="flex mt-2">
            {[...Array(hotel.star_rating || 4)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
        </Card>

        {/* Booking Form + Payment */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Booking Form */}
          <Card className="p-6 bg-slate-900 space-y-4">
            <h3 className="text-white font-semibold mb-2">Stay Information</h3>

            <label className="text-white/80">Check-in Date</label>
            <input
              type="date"
              min={today}
              onChange={(e) => setCheckIn(new Date(e.target.value))}
              className="bg-slate-800 p-2 w-full text-white"
            />

            <label className="text-white/80 mt-2">Check-out Date</label>
            <input
              type="date"
              min={today}
              onChange={(e) => setCheckOut(new Date(e.target.value))}
              className="bg-slate-800 p-2 w-full text-white"
            />

            <label className="text-white/80 mt-2">Room Type</label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger className="bg-slate-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white">
                <SelectItem value="standard">Standard - $0.5/night</SelectItem>
                <SelectItem value="deluxe">Deluxe - $1/night</SelectItem>
                <SelectItem value="executive">Executive - $1.5/night</SelectItem>
                <SelectItem value="suite">Suite - $2/night</SelectItem>
              </SelectContent>
            </Select>

            <label className="text-white/80 mt-2">Guests</label>
            <Select value={guests.toString()} onValueChange={(v) => setGuests(Number(v))}>
              <SelectTrigger className="bg-slate-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 text-white">
                {[1, 2, 3, 4].map((n) => (
                  <SelectItem key={n} value={n.toString()}>{n} person</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Payment Method */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <p className="text-sm text-slate-400 mb-1">
              Payment Currency
            </p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold text-lg">
                  {hotel?.stablecoin?.symbol || "USDC"}
                </p>

                <p className="text-xs text-slate-500">
                  Accepted payment token for this hotel
                </p>
              </div>

              <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                Stablecoin
              </div>
            </div>
          </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6 bg-slate-900/90 backdrop-blur-md">
            <h3 className="text-white font-semibold mb-2">Order Summary</h3>

            {checkIn && checkOut ? (
              <>
                <p className="text-white/80 text-sm">
                  {format(checkIn, "yyyy/MM/dd")} → {format(checkOut, "yyyy/MM/dd")}
                </p>

                <div className="flex justify-between mt-2 text-white">
                  <span>{roomType} x {nights} nights</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between mt-1 text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {paymentMethod === "dra_token" ? "DRA Payment Discount" : ""}
                    </span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="h-px bg-slate-700 my-2" />
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-amber-400 text-xl">${totalPrice.toFixed(2)}</span>
                </div>

                 

                <Button
                  className="w-full mt-4 bg-amber-500"
                  onClick={handleBookingPayment}
                  disabled={!walletReady || isPaying}
                >
                  <CreditCard className="mr-2" />
                  {isPaying ? "Processing..." : "Confirm Booking"}
                </Button>
              </>
            ) : (
              <p className="text-slate-400 text-sm">Select dates to continue</p>
            )}
          </Card>
        </div>

        {/* Image Modal */}
        {isGalleryOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
            <img src={hotel.imageUrl} className="max-h-[90vh]" />
            <Button
              className="absolute top-4 right-4"
              onClick={() => setGalleryOpen(false)}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}