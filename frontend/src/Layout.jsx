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

function LayoutContent({ children }) {
  const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

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
    <div className="min-h-screen bg-slate-950">
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-sm">DR</span>
              </div>
              <span className="text-white font-semibold text-lg hidden sm:block">DIGIREAL</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={createPageUrl(item.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive(item.href)
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon 

                  className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              {/* Wallet Connect */}
              <WalletConnect />

              {/* Language Switcher */}
              < Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-slate-400 hover:text-white hover:bg-slate-800 gap-1.5"
              >
                <Globe 

                className="w-4 h-4" />
                <span className="font-medium text-xs">{language === 'zh' ? 'EN' : '中文'}</span>
              </Button>

              {!authLoading && (
                <>
                  {isAuthenticated && user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800 gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                            <span className="text-slate-900 font-bold text-xs">
                              {user.firstName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="hidden md:inline">{user.firstName || t('nav.user')}</span>
                          <ChevronDown 

                          className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      < DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
                        <div className="px-3 py-2">
                          <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-slate-400 text-sm truncate">{user.email}</p>
                        </div>
                        <DropdownMenuSeparator 

                        className="bg-slate-800" />
                        < DropdownMenuItem asChild className="text-slate-300 hover:text-white focus:bg-slate-800">
                          <Link to={createPageUrl('Portfolio')} className="flex items-center gap-2">
                            <Wallet 

                            className="w-4 h-4" />
                            {t('nav.portfolio')}
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator 

                        className="bg-slate-800" />
                        <DropdownMenuItem 
                          className="text-red-400 hover:text-red-300 focus:bg-slate-800 cursor-pointer"
                          onClick={handleLogout}
                        >
                          <LogOut 

                          className="w-4 h-4 mr-2" />
                          {t('nav.logout')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="flex items-center gap-2">
                      < Button 
                        variant="ghost"
                        className="text-slate-300 hover:text-white hover:bg-slate-800"
                        onClick={openLoginModal}
                      >
                        {t('nav.login')}
                      </Button>
                      < Button 
                        className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                        onClick={openRegisterModal}
                      >
                        Register
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <Menu 

                    className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-slate-900 border-slate-800 w-72">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                          <span className="text-slate-900 font-bold text-sm">DR</span>
                        </div>
                        <span className="text-white font-semibold">DIGIREAL</span>
                      </div>
                    </div>

                    <nav className="flex-1 space-y-1">
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
                          <item.icon 

                          className="w-5 h-5" />
                          {item.name}
                        </Link>
                      ))}
                    </nav>

                    {/* Language Switch in Mobile */}
                    <div className="border-t border-slate-800 pt-4 mt-4">
                      < Button
                        variant="ghost"
                        className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={toggleLanguage}
                      >
                        <Globe 

                        className="w-4 h-4 mr-2" />
                        {language === 'zh' ? 'Switch to English' : '切换到中文'}
                      </Button>
                    </div>

                    {/* Mobile Auth Section */}
                    {!authLoading && (
                      <>
                        {isAuthenticated && user ? (
                          <div className="border-t border-slate-800 pt-4 mt-4">
                            <div className="flex items-center gap-3 px-4 mb-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                <span className="text-slate-900 font-bold">
                                  {user.firstName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                                <p className="text-slate-400 text-sm truncate">{user.email}</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
                              onClick={handleLogout}
                            >
                              <LogOut 

                              className="w-4 h-4 mr-2" />
                              {t('nav.logout')}
                            </Button>
                          </div>
                        ) : (
                          <div className="border-t border-slate-800 pt-4 mt-4 space-y-2">
                            < Button
                              variant="ghost"
                              className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                              onClick={openLoginModal}
                            >
                              {t('nav.login')}
                            </Button>
                            <  Button
                              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900"
                              onClick={openRegisterModal}
                            >
                              Register
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-xs">DR</span>
              </div>
              <span className="text-slate-400 text-sm">{t('footer.copyright')}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span>{t('footer.baseChain')}</span>
              <span>•</span>
              <span>{t('footer.sfcCompliant')}</span>
              <span>•</span>
              <span>{t('footer.x402Protocol')}</span>
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
