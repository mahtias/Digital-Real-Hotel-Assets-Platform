import { ethers } from "ethers";
declare function getProvider(): ethers.JsonRpcProvider;
declare function getWallet(): ethers.Wallet;
declare function getContract(runner?: ethers.ContractRunner): ethers.Contract;
export declare const hotelFactory: {
    getContract: typeof getContract;
    getWallet: typeof getWallet;
    getProvider: typeof getProvider;
    address: string;
    abi: ({
        type: string;
        inputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        stateMutability: string;
        name?: undefined;
        outputs?: undefined;
        anonymous?: undefined;
    } | {
        type: string;
        name: string;
        inputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        outputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        stateMutability: string;
        anonymous?: undefined;
    } | {
        type: string;
        name: string;
        inputs: {
            name: string;
            type: string;
            indexed: boolean;
            internalType: string;
        }[];
        anonymous: boolean;
        stateMutability?: undefined;
        outputs?: undefined;
    } | {
        type: string;
        name: string;
        inputs: {
            name: string;
            type: string;
            internalType: string;
        }[];
        stateMutability?: undefined;
        outputs?: undefined;
        anonymous?: undefined;
    })[];
};
export {};
//# sourceMappingURL=hotelFactory.d.ts.map