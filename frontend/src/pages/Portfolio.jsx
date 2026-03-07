// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Lock, Hotel, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from '@/components/common/LanguageContext';
import { useAuthModal } from "@/context/AuthModalContext";
import { useAccount, useReadContract } from "wagmi";
import { HAT_TOKEN_ABI } from "@/contracts/abis";
import { HAT_TOKEN_ADDRESS } from "@/config/chains";
import { formatUnits } from "viem";
import apiClient from "@/utils/apiClient"; // ✅ Use apiClient instead of authFetch
import { toast } from "sonner";

export default function Portfolio() {

  const { openAuthModal } = useAuthModal();
  
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // 🔥 Wallet
  const { address, isConnected } = useAccount();
  const { data: hatBalanceRaw, refetch: refetchHatBalance } = useReadContract({
    address: HAT_TOKEN_ADDRESS,
    abi: HAT_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });
  const hatBalance = hatBalanceRaw ? Number(formatUnits(hatBalanceRaw, 18)) : 0;

  // 🔥 User
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  useEffect(() => {
    setUserLoading(true);
    apiClient.get("/auth/me")
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setUserLoading(false));
  }, []);

  // 🔥 Investments
  const { data: investmentsRaw = [], isLoading: investmentsLoading, refetch: refetchInvestments } = useQuery({
    queryKey: ["investments"],
    queryFn: async () => {
      const { data } = await apiClient.get("/investments");
      console.log("INVESTMENTS RAW DATA:", data);
      return data.data || [];
    },
    enabled: !!user,
  });

  // 🔥 Enrich investments using hotelAsset from API
  const enrichedInvestments = investmentsRaw.map(inv => ({
    ...inv,
    hotel: inv.hotelAsset || { name: "Unknown Hotel", location: "N/A", expectedYield: 0 },
    amount: Number(inv.investedAmount || inv.amount),
    tokenAmount: Number(inv.tokenAmount || 0),
    pendingRewards: Number(inv.pendingRewards || 0),
  }));

  // 🔥 Portfolio totals
  const totalInvested = enrichedInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalTokens = enrichedInvestments.reduce((sum, inv) => sum + (inv.tokenAmount || 0), 0);
  const totalProperties = enrichedInvestments.length;
  const totalPendingRewards = enrichedInvestments.reduce((sum, inv) => sum + (inv.pendingRewards || 0), 0);

  // 🔥 Refresh
  const refreshPortfolio = async () => {
    toast.info("Refreshing portfolio...");
    await Promise.all([refetchInvestments(), refetchHatBalance()]);
    toast.success("Portfolio refreshed!");
  };

  // 🔥 Claim rewards
  const claimRewardsMutation = useMutation({
    mutationFn: async (investment) => {
      const { data } = await apiClient.post(`/investments/${investment.id}/claim`);
      return data;
    },
    onSuccess: () => refetchInvestments(),
    onError: (err) => toast.error(`Failed to claim: ${err.message}`),
  });

  // 🔥 Delete investment
  const deleteInvestmentMutation = useMutation({
    mutationFn: async (investmentId) => {
      const { data } = await apiClient.delete(`/investments/${investmentId}`);
      return data;
    },
    onSuccess: () => refetchInvestments(),
    onError: (err) => toast.error(`Failed to delete: ${err.message}`),
  });
  const handleDeleteInvestment = (inv) => {
    if (window.confirm(`Delete investment of ${inv.tokenAmount.toFixed(2)} HAT from ${inv.hotel?.name}?`)) {
      deleteInvestmentMutation.mutate(inv.id);
    }
  };

  // 🔥 Loading screen
  if (userLoading || investmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl text-white font-bold">Loading Portfolio...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header + Totals */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              💎 My Portfolio
            </h1>
            <p className="text-xl text-slate-400 mt-2">Track your investments & rewards</p>
            {isConnected && <div className="text-sm text-slate-500 mt-2">Wallet: {address?.slice(0,6)}...{address?.slice(-4)}</div>}
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-black text-white mb-1">${totalInvested.toLocaleString()}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">Total Invested</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-400">{totalTokens.toFixed(2)}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">HAT Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-amber-400">{totalProperties}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">Properties</div>
            </div>
          </div>
          <Button onClick={refreshPortfolio} className="ml-auto bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        {/* Investments Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border p-2 rounded-2xl mb-8">
            <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-slate-900 font-bold rounded-xl">
              Active Investments
            </TabsTrigger>
            <TabsTrigger value="staked" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-bold rounded-xl">
              Staked Assets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {enrichedInvestments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrichedInvestments.map((inv, idx) => (
                  <Card key={inv.id || idx} className="bg-slate-900/50 border backdrop-blur-xl hover:border-amber-500/50 transition-all">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                          <Hotel className="w-6 h-6 text-amber-400" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-white">{inv.hotel?.name}</CardTitle>
                          <div className="flex gap-2 mt-1">
                            <Badge className="bg-emerald-500/20 text-emerald-400 font-bold text-xs">{inv.status}</Badge>
                            {inv.blockchainStatus && (
                              <Badge className={`font-bold text-xs ${
                                inv.blockchainStatus==='MINTED'?'bg-purple-500/20 text-purple-400':
                                inv.blockchainStatus==='PENDING'?'bg-yellow-500/20 text-yellow-400':'bg-slate-500/20 text-slate-400'
                              }`}>{inv.blockchainStatus}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Investment</div>
                          <div className="font-bold text-lg text-white">${inv.amount.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">HAT Tokens</div>
                          <div className="font-bold text-lg text-emerald-400">{inv.tokenAmount.toFixed(2)} HAT</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Location</div>
                          <div className="font-bold text-white">{inv.hotel?.location}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Yield</div>
                          <div className="font-bold text-lg text-amber-400">{inv.hotel?.expectedYield}%</div>
                        </div>
                      </div>
                      {inv.pendingRewards > 0 && (
                        <Button size="sm" onClick={()=>claimRewardsMutation.mutate(inv)}>Claim ${inv.pendingRewards.toFixed(2)}</Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-16 text-center bg-slate-900/50 border rounded-xl">
                <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-6 opacity-50"/>
                <h3 className="text-2xl font-bold text-white mb-3">No Active Investments</h3>
                <Link to={createPageUrl('Marketplace')}>
                  <Button className="bg-amber-500 text-slate-900 font-bold px-12 py-6">Browse Assets →</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="staked">
            <Card className="p-16 text-center bg-slate-900/50 border rounded-xl">
              <Lock className="w-16 h-16 text-slate-600 mx-auto mb-6 opacity-50"/>
              <h3 className="text-2xl font-bold text-white mb-3">Staking Coming Soon</h3>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}