// @ts-ignore
import React from 'react';
import { Card } from "@/components/ui/card";
// @ts-ignore
import { TrendingUp, Building2, Coins, Users } from "lucide-react";
import { useLanguage } from '@/components/common/LanguageContext';

export default function StatsOverview() {
  const { t } = useLanguage();

  const stats = [
    { labelKey: 'stats.tvl', value: "$24.5M", change: "+12.3%", icon: Coins, color: "text-amber-400" },
    { labelKey: 'stats.tokenizedHotels', value: "8", change: "+2", icon: Building2, color: "text-emerald-400" },
    { labelKey: 'stats.avgApy', value: "8.2%", change: "+0.4%", icon: TrendingUp, color: "text-sky-400" },
    { labelKey: 'stats.activeInvestors', value: "2,847", change: "+156", icon: Users, color: "text-violet-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <
// @ts-ignore
        Card key={index} className="bg-slate-900/50 border-slate-800 p-5 hover:bg-slate-900/70 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">{t(stat.labelKey)}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp 
// @ts-ignore
                className="w-3 h-3" />
                {stat.change}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl bg-slate-800/50 ${stat.color}`}>
              <stat.icon 
// @ts-ignore
              className="w-5 h-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}