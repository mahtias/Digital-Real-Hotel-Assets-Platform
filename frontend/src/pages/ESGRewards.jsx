// @ts-nocheck
import React, { useState, useEffect } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthModal } from "@/context/AuthModalContext";
import { Leaf, Droplets, Wind, Recycle, Sparkles, CheckCircle, Clock, Gift, TrendingUp } from "lucide-react";
import { format } from 'date-fns';
import { useLanguage } from '@/components/common/LanguageContext';
import { useAuth } from "@/context/AuthContext";

export default function ESGRewards() {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  const { authFetch } = useAuth(); 
const { openAuthModal } = useAuthModal();

 useEffect(() => {
  authFetch("/api/v1/auth/me")
    .then(res => setUser(res.user))
    .catch(() => setUser(null));
}, []);

  const { data: rewards = [], isLoading } = useQuery({
  queryKey: ["esg-rewards", user?.email],
  queryFn: async () => {
    if (!user) return [];

    const res = await authFetch(
      `/api/v1/esg-rewards?email=${encodeURIComponent(user.email)}`
    );
    return res;
  },
  enabled: !!user,
});

  const claimMutation = useMutation({
  mutationFn: async (rewardId) => {
    await authFetch(`/api/v1/esg-rewards/${rewardId}/claim`, {
      method: "PATCH",
    });
  },
  onSuccess: () => {
    queryClient.invalidateQueries(["esg-rewards"]);
  }
});

  const actionTypes = {
    ac_off: { labelKey: 'esg.acOff', icon: Wind, color: 'text-sky-400', bgColor: 'bg-sky-500/10', reward: '$0.50' },
    towel_reuse: { labelKey: 'esg.towelReuse', icon: Recycle, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', reward: '$0.20' },
    no_cleaning: { labelKey: 'esg.noCleaning', icon: Sparkles, color: 'text-violet-400', bgColor: 'bg-violet-500/10', reward: '$0.30' },
    water_saving: { labelKey: 'esg.waterSaving', icon: Droplets, color: 'text-blue-400', bgColor: 'bg-blue-500/10', reward: '$0.15' },
    recycling: { labelKey: 'esg.recycling', icon: Leaf, color: 'text-green-400', bgColor: 'bg-green-500/10', reward: '$0.10' },
  };

  const totalEarned = rewards.filter(r => r.status === 'claimed').reduce((acc, r) => acc + (r.reward_amount || 0), 0);
  const pendingRewards = rewards.filter(r => r.status === 'verified').reduce((acc, r) => acc + (r.reward_amount || 0), 0);
  const totalActions = rewards.length;


  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Leaf 

            className="w-8 h-8 text-emerald-400" />
            {t('esg.title')}
          </h1>
          <p className="text-slate-400">{t('esg.subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <  Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <Gift 

                className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{t('esg.totalRewards')}</p>
                <p className="text-2xl font-bold text-emerald-400">${totalEarned.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          < Card className="bg-slate-900/50 border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/20">
                <Clock 

                className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{t('esg.pending')}</p>
                <p className="text-2xl font-bold text-amber-400">${pendingRewards.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-sky-500/20">
                <TrendingUp 

                className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{t('esg.actions')}</p>
                <p className="text-2xl font-bold text-white">{totalActions}</p>
              </div>
            </div>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800 p-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-green-500/20">
                <Leaf 

                className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{t('esg.carbonReduced')}</p>
                <p className="text-2xl font-bold text-green-400">{(totalActions * 0.5).toFixed(1)} kg</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Action Types */}
          <div className="lg:col-span-1">
            < Card className="bg-slate-900/50 border-slate-800 p-6">
              <h3 className="text-white font-semibold mb-4">{t('esg.rewardableActions')}</h3>
              <div className="space-y-3">
                {Object.entries(actionTypes).map(([key, action]) => {
                  const ActionIcon = action.icon;
                  return (
                    <div key={key} className={`${action.bgColor} rounded-lg p-3 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <ActionIcon 

                        className={`w-5 h-5 ${action.color}`} />
                        <span className="text-white text-sm">{t(action.labelKey)}</span>
                      </div>
                      <span className={`font-semibold ${action.color}`}>{action.reward}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                <h4 className="text-white font-medium mb-2">{t('esg.howToEarn')}</h4>
                <ol className="text-slate-400 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">1.</span>
                    {t('esg.step1')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">2.</span>
                    {t('esg.step2')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">3.</span>
                    {t('esg.step3')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">4.</span>
                    {t('esg.step4')}
                  </li>
                </ol>
              </div>
            </Card>
          </div>

          {/* Rewards History */}
          <div className="lg:col-span-2">
            < Card className="bg-slate-900/50 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">{t('esg.rewardHistory')}</h3>
                {pendingRewards > 0 && (
                  <

                  Button 
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => {
                      rewards.filter(r => r.status === 'verified').forEach(r => {
                        claimMutation.mutate(r.id);
                      });
                    }}
                  >
                    <CheckCircle 

                    className="w-4 h-4 mr-1" />
                    {t('esg.claimAll')}
                  </Button>
                )}
              </div>

               {!user ? (
      <div className="text-center py-12">
        <Leaf className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400">{t('esg.loginToView')}</p>

            <Button  className="mt-4 bg-amber-500 hover:bg-amber-600 text-slate-900"
                 onClick={() => openAuthModal("login")}
               >
                  {t("common.login")}
               </Button>
      </div>
    ) : isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />
                  ))}
                </div> 
                
                

                
              ) : rewards.length > 0 ? (
                <div className="space-y-3">
                  {rewards.map((reward) => {
                    const action = actionTypes[reward.action_type] || actionTypes.ac_off;
                    const ActionIcon = action.icon;
                    
                    return (
                      <div key={reward.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-lg ${action.bgColor}`}>
                            <ActionIcon className={`w-5 h-5 ${action.color}`} />
                          </div>
                          <div>
                            <p className="text-white font-medium">{t(action.labelKey)}</p>
                            <p className="text-slate-500 text-xs">
                              {

                              format(new Date(reward.created_date), 'yyyy/MM/dd HH:mm')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className={`font-semibold ${action.color}`}>
                            +${reward.reward_amount?.toFixed(2)}
                          </span>
                          < Badge className={`${
                            reward.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                            reward.status === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            'bg-slate-500/20 text-slate-400 border-slate-500/30'
                          } border`}>
                            {t(`esg.status.${reward.status}`)}
                          </Badge>
                          {reward.status === 'verified' && (
                            <

                            Button 
                              size="sm" 
                              variant="outline"
                              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                              onClick={() => claimMutation.mutate(reward.id)}
                              disabled={claimMutation.isPending}
                            >
                              {t('esg.claim')}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Leaf 

                  className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl text-white mb-2">{t('esg.noRewards')}</h3>
                  <p className="text-slate-400">{t('esg.stayToEarn')}</p>
                </div>
              )}
            </Card>

            {/* ESG Impact */}
            < Card className="bg-slate-900/50 border-slate-800 p-6 mt-6">
              <h3 className="text-white font-semibold mb-4">{t('esg.impact')}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-3xl font-bold text-sky-400">{(totalActions * 2.5).toFixed(0)}</p>
                  <p className="text-slate-400 text-sm mt-1">{t('esg.waterSaved')}</p>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-3xl font-bold text-amber-400">{(totalActions * 1.2).toFixed(1)}</p>
                  <p className="text-slate-400 text-sm mt-1">{t('esg.energySaved')}</p>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-3xl font-bold text-green-400">{(totalActions * 0.5).toFixed(1)}</p>
                  <p className="text-slate-400 text-sm mt-1">{t('esg.carbonReduction')}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}