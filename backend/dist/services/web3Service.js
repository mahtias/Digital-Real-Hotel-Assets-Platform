"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web3Service = exports.Web3Service = void 0;
const ethers_1 = require("ethers");
const database_1 = __importDefault(require("../config/database"));
const KYCRegistry_json_1 = __importDefault(require("../../../out/KYCRegistry.sol/KYCRegistry.json"));
const HotelAssetManager_json_1 = __importDefault(require("../../../out/HotelAssetManager.sol/HotelAssetManager.json"));
const HotelInvestment_json_1 = __importDefault(require("../../../out/HotelInvestment.sol/HotelInvestment.json"));
const HotelAssetToken_json_1 = __importDefault(require("../../../out/HotelAssetToken.sol/HotelAssetToken.json"));
const stablecoinService_1 = require("./stablecoinService");
const USDC_ABI = [
    "event Transfer(address indexed from, address indexed to, uint256 value)"
];
const KYC_CONFIG = {
    LARGE_INVESTMENT_THRESHOLD: 1000,
    BLOCKCHAIN_CACHE_HOURS: 24,
    MAX_SYNC_ATTEMPTS: 3,
    SYNC_RETRY_DELAY: 5000,
};
const GAS_LIMITS = {
    KYC_REGISTER: 200000,
    INVESTMENT: 500000,
    TOKEN_TRANSFER: 100000,
};
class Web3Service {
    constructor() {
        this.tokenContractCache = new Map();
        this.provider = this.initializeProvider();
        this.signer = this.initializeSigner();
        this.kycContract = this.initializeKycContract();
        this.hotelAssetManager = this.initializeAssetManager();
        this.hotelInvestment = this.initializeInvestmentContract();
    }
    async getReceiptWithRetry(txHash, retries = 5, delayMs = 2000) {
        for (let i = 0; i < retries; i++) {
            const receipt = await this.provider.getTransactionReceipt(txHash);
            if (receipt)
                return receipt;
            console.log(`Receipt not found yet, retry ${i + 1}/${retries}`);
            await new Promise((res) => setTimeout(res, delayMs));
        }
        return null;
    }
    initializeProvider() {
        const rpc = process.env.BASE_SEPOLIA_RPC || process.env.RPC_URL;
        if (!rpc)
            throw new Error(" Missing BASE_SEPOLIA_RPC or RPC_URL in .env");
        console.log(' Using RPC:', rpc);
        return new ethers_1.ethers.JsonRpcProvider(rpc);
    }
    initializeSigner() {
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey)
            throw new Error(" Missing PRIVATE_KEY in .env");
        const signer = new ethers_1.ethers.Wallet(privateKey, this.provider);
        console.log(' Signer address:', signer.address);
        return signer;
    }
    initializeKycContract() {
        const address = process.env.KYC_CONTRACT_ADDRESS;
        if (!address)
            throw new Error(" Missing KYC_CONTRACT_ADDRESS in .env");
        const contract = new ethers_1.ethers.Contract(address, KYCRegistry_json_1.default.abi, this.signer);
        console.log(' KYC connected:', address);
        console.log("KYC Contract Functions:", contract.interface.fragments
            .filter((f) => f.type === "function")
            .map((f) => f.name));
        const approveFn = contract.interface.getFunction("approveKYC");
        console.log("approveKYC signature:", approveFn?.format());
        return contract;
    }
    initializeAssetManager() {
        const address = process.env.HOTEL_ASSET_MANAGER_ADDRESS;
        if (!address)
            throw new Error(" Missing HOTEL_ASSET_MANAGER_ADDRESS in .env");
        const contract = new ethers_1.ethers.Contract(address, HotelAssetManager_json_1.default.abi, this.signer);
        console.log(' HotelAssetManager connected:', address);
        return contract;
    }
    initializeInvestmentContract() {
        const address = process.env.INVESTMENT_CONTRACT_ADDRESS;
        if (!address)
            throw new Error(" Missing INVESTMENT_CONTRACT_ADDRESS in .env");
        const contract = new ethers_1.ethers.Contract(address, HotelInvestment_json_1.default.abi, this.signer);
        console.log(' HotelInvestment connected:', address);
        return contract;
    }
    async isKycVerified(address, forceBlockchainCheck = false) {
        try {
            const normalizedAddress = address.toLowerCase();
            console.log(` KYC Check for ${address}`);
            const user = await database_1.default.user.findUnique({
                where: { walletAddress: normalizedAddress },
                select: {
                    kycStatus: true,
                    kycBlockchainSynced: true,
                    kycLastVerified: true,
                    kycApprovedAt: true
                }
            });
            if (user?.kycStatus !== 'APPROVED') {
                console.log('    Database: NOT APPROVED');
                return false;
            }
            console.log('    Database: APPROVED');
            if (user.kycBlockchainSynced && user.kycLastVerified) {
                const hoursSinceVerification = (Date.now() - user.kycLastVerified.getTime()) / (1000 * 60 * 60);
                if (hoursSinceVerification < KYC_CONFIG.BLOCKCHAIN_CACHE_HOURS && !forceBlockchainCheck) {
                    console.log(` Using cached verification (${hoursSinceVerification.toFixed(1)}h old)`);
                    return true;
                }
            }
            if (forceBlockchainCheck || !user.kycBlockchainSynced) {
                console.log('   Verifying on blockchain...');
                try {
                    const onChainVerified = await this.kycContract.isKYCVerified(address);
                    await database_1.default.user.update({
                        where: { walletAddress: normalizedAddress },
                        data: {
                            kycBlockchainSynced: onChainVerified,
                            kycLastVerified: new Date(),
                            kycSyncError: null
                        }
                    });
                    console.log(`   Blockchain: ${onChainVerified ? ' Verified' : ' Not Verified'}`);
                    return onChainVerified;
                }
                catch (error) {
                    console.warn('    Blockchain check failed:', error.message);
                    await database_1.default.user.update({
                        where: { walletAddress: normalizedAddress },
                        data: { kycSyncError: error.message }
                    }).catch(() => { });
                    console.log('    Using database fallback');
                    return true;
                }
            }
            return true;
        }
        catch (error) {
            console.error(' KYC check failed:', error.message);
            return false;
        }
    }
    async registerKyc(address, hash) {
        try {
            console.log(` Registering KYC for ${address}...`);
            const level = 1;
            const expiresAt = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60;
            const verifierRole = await this.kycContract.VERIFIER_ROLE();
            const hasRole = await this.kycContract.hasRole(verifierRole, this.signer.address);
            const paused = await this.kycContract.paused();
            console.log("Signer has VERIFIER_ROLE:", hasRole);
            console.log("KYC contract paused:", paused);
            if (!hasRole)
                throw new Error("Signer does not have VERIFIER_ROLE");
            if (paused)
                throw new Error("KYC contract is currently paused");
            const tx = await this.kycContract.approveKYC(address, level, expiresAt, {
                gasLimit: GAS_LIMITS.KYC_REGISTER
            });
            console.log(" Tx sent:", tx.hash);
            const receipt = await tx.wait();
            console.log(" KYC approved on blockchain:", receipt.hash);
            await database_1.default.user.update({
                where: { walletAddress: address.toLowerCase() },
                data: {
                    kycBlockchainTxHash: receipt.hash,
                    kycBlockchainSynced: true,
                    kycLastVerified: new Date(),
                    kycSyncAttempts: 0,
                    kycSyncError: null
                }
            });
            return receipt.hash;
        }
        catch (error) {
            console.error(" KYC registration failed:", error.message);
            await database_1.default.user.update({
                where: { walletAddress: address.toLowerCase() },
                data: {
                    kycSyncAttempts: { increment: 1 },
                    kycSyncError: error.message
                }
            }).catch(() => { });
            throw error;
        }
    }
    async syncAllPendingKycs() {
        try {
            console.log('\nStarting bulk KYC sync to blockchain...');
            const pendingUsers = await database_1.default.user.findMany({
                where: {
                    kycStatus: 'APPROVED',
                    kycBlockchainSynced: false,
                    walletAddress: { not: null },
                },
                select: {
                    id: true,
                    walletAddress: true,
                    kycDocumentHash: true,
                    email: true,
                },
            });
            if (pendingUsers.length === 0) {
                console.log('No pending KYC syncs needed');
                return { synced: 0, failed: 0 };
            }
            console.log(`Found ${pendingUsers.length} users to sync`);
            let synced = 0;
            let failed = 0;
            for (const user of pendingUsers) {
                if (!user.walletAddress) {
                    console.log(`Skipping ${user.email}: No wallet address`);
                    failed++;
                    continue;
                }
                const hash = user.kycDocumentHash ||
                    ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(`kyc-${user.id}-${Date.now()}`));
                console.log(`\nSyncing KYC for: ${user.email}`);
                console.log(`   Wallet: ${user.walletAddress}`);
                let attempts = 0;
                let txHash = null;
                while (attempts < 3 && !txHash) {
                    attempts++;
                    try {
                        txHash = await this.registerKyc(user.walletAddress, hash);
                    }
                    catch (error) {
                        console.warn(`Attempt ${attempts} failed for ${user.email}: ${error.message}`);
                        if (attempts < 3) {
                            await this.delay(2000);
                        }
                    }
                }
                if (!txHash) {
                    console.error(`Failed to sync ${user.email} after 3 attempts`);
                    failed++;
                    continue;
                }
                await database_1.default.user.update({
                    where: { id: user.id },
                    data: {
                        kycBlockchainSynced: true,
                        kycBlockchainTxHash: txHash,
                        kycLastVerified: new Date(),
                        kycDocumentHash: hash,
                        updatedAt: new Date(),
                    },
                });
                synced++;
                console.log(`Synced successfully (tx: ${txHash.slice(0, 10)}...)`);
                await this.delay(2000);
            }
            console.log('\nBulk KYC sync completed:');
            console.log(`   ✓ Success: ${synced}`);
            console.log(`   ✗ Failed: ${failed}`);
            return { synced, failed };
        }
        catch (error) {
            console.error('Bulk KYC sync failed:', error.message);
            throw error;
        }
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async getHotelTokenAddress(hotelId) {
        try {
            const hotel = await database_1.default.hotelAsset.findUnique({
                where: { id: hotelId },
                select: { blockchainId: true, name: true }
            });
            if (!hotel?.blockchainId) {
                throw new Error(`Hotel ${hotelId} not found or not tokenized`);
            }
            const hotelData = await this.hotelAssetManager.getHotel(hotel.blockchainId);
            const tokenAddress = hotelData.tokenContract;
            if (tokenAddress === ethers_1.ethers.ZeroAddress) {
                throw new Error(`Hotel ${hotel.name} has no asset token deployed`);
            }
            console.log(` ${hotel.name} token address:`, tokenAddress);
            return tokenAddress;
        }
        catch (error) {
            console.error(' Get token address failed:', error.message);
            throw error;
        }
    }
    async getHotelTokenContract(hotelId) {
        if (this.tokenContractCache.has(hotelId)) {
            return this.tokenContractCache.get(hotelId);
        }
        const tokenAddress = await this.getHotelTokenAddress(hotelId);
        const contract = new ethers_1.ethers.Contract(tokenAddress, HotelAssetToken_json_1.default.abi, this.signer);
        this.tokenContractCache.set(hotelId, contract);
        return contract;
    }
    async processInvestment(hotelId, userAddress, stableAmount, paymentToken = "USDC") {
        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('💰 PROCESSING INVESTMENT');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            const hotel = await database_1.default.hotelAsset.findUnique({
                where: { id: hotelId },
                select: {
                    id: true,
                    blockchainId: true,
                    name: true,
                    tokenPrice: true
                }
            });
            if (!hotel?.blockchainId) {
                throw new Error(`Hotel ${hotelId} not found`);
            }
            const amountUSD = parseFloat(stableAmount);
            console.log(` Hotel: ${hotel.name}`);
            console.log(` Investment: $${amountUSD} USDC`);
            const requiresBlockchainCheck = amountUSD >= KYC_CONFIG.LARGE_INVESTMENT_THRESHOLD;
            if (requiresBlockchainCheck) {
                console.log(` Large investment ($${amountUSD}) - blockchain check required`);
            }
            const user = await database_1.default.user.findFirst({
                where: { walletAddress: userAddress },
                select: { id: true, kycStatus: true }
            });
            if (!user) {
                throw new Error('User not found');
            }
            console.log(`🔍 KYC Check for ${userAddress}`);
            console.log(`   User ID: ${user.id}`);
            console.log(`   Database KYC: ${user.kycStatus}`);
            if (user.kycStatus !== 'APPROVED') {
                throw new Error('User must complete KYC verification first');
            }
            if (requiresBlockchainCheck) {
                const blockchainKYC = await this.isKycVerified(userAddress, true);
                console.log(`   Blockchain KYC: ${blockchainKYC ? 'VERIFIED' : 'NOT VERIFIED'}`);
                if (!blockchainKYC) {
                    throw new Error('Large investment requires blockchain KYC verification');
                }
            }
            console.log('✅ KYC verification passed');
            const tokenAmount = amountUSD / Number(hotel.tokenPrice);
            console.log(` Expected tokens: ${tokenAmount.toFixed(2)}`);
            stablecoinService_1.StablecoinService.validateToken(paymentToken, "INVESTMENT");
            const stablecoin = stablecoinService_1.StablecoinService.getStablecoin(paymentToken);
            const amountWei = ethers_1.ethers.parseUnits(stableAmount, stablecoin.decimals);
            console.log(` USDC (wei): ${amountWei.toString()}`);
            if (!stablecoin.allowInvestments) {
                throw new Error(`${stablecoin.symbol} is not allowed for investments`);
            }
            if (stablecoin.complianceTier === "BANK_GRADE") {
                console.log("🏦 Bank-grade investment detected:", stablecoin.symbol);
            }
            console.log(" Stablecoin approved:", stablecoin.symbol);
            console.log(' Calling HotelInvestment.invest()...');
            const tx = await this.hotelInvestment.invest(hotel.blockchainId, amountWei, { gasLimit: GAS_LIMITS.INVESTMENT });
            console.log('   Tx sent:', tx.hash);
            console.log('   Waiting for confirmation...');
            const receipt = await tx.wait();
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(' INVESTMENT SUCCESS!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(' Tx Hash:', receipt.hash);
            console.log(' Block:', receipt.blockNumber);
            console.log(' Gas Used:', receipt.gasUsed.toString());
            console.log(' Investor:', userAddress);
            console.log(' Hotel:', hotel.name);
            console.log(' USDC Invested:', stableAmount);
            console.log(' Tokens Minted:', tokenAmount.toFixed(2));
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            return receipt.hash;
        }
        catch (error) {
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error(' INVESTMENT FAILED!');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error(' Error:', error.message);
            console.error(' Code:', error.code);
            if (error.message.includes('KYCRequired')) {
                throw new Error('User must complete KYC verification first');
            }
            if (error.message.includes('insufficient funds')) {
                throw new Error('Insufficient USDC balance or gas funds');
            }
            if (error.message.includes('InvestmentClosed')) {
                throw new Error('Investment period has ended for this hotel');
            }
            throw new Error(`Investment failed: ${error.message}`);
        }
    }
    async getHotelTokenBalance(userAddress, hotelId) {
        try {
            const hotel = await database_1.default.hotelAsset.findUnique({
                where: { id: hotelId },
                select: { name: true }
            });
            const tokenContract = await this.getHotelTokenContract(hotelId);
            const balanceWei = await tokenContract.balanceOf(userAddress);
            const balance = ethers_1.ethers.formatUnits(balanceWei, 18);
            console.log(` Balance for ${userAddress}:`);
            console.log(`  Hotel: ${hotel?.name}`);
            console.log(`  Balance: ${balance} tokens`);
            return balance;
        }
        catch (error) {
            console.error(' Balance check failed:', error.message);
            return "0";
        }
    }
    async getAllHotelTokenBalances(userAddress) {
        try {
            const hotels = await database_1.default.hotelAsset.findMany({
                where: { blockchainId: { gt: 0 } },
                select: {
                    id: true,
                    name: true,
                    blockchainId: true
                }
            });
            console.log(` Checking balances for ${hotels.length} tokenized hotels`);
            const balances = {};
            const results = await Promise.allSettled(hotels.map(hotel => this.getHotelTokenBalance(userAddress, hotel.id)
                .then(balance => ({ name: hotel.name, balance }))));
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    const { name, balance } = result.value;
                    if (parseFloat(balance) > 0) {
                        balances[name] = balance;
                        console.log(`  ${name}: ${balance}`);
                    }
                }
                else {
                    console.log(` ${hotels[index].name}: Could not fetch balance`);
                }
            });
            console.log(` Found ${Object.keys(balances).length} hotels with positive balances`);
            return balances;
        }
        catch (error) {
            console.error(' Get all balances failed:', error.message);
            return {};
        }
    }
    async getSignerAddress() {
        return this.signer.address;
    }
    async getSignerBalance() {
        const balance = await this.provider.getBalance(this.signer.address);
        return ethers_1.ethers.formatEther(balance);
    }
    async getNetworkInfo() {
        const network = await this.provider.getNetwork();
        return {
            chainId: network.chainId.toString(),
            name: network.name
        };
    }
    clearTokenCache() {
        this.tokenContractCache.clear();
        console.log(' Token contract cache cleared');
    }
    async verifyStablecoinTransfer(txHash, expectedAmount, expectedReceiver, stablecoin) {
        const receipt = await this.getReceiptWithRetry(txHash);
        if (!receipt) {
            console.error("Transaction receipt not found after retries");
            throw new Error("Transaction not found or not mined yet");
        }
        if (receipt.status !== 1) {
            console.error("Transaction receipt indicates failure", receipt);
            throw new Error("Transaction failed on-chain");
        }
        const stablecoinInterface = new ethers_1.ethers.Interface(USDC_ABI);
        let foundAnyTransfer = false;
        let foundMatchingReceiver = false;
        for (const log of receipt.logs) {
            if (!log.address || log.address.toLowerCase() !== stablecoin.address.toLowerCase())
                continue;
            try {
                const parsed = stablecoinInterface.parseLog(log);
                if (!parsed || parsed.name !== "Transfer")
                    continue;
                const from = parsed.args.from;
                const to = parsed.args.to;
                const value = parsed.args.value;
                foundAnyTransfer = true;
                console.log(`${stablecoin.symbol} Transfer Found:`, {
                    from,
                    to,
                    value: value.toString(),
                    expectedAmount: expectedAmount.toString(),
                });
                if (to.toLowerCase() !== expectedReceiver.toLowerCase())
                    continue;
                foundMatchingReceiver = true;
                if (process.env.NODE_ENV !== "development" && value < expectedAmount) {
                    throw new Error(`Insufficient ${stablecoin.symbol} payment. Expected: ${expectedAmount.toString()}, Got: ${value.toString()}`);
                }
                return {
                    sender: from,
                    receiver: to,
                    amount: value,
                };
            }
            catch (err) {
                console.warn("Failed to parse log:", err.message ?? err);
                continue;
            }
        }
        if (!foundAnyTransfer) {
            console.error(`No ${stablecoin.symbol} Transfer events found`);
            throw new Error(`No ${stablecoin.symbol} Transfer events found in transaction`);
        }
        if (!foundMatchingReceiver) {
            console.error(`${stablecoin.symbol} Transfer exists but not to expected receiver`, {
                expectedReceiver,
                logs: receipt.logs,
            });
            throw new Error(`${stablecoin.symbol} Transfer found, but not sent to expected receiver`);
        }
        throw new Error(`${stablecoin.symbol} transfer verification failed`);
    }
}
exports.Web3Service = Web3Service;
exports.web3Service = new Web3Service();
//# sourceMappingURL=web3Service.js.map