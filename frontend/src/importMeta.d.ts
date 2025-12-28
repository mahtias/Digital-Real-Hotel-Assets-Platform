interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_KYC_CONTRACT_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}