// @ts-ignore
// @ts-ignore
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
// @ts-ignore
import { Star, MapPin, Leaf, TrendingUp, Calendar, Home, Users, Shield, FileText, ArrowLeft, Plus, Minus, Wallet, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from 'date-fns';
import { useLanguage } from '@/components/common/LanguageContext';

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
      // @ts-ignore
      const hotels = await base44.entities.HotelAsset.filter({ id: hotelId });
      return hotels[0];
    },
    enabled: !!hotelId,
  });

  const investMutation = useMutation({
    mutationFn: async () => {
      const tokenAmount = investAmount / hotel.token_price;
      // @ts-ignore
      await base44.entities.Investment.create({
        hotel_asset_id: hotel.id,
        user_email: user.email,
        token_amount: tokenAmount,
        invested_amount: investAmount,
        staked_amount: 0,
        earned_rewards: 0,
        pending_rewards: 0,
        status: 'active'
      });
      // @ts-ignore
      await base44.entities.HotelAsset.update(hotel.id, {
        tokens_sold: (hotel.tokens_sold || 0) + tokenAmount
      });
    },
    onSuccess: () => {
      setInvestSuccess(true);
      // @ts-ignore
      queryClient.invalidateQueries(['hotel', hotelId]);
      setTimeout(() => {
        setShowInvestDialog(false);
        setInvestSuccess(false);
      }, 2000);
    }
  });

  if (isLoading || !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const soldPercentage = ((hotel.tokens_sold || 0) / hotel.total_tokens) * 100;
  const tokensAvailable = hotel.total_tokens - (hotel.tokens_sold || 0);
  const tokensToBuy = investAmount / hotel.token_price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96">
        <img 
          src={hotel.image_url || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920`}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <
// @ts-ignore
        Button 
          variant="ghost" 
          className="absolute top-4 left-4 text-white hover:bg-white/10"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft 
// @ts-ignore
          className="w-5 h-5 mr-2" />
          {t('hotelDetail.back')}
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <
// @ts-ignore
            Card className="bg-slate-900/80 backdrop-blur border-slate-800 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {hotel.esg_score >= 80 && (
                      <
// @ts-ignore
                      Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Leaf 
// @ts-ignore
                        className="w-3 h-3 mr-1" />
                        ESG {hotel.esg_score}
                      </Badge>
                    )}
                    <
// @ts-ignore
                    Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {hotel.token_symbol}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold text-white">{hotel.name}</h1>
                  <p className="text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin 
// @ts-ignore
                    className="w-4 h-4" />
                    {hotel.location}, {hotel.country}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(hotel.star_rating || 4)].map((_, i) => (
                    // @ts-ignore
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed">{hotel.description}</p>
            </Card>

            <Tabs defaultValue="overview" className="w-full">
              <
// @ts-ignore
              TabsList className="bg-slate-900/50 border border-slate-800 w-full justify-start">
                <
// @ts-ignore
                TabsTrigger value="overview" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">{t('hotelDetail.overview')}</TabsTrigger>
                <
// @ts-ignore
                TabsTrigger value="performance" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">{t('hotelDetail.performance')}</TabsTrigger>
                <
// @ts-ignore
                TabsTrigger value="documents" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">{t('hotelDetail.documents')}</TabsTrigger>
              </TabsList>

              <
// @ts-ignore
              TabsContent value="overview" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <
// @ts-ignore
                  Card className="bg-slate-900/50 border-slate-800 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <Home 
// @ts-ignore
                        className="w-5 h-5 text-amber-400" />
                      </div>
                      <span className="text-slate-400">{t('hotelDetail.rooms')}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{hotel.room_count || 120}</p>
                  </Card>
                  <
// @ts-ignore
                  Card className="bg-slate-900/50 border-slate-800 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10">
                        <Users 
// @ts-ignore
                        className="w-5 h-5 text-emerald-400" />
                      </div>
                      <span className="text-slate-400">{t('hotelDetail.occupancy')}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{hotel.occupancy_rate || 85}%</p>
                  </Card>
                  <
// @ts-ignore
                  Card className="bg-slate-900/50 border-slate-800 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-sky-500/10">
                        <TrendingUp 
// @ts-ignore
                        className="w-5 h-5 text-sky-400" />
                      </div>
                      <span className="text-slate-400">{t('hotelDetail.revpar')}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">${hotel.revpar || 125}</p>
                  </Card>
                  <
// @ts-ignore
                  Card className="bg-slate-900/50 border-slate-800 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-violet-500/10">
                        <Calendar 
// @ts-ignore
                        className="w-5 h-5 text-violet-400" />
                      </div>
                      <span className="text-slate-400">{t('hotelDetail.leaseEnd')}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {hotel.lease_end_date ? 
// @ts-ignore
                      format(new Date(hotel.lease_end_date), 'yyyy/MM') : '2030/12'}
                    </p>
                  </Card>
                </div>
              </TabsContent>

              <
// @ts-ignore
              TabsContent value="performance" className="mt-6">
                <
// @ts-ignore
                Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-white font-semibold mb-4">{t('hotelDetail.quarterlyReturns')}</h3>
                  <div className="space-y-4">
                    {['2024 Q4', '2024 Q3', '2024 Q2', '2024 Q1'].map((quarter) => (
                      <div key={quarter} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="text-slate-400">{quarter}</span>
                        <span className="text-emerald-400 font-semibold">+{(2 + Math.random() * 0.5).toFixed(2)}%</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <
// @ts-ignore
              TabsContent value="documents" className="mt-6">
                <
// @ts-ignore
                Card className="bg-slate-900/50 border-slate-800 p-6">
                  <div className="space-y-3">
                    {[
                      t('hotelDetail.assetReport'),
                      t('hotelDetail.leaseSummary'),
                      t('hotelDetail.auditReport'),
                      t('hotelDetail.contractAddress')
                    ].map((doc) => (
                      <div key={doc} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <FileText 
// @ts-ignore
                          className="w-5 h-5 text-amber-400" />
                          <span className="text-white">{doc}</span>
                        </div>
                        <Shield 
// @ts-ignore
                        className="w-4 h-4 text-emerald-400" />
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Investment Card */}
          <div className="space-y-6">
            <
// @ts-ignore
            Card className="bg-slate-900/80 backdrop-blur border-slate-800 p-6 sticky top-4">
              <div className="text-center mb-6">
                <p className="text-slate-400 text-sm">{t('hotelDetail.tokenPrice')}</p>
                <p className="text-4xl font-bold text-white">${hotel.token_price}</p>
                <p className="text-amber-400 text-sm mt-1">/{hotel.token_symbol}</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t('hotelDetail.apy')}</span>
                  <span className="text-emerald-400 font-semibold">{hotel.apy}% APY</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t('hotelDetail.totalValue')}</span>
                  <span className="text-white">${hotel.total_value?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t('hotelDetail.totalTokens')}</span>
                  <span className="text-white">{hotel.total_tokens?.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t('hotelDetail.progress')}</span>
                  <span className="text-white">{soldPercentage.toFixed(1)}%</span>
                </div>
                <Progress 
// @ts-ignore
                value={soldPercentage} className="h-2 bg-slate-800" />
                <p className="text-xs text-slate-500">
                  {tokensAvailable.toLocaleString()} {t('hotelDetail.remaining')}
                </p>
              </div>

              <Dialog open={showInvestDialog} onOpenChange={setShowInvestDialog}>
                <DialogTrigger asChild>
                  <
// @ts-ignore
                  Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold text-lg py-6"
                    disabled={hotel.status === 'sold_out'}
                  >
                    <Wallet 
// @ts-ignore
                    className="w-5 h-5 mr-2" />
                    {t('hotelDetail.investNow')}
                  </Button>
                </DialogTrigger>
                <
// @ts-ignore
                DialogContent className="bg-slate-900 border-slate-800">
                  <
// @ts-ignore
                  DialogHeader>
                    <
// @ts-ignore
                    DialogTitle className="text-white">{t('hotelDetail.investIn')} {hotel.name}</DialogTitle>
                  </DialogHeader>
                  
                  {investSuccess ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle 
// @ts-ignore
                        className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h3 className="text-xl text-white font-semibold mb-2">{t('hotelDetail.investSuccess')}</h3>
                      <p className="text-slate-400">{t('hotelDetail.purchased')} {tokensToBuy.toFixed(2)} {hotel.token_symbol}</p>
                    </div>
                  ) : (
                    <div className="space-y-6 py-4">
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">{t('hotelDetail.investAmount')}</label>
                        <div className="flex items-center gap-3">
                          <
// @ts-ignore
                          Button 
                            variant="outline" 
                            size="icon"
                            className="border-slate-700"
                            onClick={() => setInvestAmount(Math.max(1, investAmount - 100))}
                          >
                            <Minus 
// @ts-ignore
                            className="w-4 h-4" />
                          </Button>
                          <Input
                            // @ts-ignore
                            type="number"
                            value={investAmount}
                            onChange={(e) => setInvestAmount(Number(e.target.value))}
                            className="text-center text-xl font-bold bg-slate-800 border-slate-700 text-white"
                          />
                          <
// @ts-ignore
                          Button 
                            variant="outline" 
                            size="icon"
                            className="border-slate-700"
                            onClick={() => setInvestAmount(investAmount + 100)}
                          >
                            <Plus 
// @ts-ignore
                            className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {[100, 500, 1000, 5000].map((amount) => (
                            <
// @ts-ignore
                            Button 
                              key={amount}
                              variant="outline" 
                              size="sm"
                              className={`flex-1 border-slate-700 ${investAmount === amount ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'text-slate-400'}`}
                              onClick={() => setInvestAmount(amount)}
                            >
                              ${amount}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t('hotelDetail.tokensReceive')}</span>
                          <span className="text-white font-semibold">{tokensToBuy.toFixed(2)} {hotel.token_symbol}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">{t('hotelDetail.expectedYield')}</span>
                          <span className="text-emerald-400 font-semibold">${(investAmount * hotel.apy / 100).toFixed(2)}</span>
                        </div>
                      </div>

                      <
// @ts-ignore
                      Button 
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold"
                        onClick={() => investMutation.mutate()}
                        disabled={investMutation.isPending || !user}
                      >
                        {investMutation.isPending ? t('hotelDetail.processing') : user ? t('hotelDetail.confirmInvest') : t('hotelDetail.pleaseLogin')}
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Link to={createPageUrl(`Booking?hotel_id=${hotel.id}`)}>
                <
// @ts-ignore
                Button variant="outline" className="w-full mt-3 border-slate-700 text-slate-300 hover:bg-slate-800">
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