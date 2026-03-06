"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KYCLevel = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ethers_1 = require("ethers");
const HotelTokenFactory_json_1 = __importDefault(require("../blockchain/abis/HotelTokenFactory.json"));
const HotelAssetToken_json_1 = __importDefault(require("../blockchain/abis/HotelAssetToken.json"));
function validateEnv() {
    const errors = [];
    if (!process.env.HOTEL_FACTORY_ADDRESS) {
        errors.push('HOTEL_FACTORY_ADDRESS not set in .env');
    }
    if (!process.env.BASE_SEPOLIA_RPC) {
        errors.push('BASE_SEPOLIA_RPC not set in .env');
    }
    if (!process.env.PRIVATE_KEY) {
        errors.push('PRIVATE_KEY not set in .env');
    }
    else {
        const pk = process.env.PRIVATE_KEY;
        if (!pk.startsWith('0x')) {
            errors.push('PRIVATE_KEY must start with 0x');
        }
        else if (pk.length !== 66) {
            errors.push(`PRIVATE_KEY must be 66 characters (0x + 64 hex), got ${pk.length}`);
        }
    }
    if (errors.length > 0) {
        throw new Error('Environment validation failed:\n' + errors.join('\n'));
    }
}
validateEnv();
const FACTORY_ADDRESS = process.env.HOTEL_FACTORY_ADDRESS;
const RPC_URL = process.env.BASE_SEPOLIA_RPC;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
var KYCLevel;
(function (KYCLevel) {
    KYCLevel[KYCLevel["NONE"] = 0] = "NONE";
    KYCLevel[KYCLevel["BASIC"] = 1] = "BASIC";
    KYCLevel[KYCLevel["ADVANCED"] = 2] = "ADVANCED";
    KYCLevel[KYCLevel["INSTITUTIONAL"] = 3] = "INSTITUTIONAL";
})(KYCLevel || (exports.KYCLevel = KYCLevel = {}));
class FactoryService {
    constructor() {
        try {
            this.provider = new ethers_1.ethers.JsonRpcProvider(RPC_URL);
            this.wallet = new ethers_1.ethers.Wallet(PRIVATE_KEY, this.provider);
            this.factory = new ethers_1.ethers.Contract(FACTORY_ADDRESS, HotelTokenFactory_json_1.default.abi, this.wallet);
            console.log('✅ Factory service initialized');
            console.log('📍 Factory Address:', FACTORY_ADDRESS);
        }
        catch (error) {
            console.error('❌ Failed to initialize Factory Service:', error);
            throw error;
        }
    }
    async deployHotelToken(params) {
        try {
            console.log('🚀 Deploying hotel token:', params);
            const { hotelId, hotelName, location, symbol, maxSupply, priceUSD, admin, kycLevel } = params;
            let tx;
            if (kycLevel !== undefined) {
                tx = await this.factory.deployHotelToken(hotelId, hotelName, location, symbol, maxSupply, priceUSD, admin, kycLevel);
            }
            else {
                tx = await this.factory.deployHotelTokenDefault(hotelId, hotelName, location, symbol, maxSupply, priceUSD, admin);
            }
            console.log('📝 Transaction sent:', tx.hash);
            const receipt = await tx.wait();
            console.log('✅ Transaction confirmed in block:', receipt.blockNumber);
            const event = receipt.logs.find((log) => {
                try {
                    const parsed = this.factory.interface.parseLog({
                        topics: log.topics,
                        data: log.data
                    });
                    return parsed?.name === 'TokenDeployed';
                }
                catch {
                    return false;
                }
            });
            if (!event) {
                throw new Error('TokenDeployed event not found in transaction logs');
            }
            const parsed = this.factory.interface.parseLog({
                topics: event.topics,
                data: event.data
            });
            const tokenAddress = parsed.args[0];
            console.log('🎉 Token deployed at:', tokenAddress);
            return {
                tokenAddress,
                txHash: receipt.hash,
                blockNumber: receipt.blockNumber
            };
        }
        catch (error) {
            console.error('❌ Error deploying hotel token:', error);
            throw error;
        }
    }
    async getAllTokens() {
        try {
            return await this.factory.getAllTokens();
        }
        catch (error) {
            console.error('Error getting all tokens:', error);
            throw error;
        }
    }
    async getTokenForHotel(hotelId) {
        try {
            return await this.factory.getTokenForHotel(hotelId);
        }
        catch (error) {
            console.error('Error getting token for hotel:', error);
            throw error;
        }
    }
    async getTotalDeployedTokens() {
        try {
            const total = await this.factory.getTotalDeployedTokens();
            return Number(total);
        }
        catch (error) {
            console.error('Error getting total deployed tokens:', error);
            throw error;
        }
    }
    async getKYCRegistry() {
        try {
            return await this.factory.kycRegistry();
        }
        catch (error) {
            console.error('Error getting KYC registry:', error);
            throw error;
        }
    }
    async getDefaultKYCLevel() {
        try {
            return await this.factory.defaultKYCLevel();
        }
        catch (error) {
            console.error('Error getting default KYC level:', error);
            throw error;
        }
    }
    getTokenContract(tokenAddress) {
        return new ethers_1.ethers.Contract(tokenAddress, HotelAssetToken_json_1.default.abi, this.wallet);
    }
    getFactoryAddress() {
        return FACTORY_ADDRESS;
    }
    async getOwner() {
        try {
            return await this.factory.owner();
        }
        catch (error) {
            console.error('Error getting owner:', error);
            throw error;
        }
    }
    async getCompleteTokenInfo(tokenAddress) {
        try {
            const token = this.getTokenContract(tokenAddress);
            const [name, symbol, decimals, totalSupply, hotelId, hotelName, location, maxSupply, tokenPriceUSD, deployedAt, paused] = await Promise.all([
                token.name(),
                token.symbol(),
                token.decimals(),
                token.totalSupply(),
                token.hotelId(),
                token.hotelName(),
                token.location(),
                token.maxSupply(),
                token.tokenPriceUSD(),
                token.deployedAt(),
                token.paused()
            ]);
            const remainingSupply = maxSupply - totalSupply;
            let totalInvested = BigInt(0);
            let requiredKYCLevel = 0;
            try {
                totalInvested = await token.totalInvested();
            }
            catch (e) {
            }
            try {
                requiredKYCLevel = await token.requiredKYCLevel();
            }
            catch (e) {
            }
            return {
                address: tokenAddress,
                name,
                symbol,
                decimals: Number(decimals),
                totalSupply,
                hotelId,
                hotelName,
                location,
                maxSupply,
                remainingSupply,
                tokenPriceUSD: Number(tokenPriceUSD),
                totalInvested,
                requiredKYCLevel: Number(requiredKYCLevel),
                deployedAt: new Date(Number(deployedAt) * 1000),
                paused
            };
        }
        catch (error) {
            console.error('Error getting complete token info:', error.message);
            throw error;
        }
    }
    async getInvestorInfo(tokenAddress, investorAddress) {
        try {
            const token = this.getTokenContract(tokenAddress);
            const info = await token.getInvestorInfo(investorAddress);
            return {
                investor: info.investor,
                amount: info.amount,
                timestamp: info.timestamp,
                kycLevel: info.kycLevel
            };
        }
        catch (error) {
            console.error('Error getting investor info:', error);
            throw error;
        }
    }
    async calculateTokenValue(tokenAddress, tokenAmount) {
        try {
            const token = this.getTokenContract(tokenAddress);
            const amount = ethers_1.ethers.parseEther(tokenAmount);
            const usdValue = await token.calculateValue(amount);
            return ethers_1.ethers.formatUnits(usdValue, 0);
        }
        catch (error) {
            console.error('Error calculating token value:', error);
            throw error;
        }
    }
    async getTotalInvested(tokenAddress, investorAddress) {
        try {
            const token = this.getTokenContract(tokenAddress);
            const invested = await token.totalInvested(investorAddress);
            return invested;
        }
        catch (error) {
            console.error('Error getting total invested:', error);
            return 0n;
        }
    }
    async getBalance(tokenAddress, address) {
        try {
            const token = this.getTokenContract(tokenAddress);
            const balance = await token.balanceOf(address);
            return balance;
        }
        catch (error) {
            console.error('Error getting balance:', error);
            return 0n;
        }
    }
}
exports.default = new FactoryService();
//# sourceMappingURL=factoryService.js.map