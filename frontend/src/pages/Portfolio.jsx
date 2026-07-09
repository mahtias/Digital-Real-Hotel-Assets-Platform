// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Lock, Hotel, RefreshCw, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useLanguage } from '@/components/common/LanguageContext';
import { useAuthModal } from "@/context/AuthModalContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useAccount, useReadContract } from "wagmi";
import { useWalletClient } from "wagmi";
import { BrowserProvider } from "ethers";
import { HAT_TOKEN_ABI } from "@/contracts/abis";
import { HAT_TOKEN_ADDRESS } from "@/config/chains";
import { formatUnits } from "viem";
import { web3Service } from "@/services/web3Service";
import { STABLECOIN_REGISTRY } from "@/config/stablecoinRegistry";

const YIELD_VAULT_STABLECOIN = import.meta.env.VITE_YIELD_VAULT_STABLECOIN || "USDC";
const YIELD_VAULT_DECIMALS = STABLECOIN_REGISTRY[YIELD_VAULT_STABLECOIN]?.decimals ?? 6;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; 
export default function Portfolio() {
  const { openAuthModal } = useAuthModal();
  const { authFetch } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  //  Wallet
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: hatBalanceRaw, refetch: refetchHatBalance } = useReadContract({
    address: HAT_TOKEN_ADDRESS,
    abi: HAT_TOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true,
  });
  const {data: claimableYield,refetch: refetchClaimableYield,
} = useQuery({
  queryKey: ["claimable-yield", address],
  queryFn: async () => {
    if (!address) return "0";

    const res = await authFetch(
      `${API_URL}/api/v1/yield/claimable/${address}`
    );

    const json = await res.json();

    return json.claimable;
  },
  enabled: !!address,
});
useEffect(() => {
  if (!walletClient || !address) return;

  const initSigner = async () => {
    try {
      const provider = new BrowserProvider(
        walletClient.transport
      );

      const signer = await provider.getSigner();

      await web3Service.setSigner(signer);
    } catch (err) {
      console.error(
        "Portfolio signer init failed:",
        err
      );
    }
  };

  initSigner();
}, [walletClient, address]);

  const hatBalance = hatBalanceRaw ? Number(formatUnits(hatBalanceRaw, 18)) : 0;
  const claimableUSDC = claimableYield
    ? Number(formatUnits(BigInt(claimableYield), YIELD_VAULT_DECIMALS))
    : 0;

  //  User
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [draBalance, setDraBalance] = useState(0);
  useEffect(() => {
    setUserLoading(true);
    authFetch("/api/v1/auth/me")
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setUserLoading(false));
  }, [authFetch]);

  useEffect(() => {
    authFetch(`${API_URL}/api/v1/auth/dra-balance`)
      .then(res => res.json())
      .then(data => { if (data.success) setDraBalance(data.balance); })
      .catch(() => {});
  }, [authFetch]);

  //  Investments
const { data: investmentsRaw = [], isLoading: investmentsLoading, refetch: refetchInvestments } = useQuery({
  queryKey: ["investments"],
  queryFn: async () => {
    const res = await authFetch(`${API_URL}/api/v1/investments`);

    if (!res.ok) throw new Error("Failed to fetch investments");

    const json = await res.json();
    return json?.data ?? [];
  },
  enabled: !!localStorage.getItem("authToken"),
});

  //  Enrich investments using hotelAsset from API
const enrichedInvestments = investmentsRaw.map(inv => ({
  ...inv,
  hotel: inv.hotelAsset || { name: "Unknown Hotel", location: "N/A", expectedYield: 0 },
  amount: Number(inv.amount ?? 0),
  platformFee: Number(inv.platformFee ?? 0),
  netInvested: Number(inv.netInvested ?? 0),
  tokenAmount: inv.tokenAmount !== null && inv.tokenAmount !== undefined 
               ? Number(inv.tokenAmount) 
               : 0,
  pendingRewards: Number(inv.pendingRewards ?? 0),
}));

  // Performance data — fetched per unique hotel from user's investments
  const uniqueHotelIds = [...new Set(investmentsRaw.map(inv => inv.hotelAssetId).filter(Boolean))];
  const { data: performanceData = [] } = useQuery({
    queryKey: ["performance", uniqueHotelIds],
    queryFn: async () => {
      const results = await Promise.all(
        uniqueHotelIds.map(async (id) => {
          try {
            const res = await authFetch(`${API_URL}/api/v1/performance/${id}/history?limit=6`);
            const json = await res.json();
            return { hotelAssetId: id, history: json.data ?? [] };
          } catch {
            return { hotelAssetId: id, history: [] };
          }
        })
      );
      return results;
    },
    enabled: uniqueHotelIds.length > 0,
  });

  //  Portfolio totals
  const totalInvested = enrichedInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const totalTokens = enrichedInvestments.reduce((sum, inv) => sum + (inv.tokenAmount || 0), 0);
  const totalProperties = enrichedInvestments.length;
  const totalPendingRewards = claimableUSDC;
  const totalEarned = enrichedInvestments.reduce((sum, inv) => sum + Number(inv.earnedRewards ?? 0),0);

  //  Refresh
  const refreshPortfolio = async () => {
    toast.info("Refreshing portfolio...");
    await Promise.all([refetchInvestments(),
      refetchHatBalance(),
       refetchClaimableYield(),]);
    toast.success("Portfolio refreshed!");
  };

 const claimYieldMutation = useMutation({
  mutationFn: async () => {
    const receipt = await web3Service.claimYield();

    await authFetch(`${API_URL}/api/v1/yield/mark-claimed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, txHash: receipt.hash }),
    });

    return receipt;
  },

  onSuccess: async () => {
    toast.success("Yield claimed successfully!");
    await Promise.all([refetchClaimableYield(), refetchInvestments(), refetchHatBalance()]);
  },

  onError: (err) => {
    toast.error(err.message);
  },
});

  //  Delete investment
  const deleteInvestmentMutation = useMutation({
    mutationFn: async (investmentId) => {
      const res = await authFetch(`/api/v1/investments/${investmentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete investment");
      return res.json();
    },
    onSuccess: () => refetchInvestments(),
    onError: (err) => toast.error(`Failed to delete: ${err.message}`),
  });
  const handleDeleteInvestment = (inv) => {
    if (window.confirm(`Delete investment of ${inv.tokenAmount.toFixed(2)} HAT from ${inv.hotel?.name}?`)) {
      deleteInvestmentMutation.mutate(inv.id);
    }
  };

  //  Loading screen
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
            <div className="text-2xl font-black text-emerald-400">
              ${totalPendingRewards.toFixed(2)}
            </div>
            <div className="text-sm text-slate-500 uppercase tracking-wider">
              Pending Yield
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-green-500">
              ${totalEarned.toFixed(2)}
            </div>
            <div className="text-sm text-slate-500 uppercase tracking-wider">
              Total Earned
            </div>
          </div>
            <div className="text-center">
              <div className="text-2xl font-black text-amber-400">{totalProperties}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">Properties</div>
            </div>
            <div className="text-center border-l border-slate-700 pl-4">
              <div className="text-2xl font-black text-violet-400">{draBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div className="text-sm text-slate-500 uppercase tracking-wider">DRA Tokens</div>
            </div>
          </div>
          <div className="flex gap-3 ml-auto">
            {claimableUSDC > 0 && (
              <Button
                onClick={() => claimYieldMutation.mutate()}
                disabled={claimYieldMutation.isPending}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center gap-2"
              >
                {claimYieldMutation.isPending ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Claiming...</>
                ) : (
                  <>Claim ${claimableUSDC.toFixed(2)} USDC</>
                )}
              </Button>
            )}
            <Button
              onClick={refreshPortfolio}
              disabled={investmentsLoading}
              className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>
          </div>
        </div>

        {/* Investments Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border p-2 rounded-2xl mb-8">
            <TabsTrigger value="active" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-slate-900 font-bold rounded-xl">
              Active Investments
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white font-bold rounded-xl">
              Performance
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
                          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                            Investment
                          </div>
                          <div className="font-bold text-lg text-white">
                            ${inv.amount.toFixed(2)}
                          </div>
                        </div>

                        <div>
                          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                            Platform Fee
                          </div>
                          <div className="font-bold text-red-400">
                            ${inv.platformFee.toFixed(2)}
                          </div>
                        </div>

                        <div>
                          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                            Net Invested
                          </div>
                          <div className="font-bold text-emerald-400">
                            ${inv.netInvested.toFixed(2)}
                          </div>
                        </div>

                        <div>
                          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                            HAT Tokens
                          </div>
                          <div className="font-bold text-lg text-emerald-400">
                            {inv.tokenAmount.toFixed(2)} HAT
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Location</div>
                          <div className="font-bold text-white">{inv.hotel?.location}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Yield</div>
                          <div className="font-bold text-lg text-amber-400">{inv.hotel?.expectedYield}%</div>
                        </div>
                        <div className="col-span-2 mt-2">
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                          Earnings
                        </div>

                        <div className="flex flex-col gap-1 text-sm mt-1">
                      <span className="text-green-400">
                        Earned: ${Number(inv.earnedRewards ?? 0).toFixed(2)}
                      </span>
                      <span className="text-amber-400">
                        Pending: ${inv.pendingRewards.toFixed(2)}
                      </span>
                    </div>
                     <div className="text-xs text-slate-500 mt-1">
                      Total: ${(Number(inv.earnedRewards ?? 0) + inv.pendingRewards).toFixed(2)}
                    </div>
                    </div>
                      </div>
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

          <TabsContent value="performance">
            {performanceData.length === 0 ? (
              <Card className="p-16 text-center bg-slate-900/50 border rounded-xl">
                <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-6 opacity-50"/>
                <h3 className="text-2xl font-bold text-white mb-3">No Performance Data Yet</h3>
                <p className="text-slate-400">Performance records are generated monthly by the admin after bookings are completed.</p>
              </Card>
            ) : (
              <div className="flex flex-col gap-8">
                {performanceData.map(({ hotelAssetId, history }) => {
                  const hotel = enrichedInvestments.find(inv => inv.hotelAssetId === hotelAssetId)?.hotel;
                  if (!history.length) return null;
                  const latest = history[0];
                  return (
                    <Card key={hotelAssetId} className="bg-slate-900/50 border backdrop-blur-xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-400"/>
                          {hotel?.name ?? "Hotel"} — Performance
                        </CardTitle>
                        <p className="text-slate-400 text-sm">Latest period: {latest.period}</p>
                      </CardHeader>
                      <CardContent>
                        {/* Latest metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                            <div className="text-2xl font-black text-blue-400">{latest.occupancyRate}%</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Occupancy</div>
                          </div>
                          <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                            <div className="text-2xl font-black text-emerald-400">${Number(latest.totalRevenue).toLocaleString()}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Revenue</div>
                          </div>
                          <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                            <div className="text-2xl font-black text-amber-400">${Number(latest.revpar).toFixed(2)}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">RevPAR</div>
                          </div>
                          <div className="bg-slate-800/60 rounded-xl p-4 text-center">
                            <div className="text-2xl font-black text-green-400">${Number(latest.investorYield).toLocaleString()}</div>
                            <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Investor Yield</div>
                          </div>
                        </div>
                        {/* History table */}
                        {history.length > 1 && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead>
                                <tr className="text-slate-500 uppercase text-xs border-b border-slate-700">
                                  <th className="pb-2 pr-4">Period</th>
                                  <th className="pb-2 pr-4">Revenue</th>
                                  <th className="pb-2 pr-4">Occupancy</th>
                                  <th className="pb-2 pr-4">RevPAR</th>
                                  <th className="pb-2">Bookings</th>
                                </tr>
                              </thead>
                              <tbody>
                                {history.map((row) => (
                                  <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/40">
                                    <td className="py-2 pr-4 text-white font-medium">{row.period}</td>
                                    <td className="py-2 pr-4 text-emerald-400">${Number(row.totalRevenue).toLocaleString()}</td>
                                    <td className="py-2 pr-4 text-blue-400">{row.occupancyRate}%</td>
                                    <td className="py-2 pr-4 text-amber-400">${Number(row.revpar).toFixed(2)}</td>
                                    <td className="py-2 text-slate-300">{row.bookingCount}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
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