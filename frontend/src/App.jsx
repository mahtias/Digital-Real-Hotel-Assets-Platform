// @ts-nocheck
//import './App.css'
import { LanguageProvider } from "@/components/common/LanguageContext";
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'

import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { config } from '@/config/wagmi';
import Login from '@/pages/auth/Login';
import KYCForm from '@/components/KYC/KYCForm';
import KYCStatus from '@/components/KYC/KYCStatus';
import AdminKYCReview from '@/components/Admin/KYCReview';
import KYCReviewDetails from '@/components/Admin/KYCReviewDetails';
import AdminDashboard from "@/components/Admin/AdminDashboard";
import AdminKYCStatusList from '@/components/Admin/AdminKYCStatusList';
import AdminKYCStatusDetail from '@/components/Admin/AdminKYCStatusDetail';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import VerifyEmailSent from '@/pages/auth/VerifyEmailSent';
import VerifyEmail from '@/pages/auth/VerifyEmail';


import { AuthModalProvider } from "@/context/AuthModalContext";
import { useAuthModal } from "@/context/AuthModalContext";
import AuthModal from "@/components/AuthModal";

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

// Protected Pages
const PROTECTED_PAGES = [
  'my-investments', 
  'my-bookings', 
  'dashboard',
  'profile',
  'settings'
];


const LayoutWrapper = ({ children, currentPageName }) =>
  Layout ?
    <Layout currentPageName={currentPageName}>{children}</Layout>
    : <>{children}</>;


function AuthModalWrapper() {
  const { isOpen, defaultTab, closeAuthModal } = useAuthModal();

  return (
    <AuthModal 
      isOpen={isOpen}
      onClose={closeAuthModal}
      defaultTab={defaultTab}
    />
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthModalProvider>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClientInstance}>
            <RainbowKitProvider>
              
              <Router>

                {/* IMPORTANT FIX: AuthProvider goes INSIDE Router */}
                <AuthProvider>

                  <Routes>
                    {/* Main Page */}
                    <Route 
                      path="/" 
                      element={
                        <LayoutWrapper currentPageName={mainPageKey}>
                          <MainPage />
                        </LayoutWrapper>
                      }
                    />

                    {/* Auth Pages */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email-sent" element={<VerifyEmailSent />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />


                    {/* KYC */}
                    <Route path="/kyc/submit" element={<KYCForm />} />
                    <Route path="/kyc/status" element={<KYCStatus />} />

                    {/* Admin */}
                    <Route path="/admin/kyc" element={<AdminKYCReview />} />
                    <Route path="/admin/kyc/review/:kycId" element={<KYCReviewDetails />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/kyc/status" element={<AdminKYCStatusList />} />
                    <Route path="/admin/kyc/status/:kycId" element={<AdminKYCStatusDetail />} />

                    {/* Dynamic Pages */}
                    {Object.entries(Pages).map(([path, Page]) => {
                      const isProtected = PROTECTED_PAGES.includes(path);

                      return (
                        <Route
                          key={path}
                          path={`/${path}`}
                          element={
                            isProtected ? (
                              <ProtectedRoute>
                                <LayoutWrapper currentPageName={path}>
                                  <Page />
                                </LayoutWrapper>
                              </ProtectedRoute>
                            ) : (
                              <LayoutWrapper currentPageName={path}>
                                <Page />
                              </LayoutWrapper>
                            )
                          }
                        />
                      );
                    })}

                    {/* 404 */}
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>

                  <Toaster />
                  <VisualEditAgent />
                  
                  <AuthModalWrapper />

                </AuthProvider>
              </Router>

            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </AuthModalProvider>
    </LanguageProvider>
  );
}

export default App;
