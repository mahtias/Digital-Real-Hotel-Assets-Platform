// @ts-ignore
// @ts-ignore
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
// @ts-ignore
import { Star, MapPin, Leaf, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from '@/components/common/LanguageContext';

export default function HotelAssetCard({ hotel }) {
  const { t } = useLanguage();
  const soldPercentage = (hotel.tokens_sold / hotel.total_tokens) * 100;
  
  const statusColors = {
    upcoming: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    sold_out: "bg-slate-500/20 text-slate-400 border-slate-500/30"
  };

  const getStatusLabel = (status) => {
    return t(`hotelCard.${status === 'sold_out' ? 'soldOut' : status}`);
  };

  return (
    <
// @ts-ignore
    Card className="bg-slate-900/50 border-slate-800 overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={hotel.image_url || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600`}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <Badge className={`absolute top-3 right-3 ${statusColors[hotel.status]} border`} variant={undefined}>
          {getStatusLabel(hotel.status)}
        </Badge>
        {hotel.esg_score >= 80 && (
          <Badge className="absolute top-3 left-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" variant={undefined}>
            <Leaf 
// @ts-ignore
            className="w-3 h-3 mr-1" />
            ESG {hotel.esg_score}
          </Badge>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white">{hotel.name}</h3>
          <p className="text-slate-300 text-sm flex items-center gap-1">
            <MapPin 
// @ts-ignore
            className="w-3 h-3" />
            {hotel.location}, {hotel.country}
          </p>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(hotel.star_rating || 4)].map((_, i) => (
              // @ts-ignore
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-amber-400 font-mono font-bold">{hotel.token_symbol}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-800/50 rounded-lg p-2.5">
            <p className="text-slate-400 text-xs">{t('hotelCard.tokenPrice')}</p>
            <p className="text-white font-semibold">${hotel.token_price}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2.5">
            <p className="text-slate-400 text-xs">{t('hotelCard.apy')}</p>
            <p className="text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp 
// @ts-ignore
              className="w-3 h-3" />
              {hotel.apy}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">{t('hotelCard.progress')}</span>
            <span className="text-white">{soldPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
// @ts-ignore
          value={soldPercentage} className="h-1.5 bg-slate-800" />
          <p className="text-xs text-slate-500">
            {hotel.tokens_sold?.toLocaleString()} / {hotel.total_tokens?.toLocaleString()} {t('hotelCard.tokens')}
          </p>
        </div>

        <Link to={createPageUrl(`HotelDetail?id=${hotel.id}`)}>
          <
// @ts-ignore
          Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold">
            {t('hotelCard.viewDetails')}
          </Button>
        </Link>
      </div>
    </Card>
  );
}