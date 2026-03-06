// frontend/src/api/investments.ts
import api from '../services/api';

// ✅ GET USER TOKENS
export const getUserTokens = async () => {
  return api.get('/user/tokens');
};

// ✅ GET USER PORTFOLIO
export const getUserPortfolio = async () => {
  return api.get('/user/portfolio');
};

// ✅ GET USER INVESTMENTS
export const getUserInvestments = async () => {
  return api.get('/investments');
};

// ✅ CONFIRM ALL INVESTMENTS
export const confirmAllInvestments = async () => {
  return api.patch('/user/investments/confirm-all', {});
};

// ✅ CREATE INVESTMENT
export const createInvestment = async (data: {
  hotelId: string;
  amount: string;
  tokenPrice: number;
}) => {
  const tokenAmount = Math.floor(Number(data.amount) / data.tokenPrice);

  return api.post('/investments', {
    hotelId: data.hotelId,
    amount: data.amount,
    tokenAmount: tokenAmount,
  });
};

// ✅ GET SINGLE INVESTMENT
export const getInvestment = async (id: string) => {
  return api.get(`/investments/${id}`);
};

// ✅ UPDATE INVESTMENT STATUS
export const updateInvestmentStatus = async (
  id: string,
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
) => {
  return api.patch(`/investments/${id}/status`, { status });
};
