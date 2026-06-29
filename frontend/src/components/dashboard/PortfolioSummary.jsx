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
  totalInvested,
  totalTokens,
  totalProperties,
  claimableUSDC  
}) {
  const { t } = useLanguage();

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
   <div className="flex gap-4 mb-6">
  <div className="text-center">
    <div className="text-2xl font-black text-white ">
      ${(totalInvested || 0).toLocaleString()}
    </div>
    <div className="text-sm text-slate-500 uppercase tracking-wider text-white">
      Total Invested
    </div>
  </div>

  <div className="text-center">
    <div className="text-2xl font-black text-emerald-400">
      {(totalTokens || 0).toFixed(2)}
    </div>
    <div className="text-sm text-slate-500 uppercase tracking-wider text-white">
      HAT Tokens
    </div>
  </div>

  <div className="text-center">
    <div className="text-2xl font-black text-amber-400">
      {totalProperties || 0}
    </div>
    <div className="text-sm text-slate-500 uppercase tracking-wider text-white">
      Properties
    </div>
  </div>

  <div className="text-center">
  <div className="text-2xl font-black text-green-400">
    ${Number(claimableUSDC || 0).toFixed(2)}
  </div>

  <div className="text-sm text-slate-500 uppercase tracking-wider text-white">
    Claimable Yield
  </div>
</div>
</div>

 {/* 🔥 INVESTMENT LIST */}
{investments && investments.length > 0 ? (
  <div className="space-y-3">
    {investments.slice(0, 3).map((inv, idx) => {

      const hotel =
        inv.hotel ||
        inv.hotelAsset || {
          name: "Unknown Hotel"
        };

      const amount =
        Number(inv.amount ?? 0);

      const tokenAmount =
        Number(inv.tokenAmount ?? 0);

     

      return (
        <div
          key={inv.id || idx}
          className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all"
        >
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
              🏨
            </div>

            <div>
              <p className="text-white font-medium text-sm">
                {hotel.name}
              </p>

              <p className="text-sm text-slate-400">
                {tokenAmount.toFixed(2)} HAT
              </p>
            </div>

          </div>

          <div className="text-right">

            <p className="text-white font-bold">
              ${amount.toFixed(2)}
            </p>

          </div>
        </div>
      );
    })}
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
