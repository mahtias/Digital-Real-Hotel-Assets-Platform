// @ts-nocheck
import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Building2, Coins, Users } from "lucide-react";
import { useLanguage } from "@/components/common/LanguageContext";

export default function StatsOverview({
  hotels = [],
  investments = [],
}) {
  const { t } = useLanguage();

  // 🔹 TOTAL VALUE LOCKED (sum of investedAmount)
  const totalValueLocked = investments.reduce(
    (sum, inv) => sum + Number(inv.investedAmount || inv.amount || 0),
    0
  );

  const tvlDisplay =
    totalValueLocked >= 1000000
      ? `$${(totalValueLocked / 1000000).toFixed(1)}M`
      : `$${totalValueLocked.toLocaleString()}`;

  // 🔹 AVERAGE APY
  const apyHotels = hotels.filter((h) => h.apy);
  const avgApy = apyHotels.length
    ? (
        apyHotels.reduce((sum, h) => sum + Number(h.apy || 0), 0) /
        apyHotels.length
      ).toFixed(1)
    : 0;

  // 🔹 ACTIVE INVESTORS
  const activeInvestors = new Set(investments.map((inv) => inv.userId)).size;

  // 🔹 NEW HOTELS (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const newHotels = hotels.filter((h) => new Date(h.createdAt || h.created_at || h.updatedAt) > thirtyDaysAgo).length;

  // 🔹 NEW INVESTORS (last 30 days)
  const newInvestors = investments.filter((inv) => new Date(inv.createdAt || inv.created_at) > thirtyDaysAgo).length;

  // 🔹 TVL change mock
  const tvlChange = `+${Math.min(Math.round(totalValueLocked / 1000), 25)}%`;

  const statsData = [
    {
      labelKey: "stats.tvl",
      value: tvlDisplay,
      change: tvlChange,
      icon: Coins,
      color: "text-amber-400",
    },
    {
      labelKey: "stats.tokenizedHotels",
      value: hotels.length.toLocaleString(),
      change: `+${newHotels}`,
      icon: Building2,
      color: "text-emerald-400",
    },
    {
      labelKey: "stats.avgApy",
      value: `${avgApy}%`,
      change: `+${(avgApy * 0.15).toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-sky-400",
    },
    {
      labelKey: "stats.activeInvestors",
      value: activeInvestors ? activeInvestors.toLocaleString() : "0",
      change: `+${newInvestors}`,
      icon: Users,
      color: "text-violet-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="bg-slate-900/50 border-slate-800 p-5 hover:bg-slate-900/70 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                {t(stat.labelKey)}
              </p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </p>
            </div>
            <div
              className={`p-2.5 rounded-xl bg-slate-800/50 ${stat.color} group-hover:scale-110 transition-all duration-200`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}