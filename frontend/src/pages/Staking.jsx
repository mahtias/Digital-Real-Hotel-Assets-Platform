// @ts-ignore
// @ts-ignore
// @ts-ignore
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Coins, Lock, Unlock, Gift, TrendingUp, Vote, Clock, CheckCircle, 
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  AlertTriangle, Sparkles, ArrowRight, Zap
// @ts-ignore
// @ts-ignore
} from "lucide-react";
// @ts-ignore
import { format, differenceInDays, addDays } from 'date-fns';
import { useLanguage } from '@/components/common/LanguageContext';

export default function Staking() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [showStakeDialog, setShowStakeDialog] = useState(false);
  const [stakeAmount, setStakeAmount] = useState(100);
  const [selectedPeriod, setSelectedPeriod] = useState(90);
  const [stakeSuccess, setStakeSuccess] = useState(false);
  const queryClient = useQueryClient();

  const draBalance = user?.dra_balance || 5000;

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  const { data: stakes = [], isLoading } = useQuery({
    queryKey: ['dra-staking', user?.email],
    // @ts-ignore
    queryFn: () => user ? base44.entities.DRAStaking.filter({ user_email: user.email }) : [],
    enabled: !!user,
  });

  const lockPeriodConfig = {
    30: { apy: 8, multiplier: 1.2 },
    90: { apy: 12, multiplier: 1.5 },
    180: { apy: 18, multiplier: 2 },
    365: { apy: 25, multiplier: 3 },
  };

  const stakeMutation = useMutation({
    mutationFn: async () => {
      const config = lockPeriodConfig[selectedPeriod];
      const startDate = new Date();
      // @ts-ignore
      const endDate = addDays(startDate, selectedPeriod);
      
      // @ts-ignore
      await base44.entities.DRAStaking.create({
        user_email: user.email,
        staked_amount: stakeAmount,
        lock_period_days: selectedPeriod,
        stake_start_date: startDate.toISOString(),
        stake_end_date: endDate.toISOString(),
        apy_rate: config.apy,
        earned_rewards: 0,
        claimed_rewards: 0,
        voting_power_multiplier: config.multiplier,
        status: 'active'
      });
    },
    onSuccess: () => {
      setStakeSuccess(true);
      // @ts-ignore
      queryClient.invalidateQueries(['dra-staking']);
      setTimeout(() => {
        setShowStakeDialog(false);
        setStakeSuccess(false);
        setStakeAmount(100);
      }, 2000);
    }
  });

  const claimMutation = useMutation({
    mutationFn: async (stakeId) => {
      const stake = stakes.find(s => s.id === stakeId);
      // @ts-ignore
      const daysPassed = differenceInDays(new Date(), new Date(stake.stake_start_date));
      const earned = (stake.staked_amount * stake.apy_rate / 100) * (daysPassed / 365);
      
      // @ts-ignore
      await base44.entities.DRAStaking.update(stakeId, {
        claimed_rewards: (stake.claimed_rewards || 0) + earned,
        earned_rewards: 0
      });
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(['dra-staking']);
    }
  });

  const unstakeMutation = useMutation({
    mutationFn: async (stakeId) => {
      // @ts-ignore
      await base44.entities.DRAStaking.update(stakeId, { status: 'completed' });
    },
    onSuccess: () => {
      // @ts-ignore
      queryClient.invalidateQueries(['dra-staking']);
    }
  });

  const activeStakes = stakes.filter(s => s.status === 'active');
  const totalStaked = activeStakes.reduce((acc, s) => acc + (s.staked_amount || 0), 0);
  const totalVotingPower = activeStakes.reduce((acc, s) => 
    acc + (s.staked_amount * (s.voting_power_multiplier || 1)), 0);
  const totalPendingRewards = activeStakes.reduce((acc, s) => {
    // @ts-ignore
    const daysPassed = differenceInDays(new Date(), new Date(s.stake_start_date));
    return acc + (s.staked_amount * s.apy_rate / 100) * (daysPassed / 365);
  }, 0);
  const avgApy = activeStakes.length > 0 
    ? activeStakes.reduce((acc, s) => acc + s.apy_rate, 0) / activeStakes.length 
    : 0;

  const expectedRewards = (stakeAmount * lockPeriodConfig[selectedPeriod].apy / 100);
  const votingBoost = stakeAmount * lockPeriodConfig[selectedPeriod].multiplier;

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <
// @ts-ignore
        Card className="bg-slate-900/50 border-slate-800 p-8 text-center max-w-md">
          <Coins 
// @ts-ignore
          className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl text-white font-semibold mb-2">{t('portfolio.loginRequired')}</h2>
          <p className="text-slate-400 mb-4">{t('portfolio.loginToView')}</p>
          <
// @ts-ignore
          Button 
            // @ts-ignore
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            {t('common.login')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Coins 
// @ts-ignore
              className="w-8 h-8 text-amber-400" />
              {t('staking.title')}
            </h1>
            <p className="text-slate-400">{t('staking.subtitle')}</p>
          </div>
          
          <Dialog open={showStakeDialog} onOpenChange={setShowStakeDialog}>
            <DialogTrigger asChild>
              <
// @ts-ignore
              Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold">
                <Lock 
// @ts-ignore
                className="w-4 h-4 mr-2" />
                {t('staking.stakeDra')}
              </Button>
            </DialogTrigger>
            <
// @ts-ignore
            DialogContent className="bg-slate-900 border-slate-800 max-w-md">
              <
// @ts-ignore
              DialogHeader>
                <
// @ts-ignore
                DialogTitle className="text-white flex items-center gap-2">
                  <Coins 
// @ts-ignore
                  className="w-5 h-5 text-amber-400" />
                  {t('staking.stakeDra')}
                </DialogTitle>
              </DialogHeader>
              
              {stakeSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle 
// @ts-ignore
                    className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl text-white font-semibold mb-2">{t('staking.stakeSuccess')}</h3>
                  <p className="text-slate-400">{t('staking.youStaked')} {stakeAmount} DRA</p>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  {/* Amount Input */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-slate-400 text-sm">{t('staking.stakeAmount')}</label>
                      <span className="text-slate-500 text-sm">{t('staking.available')}: {draBalance.toLocaleString()} DRA</span>
                    </div>
                    <div className="relative">
                      <Input
                        // @ts-ignore
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(Math.min(Number(e.target.value), draBalance))}
                        className="text-xl font-bold bg-slate-800 border-slate-700 text-white pr-16"
                      />
                      <
// @ts-ignore
                      Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-300"
                        onClick={() => setStakeAmount(draBalance)}
                      >
                        {t('staking.max')}
                      </Button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {[100, 500, 1000, 2500].map((amount) => (
                        <
// @ts-ignore
                        Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          className={`flex-1 border-slate-700 ${stakeAmount === amount ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'text-slate-400'}`}
                          onClick={() => setStakeAmount(amount)}
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Lock Period Selection */}
                  <div>
                    <label className="text-slate-400 text-sm mb-3 block">{t('staking.lockPeriod')}</label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(lockPeriodConfig).map(([days, config]) => (
                        <div
                          key={days}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedPeriod === Number(days)
                              ? 'bg-amber-500/10 border-amber-500'
                              : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                          }`}
                          onClick={() => setSelectedPeriod(Number(days))}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-semibold">{days} {t('staking.days')}</span>
                            <
// @ts-ignore
                            Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                              {config.apy}% APY
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Zap 
// @ts-ignore
                            className="w-3 h-3 text-violet-400" />
                            {t('staking.multipliers')[days]} {t('staking.votingBoost')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-slate-800/50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">{t('staking.expectedRewards')}</span>
                      <span className="text-emerald-400 font-semibold">+{expectedRewards.toFixed(2)} DRA/{t('staking.days').replace('天', 'year')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">{t('staking.votingBoost')}</span>
                      <span className="text-violet-400 font-semibold">{votingBoost.toLocaleString()} VP</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">{t('staking.unlockDate')}</span>
                      <span className="text-white">{
// @ts-ignore
                      format(addDays(new Date(), selectedPeriod), 'yyyy/MM/dd')}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                    <AlertTriangle 
// @ts-ignore
                    className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-amber-400 text-xs">{t('staking.earlyUnstakeFee')}</p>
                  </div>

                  <
// @ts-ignore
                  Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold"
                    onClick={() => stakeMutation.mutate()}
                    disabled={stakeMutation.isPending || stakeAmount <= 0}
                  >
                    {stakeMutation.isPending ? t('hotelDetail.processing') : t('staking.confirmStake')}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <
// @ts-ignore
          Card className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-amber-500/30 p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/20">
                <Lock 
// @ts-ignore
                className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{t('staking.totalStaked')}</p>
                <p className="text-2xl font-bold text-amber-400">{totalStaked.toLocaleString()} DRA</p>
              </div>
            </div>
          </Card>
          <
// @ts-ignore
          Card className="bg-slate-900/50 border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Gift 
// @ts-ignore
                className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{t('staking.pendingRewards')}</p>
                <p className="text-2xl font-bold text-emerald-400">{totalPendingRewards.toFixed(2)} DRA</p>
              </div>
            </div>
          </Card>
          <
// @ts-ignore
          Card className="bg-slate-900/50 border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-500/20">
                <TrendingUp 
// @ts-ignore
                className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{t('staking.avgApy')}</p>
                <p className="text-2xl font-bold text-sky-400">{avgApy.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
          <
// @ts-ignore
          Card className="bg-slate-900/50 border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-violet-500/20">
                <Vote 
// @ts-ignore
                className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{t('staking.votingPower')}</p>
                <p className="text-2xl font-bold text-violet-400">{totalVotingPower.toLocaleString()} VP</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Stakes */}
        <Tabs defaultValue="active" className="w-full">
          <
// @ts-ignore
          TabsList className="bg-slate-900/50 border border-slate-800">
            <
// @ts-ignore
            TabsTrigger value="active" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              {t('staking.activeStakes')} ({activeStakes.length})
            </TabsTrigger>
            <
// @ts-ignore
            TabsTrigger value="history" className="data-[state=active]:bg-amber-500 data-[state=active]:text-slate-900">
              {t('staking.stakingHistory')}
            </TabsTrigger>
          </TabsList>

          <
// @ts-ignore
          TabsContent value="active" className="mt-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <
// @ts-ignore
                  Card key={i} className="bg-slate-900/50 border-slate-800 p-6 animate-pulse">
                    <div className="h-20 bg-slate-800 rounded" />
                  </Card>
                ))}
              </div>
            ) : activeStakes.length > 0 ? (
              <div className="space-y-4">
                {activeStakes.map((stake) => {
                  // @ts-ignore
                  const daysLeft = differenceInDays(new Date(stake.stake_end_date), new Date());
                  const isUnlocked = daysLeft <= 0;
                  const progress = ((stake.lock_period_days - Math.max(0, daysLeft)) / stake.lock_period_days) * 100;
                  const pendingReward = (stake.staked_amount * stake.apy_rate / 100) * 
                    // @ts-ignore
                    (differenceInDays(new Date(), new Date(stake.stake_start_date)) / 365);

                  return (
                    <
// @ts-ignore
                    Card key={stake.id} className="bg-slate-900/50 border-slate-800 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                            {isUnlocked ? (
                              // @ts-ignore
                              <Unlock className="w-6 h-6 text-emerald-400" />
                            ) : (
                              // @ts-ignore
                              <Lock className="w-6 h-6 text-amber-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl font-bold text-white">{stake.staked_amount.toLocaleString()} DRA</span>
                              <
// @ts-ignore
                              Badge className={`${isUnlocked ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'} border`}>
                                {isUnlocked ? t('staking.unlocked') : t('staking.locked')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <TrendingUp 
// @ts-ignore
                                className="w-3 h-3 text-emerald-400" />
                                {stake.apy_rate}% APY
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap 
// @ts-ignore
                                className="w-3 h-3 text-violet-400" />
                                {stake.voting_power_multiplier}x VP
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock 
// @ts-ignore
                                className="w-3 h-3" />
                                {stake.lock_period_days} {t('staking.days')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 max-w-xs">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>{t('staking.unlockDate')}: {
// @ts-ignore
                            format(new Date(stake.stake_end_date), 'yyyy/MM/dd')}</span>
                            <span>{isUnlocked ? '100%' : `${Math.max(0, daysLeft)} ${t('staking.daysLeft')}`}</span>
                          </div>
                          <Progress 
// @ts-ignore
                          value={progress} className="h-2 bg-slate-800" />
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-slate-400 text-xs">{t('staking.pendingRewards')}</p>
                            <p className="text-emerald-400 font-bold text-lg">+{pendingReward.toFixed(4)} DRA</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <
// @ts-ignore
                            Button
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                              onClick={() => claimMutation.mutate(stake.id)}
                              disabled={claimMutation.isPending || pendingReward <= 0}
                            >
                              <Gift 
// @ts-ignore
                              className="w-4 h-4 mr-1" />
                              {t('staking.claimRewards')}
                            </Button>
                            {isUnlocked && (
                              <
// @ts-ignore
                              Button
                                size="sm"
                                variant="outline"
                                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                onClick={() => unstakeMutation.mutate(stake.id)}
                                disabled={unstakeMutation.isPending}
                              >
                                <Unlock 
// @ts-ignore
                                className="w-4 h-4 mr-1" />
                                {t('staking.unstake')}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <
// @ts-ignore
              Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                <Coins 
// @ts-ignore
                className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">{t('staking.noStakes')}</h3>
                <p className="text-slate-400 mb-4">{t('staking.startStaking')}</p>
                <
// @ts-ignore
                Button 
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900"
                  onClick={() => setShowStakeDialog(true)}
                >
                  <Lock 
// @ts-ignore
                  className="w-4 h-4 mr-2" />
                  {t('staking.stakeDra')}
                </Button>
              </Card>
            )}
          </TabsContent>

          <
// @ts-ignore
          TabsContent value="history" className="mt-6">
            {stakes.filter(s => s.status === 'completed').length > 0 ? (
              <div className="space-y-4">
                {stakes.filter(s => s.status === 'completed').map((stake) => (
                  <
// @ts-ignore
                  Card key={stake.id} className="bg-slate-900/50 border-slate-800 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-slate-800">
                          <CheckCircle 
// @ts-ignore
                          className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{stake.staked_amount.toLocaleString()} DRA</p>
                          <p className="text-slate-500 text-sm">
                            {
// @ts-ignore
                            format(new Date(stake.stake_start_date), 'yyyy/MM/dd')} - {format(new Date(stake.stake_end_date), 'yyyy/MM/dd')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-xs">{t('staking.earned')}</p>
                        <p className="text-emerald-400 font-semibold">+{(stake.claimed_rewards || 0).toFixed(2)} DRA</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <
// @ts-ignore
              Card className="bg-slate-900/50 border-slate-800 p-12 text-center">
                <Clock 
// @ts-ignore
                className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">{t('common.noData')}</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Staking Tiers Info */}
        <
// @ts-ignore
        Card className="bg-slate-900/50 border-slate-800 p-6 mt-8">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Sparkles 
// @ts-ignore
            className="w-5 h-5 text-amber-400" />
            {t('staking.lockPeriod')}
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(lockPeriodConfig).map(([days, config]) => (
              <div key={days} className="bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-white mb-1">{days}</p>
                <p className="text-slate-400 text-sm mb-3">{t('staking.days')}</p>
                <div className="space-y-2">
                  <
// @ts-ignore
                  Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-full justify-center">
                    {config.apy}% APY
                  </Badge>
                  <
// @ts-ignore
                  Badge className="bg-violet-500/20 text-violet-400 border border-violet-500/30 w-full justify-center">
                    {config.multiplier}x VP
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}