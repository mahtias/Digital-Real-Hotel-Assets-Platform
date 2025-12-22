// Import your pages
import Login from '@/pages/auth/Login';
// @ts-ignore
import Register from '@/pages/auth/Register';
import Home from '@/pages/Home';
import Marketplace from '@/pages/Marketplace';
import HotelDetail from '@/pages/HotelDetail';
import Portfolio from '@/pages/Portfolio';
import Booking from '@/pages/Booking';
import Governance from '@/pages/Governance';
import ESGRewards from '@/pages/ESGRewards';
import Staking from '@/pages/Staking';
import MainPage from '@/pages/MainPage';
import Layout from '@/Layout';

export const pagesConfig = {
  Pages: {
    // Public pages (no authentication required)
    home: Home,
    marketplace: Marketplace,
    'hotel-detail': HotelDetail,
    login: Login,
    register: Register,

    // Protected pages (require authentication)
    'main-page': MainPage,
    portfolio: Portfolio,
    booking: Booking,
    governance: Governance,
    'esg-rewards': ESGRewards,
    staking: Staking,
  },

  Layout: Layout,
  mainPage: 'main-page', // Changed to MainPage as the landing page after login

  // Only these pages require authentication
  protectedPages: ['main-page', 'portfolio', 'booking', 'governance', 'esg-rewards', 'staking'],
};
