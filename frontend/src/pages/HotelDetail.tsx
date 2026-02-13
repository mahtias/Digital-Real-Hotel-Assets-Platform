// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Star, MapPin, Leaf, TrendingUp, Calendar, Home, Users, Shield, FileText, ArrowLeft, Wallet, CheckCircle, DollarSign, ExternalLink } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from '@/components/common/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; 

export default function HotelDetail() {
  // 1. URL + Navigation
  const [searchParams] = useSearchParams();
  const hotelId = searchParams.get('id') || '692bf7e5e51d3a2d1ee44f6b';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  // 2. Wallet + Auth
  const { isConnected, address } = useAccount();
  const { user, authFetch, refreshUser } = useAuth();

  // 3. STATES
  const [investAmount, setInvestAmount] = useState(100);
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const [showKycDialog, setShowKycDialog] = useState(false);
  const [investSuccess, setInvestSuccess] = useState(false);
  const [txHash, setTxHash] = useState(null);

  //  HOTEL STATE
  const [hotel, setHotel] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(null);

  //  HOTEL FETCH
  useEffect(() => {
    if (!hotelId) return;

    console.log('🔍 Loading hotel:', hotelId);
    setHotelLoading(true);
    setHotelError(null);

    fetch(`${API_URL}/api/v1/hotel-assets/${hotelId}`)
      .then(res => {
        console.log('📡 Response:', res.status);
        if (!res.ok) throw new Error(`Hotel not found: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('✅ Hotel loaded:', data.id, data.name);

        // ✅ Image fix
        if (data.imageUrl) {
          data.imageUrl = data.imageUrl.startsWith('http') 
            ? data.imageUrl 
            : `${API_URL}${data.imageUrl}`;
          data.image = data.imageUrl;
        } else {
          data.image = '/hotel-placeholder.jpg';
        }

        setHotel(data);
      })
      .catch(err => {
        console.error(' Hotel error:', err);
        setHotelError(err.message);
        toast.error('Failed to load hotel');
      })
      .finally(() => setHotelLoading(false));
  }, [hotelId]);

  // 5. KYC Status
  const normalizedKyc = user?.kycStatus?.toUpperCase();
  const isKycApproved = normalizedKyc === "APPROVED";
  const isLoggedIn = !!user;

  // 6. CALCULATIONS
  const tokensToBuy = hotel ? ((investAmount / (hotel.tokenPrice || 0.001)) * 1000).toFixed(0) : 0;
const soldPercentage = hotel ? Math.min( (hotel.tokensSold ?? 0) / (hotel.totalTokens ?? 1) * 100,  100): 0;

  //   FIXED INVEST MUTATION
 const investMutation = useMutation({
  mutationFn: async () => {
    // 🔥 ADD tokenAmount calc
    const tokensToBuy = Math.floor(investAmount / hotel.tokenPrice);
    
    console.log(' INVEST DATA:', { 
      hotelId: hotel.id,
      amount: investAmount, 
      walletAddress: address,
      userId: user?.id,
      tokenAmount: tokensToBuy  // 🔥 NEW!
    });

    if (!hotel?.id) throw new Error('Hotel ID missing');
    if (!isConnected || !address) throw new Error('Connect wallet first');
    if (!isKycApproved) throw new Error('KYC required');

    // 🔥 ADD tokenAmount to body
    const backendRes = await authFetch(`${API_URL}/api/v1/investments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        hotelId: hotel.id,
        amount: investAmount,
        walletAddress: address,
        tokenAmount: tokensToBuy  // 🔥 ADD THIS LINE!
      })
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      throw new Error(`Investment failed: ${errorText}`);
    }

    const responseData = await backendRes.json();
    console.log('✅ Backend response:', responseData);
    return responseData;
  },
  onSuccess: (data) => {
    console.log('🎉 INVESTMENT SUCCESS:', data);
    toast.success(data.message || `Invested $${investAmount}!`);
    setInvestSuccess(true);
    setShowInvestDialog(false);
    
    // 🔥 ADD THESE 2 LINES:
    queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    queryClient.invalidateQueries({ queryKey: ['investments', user?.email] });
    
    refreshUser();
  },
  onError: (error) => {
    console.error('❌ Investment error:', error);
    toast.error(error.message || 'Investment failed');
  }
});

  

  // 7. Event handlers
  const handleInvestClick = useCallback(() => {
    if (!isLoggedIn) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    if (!isKycApproved) {
      setShowKycDialog(true);
      return;
    }
    if (!isConnected) {
      toast.error('Connect your wallet');
      return;
    }
    setShowInvestDialog(true);
  }, [isLoggedIn, isKycApproved, isConnected, navigate]);

  // 8. LOADING / ERROR STATES
  if (hotelLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin mx-auto mb-8"></div>
          <h1 className="text-2xl font-bold text-slate-300 mb-2">Loading Hotel...</h1>
          <p className="text-slate-500">Fetching property details</p>
        </div>
      </div>
    );
  }

  if (hotelError || !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Home className="w-10 h-10 text-slate-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-200 mb-4">Hotel Not Found</h1>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
            The hotel you're looking for doesn't exist or is not available.
          </p>
          {/* ✅ BACK BUTTON */}
          <div className="space-y-3">
            <Link 
              to="/hotels" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-2xl shadow-xl shadow-emerald-500/25 transition-all w-full justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
              Browse Hotels
            </Link>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="w-full border-slate-400 hover:bg-slate-800 text-slate-300"
            >
              ← Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 9. MAIN UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* ✅ BACK BUTTON - TOP */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-8 text-slate-300 hover:bg-slate-800/50 hover:text-white border-slate-600 w-fit h-12 px-6 rounded-2xl backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Hotels
        </Button>

        {/* HERO SECTION */}
        <div className="relative bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl p-8 lg:p-12 mb-12 shadow-2xl border border-slate-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-3xl" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                  4.2 Stars
                </Badge>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-6 leading-tight">
                {hotel.name}
              </h1>
              <div className="flex items-center gap-2 mb-6 text-slate-300">
                <MapPin className="w-6 h-6" />
                <span>{hotel.location}, {hotel.country}</span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {hotel.apy || 0}% APY
                </Badge>
                <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">
                  <Users className="w-4 h-4 mr-1" />
                  {hotel.occupancyRate || 0}% Occupancy
                </Badge>
                <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
                  <Leaf className="w-4 h-4 mr-1" />
                  ESG {hotel.esgScore || 0}
                </Badge>
              </div>
            </div>
            <div className="relative">
              <img 
                src={hotel.image} 
                alt={hotel.name}
                className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl border-4 border-slate-700/50"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-2xl border-4 border-slate-900 flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* STATS + INVEST */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* STATS */}
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 shadow-2xl hover:shadow-emerald-500/10 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-black text-slate-200">
                 Investment Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
               <div className="flex justify-between text-slate-400">
                <span>{hotel.tokenSymbol || 'HAT'} Tokens</span>
                <span>{(hotel.tokensSold ?? 0).toLocaleString()} / {(hotel.totalTokens ?? 0).toLocaleString()}</span>
              </div>
                <div className="flex justify-between text-slate-400">
                  <span>Invested</span>
                  <span>${hotel.totalInvestment?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Token Price</span>
                  <span>${(hotel.tokenPrice || 0.001).toFixed(3)}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
                    style={{ width: `${soldPercentage}%` }}
                  />
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-400">
                    {soldPercentage.toFixed(0)}% Funded
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* INVEST CARD */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border-emerald-500/30 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all group">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
                Invest Now
              </CardTitle>
              <p className="text-slate-400 text-lg">Own a piece of {hotel.name}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Slider */}
              <div className="space-y-3">
                <label className="flex justify-between text-sm font-medium text-slate-300">
                  <span>Investment Amount</span>
                  <span>${investAmount}</span>
                </label>
                <Input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  className="h-3 bg-slate-700 w-full"
                />
              </div>

              {/* Tokens Preview */}
              <div className="text-center p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                <div className="text-3xl font-black text-emerald-400 mb-1">
                  {tokensToBuy} HAT
                </div>
                <div className="text-sm text-slate-500">Tokens you'll receive</div>
              </div>

              {/* MAIN BUTTON */}
              {isKycApproved && isConnected ? (
                <Dialog open={showInvestDialog} onOpenChange={setShowInvestDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full h-16 text-2xl font-black bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-2xl shadow-emerald-500/25 text-white tracking-wide"
                      disabled={investMutation.isPending}
                    >
                       Invest ${investAmount}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50 max-w-md">
                    <DialogHeader className="text-center">
                      <DialogTitle className="text-2xl">Confirm Investment</DialogTitle>
                      <DialogDescription className="text-slate-400">
                        Pay ${investAmount} to receive {tokensToBuy} HAT tokens
                      </DialogDescription>
                    </DialogHeader>
                    <Button
                      className="w-full h-14 font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 mt-4"
                      onClick={() => investMutation.mutate()}
                      disabled={investMutation.isPending}
                    >
                      {investMutation.isPending ? '⏳ Creating Investment...' : '✅ Confirm & Invest'}
                    </Button>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button 
                  onClick={handleInvestClick}
                  className="w-full h-16 text-2xl font-black bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 shadow-xl text-white tracking-wide disabled:opacity-50"
                  disabled={!isConnected || investMutation.isPending}
                >
                  {isKycApproved ? ' Connect Wallet' : 'Complete KYC'}
                </Button>
              )}

              {/* KYC Dialog */}
              <Dialog open={showKycDialog} onOpenChange={setShowKycDialog}>
                <DialogTrigger asChild />
                <DialogContent className="bg-slate-900/95 backdrop-blur-xl border-slate-700/50">
                  <DialogHeader className="text-center">
                    <DialogTitle>KYC Verification Required</DialogTitle>
                    <DialogDescription>
                      Complete KYC to unlock hotel investments
                    </DialogDescription>
                  </DialogHeader>
                  <div className="pt-4">
                    <Link 
                      to="/kyc/submit" target="_blank" rel="noopener noreferrer"
                      className="w-full block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25"
                    >
                      Start KYC Now <ExternalLink className="w-5 h-5" />
                    </Link>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* DESCRIPTION */}
        {hotel.description && (
          <Card className="mt-12 bg-slate-900/30 backdrop-blur-xl border-slate-700/30">
            <CardHeader>
              <CardTitle className="text-2xl font-black text-slate-200 flex items-center gap-2">
                 About {hotel.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
                {hotel.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
