// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useAccount, useWalletClient  } from "wagmi";
import { ethers } from "ethers";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { web3Service } from '@/services/web3Service';
import { CalendarIcon, MapPin, Star, Users, CreditCard, CheckCircle, Gift, Tag } from "lucide-react";
import { format, differenceInDays } from 'date-fns';
import { useLanguage } from '@/components/common/LanguageContext';
import { useAuth } from "@/context/AuthContext";



const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default function Booking() {
  const urlParams = new URLSearchParams(window.location.search);
  const preselectedHotelId = urlParams.get('hotel_id');
  const { t } = useLanguage();
 const { authFetch, user } = useAuth();
  //const [user, setUser] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(preselectedHotelId || '');
  const [checkIn, setCheckIn] = useState();
  const [checkOut, setCheckOut] = useState();
  const [roomType, setRoomType] = useState('standard');
  const [guests, setGuests] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('usdc');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
 const { address, isConnected } = useAccount();
 const { data: walletClient } = useWalletClient();
 const navigate = useNavigate();
 const kycStatus = user?.kycStatus; 
const [signer, setSigner] = useState(null);

const isWalletReady = isConnected && address && signer;


const [walletReady, setWalletReady] = useState(false);

useEffect(() => {
  const setupSigner = async () => {
    if (!walletClient || !user) return;

    const provider = new ethers.BrowserProvider(walletClient.transport);
    const signerInstance = await provider.getSigner();
    const signerAddress = await signerInstance.getAddress();

    console.log("Signer (wagmi):", signerAddress);
    console.log("Wagmi address:", address);
    console.log("User DB wallet:", user.walletAddress);

    setSigner(signerInstance);
    web3Service.setSigner(signerInstance);
    setWalletReady(true); // <-- now wallet is ready
  };

  setupSigner();
}, [walletClient, address, user]);

console.log("DEBUG:", {
  user,
  isConnected,
  address,
  walletClient,
  signer
});
// hotels
const { data: hotels = [] } = useQuery({
  queryKey: ["booking-hotels"],
  queryFn: async () => {
    const res = await fetch(`${API_URL}/api/v1/hotels`);
    if (!res.ok) throw new Error("Failed to fetch hotels");

    const data = await res.json();

    return Array.isArray(data)
      ? data
      : data.hotels || [];   // safety fallback
  }
});

// investments
const { data: investments = [] } = useQuery({
  queryKey: ["user-investments", user?.email],
  enabled: !!user,
  queryFn: async () => {
    const res = await authFetch(`${API_URL}/api/v1/investments`);

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : data.investments || [];
  }
});

  const hotel = hotels.find(h => String(h.id) === String(selectedHotel));
  const userHasTokens = investments.some(inv => inv.hotel_asset_id === selectedHotel && inv.token_amount > 0);
  
  const roomPrices = { standard: 120, deluxe: 180, suite: 320 };
  
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const basePrice = nights * roomPrices[roomType];
  const discount = userHasTokens ? basePrice * 0.15 : (paymentMethod === 'dra_token' ? basePrice * 0.05 : 0);
  const totalPrice = basePrice - discount;

const [isPaying, setIsPaying] = useState(false);

const handleBookingPayment = async () => {
  if (!user) return;

  if (!isConnected || !address) {
    toast.error("Wallet not connected.");
    return;
  }

  // Enforce registered wallet
  if (address.toLowerCase() !== user.walletAddress.toLowerCase()) {
    toast.error(
      `Connected wallet does not match your registered wallet! Please connect: ${user.walletAddress}`
    );
    return;
  }

  setIsPaying(true);

  try {
    // 1️⃣ Create booking (PENDING)
    const createPayload = {
      userId: user.id,
      hotelAssetId: selectedHotel,
      checkInDate: checkIn.toISOString(),
      checkOutDate: checkOut.toISOString(),
      totalPrice: totalPrice,
      roomType,
      guests,
      paymentMethod,
      discountApplied: discount,
    };

    const createRes = await authFetch(`${API_URL}/api/v1/bookings`, {
      method: "POST",
      body: JSON.stringify(createPayload),
    });

    if (!createRes.ok) {
      const error = await createRes.text();
      throw new Error("Booking creation failed: " + error);
    }

    const bookingData = await createRes.json();
    const bookingId = bookingData.data.id;
    const bookingCode = bookingData.data.bookingCode;

    // 2️⃣ Send USDC payment
    // 🔹 Use 1 USDC in local/test environments to avoid balance issues
    const paymentAmount =
      import.meta.env.VITE_NODE_ENV === "development" ? 1 : totalPrice;

    console.log(
      `Paying USDC for booking ${bookingId} | Amount: ${paymentAmount} ${
        import.meta.env.VITE_NODE_ENV === "development" ? "(Dev Test)" : "(Prod Full Price)"
      }`
    );

    const receipt = await web3Service.payBookingUSDC(
      bookingId,
      paymentAmount,
      import.meta.env.VITE_TREASURY_ADDRESS,
      user.walletAddress
    );

    toast.success("Payment successful! Booking confirmed.");
    setBookingCode(bookingCode);
    setBookingSuccess(true);
  } catch (err) {
    console.error("Booking payment error:", err);
    toast.error(err?.message || "Booking failed");
  } finally {
    setIsPaying(false);
  }
};

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        < Card className="bg-slate-900/80 border-slate-800 p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle 

            className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">{t('booking.bookingSuccess')}</h2>
          <p className="text-slate-400 mb-6">{t('booking.confirmationCode')}</p>
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <p className="text-3xl font-mono font-bold text-amber-400">{bookingCode}</p>
          </div>
          <div className="text-left bg-slate-800/50 rounded-lg p-4 space-y-2 mb-6">
            <p className="text-slate-400 text-sm">{t('booking.hotel')}: <span className="text-white">{hotel?.name}</span></p>
            <p className="text-slate-400 text-sm">{t('booking.checkIn')}: <span className="text-white">{

            format(checkIn, 'yyyy/MM/dd')}</span></p>
            <p className="text-slate-400 text-sm">{t('booking.checkOut')}: <span className="text-white">{

            format(checkOut, 'yyyy/MM/dd')}</span></p>
            <p className="text-slate-400 text-sm">{t('booking.total')}: <span className="text-emerald-400 font-semibold">${totalPrice.toFixed(2)}</span></p>
          </div>
          <Button 
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900"
            onClick={() => { setBookingSuccess(false); setCheckIn(null); setCheckOut(null); }}
          >
            {t('booking.continueBooking')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('booking.title')}</h1>
          <p className="text-slate-400">{t('booking.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
           <Card className="bg-slate-900/50 border-slate-800 p-6">
  <h3 className="text-white font-semibold mb-4">{t('booking.selectHotel')}</h3>

  <Select value={String(selectedHotel)} onValueChange={(val) => setSelectedHotel(val)}>
    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
      <SelectValue placeholder={t('booking.selectHotelPlaceholder')} />
    </SelectTrigger>
    <SelectContent className="bg-slate-800 border-slate-700">
      {hotels.map((h) => (
        <SelectItem key={h.id} value={String(h.id)}>
          <div className="flex items-center gap-2">
            <span>{h.name}</span>
            <span className="text-slate-400 text-sm">- {h.location}</span>
          </div>
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  {hotel && (
    <div key={hotel.id} className="mt-4 p-4 bg-slate-800/50 rounded-lg flex items-center gap-4">
          <img
        src={
          hotel.imageUrl ||
          `https://source.unsplash.com/200x200/?luxury-hotel,${hotel.id}`
        }
        alt={hotel.name}
        className="w-20 h-20 rounded-lg object-cover"
      />
      <div>
        <h4 className="text-white font-semibold">{hotel.name}</h4>
        <p className="text-slate-400 text-sm flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {hotel.location}, {hotel.country}
        </p>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(hotel.star_rating || 4)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
      </div>
      {userHasTokens && (
        <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Gift className="w-3 h-3 mr-1" />
          {t('booking.holderExclusive')}
        </Badge>
      )}
    </div>
  )}
</Card>

            < Card className="bg-slate-900/50 border-slate-800 p-6">
              <h3 className="text-white font-semibold mb-4">{t('booking.stayInfo')}</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-slate-400 mb-2 block">{t('booking.checkIn')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      < Button variant="outline" className="w-full justify-start bg-slate-800 border-slate-700 text-white">
                        <CalendarIcon 

                        className="mr-2 h-4 w-4" />
                        {checkIn ? 

                        format(checkIn, 'yyyy/MM/dd') : t('booking.selectDate')}
                      </Button>
                    </PopoverTrigger>
                    < PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                     <Calendar className="calendar" mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(date) => date < new Date()}/>
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  < Label className="text-slate-400 mb-2 block">{t('booking.checkOut')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <  Button variant="outline" className="w-full justify-start bg-slate-800 border-slate-700 text-white">
                        <CalendarIcon 

                        className="mr-2 h-4 w-4" />
                        {checkOut ? 

                        format(checkOut, 'yyyy/MM/dd') : t('booking.selectDate')}
                      </Button>
                    </PopoverTrigger>
                    <  PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                      <Calendar className="calendar" mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(date) => date <= (checkIn || new Date())}/>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  < Label className="text-slate-400 mb-2 block">{t('booking.roomType')}</Label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    < SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    < SelectContent className="bg-slate-800 border-slate-700">
                      < SelectItem value="standard">{t('booking.standard')} - $120{t('booking.perNight')}</SelectItem>
                      < SelectItem value="deluxe">{t('booking.deluxe')} - $180{t('booking.perNight')}</SelectItem>
                      < SelectItem value="suite">{t('booking.suite')} - $320{t('booking.perNight')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  < Label className="text-slate-400 mb-2 block">{t('booking.guests')}</Label>
                  <Select value={guests.toString()} onValueChange={(v) => setGuests(Number(v))}>
                    < SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <Users 

                      className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <   SelectContent className="bg-slate-800 border-slate-700">
                      {[1, 2, 3, 4].map((n) => (
                        <  SelectItem key={n} value={n.toString()}>{n} {t('booking.person')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            < Card className="bg-slate-900/50 border-slate-800 p-6">
              <h3 className="text-white font-semibold mb-4">{t('booking.paymentMethod')}</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { value: 'usdc', label: 'USDC', desc: t('booking.stablecoin') },
                  { value: 'hat_token', label: 'HAT', desc: t('booking.hotelToken') },
                  { value: 'dra_token', label: 'DRA', desc: t('booking.draDiscount') },
                ].map((method) => (
                  <div
                    key={method.value}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === method.value 
                        ? 'bg-amber-500/10 border-amber-500' 
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                    }`}
                    onClick={() => setPaymentMethod(method.value)}
                  >
                    <p className="text-white font-semibold">{method.label}</p>
                    <p className="text-slate-400 text-xs">{method.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Summary */}
          <div>
            < Card className="bg-slate-900/80 border-slate-800 p-6 sticky top-4">
              <h3 className="text-white font-semibold mb-4">{t('booking.orderSummary')}</h3>
              
              {hotel && checkIn && checkOut ? (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">
                        {roomType === 'standard' ? t('booking.standard') : roomType === 'deluxe' ? t('booking.deluxe') : t('booking.suite')} x {nights} {t('booking.nights')}
                      </span>
                      <span className="text-white">${basePrice.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-400 flex items-center gap-1">
                          <Tag 

                          className="w-3 h-3" />
                          {userHasTokens ? t('booking.tokenHolderDiscount') : t('booking.draPaymentDiscount')}
                        </span>
                        <span className="text-emerald-400">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="h-px bg-slate-700" />
                    <div className="flex justify-between">
                      <span className="text-white font-semibold">{t('booking.total')}</span>
                      <span className="text-2xl font-bold text-amber-400">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

               {!isConnected ? (
  <Button
    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
    onClick={() =>
      toast.error("Connect your wallet before confirming your booking")
    }
  >
    Connect Wallet Before Booking
  </Button>
) : (
  
 <Button
  className="w-full bg-gradient-to-r from-amber-500 to-amber-600
             hover:from-amber-600 hover:to-amber-700
             text-slate-900 font-semibold"
  onClick={handleBookingPayment}
  disabled={!user || !isConnected || !walletReady || isPaying}
>
  <CreditCard className="w-4 h-4 mr-2" />
  {isPaying
    ? t("hotelDetail.processing")
    : !walletReady
    ? "Initializing Wallet..."
    : t("booking.confirmBooking")}
</Button>
)}
                </>
              ) : (
                <p className="text-slate-400 text-sm text-center py-4">
                  {t('booking.selectHotelAndDates')}
                </p>
              )}

              {userHasTokens && (
                <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                  <p className="text-emerald-400 text-sm flex items-center gap-2">
                    <Gift 

                    className="w-4 h-4" />
                    {t('booking.tokenHolderPerk')}
                  </p>
                </div>
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}