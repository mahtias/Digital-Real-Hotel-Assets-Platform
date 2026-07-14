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
import { MapPin, Star, CreditCard, Tag, CheckCircle, Zap, X } from "lucide-react";

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
  const [payWith, setPayWith] = useState("usdc"); // "usdc" | "x402"
  const [x402Modal, setX402Modal] = useState(null); // holds 402 response data
  const [isX402Loading, setIsX402Loading] = useState(false);
  const [x402Error, setX402Error] = useState(null); // error message shown inside modal
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
  
  
  // -------- x402 STEP 1: get 402 payment requirements --------
  const handleX402Payment = async () => {
    if (!checkIn || !checkOut) { toast.error("Select dates first"); return; }
    if (!user) { toast.error("Please login first"); return; }
    setIsX402Loading(true);
    setX402Modal(null);
    setX402Error(null);
    try {
      const token = localStorage.getItem("authToken") || "";
      const res = await fetch(`${API_URL}/api/v1/bookings/x402?pay=x402`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelAssetId: hotelId,
          checkInDate: checkIn.toISOString(),
          checkOutDate: checkOut.toISOString(),
          totalPrice: totalPrice,
          roomType,
          guests,
        }),
      });
      const data = await res.json();
      if (res.status === 402) {
        setX402Modal(data);
      } else if (res.ok) {
        toast.success("Booking confirmed via x402!");
        setBookingSuccess(true);
      } else {
        toast.error(data.message || "x402 request failed");
      }
    } catch (err) {
      toast.error("x402 request failed: " + err.message);
    } finally {
      setIsX402Loading(false);
    }
  };

  // -------- x402 STEP 2: sign EIP-712 and retry with X-PAYMENT header --------
  const handleX402Pay = async () => {
    if (!signer || !address) { toast.error("Connect your wallet first"); return; }
    if (!x402Modal?.accepts?.[0]) return;

    const req = x402Modal.accepts[0];
    setIsX402Loading(true);

    try {
      const amountRaw = BigInt(req.maxAmountRequired);
      const validBefore = BigInt(Math.floor(Date.now() / 1000) + (req.maxTimeoutSeconds || 300));
      const nonce = ethers.hexlify(ethers.randomBytes(32));

      // EIP-712 domain for USDC on Base Sepolia — name is "USDC" (not "USD Coin") on this chain
      const domain = {
        name: "USDC",
        version: "2",
        chainId: 84532,
        verifyingContract: req.asset,
      };

      const types = {
        TransferWithAuthorization: [
          { name: "from", type: "address" },
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "validAfter", type: "uint256" },
          { name: "validBefore", type: "uint256" },
          { name: "nonce", type: "bytes32" },
        ],
      };

      const message = {
        from: address,
        to: req.payTo,
        value: amountRaw,
        validAfter: BigInt(0),
        validBefore,
        nonce,
      };

      console.log("[x402] address from wagmi:", address);
      console.log("[x402] payTo:", req.payTo);
      console.log("[x402] amount (raw):", amountRaw.toString());
      console.log("[x402] nonce:", nonce);
      toast.info("Sign the payment authorization in your wallet...");

      // Use wagmi walletClient.signTypedData directly — more reliable with Coinbase Wallet
      // than going through ethers BrowserProvider wrapper
      const signature = await walletClient.signTypedData({
        account: address,
        domain,
        types,
        primaryType: "TransferWithAuthorization",
        message,
      });

      // Build X-PAYMENT payload (base64 JSON)
      const paymentPayload = {
        x402Version: 1,
        scheme: "exact",
        network: req.network,
        payload: {
          signature,
          authorization: {
            from: address,
            to: req.payTo,
            value: amountRaw.toString(),
            validAfter: "0",
            validBefore: validBefore.toString(),
            nonce,
          },
        },
      };

      const xPaymentHeader = btoa(JSON.stringify(paymentPayload));
      toast.info("Verifying payment with facilitator...");

      const token = localStorage.getItem("authToken") || "";
      const retryRes = await fetch(`${API_URL}/api/v1/bookings/x402?pay=x402`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-PAYMENT": xPaymentHeader,
        },
        body: JSON.stringify({
          hotelAssetId: hotelId,
          checkInDate: checkIn.toISOString(),
          checkOutDate: checkOut.toISOString(),
          totalPrice,
          roomType,
          guests,
        }),
      });

      if (retryRes.ok) {
        setX402Modal(null);
        setX402Error(null);
        setBookingInfo({
          name: user?.name || user?.email || "Guest",
          hotel: hotel?.name,
          roomType,
          guests,
          checkIn,
          checkOut,
          totalPaid: (Number(amountRaw) / 1_000_000).toFixed(2),
        });
        setBookingSuccess(true);
        toast.success("Booking confirmed via x402!");
      } else {
        const errData = await retryRes.json().catch(() => ({}));
        const reason = errData.error || errData.message || "Payment verification failed";
        setX402Error(reason);
      }
    } catch (err) {
      if (err.code === 4001 || err.message?.includes("rejected") || err.message?.includes("denied")) {
        setX402Error("Payment was rejected in your wallet. Click below to try again.");
      } else {
        console.error("x402 pay error:", err);
        setX402Error("x402 payment failed: " + (err.shortMessage || err.message || "Unknown error"));
      }
    } finally {
      setIsX402Loading(false);
    }
  };

    // -------- SUCCESS SCREEN --------
  if (bookingSuccess && bookingInfo) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-900 p-5 sm:p-8 w-full max-w-md text-center">
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
    <div className="min-h-screen bg-slate-950 p-3 sm:p-6 text-white">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">

        {/* Back */}
        <Button onClick={() => navigate("/booking")}>← Back</Button>

        {/* Hotel Info */}
        <Card className="p-4 sm:p-6 bg-slate-900">
          <img
            src={hotel.imageUrl}
            className="w-full h-48 sm:h-64 object-cover rounded-lg cursor-pointer"
            onClick={() => setGalleryOpen(true)}
          />
          <h2 className="text-xl sm:text-2xl font-bold mt-4 text-white">{hotel.name}</h2>
          <p className="text-white/90 flex items-center gap-2 text-sm sm:text-base">
            <MapPin className="w-4 h-4 shrink-0" /> {hotel.location}
          </p>
          <div className="flex mt-2">
            {[...Array(hotel.star_rating || 4)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
          </div>
        </Card>

        {/* Booking Form + Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

          {/* Booking Form */}
          <Card className="p-4 sm:p-6 bg-slate-900 space-y-4">
            <h3 className="text-white font-semibold mb-2">Stay Information</h3>

            <label className="text-white/80 text-sm">Check-in Date</label>
            <input
              type="date"
              min={today}
              onChange={(e) => setCheckIn(new Date(e.target.value))}
              className="bg-slate-800 p-2 w-full text-white rounded-lg text-sm"
            />

            <label className="text-white/80 mt-2 text-sm">Check-out Date</label>
            <input
              type="date"
              min={today}
              onChange={(e) => setCheckOut(new Date(e.target.value))}
              className="bg-slate-800 p-2 w-full text-white rounded-lg text-sm"
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
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Payment Method</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayWith("usdc")}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    payWith === "usdc"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <CreditCard className="w-4 h-4 mb-1" />
                  <div>{hotel?.stablecoin?.symbol || "USDC"}</div>
                  <div className="text-xs opacity-70">Direct wallet</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPayWith("x402")}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                    payWith === "x402"
                      ? "bg-violet-500/20 border-violet-500 text-violet-400"
                      : "bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <Zap className="w-4 h-4 mb-1" />
                  <div>x402 Protocol</div>
                  <div className="text-xs opacity-70">HTTP-native pay</div>
                </button>
              </div>
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md">
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

                 

                {payWith === "usdc" ? (
                  <Button
                    className="w-full mt-4 bg-amber-500 hover:bg-amber-600"
                    onClick={handleBookingPayment}
                    disabled={!walletReady || isPaying}
                  >
                    <CreditCard className="mr-2 w-4 h-4" />
                    {isPaying ? "Processing..." : "Confirm Booking (USDC)"}
                  </Button>
                ) : (
                  <Button
                    className="w-full mt-4 bg-violet-600 hover:bg-violet-700"
                    onClick={handleX402Payment}
                    disabled={isX402Loading}
                  >
                    <Zap className="mr-2 w-4 h-4" />
                    {isX402Loading ? "Requesting..." : "Pay with x402 Protocol"}
                  </Button>
                )}
              </>
            ) : (
              <p className="text-slate-400 text-sm">Select dates to continue</p>
            )}
          </Card>
        </div>

        {/* Image Modal */}
        {isGalleryOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40">
            <img src={hotel.imageUrl} className="max-h-[90vh]" />
            <Button className="absolute top-4 right-4" onClick={() => setGalleryOpen(false)}>
              Close
            </Button>
          </div>
        )}

        {/* x402 Payment Details Modal */}
        {x402Modal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-violet-500/40 rounded-2xl p-6 max-w-md w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-violet-400" />
                  <h3 className="text-white font-bold text-lg">x402 Payment Required</h3>
                </div>
                <button onClick={() => setX402Modal(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 space-y-3">
                {x402Modal.accepts?.[0] && (() => {
                  const req = x402Modal.accepts[0];
                  const amountUSDC = (Number(req.maxAmountRequired) / 1_000_000).toFixed(2);
                  return (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Amount Due</span>
                        <span className="text-white font-bold text-base">${amountUSDC} USDC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Network</span>
                        <span className="text-violet-300 font-medium">{req.network}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Pay To</span>
                        <p className="text-white font-mono text-xs mt-1 break-all bg-slate-800 rounded p-2">
                          {req.payTo}
                        </p>
                      </div>
                      <div className="text-sm">
                        <span className="text-slate-400">Token (USDC)</span>
                        <p className="text-white font-mono text-xs mt-1 break-all bg-slate-800 rounded p-2">
                          {req.asset}
                        </p>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Expires in</span>
                        <span className="text-amber-400">{req.maxTimeoutSeconds}s</span>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="bg-slate-800/50 rounded-xl p-3 text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">How x402 works:</p>
                <p>1. Sign a payment authorization in your wallet (no gas needed)</p>
                <p>2. The <code className="text-violet-300">X-PAYMENT</code> proof is sent with your booking request</p>
                <p>3. Coinbase facilitator verifies and settles on-chain automatically</p>
              </div>

              {x402Error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <p className="text-red-400 text-sm font-medium mb-1">Payment failed</p>
                  <p className="text-red-300 text-xs">{x402Error}</p>
                </div>
              )}

              <Button
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                onClick={() => { setX402Error(null); handleX402Pay(); }}
                disabled={isX402Loading || !signer}
              >
                <Zap className="w-4 h-4 mr-2" />
                {isX402Loading
                  ? "Processing..."
                  : !signer
                  ? "Connect wallet to pay"
                  : x402Error
                  ? "Try Again — Sign with Wallet"
                  : "Pay Now — Sign with Wallet"}
              </Button>

              <p className="text-center text-xs text-violet-400 font-medium">
                 x402 Protocol Active — HTTP 402 response confirmed
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}