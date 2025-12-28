/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_RPC_URL: string;
  readonly VITE_KYC_CONTRACT_ADDRESS: string;
  readonly VITE_CHAIN_ID: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
