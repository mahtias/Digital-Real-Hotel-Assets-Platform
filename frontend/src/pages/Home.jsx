// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ArrowRight, Sparkles, Shield, Globe, TrendingUp, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import StatsOverview from "@/components/dashboard/StatsOverview";
import HotelAssetCard from "@/components/dashboard/HotelAssetCard";
import PortfolioSummary from "@/components/dashboard/PortfolioSummary";
import { useLanguage } from '@/components/common/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; 
export default function Home() {
  const [user, setUser] = useState(null);
  const { t } = useLanguage();

//  useEffect(() => {
//   const token = localStorage.getItem("token");

//   fetch("/api/v1/auth/me", {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//     .then(res => res.json())
//     .then(data => setUser(data.user))
//     .catch(() => setUser(null));
// }, []);

  const { data: hotels = [] } = useQuery({
    queryKey: ['hotels'],
    
  queryFn: async () => {
  const res = await fetch(`${API_URL}/api/v1/hotel`);
  if (!res.ok) throw new Error("Failed to fetch hotels");
  return res.json();
}
  });

  const { data: investments = [] } = useQuery({
    queryKey: ["user-investments"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/investments`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch investments");
      return res.json();
    },
  });

  const totalValue = investments.reduce((acc, inv) => acc + (inv.invested_amount || 0), 0);
  const totalRewards = investments.reduce((acc, inv) => acc + (inv.earned_rewards || 0), 0);

  const features = [
    { icon: Sparkles, ...t('home.features.lowEntry') },
    { icon: TrendingUp, ...t('home.features.stableYield') },
    { icon: Shield, ...t('home.features.hkCompliant') },
    { icon: Globe, ...t('home.features.globalLiquidity') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
        
        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            < Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-6">
              {t('home.badge')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('home.title1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                {t('home.title2')}
              </span>
            </h1>
            <p className="text-lg text-slate-400 mb-8">
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Marketplace')}>
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold px-8">
                  {t('home.exploreBtn')} <ArrowRight  className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                
           <a href=" http://xhslink.com/o/9RiPnlyZbnP " target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white">
            {t('home.learnMore')}
           </a>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <StatsOverview />
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <

            Card key={idx} className="bg-slate-900/50 border-slate-800 p-6 hover:border-amber-500/30 transition-colors">
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
                <Building2 

                className="w-6 h-6 text-amber-400" />
                {t('home.hotHotels')}
              </h2>
              <Link to={createPageUrl('Marketplace')}>
                < Button variant="ghost" className="text-amber-400 hover:text-amber-300">
                  {t('home.viewAll')} <ArrowRight 

                  className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {hotels.slice(0, 4).map((hotel) => (
                <HotelAssetCard key={hotel.id} hotel={hotel} />
              ))}
            </div>

            {hotels.length === 0 && (
              <

              Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                <Building2 

                className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">{t('common.noData')}</p>
              </Card>
            )}
          </div>

          {/* Portfolio Summary */}
          <div>
            <PortfolioSummary 
              investments={investments}
              totalValue={totalValue}
              totalRewards={totalRewards}
            />

            {/* Quick Actions */}
            < Card className="bg-slate-900/50 border-slate-800 p-6 mt-6">
              <h3 className="text-white font-semibold mb-4">{t('home.quickActions')}</h3>
              <div className="space-y-3">
                <Link to={createPageUrl('Booking')} className="block">
                  < Button variant="outline" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                    {t('home.bookRoom')}
                  </Button>
                </Link>
                <Link to={createPageUrl('Governance')} className="block">
                  <  Button variant="outline" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                    {t('home.joinDao')}
                  </Button>
                </Link>
                <Link to={createPageUrl('ESGRewards')} className="block">
                  < Button variant="outline" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                    {t('home.esgRewards')}
                  </Button>
                </Link>
                <Link to={createPageUrl('Staking')} className="block">
                  <Button variant="outline" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
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