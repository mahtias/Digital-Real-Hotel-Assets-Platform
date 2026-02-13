// frontend/src/api/investments.ts
import api from './axiosConfig';

// ✅ TOKENS API
export const getUserTokens = async (token: string) => {
  return api.get('/user/tokens', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// ✅ PORTFOLIO
export const getUserPortfolio = async (token: string) => {
  return api.get('/user/portfolio', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// ✅ INVESTMENTS LIST
export const getUserInvestments = async (token: string) => {
  return api.get('/investments', {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// ✅ CONFIRM ALL
export const confirmAllInvestments = async (token: string) => {
  return api.patch('/user/investments/confirm-all', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

//  NEW: CREATE INVESTMENT (FIXES tokenAmount=0)
export const createInvestment = async (data: { 
  hotelId: string; 
  amount: string; 
  tokenPrice: number 
}) => {
  const tokenAmount = Math.floor(Number(data.amount) / data.tokenPrice);
  
  return api.post('/investments', {
    hotelId: data.hotelId,
    amount: data.amount,
    tokenAmount: tokenAmount  // 🔥 SEND IT!
  });
};
