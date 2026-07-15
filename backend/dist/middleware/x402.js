"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.x402Middleware = void 0;
const ethers_1 = require("ethers");
const TREASURY_ADDRESS = (process.env.TREASURY_ADDRESS || "");
const CHAIN_ID = Number(process.env.CHAIN_ID || 84532);
const NETWORK = CHAIN_ID === 8453 ? "base" : "base-sepolia";
const USDC_ADDRESS = process.env.USDC_CONTRACT_ADDRESS ||
    (CHAIN_ID === 8453
        ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        : "0x036CbD53842c5426634e7929541eC2318f3dCF7e");
const TRANSFER_WITH_AUTH_TYPES = {
    TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" },
    ],
};
const USDC_ABI = [
    "function transferWithAuthorization(address from, address to, uint256 value, uint256 validAfter, uint256 validBefore, bytes32 nonce, uint8 v, bytes32 r, bytes32 s) external",
    "function authorizationState(address authorizer, bytes32 nonce) external view returns (bool)",
];
const x402Middleware = (priceUSDC) => {
    return async (req, res, next) => {
        if (req.query.pay !== "x402")
            return next();
        const bodyPrice = parseFloat(req.body?.totalPrice);
        const effectivePrice = !isNaN(bodyPrice) && bodyPrice > 0 ? bodyPrice : priceUSDC;
        const paymentHeader = req.headers["x-payment"];
        if (!paymentHeader) {
            return res.status(402).json({
                x402Version: 1,
                error: "Payment Required",
                accepts: [
                    {
                        scheme: "exact",
                        network: NETWORK,
                        maxAmountRequired: String(Math.round(effectivePrice * 1_000_000)),
                        resource: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
                        description: `Hotel booking payment: $${effectivePrice} USDC`,
                        mimeType: "application/json",
                        payTo: TREASURY_ADDRESS,
                        maxTimeoutSeconds: 300,
                        asset: USDC_ADDRESS,
                        extra: { name: "USDC", version: "2" },
                    },
                ],
            });
        }
        try {
            const paymentPayload = JSON.parse(Buffer.from(paymentHeader, "base64").toString("utf8"));
            const auth = paymentPayload?.payload?.authorization;
            const sig = paymentPayload?.payload?.signature;
            if (!auth || !sig) {
                return res.status(402).json({ x402Version: 1, error: "Invalid payment payload structure" });
            }
            const expectedAmount = BigInt(Math.round(effectivePrice * 1_000_000));
            const paidAmount = BigInt(auth.value);
            if (paidAmount < expectedAmount) {
                return res.status(402).json({
                    x402Version: 1,
                    error: `Insufficient payment: expected ${expectedAmount} units, got ${paidAmount}`,
                });
            }
            if (auth.to?.toLowerCase() !== TREASURY_ADDRESS.toLowerCase()) {
                return res.status(402).json({ x402Version: 1, error: "Payment recipient mismatch" });
            }
            const now = BigInt(Math.floor(Date.now() / 1000));
            if (BigInt(auth.validBefore) <= now) {
                return res.status(402).json({ x402Version: 1, error: "Payment authorization expired" });
            }
            const recovered = ethers_1.ethers.verifyTypedData({ name: "USDC", version: "2", chainId: CHAIN_ID, verifyingContract: USDC_ADDRESS }, TRANSFER_WITH_AUTH_TYPES, {
                from: auth.from,
                to: auth.to,
                value: BigInt(auth.value),
                validAfter: BigInt(auth.validAfter),
                validBefore: BigInt(auth.validBefore),
                nonce: auth.nonce,
            }, sig);
            if (recovered.toLowerCase() !== auth.from.toLowerCase()) {
                console.error(`x402 sig mismatch: recovered=${recovered}, from=${auth.from}`);
                return res.status(402).json({ x402Version: 1, error: "Invalid signature" });
            }
            console.log(`x402 sig valid: from=${auth.from}, amount=${auth.value}`);
            let txHash = null;
            const facilitatorUrl = process.env.X402_FACILITATOR_URL || "https://x402.org/facilitator";
            const facilitatorBody = {
                x402Version: 1,
                paymentPayload: paymentPayload,
                paymentRequirements: {
                    scheme: "exact",
                    network: NETWORK,
                    maxAmountRequired: String(Math.round(effectivePrice * 1_000_000)),
                    resource: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
                    description: `Hotel booking payment: $${effectivePrice} USDC`,
                    mimeType: "application/json",
                    payTo: TREASURY_ADDRESS,
                    maxTimeoutSeconds: 300,
                    asset: USDC_ADDRESS,
                    extra: { name: "USDC", version: "2" },
                },
            };
            console.log("[x402] facilitator verify body:", JSON.stringify(facilitatorBody, null, 2));
            const verifyRes = await fetch(`${facilitatorUrl}/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(facilitatorBody),
            });
            const verifyData = await verifyRes.json();
            console.log("[x402] facilitator verify response:", JSON.stringify(verifyData));
            if (verifyData?.isValid) {
                const settleRes = await fetch(`${facilitatorUrl}/settle`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(facilitatorBody),
                });
                const settleData = await settleRes.json();
                console.log("[x402] facilitator settle response:", JSON.stringify(settleData));
                txHash =
                    (typeof settleData?.transaction === "string" ? settleData.transaction : null) ||
                        settleData?.transaction?.hash ||
                        settleData?.txHash ||
                        settleData?.hash ||
                        null;
                console.log(`[x402] facilitator settled: txHash=${txHash}`);
            }
            else {
                console.warn(`[x402] facilitator rejected (${verifyData?.invalidReason}), falling back to direct on-chain settlement`);
                const rpcUrl = process.env.BASE_SEPOLIA_RPC || process.env.RPC_URL;
                const privateKey = process.env.PRIVATE_KEY;
                if (!rpcUrl || !privateKey) {
                    return res.status(500).json({ error: "Settlement configuration missing" });
                }
                const provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
                const signer = new ethers_1.ethers.Wallet(privateKey, provider);
                const usdc = new ethers_1.ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
                const nonceUsed = await usdc.authorizationState(auth.from, auth.nonce);
                if (nonceUsed) {
                    return res.status(402).json({ x402Version: 1, error: "Payment authorization already used" });
                }
                const sigHex = sig.startsWith("0x") ? sig.slice(2) : sig;
                const r = "0x" + sigHex.slice(0, 64);
                const s = "0x" + sigHex.slice(64, 128);
                const v = parseInt(sigHex.slice(128, 130), 16);
                const tx = await usdc.transferWithAuthorization(auth.from, auth.to, BigInt(auth.value), BigInt(auth.validAfter), BigInt(auth.validBefore), auth.nonce, v, r, s);
                const receipt = await tx.wait();
                txHash = receipt?.hash || tx.hash;
                console.log(`[x402] direct EIP-3009 settled: txHash=${txHash}`);
            }
            req.x402Payment = {
                txHash,
                amountUSDC: effectivePrice,
                paidAt: new Date().toISOString(),
            };
            next();
        }
        catch (err) {
            console.error("x402 settlement error:", err.message);
            const msg = err?.reason || err?.shortMessage || err?.message || "Payment settlement failed";
            return res.status(402).json({ x402Version: 1, error: msg });
        }
    };
};
exports.x402Middleware = x402Middleware;
//# sourceMappingURL=x402.js.map