import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, Building2, Coins, Users } from "lucide-react";

const stats = [
  { label: "总锁仓价值 (TVL)", value: "$24.5M", change: "+12.3%", icon: Coins, color: "text-amber-400" },
  { label: "代币化酒店", value: "8", change: "+2", icon: Building2, color: "text-emerald-400" },
  { label: "平均年化收益", value: "8.2%", change: "+0.4%", icon: TrendingUp, color: "text-sky-400" },
  { label: "活跃投资者", value: "2,847", change: "+156", icon: Users, color: "text-violet-400" },
];

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-slate-900/50 border-slate-800 p-5 hover:bg-slate-900/70 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl bg-slate-800/50 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}