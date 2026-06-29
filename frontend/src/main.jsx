// @ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom/client'
import './utils/blockTracking'
import App from '@/App.jsx'
import '@/index.css'

import '@rainbow-me/rainbowkit/styles.css'

import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'

import { config } from '@/config/wagmi'
import { queryClientInstance } from '@/lib/query-client'

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClientInstance}>
      <RainbowKitProvider>
        <App />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)

// HMR for dev
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:beforeUpdate' }, '*');
  });
  import.meta.hot.on('vite:afterUpdate', () => {
    window.parent?.postMessage({ type: 'sandbox:afterUpdate' }, '*');
  });
}
