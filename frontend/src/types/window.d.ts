interface EthereumProvider {
  isMetaMask?: boolean;

  request: <T = any>(args: {
    method: string;
    params?: unknown[] | Record<string, unknown>;
  }) => Promise<T>;

  on(event: "accountsChanged", handler: (accounts: string[]) => void): void;
  on(event: "chainChanged", handler: (chainId: string) => void): void;
  on(event: string, handler: (...args: any[]) => void): void;

  removeListener(event: string, handler: (...args: any[]) => void): void;

  selectedAddress?: string | null;
  chainId?: string;
}

interface Window {
  ethereum?: EthereumProvider;
}
