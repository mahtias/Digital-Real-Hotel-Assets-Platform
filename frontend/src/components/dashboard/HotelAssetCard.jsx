// @ts-nocheck
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

import { Star, MapPin, Leaf, TrendingUp, DollarSign, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from '@/components/common/LanguageContext';

//  WAGMI v2 → FIXED IMPORTS!
import { 
  useAccount, 
  useWriteContract 
} from 'wagmi';  //  Removed broken hooks
import { parseUnits, parseEther } from 'viem';  // Added parseEther

export default function HotelAssetCard({ hotel }) {
  const { t } = useLanguage();
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending, data: hash } = useWriteContract();  // ✅ v2 async!

  //  YOUR Investment.sol → invest(hotelId, usdcAmount)
  const investUSDC = async (amountUSD) => {
    if (!address || !isConnected) {
      toast.error("Connect your wallet first!");
      return;
    }

    try {
      toast.loading(`Investing $${amountUSD}...`);

      // ✅ WAGMI v2 → writeContractAsync returns hash!
      const hash = await writeContractAsync({
        address: import.meta.env.VITE_INVESTMENT_CONTRACT_ADDRESS,
        abi: [
          {
            name: 'invest',
            inputs: [
              { name: 'hotelId', type: 'uint256' },
              { name: 'usdcAmount', type: 'uint256' }
            ],
            outputs: [{ name: 'shares', type: 'uint256' }]
          }
        ],
        functionName: 'invest',
        args: [BigInt(hotel.id), parseUnits(amountUSD.toString(), 6)], //  BigInt + 6 decimals
      });

      toast.success(`✅ Tx: ${hash.slice(0, 10)}...`);
      
      // ✅ Poll for receipt (simple!)
      const checkReceipt = async () => {
        const receipt = await window.ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [hash],
        });
        if (receipt.status === '0x1') {
          toast.success(` ${hotel.name} shares minted!`);
        }
      };
      
      setTimeout(checkReceipt, 5000); // Check after 5s

    } catch (error) {
      console.error(error);
      toast.error(`Invest failed: ${error.shortMessage || error.message}`);
    }
  };

  // 📊 Progress calculation
  const soldPercentage = hotel.tokensSold && hotel.totalTokens
    ? (hotel.tokensSold / hotel.totalTokens) * 100
    : 0;

  const image = hotel.imageUrl || hotel.image || 
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600";

  const statusColors = {
    UPCOMING: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    ACTIVE: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    SOLD_OUT: "bg-slate-500/20 text-slate-400 border-slate-500/30"
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ACTIVE": return t('hotelCard.active');
      case "UPCOMING": return t('hotelCard.upcoming');
      case "SOLD_OUT": return t('hotelCard.soldOut');
      default: return status;
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
      {/* IMAGE + STATUS → SAME */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <Badge className={`absolute top-3 right-3 ${statusColors[hotel.status]} border`} variant="secondary">
          {getStatusLabel(hotel.status)}
        </Badge>
        {hotel.esgScore >= 80 && (
          <Badge className="absolute top-3 left-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" variant="secondary">
            <Leaf className="w-3 h-3 mr-1" />
            ESG {hotel.esgScore}
          </Badge>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white truncate">{hotel.name}</h3>
          <p className="text-slate-300 text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {hotel.location}, {hotel.country}
          </p>
        </div>
      </div>

      {/* BODY → SAME */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(hotel.starRating || 4)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-amber-400 font-mono font-bold text-sm">{hotel.tokenSymbol}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-slate-800/50 rounded-lg p-2.5">
            <p className="text-slate-400 text-xs uppercase tracking-wider">{t('hotelCard.tokenPrice')}</p>
            <p className="text-white font-semibold flex items-center gap-1">
              <DollarSign className="w-3 h-3" />${hotel.tokenPrice}
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2.5">
            <p className="text-slate-400 text-xs uppercase tracking-wider">{t('hotelCard.apy')}</p>
            <p className="text-emerald-400 font-semibold">
              <TrendingUp className="w-3 h-3 inline mr-1" />
              {hotel.apy}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 uppercase tracking-wider">{t('hotelCard.progress')}</span>
            <span className="text-white font-mono">{soldPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={Math.min(soldPercentage, 100)}
            className="h-1.5 bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-600"
          />
          <p className="text-xs text-slate-500 font-mono">
            {hotel.tokensSold?.toLocaleString()} / {hotel.totalTokens?.toLocaleString()} {t('hotelCard.tokens')}
          </p>
        </div>

        {/*  QUICK INVEST */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[25, 100, 500].map((amount) => (
            <Button
              key={amount}
              size="sm"
              variant="outline"
              onClick={() => investUSDC(amount)}
              disabled={isPending || soldPercentage >= 100 || !isConnected}
              className="h-9 text-xs border-slate-600 hover:border-emerald-500/50"
            >
              ${amount}
            </Button>
          ))}
        </div>

        {/*  MAIN BUTTON */}
        <Button 
          className="w-full h-11 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 
                     hover:from-emerald-600 hover:to-emerald-800 text-slate-900 font-semibold 
                     shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
          onClick={() => investUSDC(100)}
          disabled={isPending || soldPercentage >= 100 || !isConnected}
        >
          {isPending ? (
            <>
              <Wallet className="w-4 h-4 mr-2 animate-spin" />
              Confirming...
            </>
          ) : !isConnected ? (
            "Connect Wallet"
          ) : soldPercentage >= 100 ? (
            "Sold Out"
          ) : (
            `Invest $${hotel.tokenPrice}`
          )}
        </Button>

        <Link 
          to={createPageUrl(`HotelDetail?id=${hotel.id}`)}
          className="block w-full text-center text-xs text-slate-400 hover:text-slate-200 underline underline-offset-2 transition-colors"
        >
          {t('hotelCard.viewDetails')} →
        </Link>
      </div>
    </Card>
  );
}
