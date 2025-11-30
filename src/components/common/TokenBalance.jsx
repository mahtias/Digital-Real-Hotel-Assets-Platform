import React from 'react';
import { Card } from "@/components/ui/card";
import { Coins, Vote, Gift } from "lucide-react";

export default function TokenBalance({ draBalance = 0, votingPower = 0, pendingRewards = 0 }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800 p-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-slate-900 font-bold text-sm">DRA</span>
          </div>
          <div>
            <p className="text-slate-400 text-xs">DRA余额</p>
            <p className="text-white font-semibold">{draBalance.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="h-8 w-px bg-slate-700" />
        
        <div className="flex items-center gap-2">
          <Vote className="w-4 h-4 text-violet-400" />
          <div>
            <p className="text-slate-400 text-xs">投票权</p>
            <p className="text-white font-semibold">{votingPower.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="h-8 w-px bg-slate-700" />
        
        <div className="flex items-center gap-2">
          <Gift className="w-4 h-4 text-emerald-400" />
          <div>
            <p className="text-slate-400 text-xs">待领取收益</p>
            <p className="text-emerald-400 font-semibold">${pendingRewards.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}