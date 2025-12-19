import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import HotelDetail from './pages/HotelDetail';
import Portfolio from './pages/Portfolio';
import Booking from './pages/Booking';
import Governance from './pages/Governance';
import ESGRewards from './pages/ESGRewards';
import Staking from './pages/Staking';
import MainPage from './pages/MainPage';
import __Layout from './Layout.jsx';

export const PAGES = {
    "Home": Home,
    "Marketplace": Marketplace,
    "HotelDetail": HotelDetail,
    "Portfolio": Portfolio,
    "Booking": Booking,
    "Governance": Governance,
    "ESGRewards": ESGRewards,
    "Staking": Staking,
    "MainPage": MainPage,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
}
