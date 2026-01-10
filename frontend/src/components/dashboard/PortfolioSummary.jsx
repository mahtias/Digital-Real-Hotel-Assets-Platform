// @ts-nocheck
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Wallet, TrendingUp, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from '@/components/common/LanguageContext';

export default function PortfolioSummary({ investments, totalValue, totalRewards }) {
  const { t } = useLanguage();

  return (
    <

    Card className="bg-gradient-to-br from-amber-500/10 via-slate-900/50 to-slate-900/50 border-amber-500/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Wallet 

          className="w-5 h-5 text-amber-400" />
          {t('common.myPortfolio')}
        </h3>
        <Link to={createPageUrl('Portfolio')}>
          < Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300">
            {t('home.viewAll')} <ArrowRight 

            className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <p className="text-slate-400 text-xs mb-1">{t('portfolio.totalInvested')}</p>
          <p className="text-2xl font-bold text-white">${totalValue?.toLocaleString() || '0'}</p>
        </div>
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <p className="text-slate-400 text-xs mb-1">{t('portfolio.totalEarned')}</p>
          <p className="text-2xl font-bold text-emerald-400 flex items-center justify-center gap-1">
            <TrendingUp 

            className="w-5 h-5" />
            ${totalRewards?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="text-center p-4 bg-slate-800/50 rounded-xl">
          <p className="text-slate-400 text-xs mb-1">{t('portfolio.pendingRewards')}</p>
          <p className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
            <Gift 

            className="w-5 h-5" />
            ${investments?.reduce((acc, inv) => acc + (inv.pending_rewards || 0), 0).toFixed(2) || '0'}
          </p>
        </div>
      </div>

      {investments && investments.length > 0 ? (
        <div className="space-y-3">
          {investments.slice(0, 3).map((inv, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
              <div>
                <p className="text-white font-medium text-sm">{inv.hotel_name || 'HAT Token'}</p>
                <p className="text-slate-400 text-xs">{inv.token_amount?.toLocaleString()} {t('hotelCard.tokens')}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">${inv.invested_amount?.toLocaleString()}</p>
                <p className="text-emerald-400 text-xs">+{((inv.earned_rewards / inv.invested_amount) * 100).toFixed(2)}%</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-400 mb-4">{t('portfolio.noInvestments')}</p>
          <Link to={createPageUrl('Marketplace')}>
            <

            Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              {t('portfolio.browseAssets')}
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}