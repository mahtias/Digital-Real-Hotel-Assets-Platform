// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, TrendingUp, Gift, Lock, Building2, ArrowRight, CheckCircle, Hotel, RefreshCw } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from '@/components/common/LanguageContext';
import { useAuthModal } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// 🔥 WALLET
import { useAccount, useReadContract } from 'wagmi';
import { HAT_ABI } from '@/contracts/abis';
import { HAT_TOKEN_ADDRESS } from '@/config/chains';

export default function Portfolio() {
  const { openAuthModal } = useAuthModal();
  const { authFetch } = useAuth();   
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 🔥 WALLET + HAT BALANCE
  const { address, isConnected } = useAccount();
  const { data: hatBalanceRaw } = useReadContract({
    address: HAT_TOKEN_ADDRESS,
    abi: HAT_ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const hatBalance = hatBalanceRaw ? Number(hatBalanceRaw) / 1e18 : 0;
  const hatValue = hatBalance * 20;

  const [user, setUser] = useState(null);

  useEffect(() => {
    authFetch("/api/v1/auth/me")
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, [authFetch]);

  // 🔥 🔥 NEW! INVESTMENTS QUERY (Paris $100!)
  const { data: investmentsRaw = [], isLoading: investmentsLoading } = useQuery({
    queryKey: ['investments', user?.email],  // ✅ MATCHES HotelDetail invalidate!
    queryFn: async () => {
      if (!user?.email) return [];
      console.log('🔍 Fetching investments for:', user.email);
      const res = await authFetch(`/api/v1/investments?email=${user.email}`);
      if (!res.ok) return [];
      const data = await res.json();
      console.log('✅ INVESTMENTS LOADED:', data);
      return Array.isArray(data) ? data : data.data || data.investments || [];
    },
    enabled: !!user?.email,
  });

  // 🔥 HOTELS
  const { data: hotels = [] } = useQuery({
    queryKey: ['all-hotels'],
    queryFn: async () => {
      const res = await fetch("/api/v1/hotel-assets");
      if (!res.ok) throw new Error("Failed to fetch hotels");
      const data = await res.json();
      return Array.isArray(data) ? data : data.hotels || [];
    }
  });

  const hotelMap = hotels.reduce((acc, hotel) => {
    acc[hotel.id] = hotel;
    return acc;
  }, {});

  // 🔥 ENRICHED INVESTMENTS (Paris Luxury Suites!)
  const enrichedInvestments = investmentsRaw.map(inv => ({
    id: inv.id,
    amount: inv.amount || inv.investedAmount,
    tokenAmount: inv.tokenAmount || inv.tokens || 0,
    status: inv.status || 'PENDING',
    hotelAssetId: inv.hotelAssetId || inv.hotel_asset_id || inv.hotelAsset?.id,
    hotel: hotelMap[inv.hotelAssetId || inv.hotel_asset_id || inv.hotelAsset?.id],
    pendingRewards: inv.pendingRewards || '0',
  })).filter(inv => inv.hotel);  // Only show with hotel data

  console.log('🔍 ENRICHED INVESTMENTS:', enrichedInvestments);

  // 🔥 TOTALS
  const totalInvested = enrichedInvestments.reduce((acc, inv) => acc + parseFloat(inv.amount || 0), 0);
  const totalTokens = parseFloat(enrichedInvestments.reduce((acc, inv) => acc + parseFloat(inv.tokenAmount || 0), 0));
  const totalProperties = enrichedInvestments.length;
  const totalValue = totalInvested * 1.15; // +15% appreciation

  // 🔥 REFRESH BUTTON
  const refreshPortfolio = () => {
    queryClient.invalidateQueries({ queryKey: ['investments', user?.email] });
    queryClient.invalidateQueries({ queryKey: ['all-hotels'] });
    toast.success('🔄 Portfolio refreshed!');
  };

  const claimRewardsMutation = useMutation({
    mutationFn: async (investment) => {
      const res = await authFetch(`/api/v1/investments/${investment.id}/claim`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Failed to claim');
      return res.json();
    },
    onSuccess: () => {
      refreshPortfolio();
    }
  });

  if (investmentsLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white">Loading Portfolio...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 🔥 HEADER + REFRESH */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                💎 My Portfolio
              </h1>
              <p className="text-xl text-slate-400 mt-2">Track your investments & rewards</p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-black text-white">${totalInvested.toLocaleString()}</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Total Invested</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-400">{totalTokens.toFixed(1)}</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">HAT Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-amber-400">{totalProperties}</div>
                <div className="text-sm text-slate-500 uppercase tracking-wider">Properties</div>
              </div>
            </div>
          </div>
          
          {/* 🔥 REFRESH BUTTON */}
          <div className="flex justify-end">
            <Button 
              onClick={refreshPortfolio}
              className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border-slate-600 text-slate-200 font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
              Refresh Portfolio
            </Button>
          </div>
        </div>

        {/* 🔥 STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* ... same stats cards ... */}
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border-slate-800/50 backdrop-blur-xl hover:border-amber-500/50 transition-all group">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white mb-1">${totalInvested.toLocaleString()}</div>
              <div className="text-slate-500 uppercase tracking-wider text-sm font-medium">Total Invested</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/30 backdrop-blur-xl hover:border-emerald-500/50 transition-all group">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">{totalTokens.toFixed(1)}</div>
              <div className="text-emerald-300 uppercase tracking-wider text-sm font-medium">HAT Tokens</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 backdrop-blur-xl hover:border-amber-500/50 transition-all group">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Hotel className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400">{totalProperties}</div>
              <div className="text-amber-300 uppercase tracking-wider text-sm font-medium">Properties</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 backdrop-blur-xl hover:border-purple-500/50 transition-all group">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Gift className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-purple-400">${totalValue.toLocaleString()}</div>
              <div className="text-purple-300 uppercase tracking-wider text-sm font-medium">Portfolio Value</div>
            </CardContent>
          </Card>
        </div>

        {/* 🔥 INVESTMENTS TABS */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border-slate-800/50 backdrop-blur-xl mb-8">
            <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-slate-900 font-bold">
              Active Investments ({enrichedInvestments.length})
            </TabsTrigger>
            <TabsTrigger value="staked" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-bold">
              Staked Assets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {enrichedInvestments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrichedInvestments.map((inv, index) => (
                  <Card key={inv.id || index} className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border-slate-800/50 backdrop-blur-xl hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all group">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Hotel className="w-6 h-6 text-amber-400" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white leading-tight">
                            {inv.hotel?.name || `Property #${index + 1}`}
                          </CardTitle>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-bold mt-1">
                            {inv.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Investment</div>
                            <div className="font-bold text-lg text-white">${parseFloat(inv.amount).toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">HAT Tokens</div>
                            <div className="font-bold text-lg text-emerald-400">{inv.tokenAmount.toFixed(1)}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Location</div>
                            <div className="font-bold text-white">{inv.hotel?.location}</div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Yield</div>
                            <div className="font-bold text-lg text-amber-400">12.5%</div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-800">
                          {parseFloat(inv.pendingRewards || 0) > 0 && (
                            <Button 
                              size="sm" 
                              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg flex-1 font-bold"
                              onClick={() => claimRewardsMutation.mutate(inv)}
                              disabled={claimRewardsMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Claim Rewards
                            </Button>
                          )}
                          <Link to={createPageUrl(`HotelDetail?id=${inv.hotelAssetId}`)}>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 flex-1 font-bold"
                            >
                              View Details <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border-slate-800/50 backdrop-blur-xl p-16 text-center">
                <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-bold text-white mb-3">No Active Investments</h3>
                <p className="text-xl text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
                  Start your investment journey by browsing premium hotel assets in the marketplace.
                </p>
                <Link to={createPageUrl('Marketplace')}>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 text-lg font-bold px-12 py-6 shadow-2xl">
                    Browse Assets →
                  </Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="staked">
            <Card className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border-slate-800/50 backdrop-blur-xl p-16 text-center">
              <Lock className="w-16 h-16 text-slate-600 mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-bold text-white mb-3">Staking Coming Soon</h3>
              <p className="text-slate-400 max-w-md mx-auto">Earn additional yields by staking your HAT tokens.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
