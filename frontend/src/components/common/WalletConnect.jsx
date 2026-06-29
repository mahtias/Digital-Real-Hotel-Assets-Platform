// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'; 
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, Copy, ExternalLink, LogOut, Check, ShieldCheck } from "lucide-react";
import { useLanguage } from './LanguageContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default function WalletConnect() {
  const { language } = useLanguage();
  const { address, isConnected, chain } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage(); 
  const { token, refreshUser, user } = useAuth(); 
  const [copied, setCopied] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  //  Sync wallet to backend when connected
  useEffect(() => {
    if (isConnected && address && token && !isSyncing) {
      // Check if wallet is already linked
      if (user?.walletAddress?.toLowerCase() === address.toLowerCase()) {
        return;
      }
      
      syncWalletToBackend();
    }
  }, [isConnected, address, token, user]);

  const syncWalletToBackend = async () => {
    try {
      setIsSyncing(true);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("🔐 LINKING WALLET WITH SIGNATURE");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("Address:", address);

      //  Step 1: Create message to sign
      const message = `Link wallet to KYC account: ${user?.id || 'unknown'}`;

      //  Step 2: Request signature from user
      toast.info("Please sign the message in your wallet...");
      
      let signature;
      try {
        signature = await signMessageAsync({ message });
      } catch (signError) {
        console.log(" User rejected signature");
        toast.error("Signature required to link wallet");
        return;
      }

      //  Step 3: Send to backend with signature
      const response = await axios.put(`${API_URL}/api/v1/user/wallet`,
        { 
          walletAddress: address,
          signature: signature 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // ✅ Refresh user data
      await refreshUser();
      toast.success(" Wallet verified and linked!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    } catch (error) {
      
      if (error.response?.status === 403) {
        toast.error("Invalid signature - wallet verification failed");
      } else if (error.response?.status === 409) {
        toast.error("This wallet is already linked to another account");
      } else {
        toast.error("Failed to link wallet");
      }
    } finally {
      setIsSyncing(false);
    }
  };

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
    
    let base;
    if (chain.id === 80002) base = 'https://amoy.polygonscan.com';
    else if (chain.id === 84532) base = 'https://sepolia.basescan.org';
    else if (chain.id === 137) base = 'https://polygonscan.com';
    else if (chain.id === 8453) base = 'https://basescan.org';
    else base = 'https://basescan.org';
    
    return `${base}/address/${address}`;
  };

  const handleDisconnect = async () => {
    try {
      await disconnectAsync();
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("walletConnected");
      setShowDialog(false);
      toast.success("Wallet disconnected");
    } catch (error) {
      console.error("Disconnect error:", error);
      toast.error("Failed to disconnect");
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
      syncing: 'Verifying...',
      address: 'Address',
      verified: 'Verified',
      notVerified: 'Not Verified',
    },
    zh: {
      connectWallet: '连接钱包',
      connected: '已连接',
      disconnect: '断开',
      viewOnExplorer: '浏览器',
      copyAddress: '复制',
      network: '网络',
      syncing: '验证中...',
      address: '地址',
      verified: '已验证',
      notVerified: '未验证',
    }
  };

  const t = texts[language] || texts.en;

  // ✅ Check if wallet is verified (linked to account)
  const isWalletVerified = user?.walletAddress?.toLowerCase() === address?.toLowerCase();

  if (isConnected && address) {
    return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`${
              isWalletVerified 
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20" 
                : "border-amber-500/50 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
            } gap-2`}
          >
            <div className={`w-2 h-2 rounded-full ${
              isSyncing ? "bg-blue-400 animate-pulse" :
              isWalletVerified ? "bg-emerald-400" : "bg-amber-400"
            }`} />
            {isSyncing ? t.syncing : shortenAddress(address)}
            {isWalletVerified && <ShieldCheck className="w-3 h-3" />}
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-slate-900 border-slate-800 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isWalletVerified ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              {t.connected}
              {isWalletVerified && (
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded ml-auto">
                  {t.verified}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* ✅ VERIFICATION STATUS */}
            {!isWalletVerified && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-amber-400 text-sm font-medium">Verification Required</p>
                    <p className="text-amber-300/70 text-xs mt-1">
                      Sign a message to verify wallet ownership
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* NETWORK */}
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">{t.network}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <p className="text-white font-medium">{chain?.name || 'Unknown'}</p>
                {(chain?.id === 80002 || chain?.id === 84532) && (
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                    Testnet
                  </span>
                )}
              </div>
            </div>

            {/* ADDRESS */}
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-xs mb-1">{t.address}</p>
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
