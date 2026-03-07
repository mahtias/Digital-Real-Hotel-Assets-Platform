// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Home, Building2, Wallet, Calendar, Vote, Leaf, LogOut, Menu, ChevronDown, Globe, Coins
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageProvider, useLanguage } from '@/components/common/LanguageContext';
import WalletConnect from '@/components/common/WalletConnect';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
function LayoutContent({ children }) {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const mode = localStorage.getItem("openAuthModal");
  if (mode) {
    setAuthModalTab(mode);
    setAuthModalOpen(true);
    localStorage.removeItem("openAuthModal");
  }
    console.log("Testing API connection..."); 
    fetch(`${API_URL}/api/v1/health`) 
    //fetch("http://localhost:5000/api/v1/health") 
      .then((res) => res.json())
      .then((data) => console.log("Frontend → Backend OK:", data))
      .catch((err) => console.error("Frontend → Backend ERROR:", err));
  }, []);

  const navigation = [
    { name: t('nav.home'), href: 'Home', icon: Home },
    { name: t('nav.marketplace'), href: 'Marketplace', icon: Building2 },
    { name: t('nav.portfolio'), href: 'Portfolio', icon: Wallet },
    { name: t('nav.booking'), href: 'Booking', icon: Calendar },
    { name: t('nav.governance'), href: 'Governance', icon: Vote },
    { name: t('nav.staking'), href: 'Staking', icon: Coins },
    { name: t('nav.esgRewards'), href: 'ESGRewards', icon: Leaf },
  ];

  const isActive = (href) => {
    return location.pathname.includes(href);
  };

  const openLoginModal = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const openRegisterModal = () => {
    setAuthModalTab('register');
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Desktop & Mobile Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Logo - Responsive */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-xs sm:text-sm">DR</span>
              </div>
              <span className="text-white font-semibold text-base sm:text-lg">DIGIREAL</span>
            </Link>

            {/* Desktop Menu - Hidden on mobile/tablet */}
            <div className="hidden xl:flex items-center gap-0.5">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={createPageUrl(item.href)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive(item.href)
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden 2xl:inline">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Right Side - Responsive */}
            <div className="flex items-center gap-1 sm:gap-2">
              
              {/* Wallet Connect - Hide text on small screens */}
              <div className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                <WalletConnect />
              </div>

              {/* Language Switcher - Compact on mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-slate-400 hover:text-white hover:bg-slate-800 gap-1 px-2 sm:px-3"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium text-xs hidden sm:inline">
                  {language === 'zh' ? 'EN' : '中文'}
                </span>
              </Button>

              {/* Auth Buttons - Desktop only */}
              {!authLoading && (
                <>
                  {isAuthenticated && user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-slate-300 hover:text-white hover:bg-slate-800 gap-1.5 px-2 sm:px-3 hidden lg:flex"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-slate-900 font-bold text-xs">
                              {user.firstName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="hidden xl:inline max-w-[100px] truncate">
                            {user.firstName || t('nav.user')}
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
                        <div className="px-3 py-2">
                          <p className="text-white font-medium truncate">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-slate-400 text-sm truncate">{user.email}</p>
                        </div>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem asChild className="text-slate-300 hover:text-white focus:bg-slate-800">
                          <Link to={createPageUrl('Portfolio')} className="flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            {t('nav.portfolio')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem 
                          className="text-red-400 hover:text-red-300 focus:bg-slate-800 cursor-pointer"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          {t('nav.logout')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="hidden lg:flex items-center gap-2">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-sm"
                        onClick={openLoginModal}
                      >
                        {t('nav.login')}
                      </Button>
                      <Button 
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold text-sm"
                        onClick={openRegisterModal}
                      >
                       {t('nav.register')} 
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="xl:hidden">
                  <Button variant="ghost" size="sm" className="text-slate-400 px-2">
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </SheetTrigger>
                
                {/* Mobile Sidebar */}
                <SheetContent 
                  side="right" 
                  className="bg-slate-900 border-slate-800 w-[280px] sm:w-[320px] p-0"
                >
                  <div className="flex flex-col h-full">
                    
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                          <span className="text-slate-900 font-bold text-sm">DR</span>
                        </div>
                        <span className="text-white font-semibold text-lg">DIGIREAL</span>
                      </div>
                    </div>

                    {/* Wallet Connect - Mobile */}
                    <div className="px-4 py-3 sm:hidden border-b border-slate-800">
                      <WalletConnect />
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.href}
                          to={createPageUrl(item.href)}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                            isActive(item.href)
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile Footer */}
                    <div className="border-t border-slate-800 p-4 space-y-3">
                      
                      {/* Language Toggle */}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={toggleLanguage}
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        {language === 'zh' ? 'Switch to English' : '切换到中文'}
                      </Button>

                      {/* Mobile Auth */}
                      {!authLoading && (
                        <>
                          {isAuthenticated && user ? (
                            <>
                              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
                                  <span className="text-slate-900 font-bold text-sm">
                                    {user.firstName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white font-medium text-sm truncate">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-slate-400 text-xs truncate">{user.email}</p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
                                onClick={handleLogout}
                              >
                                <LogOut className="w-4 h-4 mr-2" />
                                {t('nav.logout')}
                              </Button>
                            </>
                          ) : (
                            <div className="space-y-2">
                              <Button
                                variant="ghost"
                                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                                onClick={openLoginModal}
                              >
                                {t('nav.login')}
                              </Button>
                              <Button
                                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                                onClick={openRegisterModal}
                              >
                                {t('nav.register')}
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Responsive padding */}
      <main className="flex-1 pt-14 sm:pt-16">
        <div className="w-full">
          {children}
        </div>
      </main>

      {/* Footer - Responsive */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 sm:py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Footer Logo */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-xs">DR</span>
              </div>
              <span className="text-slate-400 text-xs sm:text-sm text-center sm:text-left">
                {t('footer.copyright')}
              </span>
            </div>
            
            {/* Footer Info - Stack on mobile */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs sm:text-sm text-slate-500 text-center">
             <p>Contact Us :</p>
             <a href="mailto:dra@digirealassets.io" className="text-slate-400">
              dra@digirealassets.io
             </a>
             <a href="https://www.base.org/" target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white">
            {t('footer.baseChain')}
           </a>
           <span className="hidden sm:inline">•</span>

            <a href="https://www.sfc.hk/en/" target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white">
            {t('footer.sfcCompliant')}
           </a>
           <span className="hidden sm:inline">•</span>
            
             <a href="https://www.coinbase.com/en-sg/developer-platform/discover/launches/x402?utm_source=chatgpt.com" target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white">
            {t('footer.x402Protocol')}
           </a>
           <span className="hidden sm:inline">•</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      <LayoutContent>{children}</LayoutContent>
    </LanguageProvider>
  );
}
