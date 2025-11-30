import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wallet, Copy, ExternalLink, LogOut, Check } from "lucide-react";
import { useLanguage } from './LanguageContext';

export default function WalletConnect() {
  const { language } = useLanguage();
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const wallets = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵' },
  ];

  const connectWallet = async (walletId) => {
    setIsConnecting(true);
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    const mockAddress = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
    setWalletAddress(mockAddress);
    setIsConnected(true);
    setIsConnecting(false);
    setShowDialog(false);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return addr.length > 13 ? addr : addr;
  };

  const texts = {
    en: {
      connectWallet: 'Connect Wallet',
      selectWallet: 'Select Wallet',
      connecting: 'Connecting...',
      connected: 'Connected',
      disconnect: 'Disconnect',
      viewOnExplorer: 'View on Explorer',
      copyAddress: 'Copy Address',
    },
    zh: {
      connectWallet: '连接钱包',
      selectWallet: '选择钱包',
      connecting: '连接中...',
      connected: '已连接',
      disconnect: '断开连接',
      viewOnExplorer: '在区块浏览器查看',
      copyAddress: '复制地址',
    }
  };

  const t = texts[language] || texts.zh;

  if (isConnected) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {shortenAddress(walletAddress)}
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
            <div className="bg-slate-800/50 rounded-lg p-4">
              <p className="text-slate-400 text-xs mb-1">Base Chain</p>
              <p className="text-white font-mono text-sm break-all">{walletAddress}</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={copyAddress}
              >
                {copied ? <Check className="w-4 h-4 mr-1 text-emerald-400" /> : <Copy className="w-4 h-4 mr-1" />}
                {t.copyAddress}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => window.open(`https://basescan.org/address/${walletAddress}`, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                {t.viewOnExplorer}
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
              onClick={disconnectWallet}
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
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 gap-2"
        >
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline">{t.connectWallet}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-white">{t.selectWallet}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.id}
              variant="outline"
              className="w-full justify-start border-slate-700 text-white hover:bg-slate-800 hover:border-amber-500/50 h-14"
              onClick={() => connectWallet(wallet.id)}
              disabled={isConnecting}
            >
              <span className="text-2xl mr-3">{wallet.icon}</span>
              <span className="font-medium">{wallet.name}</span>
              {isConnecting && (
                <div className="ml-auto">
                  <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </Button>
          ))}
        </div>
        <p className="text-slate-500 text-xs text-center">
          {language === 'zh' ? '连接钱包即表示您同意我们的服务条款' : 'By connecting, you agree to our Terms of Service'}
        </p>
      </DialogContent>
    </Dialog>
  );
}