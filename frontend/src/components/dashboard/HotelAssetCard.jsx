// @ts-nocheck
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";  
import { Badge } from "@/components/ui/badge";   
import { Progress } from "@/components/ui/progress";

import { Star, MapPin, Leaf, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from '@/components/common/LanguageContext';

export default function HotelAssetCard({ hotel, refetchHotels, refetchPortfolio }) {
  const { t } = useLanguage();

  // ✅ IMAGE → YOUR EXACT FIX!
  const image = hotel.imageUrl || hotel.image || 
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600";

  // 📊 Progress calculation
  const soldPercentage = hotel.tokensSold && hotel.totalTokens
    ? (hotel.tokensSold / hotel.totalTokens) * 100
    : 0;

  const getStatusLabel = (status) => {
    switch (status) {
      case "ACTIVE": return t('hotelCard.active') || 'Active';
      case "UPCOMING": return t('hotelCard.upcoming') || 'Upcoming';
      case "SOLD_OUT": return t('hotelCard.soldOut') || 'Sold Out';
      default: return status;
    }
  };

  // ⭐ Rating stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-3 h-3 fill-amber-300 text-amber-300" />);
    }
    while (stars.length < 5) {
      stars.push(<Star key={stars.length} className="w-3 h-3 text-slate-600" />);
    }
    return stars;
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20">
      {/* 🖼️ IMAGE */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

   {/* 🏷️ STATUS BADGE → WHITE LIKE BEFORE */}
<Badge className="absolute top-3 right-3 bg-white/20 text-white border-white/50 backdrop-blur-sm px-3 py-1.5 shadow-lg" variant={undefined}>
  {getStatusLabel(hotel.status)}
</Badge>

{/* 🌿 ESG BADGE → WHITE LIKE BEFORE */}
{hotel.esgScore >= 80 && (
  <Badge className="absolute top-3 left-3 bg-white/20 text-white border-white/50 backdrop-blur-sm px-3 py-1.5 shadow-lg" variant={undefined}>
    <Leaf className="w-3 h-3 mr-1" />
    ESG {hotel.esgScore}%
  </Badge>
)}
      </div>

      {/* 📝 CONTENT */}
      <div className="p-5 space-y-4">
        {/* 🏨 Title + Stars */}
        <div className="space-y-1">
          <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-emerald-400 transition-colors text-white">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            {renderStars(hotel.rating || 4.5)}
            <span className="text-slate-300">({hotel.rating?.toFixed(1) || '4.5'})</span>
            <span className="text-slate-400">•</span>
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="truncate text-slate-300">{hotel.location}</span>
          </div>
        </div>

        {/* 💰 STATS → ALL WHITE TEXT */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {/* Token Price */}
          <div className="text-center p-2 bg-slate-800/50 rounded-lg">
            <DollarSign className="w-3 h-3 mx-auto mb-1 text-emerald-400" />
            <div className="font-mono text-emerald-400 font-bold">${hotel.tokenPrice?.toLocaleString()}</div>
            <div className="text-slate-400 mt-1">{t('hotelCard.tokenPrice')}</div>
          </div>
          
          {/* APY */}
          <div className="text-center p-2 bg-slate-800/50 rounded-lg">
            <TrendingUp className="w-3 h-3 mx-auto mb-1 text-amber-400" />
            <div className="font-mono text-amber-400 font-bold">{hotel.apy || '12'}%</div>
            <div className="text-slate-400 mt-1">{t('hotelCard.apy')}</div>
          </div>
          
          {/* Target Funding → WHITE */}
          <div className="text-center p-2 bg-slate-800/50 rounded-lg">
            <DollarSign className="w-3 h-3 mx-auto mb-1 text-white" />
            <div className="font-mono text-white font-bold">${hotel.targetFunding?.toLocaleString()}</div>
            <div className="text-slate-400 mt-1">{t('hotelCard.target')}</div>
          </div>
        </div>

        {/* 📊 PROGRESS → WHITE TEXT */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 uppercase tracking-wider font-medium">Progress</span>
            <span className="text-white font-mono font-bold">{soldPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={Math.min(soldPercentage, 100)}
            className="h-1.5 bg-slate-800 [&>div]:bg-white"
          />
          <p className="text-xs text-slate-400 font-mono"> 
            {hotel.tokensSold?.toLocaleString() || 0} / {hotel.totalTokens?.toLocaleString() || 0} Tokens
          </p>
        </div>

        {/* 🚀 INVEST BUTTON → UNTOUCHED */}
        <Link to={createPageUrl(`HotelDetail?id=${hotel.id}`)}>
          <Button 
            className="w-full h-12 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 
                       hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 
                       text-slate-900 font-bold shadow-xl hover:shadow-emerald-500/50 
                       text-sm tracking-wide transition-all duration-200 border-0"
            disabled={soldPercentage >= 100}
          >
            {soldPercentage >= 100 ? (
              "🎉 Sold Out"
            ) : (
              " Invest Now"
            )}
          </Button>
        </Link>

        {/* 👁️ VIEW DETAILS → UNTOUCHED */}
        <div className="pt-2">
          <Link to={createPageUrl(`HotelDetail?id=${hotel.id}`)}>
            <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold">
              {t('hotelCard.viewDetails') || 'View Details'}
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
