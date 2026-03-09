// @ts-nocheck
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { web3Service } from "@/services/web3Service";
import { useWalletClient } from "wagmi";
import { useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import { 
  ArrowLeft, MapPin, Star, TrendingUp, Shield, Leaf, 
  DollarSign, Users, Calendar, Award, ChevronRight, CheckCircle, XCircle,
  Building, Coins
} from "lucide-react";
import { useLanguage } from '@/components/common/LanguageContext';
import { useAuth } from "@/context/AuthContext";
import { HOTEL_TOKEN_ABI, KYC_ABI, HAT_TOKEN_ABI, HOTEL_ASSET_MANAGER_ABI } from '@/contracts/abis';
import {  KYC_CONTRACT_ADDRESS , HOTEL_ASSET_MANAGER_ADDRESS  } from '@/contracts/config';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function HotelDetail() {
  
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { authFetch, user } = useAuth();
  const { address, isConnected } = useAccount();

  const [investmentAmount, setInvestmentAmount] = useState('');
  const [hatAmount, setHatAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
 const { data: walletClient } = useWalletClient();
  console.log("🔍 Hotel ID from URL:", id);
  console.log("👛 Wallet Address:", address);


useEffect(() => {
  if (!walletClient) return;

  (async () => {
    try {
      const { BrowserProvider } = await import("ethers");

      const provider = new BrowserProvider(
        walletClient.transport as any
      );

      const signer = await provider.getSigner();

      await web3Service.setSigner(signer);

      console.log("Signer ready:", await signer.getAddress());
    } catch (error) {
      console.error("Signer error:", error);
    }
  })();
}, [walletClient]);


  // ===================================
  // 📍 FETCH HOTEL FROM BACKEND
  // ===================================
  const { data: hotel, isLoading: isLoadingHotel, error: hotelError } = useQuery({
    queryKey: ['hotel', id],
    queryFn: async () => {
      if (!id) throw new Error('No hotel ID provided');
      
      console.log('📡 Fetching hotel:', id);
      //const res = await apiClient.get(`/hotels/${id}`);
      const res = await fetch(`${API_URL}/api/v1/hotels/${id}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Hotel not found');
      }
      
      const data = await res.json();
      console.log('✅ Hotel data received:', data);
      return data;
    },
    enabled: !!id,
  });

  
// 🔐 KYC VERIFICATION
const backendKycApproved = user?.kycStatus === 'APPROVED';

const { data: isVerified, isLoading: isLoadingKyc } = useReadContract({
  address: KYC_CONTRACT_ADDRESS,
  abi: KYC_ABI,
  functionName: 'isKYCVerified',
  args: address ? [address] : undefined,
  query: { enabled: !!address && isConnected }
});

const blockchainKycApproved = Boolean(isVerified);
const isFullyKycApproved = backendKycApproved && blockchainKycApproved;

// 🏨 GET HOTEL TOKEN ADDRESS (after hotel loads)
const hotelTokenAddress = hotel?.tokenAddress as `0x${string}` | undefined;
const blockchainId = hotel?.blockchainId;

console.log("🏨 Hotel Token Address:", hotelTokenAddress);
console.log("🔢 Blockchain ID:", blockchainId);

const { data: isHotelAvailable, isLoading: isLoadingHotelOnChain } = useReadContract({
  address: HOTEL_ASSET_MANAGER_ADDRESS,
  abi: HOTEL_ASSET_MANAGER_ABI,
  functionName: "isHotelAvailable",
  args: blockchainId !== undefined ? [blockchainId] : undefined,
  query: { enabled: !!hotelTokenAddress && blockchainId !== undefined },
});

// Hotel fundraising status
const isActive = hotel?.status === "FUNDRAISING";

// Final invest permission
const canInvest = isActive && Boolean(isHotelAvailable) && isFullyKycApproved;

console.log("Hotel DB status:", hotel?.status);
console.log("Hotel OnChain:", isHotelAvailable);
console.log("Final Can Invest:", canInvest);
console.log('🔐 KYC Status:', {
  backendKycApproved,
  blockchainKycApproved,
  isFullyKycApproved
});

  // ===================================
  // 🏨 FETCH HOTEL DATA FROM BLOCKCHAIN
  // ===================================

  // Name
  const { data: hotelName } = useReadContract({
    address: hotelTokenAddress,
    abi: HOTEL_TOKEN_ABI,
    functionName: 'name',
    query: { enabled: !!hotelTokenAddress }
  });

  // Symbol
  const { data: hotelSymbol } = useReadContract({
    address: hotelTokenAddress,
    abi: HOTEL_TOKEN_ABI,
    functionName: 'symbol',
    query: { enabled: !!hotelTokenAddress }
  });

  // Token Price in USD
  const { data: tokenPriceUSD } = useReadContract({
    address: hotelTokenAddress,
    abi: HOTEL_TOKEN_ABI,
    functionName: 'tokenPriceUSD',
    query: { enabled: !!hotelTokenAddress }
  });

  // Max Supply
  const { data: maxSupply } = useReadContract({
    address: hotelTokenAddress,
    abi: HOTEL_TOKEN_ABI,
    functionName: 'maxSupply',
    query: { enabled: !!hotelTokenAddress }
  });

  // Total Supply
  const { data: totalSupply } = useReadContract({
    address: hotelTokenAddress,
    abi: HOTEL_TOKEN_ABI,
    functionName: 'totalSupply',
    query: { enabled: !!hotelTokenAddress }
  });

  // Expected APY
  const { data: expectedAPY } = useReadContract({
    address: hotelTokenAddress,
    abi: HOTEL_TOKEN_ABI,
    functionName: 'expectedAPY',
    query: { enabled: !!hotelTokenAddress }
  });

  // Is Active
  // const { data: isActive } = useReadContract({
  //   address: hotelTokenAddress,
  //   abi: HOTEL_TOKEN_ABI,
  //   functionName: 'isActive',
  //   query: { enabled: !!hotelTokenAddress }
  // });

  // User's Hotel Token Balance
  const { data: userTokenBalance } = useReadContract({
    address: hotelTokenAddress,
    abi: HOTEL_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!hotelTokenAddress && !!address }
  });

  // User's HAT Balance
  const { data: userHatBalance } = useReadContract({
    //address: HAT_TOKEN_ADDRESS,
    abi: HAT_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // ===================================
  // 💰 INVESTMENT LOGIC
  // ===================================

  const { writeContractAsync, isPending, data: hash } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  
const handleInvest = async () => {
  if (!isHotelAvailable) {
    toast.error("Cannot invest: Hotel not verified on-chain");
    return;
  }

  if (!hotel?.blockchainId || !hotel.id) {
    toast.error("Hotel blockchain ID not available");
    return;
  }

  if (!walletClient) {
    toast.error("Wallet not connected");
    return;
  }

  const numericAmount = Number(investmentAmount);
  if (!numericAmount || numericAmount < 1) {
    toast.error("Minimum investment is $1");
    return;
  }

 try {
  setLoading(true);
  setIsInvesting(true);

  const provider = new BrowserProvider(walletClient.transport as any);
  const signer = await provider.getSigner();
  await web3Service.setSigner(signer);

  const walletAddress = await signer.getAddress();
  console.log("Using wallet:", walletAddress);

  const receipt = await web3Service.investOnBlockchain(
    hotel.blockchainId,
    hotel.id,
    numericAmount
  );

  console.log("Investment TX:", receipt.hash);

  toast.success("🎉 Investment successful! Tokens added to your portfolio.");
 
  setInvestmentAmount("");
  setHatAmount("");
 
  setTimeout(() => {
    navigate("/portfolio");
  }, 1500);

} catch (err: any) {
  console.error(err);
  toast.error(err.response?.data?.error || err.message || "Investment failed");
} finally {
  setLoading(false);
  setIsInvesting(false);
}
};

  // const handleInvest = async () => {
  //   if (!hatAmount || parseFloat(hatAmount) <= 0) {
  //     toast.error('Please enter a valid amount');
  //     return;
  //   }

  //   if (!hotelTokenAddress || blockchainId === undefined) {
  //     toast.error('Hotel token address not available');
  //     return;
  //   }

  //   try {
  //     setIsInvesting(true);
  //     const hatAmountWei = parseUnits(hatAmount, 18);

  //     console.log('💰 Investing:', {
  //       hotelId: hotel.id,
  //       blockchainId,
  //       amount: hatAmount,
  //       hatAmount: hatAmountWei.toString(),
  //     });

  //     // Step 1: Approve HAT tokens
  //     toast.info("Approving HAT tokens...");
  //     const approveTx = await writeContractAsync({
  //       address: HAT_TOKEN_ADDRESS,
  //       abi: HAT_TOKEN_ABI,
  //       functionName: 'approve',
  //       args: [hotelTokenAddress, hatAmountWei],
  //     });
  //     console.log('✅ Approve TX:', approveTx);

  //     // Step 2: Invest
  //     toast.info("Processing investment...");
  //     const investTx = await writeContractAsync({
  //       address: hotelTokenAddress,
  //       abi: HOTEL_TOKEN_ABI,
  //       functionName: 'invest',
  //       args: [hatAmountWei],
  //     });
  //     console.log('✅ Invest TX:', investTx);

  //     // Step 3: Save to backend
  //     const investData = {
  //       hotelId: hotel.id,
  //       amount: parseFloat(hatAmount),
  //       walletAddress: address,
  //       userId: user?.id,
  //       tokenAmount: parseFloat(hatAmount) / parseFloat(tokenPriceFormatted),
  //       txHash: investTx,
  //       blockchainId: blockchainId,
  //     };

  //     console.log('📤 Saving investment to backend:', investData);
  //     const res = await authFetch('/api/v1/investments', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(investData),
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(errorData.message || 'Failed to save investment');
  //     }

  //     const data = await res.json();
  //     console.log('✅ Backend response:', data);

  //     toast.success(`Successfully invested ${hatAmount} HAT!`);
  //     setInvestmentAmount('');
  //     setHatAmount('');

  //   } catch (error: any) {
  //     console.error('❌ Investment error:', error);
  //     toast.error(error.message || 'Investment failed');
  //   } finally {
  //     setIsInvesting(false);
  //   }
  // };

  // ===================================
  // 📊 CALCULATE DERIVED DATA
  // ===================================

  const tokenPriceFormatted = tokenPriceUSD ? Number(formatUnits(tokenPriceUSD, 6)).toFixed(2) : "0.00";
  const maxSupplyFormatted = maxSupply ? Number(formatUnits(maxSupply, 18)).toLocaleString() : "0";
  const totalSupplyFormatted = totalSupply ? Number(formatUnits(totalSupply, 18)).toLocaleString() : "0";
  const soldPercentage = maxSupply && totalSupply 
    ? (Number(totalSupply) / Number(maxSupply)) * 100 
    : 0;
  const apyFormatted = expectedAPY ? Number(expectedAPY) / 100 : 0;
  const userBalanceFormatted = userTokenBalance ? Number(formatUnits(userTokenBalance, 18)).toFixed(4) : "0.00";
  const userHatBalanceFormatted = userHatBalance ? Number(formatUnits(userHatBalance, 18)).toFixed(2) : "0.00";

  // ===================================
  // 🎨 LOADING & ERROR STATES
  // ===================================

  if (isLoadingHotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading hotel details...</div>
      </div>
    );
  }

  if (hotelError || !hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <Card className="bg-slate-900/50 border-slate-800 p-8 max-w-md">
          <h2 className="text-white text-2xl font-bold mb-4">❌ Hotel Not Found</h2>
          <p className="text-slate-400 mb-6">
            {hotelError?.message || `Invalid hotel ID: ${id}`}
          </p>
          <Button onClick={() => navigate('/marketplace')} className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
        </Card>
      </div>
    );
  }

  const image = hotel.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* 🔙 BACK BUTTON */}
      <div className="container mx-auto px-4 py-6">
        <Button 
          onClick={() => navigate(-1)}
          variant="ghost" 
          className="text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hotels
        </Button>
      </div>

      {/* 🖼️ HERO IMAGE */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        {/* 🏷️ BADGES */}
        <div className="absolute top-6 right-6 flex gap-3">
          <Badge className="bg-emerald-500/90 text-white px-4 py-2 text-sm backdrop-blur-sm flex items-center gap-2">
            <Building className="w-4 h-4" />
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
          <Badge className="bg-blue-500/90 text-white px-4 py-2 text-sm backdrop-blur-sm flex items-center gap-2">
            <Coins className="w-4 h-4" />
            {hotelSymbol || hotel.tokenSymbol}
          </Badge>
        </div>
      </div>

      {/* 📝 CONTENT */}
      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 🏨 LEFT: HOTEL INFO */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/50 border-slate-800 p-8">
              <h1 className="text-4xl font-bold text-white mb-4">{hotelName || hotel.name}</h1>

              <div className="flex items-center gap-4 text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {hotel.location}
                </div>
              </div>

              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                {hotel.description || `Invest in ${hotel.name} using HAT tokens and earn returns from hotel revenue.`}
              </p>

              {/* 📊 STATS GRID */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                  <DollarSign className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">${tokenPriceFormatted}</div>
                  <div className="text-xs text-slate-400">Token Price (USD)</div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                  <TrendingUp className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{apyFormatted}%</div>
                  <div className="text-xs text-slate-400">Expected APY</div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                  <Coins className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{maxSupplyFormatted}</div>
                  <div className="text- xs text-slate-400">Max Supply</div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg text-center">
                  <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{totalSupplyFormatted}</div>
                  <div className="text-xs text-slate-400">Total Sold</div>
                </div>
              </div>
            </Card>

            {/* 📊 FUNDING PROGRESS */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h3 className="text-white font-bold text-lg mb-4">Funding Progress</h3>
              <Progress value={soldPercentage} className="h-3 mb-3" />
              <div className="flex justify-between text-sm text-slate-300">
                <span>{totalSupplyFormatted} / {maxSupplyFormatted} Tokens</span>
                <span className="font-bold">{soldPercentage.toFixed(1)}%</span>
              </div>
            </Card>

            {/* 📍 CONTRACT INFO */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h3 className="text-white font-bold text-lg mb-4">Contract Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Hotel Token Address:</span>
                  <code className="text-emerald-400">{hotelTokenAddress?.slice(0, 10)}...{hotelTokenAddress?.slice(-8)}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Symbol:</span>
                  <span className="text-white font-mono">{hotelSymbol || hotel.tokenSymbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Blockchain ID:</span>
                  <span className="text-white font-mono">{blockchainId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <Badge variant={isActive ? "default" : "destructive"}>
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* 💰 RIGHT: INVESTMENT PANEL */}
          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800 p-6 sticky top-6">
              <h3 className="text-white font-bold text-xl mb-6">💎 Invest Now</h3>

              {isConnected ? (
                <>
                  {/* 🔐 KYC STATUS DISPLAY */}
                  <div className="mb-6 p-4 bg-slate-800/50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Backend KYC:</span>
                      <div className="flex items-center gap-2">
                        {backendKycApproved ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-semibold">APPROVED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400 font-semibold">{user?.kycStatus || 'PENDING'}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Blockchain KYC:</span>
                      <div className="flex items-center gap-2">
                        {isLoadingKyc ? (
                          <span className="text-slate-400">Loading...</span>
                        ) : blockchainKycApproved ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-semibold">VERIFIED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-400" />
                            <span className="text-red-400 font-semibold">NOT VERIFIED</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {isFullyKycApproved ? (
                    <>
                    {console.log(
    'isInvesting:', isInvesting,
    'isActive:', isActive,
    'hotelTokenAddress:', hotelTokenAddress
  )}
                      {/* 💰 YOUR BALANCE */}
                      {/* <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-400 text-sm">Your HAT Balance</span>
                          <span className="text-white font-bold text-lg">{userHatBalanceFormatted} HAT</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 text-sm">Your Hotel Tokens</span>
                          <span className="text-emerald-400 font-bold text-lg">{userBalanceFormatted} {hotelSymbol}</span>
                        </div>
                      </div> */}

                      {/* 💵 INVESTMENT FORM */}
   <div className="space-y-4 mb-6">
  <div>
    <label className="text-slate-400 text-sm mb-2 block">
      Investment Amount (USD)
    </label>

    <input
      type="number"
      placeholder="0.00"
      value={investmentAmount}
      onChange={(e) => setInvestmentAmount(e.target.value)}
      className="bg-slate-800 border border-slate-700 text-white text-lg h-12 w-full rounded-md px-3"
    />

    <p className="text-xs text-slate-500 mt-1">
      Minimum: $1
    </p>
  </div>
</div>

 <Button
  onClick={handleInvest}
  disabled={isInvesting || !canInvest}
  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-lg"
>
  {isInvesting ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      Processing...
    </>
  ) : (
    "💎 Invest Now"
  )}
</Button>

{!isHotelAvailable && !isLoadingHotelOnChain && (
  <div className="mt-4 p-3 bg-amber-500/20 border border-amber-500 rounded-lg text-amber-400 text-sm">
     This hotel is not yet verified on-chain. Investment unavailable.
  </div>
)}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                      <p className="text-slate-300 mb-4 font-semibold">🔐 KYC Verification Required</p>

                      <div className="text-left mb-6 space-y-2">
                        {!backendKycApproved && (
                          <p className="text-sm text-amber-400 flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Backend KYC: {user?.kycStatus || 'Not submitted'}
                          </p>
                        )}
                        {!blockchainKycApproved && (
                          <p className="text-sm text-red-400 flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Blockchain verification needed
                          </p>
                        )}
                      </div>
                       
                      <Button 
                       
                        className="w-full bg-amber-500 hover:bg-amber-600" >
                         <a 
                    href="/kyc/submit" 
                    target="_blank" 
                    rel="noopener noreferrer" >
                        {user?.kycStatus === 'APPROVED' ? 'Complete Blockchain KYC' : 'Complete KYC'}
                       
                         </a>
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">Connect wallet to invest</p>
                  <Button className="w-full">Connect Wallet</Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
