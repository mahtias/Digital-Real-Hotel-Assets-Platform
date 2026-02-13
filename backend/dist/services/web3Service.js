"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.web3Service = exports.Web3Service = void 0;
const ethers_1 = require("ethers");
const database_1 = __importDefault(require("../config/database"));
const KYCRegistry_json_1 = __importDefault(require("../../../out/KYCRegistry.sol/KYCRegistry.json"));
const HATToken_json_1 = __importDefault(require("../../../out/HATToken.sol/HATToken.json"));
const Investment_json_1 = __importDefault(require("../../../out/Investment.sol/Investment.json"));
class Web3Service {
    constructor() {
        const rpc = process.env.BASE_SEPOLIA_RPC || process.env.RPC_URL;
        if (!rpc)
            throw new Error("Missing BASE_SEPOLIA_RPC or RPC_URL in .env");
        console.log('🔗 Using RPC:', rpc);
        this.provider = new ethers_1.ethers.JsonRpcProvider(rpc);
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            throw new Error("Missing PRIVATE_KEY in .env");
        }
        this.signer = new ethers_1.ethers.Wallet(privateKey, this.provider);
        const kycAddress = process.env.KYC_CONTRACT_ADDRESS;
        if (!kycAddress) {
            throw new Error("Missing KYC_CONTRACT_ADDRESS in .env");
        }
        this.kycContract = new ethers_1.ethers.Contract(kycAddress, KYCRegistry_json_1.default.abi, this.signer);
        console.log('✅ KYC connected:', kycAddress);
        const hatAddress = process.env.HAT_CONTRACT_ADDRESS;
        if (!hatAddress) {
            throw new Error("Missing HAT_CONTRACT_ADDRESS in .env");
        }
        this.hatContract = new ethers_1.ethers.Contract(hatAddress, HATToken_json_1.default.abi, this.signer);
        console.log(' HAT connected:', hatAddress);
        const investmentAddress = process.env.INVESTMENT_CONTRACT_ADDRESS;
        if (investmentAddress) {
            this.investmentContract = new ethers_1.ethers.Contract(investmentAddress, Investment_json_1.default.abi, this.signer);
            console.log(' Investment connected:', investmentAddress);
        }
        else {
            console.warn(' No INVESTMENT_CONTRACT_ADDRESS → Direct HAT mint only');
        }
    }
    async isKycVerified(address) {
        try {
            const verified = await this.kycContract.isKycVerified(address);
            return verified;
        }
        catch (error) {
            console.error('KYC check failed:', error);
            return false;
        }
    }
    async mintInvestmentTokens(hotelId, userAddress, tokenAmount) {
        console.log(' MINT DEBUG:', { hotelId, userAddress, tokenAmount });
        try {
            const network = await this.provider.getNetwork();
            console.log(' Network:', network.chainId.toString());
            const hotel = await database_1.default.hotelAsset.findUnique({
                where: { id: hotelId }
            });
            if (!hotel)
                throw new Error(`Hotel ${hotelId} not found`);
            const tokenId = hotel.tokenId || BigInt(1);
            console.log(` Minting tokenId=${tokenId} → ${userAddress}`);
            let tx;
            if (this.investmentContract) {
                try {
                    console.log('💼 Using Investment contract → invest()');
                    const usdcAmount = ethers_1.ethers.parseUnits((tokenAmount * Number(hotel.tokenPrice)).toString(), 6);
                    tx = await this.investmentContract.invest(BigInt(hotel.tokenId), usdcAmount);
                }
                catch (invError) {
                    console.log(' Investment failed → Direct HAT mint');
                }
            }
            if (!tx) {
                console.log(' Direct HAT mint');
                try {
                    tx = await this.hatContract.mintToInvestor(tokenId, userAddress, tokenAmount);
                }
                catch {
                    tx = await this.hatContract.mint(userAddress, tokenId, tokenAmount, "0x");
                }
            }
            const receipt = await tx.wait();
            console.log(' MINT SUCCESS:', receipt.hash);
            return receipt.hash;
        }
        catch (err) {
            console.error(' MINT FAILED:', err.message);
            throw new Error(`Mint failed: ${err.message}`);
        }
    }
}
exports.Web3Service = Web3Service;
exports.web3Service = new Web3Service();
//# sourceMappingURL=web3Service.js.map