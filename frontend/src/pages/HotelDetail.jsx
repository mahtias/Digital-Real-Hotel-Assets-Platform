// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Star, MapPin, Leaf, TrendingUp, Calendar, Home, Users, Shield, FileText, ArrowLeft, Plus, Minus, Wallet, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from 'date-fns';
import { useLanguage } from '@/components/common/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; 
export default function HotelDetail() {
  
  const urlParams = new URLSearchParams(window.location.search);
  const hotelId = urlParams.get('id');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const [user, setUser] = useState(null);
  const [investAmount, setInvestAmount] = useState(100);
  const [showInvestDialog, setShowInvestDialog] = useState(false);
  const [investSuccess, setInvestSuccess] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

const { data: hotel, isLoading } = useQuery({
  queryKey: ['hotel', hotelId],
  queryFn: async () => {
    const res = await fetch(`${API_URL}/api/v1/hotel?id=${hotelId}`);
    const data = await res.json();
    return data[0];
  },
  enabled: !!hotelId,
});

  // FIXED: Use correct backend fields
  const soldPercentage =
    hotel ? (hotel.tokensSold / hotel.totalTokens) * 100 : 0;

  const tokensAvailable =
    hotel ? hotel.totalTokens - hotel.tokensSold : 0;

  const tokensToBuy =
    hotel ? investAmount / hotel.tokenPrice : 0;

  if (isLoading || !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">

      {/* HERO IMAGE */}
      <div className="relative h-64 md:h-96">
        <img 
          src={hotel.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920"}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        
        <Button 
          variant="ghost" 
          className="absolute top-4 left-4 text-white hover:bg-white/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('hotelDetail.back')}
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/80 backdrop-blur border-slate-800 p-6">

              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">

                    {/* ESG */}
                    {hotel.esgScore >= 80 && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Leaf className="w-3 h-3 mr-1" />
                        ESG {hotel.esgScore}
                      </Badge>
                    )}

                    {/* TOKEN SYMBOL */}
                    <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {hotel.tokenSymbol}
                    </Badge>
                  </div>

                  <h1 className="text-3xl font-bold text-white">{hotel.name}</h1>
                  <p className="text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {hotel.location}, {hotel.country}
                  </p>
                </div>

                {/* STAR RATING */}
                <div className="flex items-center gap-1">
                  {[...Array(hotel.starRating || 4)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">{hotel.description}</p>
            </Card>

            {/* TABS */}
            <Tabs defaultValue="overview">
              <TabsList className="bg-slate-900/50 border border-slate-800 w-full justify-start">
                <TabsTrigger value="overview">{t('hotelDetail.overview')}</TabsTrigger>
                <TabsTrigger value="performance">{t('hotelDetail.performance')}</TabsTrigger>
                <TabsTrigger value="documents">{t('hotelDetail.documents')}</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">

                  {/* ROOMS */}
                  <Card className="bg-slate-900/50 border-slate-800 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <Home className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="text-slate-400">{t('hotelDetail.rooms')}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{hotel.roomCount}</p>
                  </Card>

                  {/* OCCUPANCY */}
                  <Card className="bg-slate-900/50 border-slate-800 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <Users className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-slate-400">{t('hotelDetail.occupancy')}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{hotel.occupancyRate}%</p>
                  </Card>

                  {/* REVPAR */}
                  <Card className="bg-slate-900/50 border-slate-800 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-sky-500/10">
                        <TrendingUp className="w-5 h-5 text-sky-400" />
                      </div>
                      <span className="text-slate-400">{t('hotelDetail.revpar')}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">${hotel.revpar}</p>
                  </Card>

                  {/* LEASE END */}
                  <Card className="bg-slate-900/50 border-slate-800 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-violet-500/10">
                        <Calendar className="w-5 h-5 text-violet-400" />
                      </div>
                      <span className="text-slate-400">{t('hotelDetail.leaseEnd')}</span>
                    </div>

                    <p className="text-2xl font-bold text-white">
                      {hotel.leaseEndDate
                        ? format(new Date(hotel.leaseEndDate), 'yyyy/MM')
                        : '2030/12'}
                    </p>
                  </Card>

                </div>
              </TabsContent>

              <TabsContent value="performance" className="mt-6">
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-white font-semibold mb-4">{t('hotelDetail.quarterlyReturns')}</h3>

                  {[ '2025 Q4', '2025 Q3', '2025 Q2', '2025 Q1' ].map((q) => (
                    <div key={q} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <span className="text-slate-400">{q}</span>
                      <span className="text-emerald-400 font-semibold">
                        +{(2 + Math.random() * 0.5).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  {[
                    t('hotelDetail.assetReport'),
                    t('hotelDetail.leaseSummary'),
                    t('hotelDetail.auditReport'),
                    t('hotelDetail.contractAddress')
                  ].map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <span className="text-white">{doc}</span>
                      </div>
                      <Shield className="w-4 h-4 text-emerald-400" />
                    </div>
                  ))}
                </Card>
              </TabsContent>

            </Tabs>
          </div>

          {/* INVEST CARD */}
          <div className="space-y-6">
            <Card className="bg-slate-900/80 backdrop-blur border-slate-800 p-6 sticky top-4">

              <div className="text-center mb-6">
                <p className="text-slate-400 text-sm">{t('hotelDetail.tokenPrice')}</p>
                <p className="text-4xl font-bold text-white">${hotel.tokenPrice}</p>
                <p className="text-amber-400 text-sm mt-1">/{hotel.tokenSymbol}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t('hotelDetail.apy')}</span>
                  <span className="text-emerald-400 font-semibold">{hotel.apy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t('hotelDetail.totalValue')}</span>
                  <span className="text-white">${hotel.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t('hotelDetail.totalTokens')}</span>
                  <span className="text-white">{hotel.totalTokens.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t('hotelDetail.progress')}</span>
                  <span className="text-white">{soldPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={soldPercentage} className="h-2 bg-slate-800" />
                <p className="text-xs text-slate-500">
                  {tokensAvailable.toLocaleString()} {t('hotelDetail.remaining')}
                </p>
              </div>

              {/* INVEST DIALOG */}
              <Dialog open={showInvestDialog} onOpenChange={setShowInvestDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold text-lg py-6">
                    <Wallet className="w-5 h-5 mr-2" />
                    {t('hotelDetail.investNow')}
                  </Button>
                </DialogTrigger>

                <DialogContent className="bg-slate-900 border-slate-800">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      {t('hotelDetail.investIn')} {hotel.name}
                    </DialogTitle>
                  </DialogHeader>

                  {/* SUCCESS MESSAGE */}
                  {investSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-xl text-white font-semibold mb-2">{t('hotelDetail.investSuccess')}</h3>
                      <p className="text-slate-400">
                        {t('hotelDetail.purchased')} {tokensToBuy.toFixed(2)} {hotel.tokenSymbol}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 py-4">

                      {/* AMOUNT */}
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">
                          {t('hotelDetail.investAmount')}
                        </label>

                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="icon" className="border-slate-700"
                            onClick={() => setInvestAmount(Math.max(1, investAmount - 100))}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>

                          <Input
                            type="number"
                            value={investAmount}
                            onChange={(e) => setInvestAmount(Number(e.target.value))}
                            className="text-center text-xl font-bold bg-slate-800 border-slate-700 text-white"
                          />

                          <Button variant="outline" size="icon" className="border-slate-700"
                            onClick={() => setInvestAmount(investAmount + 100)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* QUICK BUTTONS */}
                        <div className="flex gap-2 mt-3">
                          {[100, 500, 1000, 5000].map((amount) => (
                            <Button key={amount}
                              variant="outline"
                              size="sm"
                              className={`flex-1 border-slate-700 ${
                                investAmount === amount
                                  ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                                  : "text-slate-400"
                              }`}
                              onClick={() => setInvestAmount(amount)}
                            >
                              ${amount}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* SUMMARY */}
                      <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t('hotelDetail.tokensReceive')}</span>
                          <span className="text-white font-semibold">
                            {tokensToBuy.toFixed(2)} {hotel.tokenSymbol}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t('hotelDetail.expectedYield')}</span>
                          <span className="text-emerald-400 font-semibold">
                            ${(investAmount * hotel.apy / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* CONFIRM */}
                      <Button
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold"
                      >
                        {t('hotelDetail.confirmInvest')}
                      </Button>
                    </div>
                  )}

                </DialogContent>
              </Dialog>

              {/* BOOKING BUTTON */}
              <Link to={createPageUrl(`Booking?hotel_id=${hotel.id}`)}>
                <Button variant="outline" className="w-full mt-3 border-slate-700 text-slate-300 hover:bg-slate-800">
                  {t('hotelDetail.bookStay')}
                </Button>
              </Link>

            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
