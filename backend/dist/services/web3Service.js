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
            const tx = await this.kycContract.registerUser(address, hash, {
                gasLimit: GAS_LIMITS.KYC_REGISTER
            });
            console.log('   Tx sent:', tx.hash);
            const receipt = await tx.wait();
            console.log('  KYC registered:', receipt.hash);
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
            console.error(' KYC registration failed:', error.message);
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
    async registerKycWithRetry(userAddress, documentHash, maxRetries = 3) {
        let lastError = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                console.log(` Attempt ${attempt}/${maxRetries}...`);
                const txHash = await this.registerKyc(userAddress, documentHash);
                console.log(`   Success on attempt ${attempt}`);
                return txHash;
            }
            catch (error) {
                lastError = error;
                console.error(` Attempt ${attempt} failed:`, error.message);
                if (error.message.includes('already registered') ||
                    error.message.includes('invalid address') ||
                    error.message.includes('invalid document hash')) {
                    console.log(`    Non-retryable error, stopping retries`);
                    throw error;
                }
                if (attempt < maxRetries) {
                    const delayMs = KYC_CONFIG.SYNC_RETRY_DELAY * attempt;
                    console.log(`  Waiting ${delayMs}ms before retry...`);
                    await this.delay(delayMs);
                }
            }
        }
        throw new Error(`KYC registration failed after ${maxRetries} attempts: ${lastError?.message}`);
    }
    async syncAllPendingKycs() {
        try {
            console.log('\n Starting bulk KYC sync to blockchain...');
            const pendingUsers = await database_1.default.user.findMany({
                where: {
                    kycStatus: 'APPROVED',
                    kycBlockchainSynced: false,
                    walletAddress: { not: null }
                },
                select: {
                    id: true,
                    walletAddress: true,
                    kycDocumentHash: true,
                    email: true
                }
            });
            if (pendingUsers.length === 0) {
                console.log(' No pending KYC syncs needed');
                return { synced: 0, failed: 0 };
            }
            console.log(` Found ${pendingUsers.length} users to sync`);
            let synced = 0;
            let failed = 0;
            for (const user of pendingUsers) {
                try {
                    if (!user.walletAddress) {
                        console.log(` Skipping ${user.email}: No wallet address`);
                        failed++;
                        continue;
                    }
                    const hash = user.kycDocumentHash || ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(`kyc-${user.id}-${Date.now()}`));
                    console.log(`\n Syncing KYC for: ${user.email}`);
                    console.log(`   Wallet: ${user.walletAddress}`);
                    const txHash = await this.registerKycWithRetry(user.walletAddress, hash);
                    await database_1.default.user.update({
                        where: { id: user.id },
                        data: {
                            kycBlockchainSynced: true,
                            kycBlockchainTxHash: txHash,
                            kycLastVerified: new Date(),
                            kycDocumentHash: hash,
                            updatedAt: new Date()
                        }
                    });
                    synced++;
                    console.log(`  Synced successfully (tx: ${txHash.slice(0, 10)}...)`);
                    await this.delay(2000);
                }
                catch (error) {
                    failed++;
                    console.error(`  Failed to sync ${user.email}:`, error.message);
                    continue;
                }
            }
            console.log('\n Bulk sync completed:');
            console.log(`   ✓ Success: ${synced}`);
            console.log(`   ✗ Failed: ${failed}`);
            return { synced, failed };
        }
        catch (error) {
            console.error(' Bulk KYC sync failed:', error.message);
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
                select: { tokenId: true, name: true }
            });
            if (!hotel?.tokenId) {
                throw new Error(`Hotel ${hotelId} not found or not tokenized`);
            }
            const hotelData = await this.hotelAssetManager.getHotel(hotel.tokenId);
            const tokenAddress = hotelData.assetToken;
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
    async processInvestment(hotelId, userAddress, usdcAmount) {
        try {
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('💰 PROCESSING INVESTMENT');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            const hotel = await database_1.default.hotelAsset.findUnique({
                where: { id: hotelId },
                select: {
                    id: true,
                    tokenId: true,
                    name: true,
                    tokenPrice: true
                }
            });
            if (!hotel?.tokenId) {
                throw new Error(`Hotel ${hotelId} not found`);
            }
            const amountUSD = parseFloat(usdcAmount);
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
            const usdcAmountWei = ethers_1.ethers.parseUnits(usdcAmount, 6);
            console.log(` USDC (wei): ${usdcAmountWei.toString()}`);
            const tokenAmount = amountUSD / Number(hotel.tokenPrice);
            console.log(` Expected tokens: ${tokenAmount.toFixed(2)}`);
            console.log(' Calling HotelInvestment.invest()...');
            const tx = await this.hotelInvestment.invest(hotel.tokenId, usdcAmountWei, { gasLimit: GAS_LIMITS.INVESTMENT });
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
            console.log(' USDC Invested:', usdcAmount);
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
                where: { tokenId: { gt: 0 } },
                select: {
                    id: true,
                    name: true,
                    tokenId: true
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
}
exports.Web3Service = Web3Service;
exports.web3Service = new Web3Service();
//# sourceMappingURL=web3Service.js.map