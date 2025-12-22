import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Get page name from pathname
    const pageName = location.pathname === '/' 
      ? 'Home' 
      : location.pathname.slice(1).split('/')[0];
    
    // DO NOT TRACK - Just log locally for debugging
    console.log('Navigated to:', pageName);
    
    // REMOVED: base44.appLogs.logUserInApp(pageName)
  }, [location]);

  return null;
};

export default NavigationTracker;
