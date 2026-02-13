// @ts-nocheck
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from '@/components/common/LanguageContext';

export default function PortfolioSummary({ 
  investments, 
  totalValue, 
  totalRewards,
  hatBalance = 0,  // 🔥 NEW: Wallet HAT balance
  hatPrice = 20    // 🔥 HAT price $20
}) {
  const { t } = useLanguage();

  // 🔥 Calculate pending rewards
  const pendingRewards = investments?.reduce((acc, inv) => acc + (inv.pending_rewards || 0), 0) || 0;

  return (
    <Card className="bg-gradient-to-br from-amber-500/10 via-slate-900/50 to-slate-900/50 border-amber-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Wallet className="w-5 h-5 text-amber-400" />
          {t('common.myPortfolio')}
        </h3>
        <Link to={createPageUrl('Portfolio')}>
          <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
            {t('home.viewAll')} <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* 🔥 4-CARD STATS WITH WALLET HAT */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total Invested */}
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <p className="text-slate-400 text-xs mb-1">{t('portfolio.totalInvested')}</p>
          <p className="text-xl md:text-2xl font-bold text-white">${totalValue?.toLocaleString() || '0'}</p>
        </div>

        {/* 🔥 WALLET HAT BALANCE */}
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <p className="text-slate-400 text-xs mb-1">HAT Wallet</p>
          <p className="text-xl md:text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
            {hatBalance?.toFixed(2) || '0'} HAT
            <span className="text-sm font-normal text-white ml-1">
              ${((hatBalance || 0) * hatPrice).toLocaleString()}
            </span>
          </p>
        </div>

        {/* Total Earned */}
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <p className="text-slate-400 text-xs mb-1">{t('portfolio.totalEarned')}</p>
          <p className="text-xl md:text-2xl font-bold text-emerald-400 flex items-center justify-center gap-1">
            <TrendingUp className="w-5 h-5" />
            ${totalRewards?.toLocaleString() || '0'}
          </p>
        </div>

        {/* Pending Rewards */}
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <p className="text-slate-400 text-xs mb-1">{t('portfolio.pendingRewards')}</p>
          <p className="text-xl md:text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
            <Gift className="w-5 h-5" />
            ${pendingRewards.toFixed(2)}
          </p>
        </div>
      </div>

      {/* 🔥 INVESTMENT LIST */}
      {investments && investments.length > 0 ? (
        <div className="space-y-3">
          {investments.slice(0, 3).map((inv, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  🏨
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{inv.hotel_name || inv.hotelAsset?.name || 'HAT Hotel'}</p>
                  <p className="text-slate-400 text-xs">
                    {inv.token_amount?.toLocaleString() || inv.amount} HAT
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">${(inv.invested_amount || inv.amount)?.toLocaleString()}</p>
                <p className="text-emerald-400 text-xs">
                  +{(((inv.earned_rewards || 0) / (inv.invested_amount || 1)) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-400 mb-4">{t('portfolio.noInvestments')}</p>
          <Link to={createPageUrl('Marketplace')}>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              {t('portfolio.browseAssets')}
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
