import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http, createStorage } from 'wagmi';
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// VITE_CHAIN_ID=8453 → mainnet first; any other value → testnet first
const isMainnet = Number(import.meta.env.VITE_CHAIN_ID) === 8453;

export const config = getDefaultConfig({
  appName: 'DIGIREAL',
  projectId: projectId || 'demo-project-id',
  chains: isMainnet ? [base, baseSepolia] : [baseSepolia, base],

  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },

  // 🔥 CRITICAL FIX (PERSIST CONNECTION)
  storage: createStorage({
    storage: localStorage,
  }),

  // optional but safer
  ssr: false,
});
