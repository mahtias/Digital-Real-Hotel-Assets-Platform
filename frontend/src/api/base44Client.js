import { appParams } from '@/lib/app-params';

const { serverUrl } = appParams;

//  COMPLETE MOCK CLIENT - NO BASE44 SDK!
export const base44 = {
  auth: {
    login: async (credentials) => {
      const response = await fetch(`${serverUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      return data;
    },
    
    me: async () => {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Not authenticated');
      
      const response = await fetch(`${serverUrl}/api/v1/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('authToken');
        }
        throw new Error('Failed to fetch user');
      }
      
      return response.json();
    },
    
    logout: async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          await fetch(`${serverUrl}/api/v1/auth/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include',
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
      
      localStorage.removeItem('authToken');
      return Promise.resolve();
    },
    
    redirectToLogin: () => {
      window.location.href = '/login';
    },
  },
  
  entities: {
    HotelAsset: {
      list: async (sortBy = '-created_date', limit = 50) => {
        const token = localStorage.getItem('authToken');
        const params = new URLSearchParams({
          sort: sortBy,
          limit: limit.toString(),
        });
        
        const response = await fetch(`${serverUrl}/api/v1/hotels?${params}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to fetch hotels');
        const data = await response.json();
        return data.hotels || [];
      },
      
      filter: async (filters = {}) => {
        const token = localStorage.getItem('authToken');
        const params = new URLSearchParams(filters);
        
        const response = await fetch(`${serverUrl}/api/v1/hotels?${params}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to fetch hotels');
        const data = await response.json();
        return data.hotels || [];
      },
      
      get: async (id) => {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${serverUrl}/api/v1/hotels/${id}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to fetch hotel');
        return response.json();
      },
      
      update: async (id, data) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication required');
        
        const response = await fetch(`${serverUrl}/api/v1/hotels/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Failed to update hotel');
        return response.json();
      },
    },
    
    Investment: {
      filter: async (filters = {}) => {
        const token = localStorage.getItem('authToken');
        const params = new URLSearchParams(filters);
        
        const response = await fetch(`${serverUrl}/api/v1/investments?${params}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to fetch investments');
        const data = await response.json();
        return data.investments || [];
      },
      
      create: async (investmentData) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication required');
        
        const response = await fetch(`${serverUrl}/api/v1/investments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(investmentData),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to create investment');
        }
        
        return response.json();
      },
      
      update: async (id, data) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication required');
        
        const response = await fetch(`${serverUrl}/api/v1/investments/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Failed to update investment');
        return response.json();
      },
    },
    
    DRAStaking: {
      filter: async (filters = {}) => {
        const token = localStorage.getItem('authToken');
        const params = new URLSearchParams(filters);
        
        const response = await fetch(`${serverUrl}/api/v1/staking?${params}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to fetch staking');
        const data = await response.json();
        return data.stakes || [];
      },
      
      create: async (stakeData) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication required');
        
        const response = await fetch(`${serverUrl}/api/v1/staking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(stakeData),
        });
        
        if (!response.ok) throw new Error('Failed to create stake');
        return response.json();
      },
      
      update: async (id, data) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication required');
        
        const response = await fetch(`${serverUrl}/api/v1/staking/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Failed to update stake');
        return response.json();
      },
    },
    
    Booking: {
      create: async (bookingData) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication required');
        
        const response = await fetch(`${serverUrl}/api/v1/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(bookingData),
        });
        
        if (!response.ok) throw new Error('Failed to create booking');
        return response.json();
      },
    },
    
    ESGReward: {
      filter: async (filters = {}) => {
        const token = localStorage.getItem('authToken');
        const params = new URLSearchParams(filters);
        
        const response = await fetch(`${serverUrl}/api/v1/rewards?${params}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to fetch rewards');
        const data = await response.json();
        return data.rewards || [];
      },
      
      update: async (id, data) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication required');
        
        const response = await fetch(`${serverUrl}/api/v1/rewards/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Failed to update reward');
        return response.json();
      },
    },
    
    Proposal: {
      list: async (sortBy = '-created_date', limit = 50) => {
        const token = localStorage.getItem('authToken');
        const params = new URLSearchParams({
          sort: sortBy,
          limit: limit.toString(),
        });
        
        const response = await fetch(`${serverUrl}/api/v1/proposals?${params}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to fetch proposals');
        const data = await response.json();
        return data.proposals || [];
      },
      
      create: async (proposalData) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication required');
        
        const response = await fetch(`${serverUrl}/api/v1/proposals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(proposalData),
        });
        
        if (!response.ok) throw new Error('Failed to create proposal');
        return response.json();
      },
      
      update: async (id, data) => {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authentication required');
        
        const response = await fetch(`${serverUrl}/api/v1/proposals/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        
        if (!response.ok) throw new Error('Failed to update proposal');
        return response.json();
      },
    },
    
    Query: null, // Placeholder
  },
  
  integrations: {
    Core: {
      InvokeLLM: null,
      SendEmail: null,
      SendSMS: null,
      UploadFile: null,
      GenerateImage: null,
      ExtractDataFromUploadedFile: null,
    },
  },
  
  appLogs: {
    logUserInApp: async (pageName) => {
      // DO NOTHING - This is the tracking we want to disable!
      console.log(' Blocked tracking:', pageName);
      return Promise.resolve({ success: true });
    },
  },
  
  // Null objects to prevent errors
  analytics: null,
  logger: null,
  socket: null,
  realtime: null,


  
};

console.log(' Custom API client initialized (base44 SDK bypassed)');

