import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, TrendingUp, Gift, Lock, Unlock, Building2, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TokenBalance from "@/components/common/TokenBalance";

export default function Portfolio() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ['investments', user?.email],
    queryFn: () => user ? base44.entities.Investment.filter({ user_email: user.email }) : [],
    enabled: !!user,
  });

  const { data: hotels = [] } = useQuery({
    queryKey: ['all-hotels'],
    queryFn: () => base44.entities.HotelAsset.list(),
  });

  const hotelMap = hotels.reduce((acc, hotel) => {
    acc[hotel.id] = hotel;
    return acc;
  }, {});

  const enrichedInvestments = investments.map(inv => ({
    ...inv,
    hotel: hotelMap[inv.hotel_asset_id]
  }));

  const totalInvested = investments.reduce((acc, inv) => acc + (inv.invested_amount || 0), 0);
  const totalEarned = investments.reduce((acc, inv) => acc + (inv.earned_rewards || 0), 0);
  const totalPending = investments.reduce((acc, inv) => acc + (inv.pending_rewards || 0), 0);
  const totalStaked = investments.reduce((acc, inv) => acc + (inv.staked_amount || 0), 0);

  const claimRewardsMutation = useMutation({
    mutationFn: async (investment) => {
      await base44.entities.Investment.update(investment.id, {
        earned_rewards: (investment.earned_rewards || 0) + (investment.pending_rewards || 0),
        pending_rewards: 0
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['investments']);
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="bg-slate-900/50 border-slate-800 p-8 text-center max-w-md">
          <Wallet className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl text-white font-semibold mb-2">请先登录</h2>
          <p className="text-slate-400 mb-4">登录后查看您的投资组合</p>
          <Button 
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            登录
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-amber-400" />
            我的投资组合
          </h1>
          <p className="text-slate-400">管理您的酒店代币投资和收益</p>
        </div>

        {/* Token Balance */}
        <div className="mb-6">
          <TokenBalance 
            draBalance={user?.dra_balance || 1500}
            votingPower={user?.voting_power || 1500}
            pendingRewards={totalPending}
          />
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-800 p-5">
            <p className="text-slate-400 text-sm">总投资额</p>
            <p className="text-2xl font-bold text-white mt-1">${totalInvested.toLocaleString()}</p>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 p-5">
            <p className="text-slate-400 text-sm">累计收益</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              ${totalEarned.toFixed(2)}
            </p>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 p-5">
            <p className="text-slate-400 text-sm">待领取收益</p>
            <p className="text-2xl font-bold text-amber-400 mt-1 flex items-center gap-2">
              <Gift className="w-5 h-5" />
              ${totalPending.toFixed(2)}
            </p>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 p-5">
            <p className="text-slate-400 text-sm">已质押代币</p>
            <p className="text-2xl font-bold text-violet-400 mt-1 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              {totalStaked.toLocaleString()}
            </p>
          </Card>
        </div>

        {/* Investments */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="active" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              活跃投资 ({enrichedInvestments.filter(i => i.status === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="staked" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              质押中 ({enrichedInvestments.filter(i => i.status === 'staked').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {enrichedInvestments.filter(i => i.status === 'active').length > 0 ? (
              <div className="space-y-4">
                {enrichedInvestments.filter(i => i.status === 'active').map((inv) => (
                  <Card key={inv.id} className="bg-slate-900/50 border-slate-800 p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800">
                          <img 
                            src={inv.hotel?.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200'}
                            alt={inv.hotel?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{inv.hotel?.name || '酒店资产'}</h3>
                          <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs">
                            {inv.hotel?.token_symbol || 'HAT'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 text-center">
                        <div>
                          <p className="text-slate-400 text-xs">持有代币</p>
                          <p className="text-white font-semibold">{inv.token_amount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">投资金额</p>
                          <p className="text-white font-semibold">${inv.invested_amount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">待领收益</p>
                          <p className="text-emerald-400 font-semibold">${inv.pending_rewards?.toFixed(2) || '0.00'}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {inv.pending_rewards > 0 && (
                          <Button 
                            size="sm" 
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={() => claimRewardsMutation.mutate(inv)}
                            disabled={claimRewardsMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            领取
                          </Button>
                        )}
                        <Link to={createPageUrl(`HotelDetail?id=${inv.hotel_asset_id}`)}>
                          <Button size="sm" variant="outline" className="border-slate-700 text-slate-300">
                            详情 <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">暂无投资</h3>
                <p className="text-slate-400 mb-4">开始投资代币化酒店资产，享受稳定收益</p>
                <Link to={createPageUrl('Marketplace')}>
                  <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                    浏览酒店资产
                  </Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="staked" className="mt-6">
            <Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
              <Lock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-2">暂无质押</h3>
              <p className="text-slate-400">质押您的代币以获得更高收益和投票权</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}