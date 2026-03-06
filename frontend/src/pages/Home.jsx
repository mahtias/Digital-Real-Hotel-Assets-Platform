// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAccount, useReadContracts } from 'wagmi';
import { ArrowRight, Sparkles, Shield, Globe, TrendingUp, Building2, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatsOverview from "@/components/dashboard/StatsOverview";
import HotelAssetCard from "@/components/dashboard/HotelAssetCard";
import PortfolioSummary from "@/components/dashboard/PortfolioSummary";
import { useLanguage } from '@/components/common/LanguageContext';
import { useAuth } from "@/context/AuthContext";

// 🔥 HOTEL TOKEN ABI
import { HOTEL_TOKEN_ABI } from '@/contracts/abis';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Home() {
  const [user, setUser] = useState(null);
  const { t } = useLanguage();
  const { authFetch } = useAuth();

  // 🔥 WALLET CONNECTION
  const { address, isConnected } = useAccount();

  // 🔥 Load user data
  useEffect(() => {
    authFetch("/api/v1/auth/me")
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, [authFetch]);

  // 🔥 HOTELS WITH TOKEN ADDRESSES
  const { data: hotels = [] } = useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/hotels`);
      if (!res.ok) throw new Error("Failed to fetch hotels");
      return res.json();
    },
  });

  // 🔥 INVESTMENTS
  const { data: investments = [] } = useQuery({
    queryKey: ["user-investments"],
    queryFn: async () => {
      if (!user) return [];
      const res = await authFetch(`/api/v1/investments?email=${user.email}`);
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user,
  });

  // 🔥 BUILD CONTRACTS ARRAY FOR BATCH READ
  const contracts = useMemo(() => {
    if (!address || hotels.length === 0) return [];
    
    return hotels.flatMap(hotel => [
      {
        address: hotel.tokenContractAddress,
        abi: HOTEL_TOKEN_ABI,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        address: hotel.tokenContractAddress,
        abi: HOTEL_TOKEN_ABI,
        functionName: 'symbol',
      }
    ]);
  }, [hotels, address]);

  // 🔥 READ ALL HOTEL TOKEN BALANCES AT ONCE
  const { data: contractResults } = useReadContracts({
    contracts,
    watch: true,
  });

  // 🔥 PARSE RESULTS INTO HOTEL TOKEN BALANCES
  const hotelTokenBalances = useMemo(() => {
    if (!contractResults || contractResults.length === 0) return [];

    return hotels.map((hotel, idx) => {
      const balanceResult = contractResults[idx * 2];
      const symbolResult = contractResults[idx * 2 + 1];

      const balance = balanceResult?.result ? Number(balanceResult.result) / 1e18 : 0;
      const symbol = symbolResult?.result || hotel.tokenSymbol || 'HOTEL';
      const value = balance * (hotel.tokenPrice || 20);

      return {
        hotelId: hotel.id,
        name: hotel.name,
        symbol,
        balance,
        value,
        tokenAddress: hotel.tokenContractAddress
      };
    });
  }, [contractResults, hotels]);

  // 🔥 CALCULATIONS
  const totalValue = investments.reduce((acc, inv) => acc + (inv.invested_amount || 0), 0);
  const totalRewards = investments.reduce((acc, inv) => acc + (inv.rewards_earned || 0), 0);
  
  const totalTokenBalance = hotelTokenBalances.reduce((acc, token) => acc + token.balance, 0);
  const walletHatValue = hotelTokenBalances.reduce((acc, token) => acc + token.value, 0);

  // 🔥 FEATURES
  const features = [
    {
      icon: Shield,
      title: t('home.features.lowEntry.title'),
      desc: t('home.features.lowEntry.desc')
    },
    {
      icon: TrendingUp,
      title: t('home.features.stableYield.title'),
      desc: t('home.features.stableYield.desc')
    },
    {
      icon: Globe,
      title: t('home.features.hkCompliant.title'),
      desc: t('home.features.hkCompliant.desc')
    },
    {
      icon: Sparkles,
      title: t('home.features.globalLiquidity.title'),
      desc: t('home.features.globalLiquidity.desc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-emerald-500/10 opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-amber-500/10 text-amber-400 border-amber-500/20">
              <Sparkles className="w-3 h-3 mr-1" />
              {t('home.badge')}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {t('home.title1')}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              {t('home.subtitle')}
            </p>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              {t('home.title2')}
            </p>
            <div className="flex gap-4 justify-center">
              <Link to={createPageUrl('Marketplace')}>
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                  {t('home.exploreHotels')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800"
                asChild
              >
                <a
                  href="https://docs.hotelastoken.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('home.learnMore')}
                </a>
              </Button>
            </div>
          </div>

          {/* 🔥 STATS WITH WALLET TOKENS */}
          <StatsOverview 
            totalValue={totalValue}
            totalRewards={totalRewards}
            tokenBalance={totalTokenBalance}
            walletValue={walletHatValue}
            hotelTokenBalances={hotelTokenBalances}
          />
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="bg-slate-900/50 border-slate-800 p-6 hover:border-amber-500/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Hotel Assets */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-6 h-6 text-amber-400" />
                {t('home.hotHotels')}
              </h2>
              <Link to={createPageUrl('Marketplace')}>
                <Button variant="ghost" className="text-amber-400 hover:text-amber-300">
                  {t('home.viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {hotels.slice(0, 4).map((hotel) => (
                <HotelAssetCard key={hotel.id} hotel={hotel} />
              ))}
            </div>

            {hotels.length === 0 && (
              <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">{t('common.noData')}</p>
              </Card>
            )}
          </div>

          {/*  PORTFOLIO SUMMARY WITH HOTEL TOKENS */}
          <div>
            <PortfolioSummary 
              investments={investments}
              totalValue={totalValue}
              totalRewards={totalRewards}
              tokenBalance={totalTokenBalance}
              hatPrice={20}
              hotelTokenBalances={hotelTokenBalances}
            />

            {/* Quick Actions */}
            <Card className="bg-slate-900/50 border-slate-800 p-6 mt-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-amber-400" />
                {t('home.quickActions')}
              </h3>
              <div className="space-y-3">
                <Link to={createPageUrl('Booking')}>
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                    {t('home.bookRoom')}
                  </Button>
                </Link>
                <Link to={createPageUrl('Governance')}>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    {t('home.joinDao')}
                  </Button>
                </Link>
                <Link to={createPageUrl('ESGRewards')}>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    {t('home.esgRewards')}
                  </Button>
                </Link>
                <Link to={createPageUrl('Staking')}>
                  <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                    {t('home.stakeDra')}
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
