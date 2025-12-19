import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'wagmi';

// Get Project ID from environment
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// Validate Project ID
if (!projectId) {
  console.error(' VITE_WALLETCONNECT_PROJECT_ID is not set in .env file');
}

export const config = getDefaultConfig({
  appName: 'DIGIREAL',
  projectId: projectId || 'demo-project-id', // Fallback for development
  chains: [baseSepolia, base],
  
  // Transports configuration with public RPC
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },

  ssr: false, // If using Next.js with SSR, set to true
});
