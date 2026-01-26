// @ts-nocheck
import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, Copy, ExternalLink, LogOut, Check } from "lucide-react";
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

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getExplorerUrl = () => {
    if (!address || !chain) return '#';

    if (chain.id === 8453) {
      return `https://basescan.org/address/${address}`;
    }
    if (chain.id === 84532) {
      return `https://sepolia.basescan.org/address/${address}`;
    }
    return `https://basescan.org/address/${address}`;
  };

  const { token,refreshUser } = useAuth();

useEffect(() => {
  if (isConnected && address && token) {
    console.log("Wallet connected — syncing with backend...");

    axios.patch(
      "/api/v1/user/wallet",
      { walletAddress: address },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(async res => {
      console.log("Wallet saved to DB:", res.data);

      //  REFRESH USER AFTER WALLET CONNECTS
      await refreshUser();
      console.log("User synced: KYC updated");
    })
    .catch(err => {
      console.error("Wallet save failed:", err.response?.data || err.message);
    });
  }
}, [isConnected, address, token, refreshUser]);

  const handleDisconnect = async () => {
  try {
    console.log("Starting wallet disconnect...");

    await disconnectAsync();

    console.log("Wallet provider disconnected");

    // DO NOT LOGOUT USER
    // Just clear wallet UI state
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletConnected");

    setShowDialog(false);

    console.log("Wallet disconnect complete");

  } catch (error) {
    console.error("Wallet disconnect error:", error);
  }
};

  const texts = {
    en: {
      connectWallet: 'Connect Wallet',
      connected: 'Connected',
      disconnect: 'Disconnect',
      viewOnExplorer: 'View on Explorer',
      copyAddress: 'Copy Address',
      network: 'Network',
    },
    zh: {
      connectWallet: '连接钱包',
      connected: '已连接',
      disconnect: '断开连接',
      viewOnExplorer: '在区块浏览器查看',
      copyAddress: '复制地址',
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

        <DialogContent className="bg-slate-900 border-slate-800 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              {t.connected}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">{t.network}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <p className="text-white font-medium">
                  {chain?.name || 'Unknown Network'}
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-xs mb-1">Wallet Address</p>
              <p className="text-white font-mono text-sm break-all">{address}</p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={copyAddress}
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-1 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 mr-1" />
                )}
                {copied ? 'Copied!' : t.copyAddress}
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => window.open(getExplorerUrl(), '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                {t.viewOnExplorer}
              </Button>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
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
          className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 gap-2"
          onClick={openConnectModal}
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">{t.connectWallet}</span>
        </Button>
      )}
    </ConnectButton.Custom>
  );
}
