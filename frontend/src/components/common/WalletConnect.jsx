// @ts-nocheck
import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useReadContract } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, Copy, ExternalLink, LogOut, Check, RefreshCw } from "lucide-react";
import { useLanguage } from './LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import axios from 'axios';


export default function WalletConnect() {
  const { language } = useLanguage();
  const { address, isConnected, chain } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  // HAT CONTRACT - UPDATE THIS ADDRESS
  const HAT_CONTRACT_ADDRESS = import.meta.env.VITE_HAT_CONTRACT || "0x16976c631c64372c20618cd84a41363bbb79ba17";
  
  // FIXED ABI - NO TYPESCRIPT
  const HAT_ABI = [
    {
      "inputs": [
        {"name": "account", "type": "address"},
        {"name": "id", "type": "uint256"}
      ],
      "name": "balanceOf",
      "outputs": [{"name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // HAT BALANCE
  const {
    data: hatBalance,
    isLoading: hatLoading,
    refetch: refreshHat
  } = useReadContract({
    address: HAT_CONTRACT_ADDRESS,
    abi: HAT_ABI,
    functionName: 'balanceOf',
    args: [address || '0x0', '0'],
    enabled: !!address
  });

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortenAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

  const getExplorerUrl = () => {
    if (!address || !chain) return '#';
    const base = chain.id === 84532 ? 'https://sepolia.basescan.org' : 'https://basescan.org';
    return `${base}/address/${address}`;
  };

  const { token, refreshUser } = useAuth();

  useEffect(() => {
    if (isConnected && address && token) {
      console.log("Wallet connected — syncing...");
      axios.patch(
        `${import.meta.env.VITE_API_URL}/api/v1/user/wallet`,
        { walletAddress: address },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      )
      .then(async () => {
        await refreshUser();
        console.log("User synced");
      })
      .catch(console.error);
    }
  }, [isConnected, address, token, refreshUser]);

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("walletConnected");
      setShowDialog(false);
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const texts = {
    en: {
      connectWallet: 'Connect Wallet',
      connected: 'Connected',
      disconnect: 'Disconnect',
      viewOnExplorer: 'Explorer',
      copyAddress: 'Copy',
      network: 'Network',
    },
    zh: {
      connectWallet: '连接钱包',
      connected: '已连接',
      disconnect: '断开',
      viewOnExplorer: '浏览器',
      copyAddress: '复制',
      network: '网络',
    }
  };

  const t = texts[language] || texts.en;

  if (isConnected && address) {
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {shortenAddress(address)}
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-slate-900 border-slate-800 max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              {t.connected}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* NETWORK */}
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">{t.network}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <p className="text-white font-medium">{chain?.name || 'Unknown'}</p>
              </div>
            </div>

            {/* HAT BALANCE - MAIN FEATURE */}
            <div className="bg-gradient-to-r from-emerald-500/15 to-teal-500/15 
                           border-2 border-emerald-500/40 rounded-xl p-4 shadow-lg">
              <p className="text-emerald-300 text-xs mb-2 font-medium flex items-center gap-1">
                🎩 HAT Tokens
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-emerald-500 animate-pulse" />
                  {hatLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-slate-400/30 border-t-emerald-400 rounded-full animate-spin" />
                      <span className="text-slate-400 font-medium">Loading...</span>
                    </div>
                  ) : hatBalance ? (
                    <div>
                      <div className="text-white font-black text-3xl leading-tight">
                        {Math.floor(Number(hatBalance) / 1e18).toLocaleString()}
                      </div>
                      <div className="text-emerald-400 text-sm font-medium">HAT</div>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-lg font-medium">0 HAT</div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 w-9 p-0 text-emerald-400 hover:bg-emerald-500/20"
                  onClick={() => refreshHat()}
                  disabled={hatLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${hatLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-xs mb-1">Address</p>
              <p className="text-white font-mono text-sm break-all">{address}</p>
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-700 text-slate-300 hover:bg-slate-800 h-10"
                onClick={copyAddress}
              >
                {copied ? <Check className="w-4 h-4 mr-1 text-emerald-400" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? 'Copied!' : t.copyAddress}
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-700 text-slate-300 hover:bg-slate-800 h-10"
                onClick={() => window.open(getExplorerUrl(), '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                {t.viewOnExplorer}
              </Button>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 h-10"
              onClick={handleDisconnect}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t.disconnect}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <ConnectButton.Custom>
      {({ openConnectModal }) => (
        <Button 
          variant="outline" 
          size="sm"
          className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 gap-2 h-10"
          onClick={openConnectModal}
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">{t.connectWallet}</span>
        </Button>
      )}
    </ConnectButton.Custom>
  );
}
