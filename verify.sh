#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check API key
if [ -z "$ETHERSCAN_API_KEY" ]; then
    echo -e "${RED} ETHERSCAN_API_KEY not set!${NC}"
    echo "Run: export ETHERSCAN_API_KEY=\$BASESCAN_API_KEY"
    exit 1
fi

echo -e "${BLUE} Verifying contracts on Base Sepolia (BaseScan)...${NC}\n"

# Contract addresses
KYC_CONTRACT_ADDRESS="0x4CC1266e950a15f5F80e2554fc91E013644085Cf"
HOTEL_ASSET_MANAGER_ADDRESS="0x572C8046A079F5782405212c17C44cA74eF9c4Ed"
INVESTMENT_CONTRACT_ADDRESS="0x93a0fB6E60b2b7Bb0D5B03BcFcb66a0a4cB26C55"
TREASURY_ADDRESS="0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb"
USDC_ADDRESS="0x036CbD53842c5426634e7929541eC2318f3dCF7e"

# 1. Verify KYCRegistry
echo -e "${GREEN}1/3 Verifying KYCRegistry...${NC}"
forge verify-contract \
  $KYC_CONTRACT_ADDRESS \
  contracts/KYCRegistry.sol:KYCRegistry \
  --chain-id 84532 \
  --verifier etherscan \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(address)" "$TREASURY_ADDRESS") \
  --watch

if [ $? -eq 0 ]; then
    echo -e "${GREEN} KYCRegistry verified!${NC}"
else
    echo -e "${YELLOW} Check if already verified or try again${NC}"
fi

echo ""
sleep 5

# 2. Verify HotelAssetManager
echo -e "${GREEN}2/3 Verifying HotelAssetManager...${NC}"
forge verify-contract \
  $HOTEL_ASSET_MANAGER_ADDRESS \
  contracts/HotelAssetManager.sol:HotelAssetManager \
  --chain-id 84532 \
  --verifier etherscan \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(address,address)" "$KYC_CONTRACT_ADDRESS" "$TREASURY_ADDRESS") \
  --watch

if [ $? -eq 0 ]; then
    echo -e "${GREEN}HotelAssetManager verified!${NC}"
else
    echo -e "${YELLOW} Check if already verified or try again${NC}"
fi

echo ""
sleep 5

# 3. Verify HotelInvestment
echo -e "${GREEN}3/3 Verifying HotelInvestment...${NC}"
forge verify-contract \
  $INVESTMENT_CONTRACT_ADDRESS \
  contracts/HotelInvestment.sol:HotelInvestment \
  --chain-id 84532 \
  --verifier etherscan \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(address,address,address,address)" "$USDC_ADDRESS" "$KYC_CONTRACT_ADDRESS" "$HOTEL_ASSET_MANAGER_ADDRESS" "$TREASURY_ADDRESS") \
  --watch

if [ $? -eq 0 ]; then
    echo -e "${GREEN} HotelInvestment verified!${NC}"
else
    echo -e "${YELLOW}  Check if already verified or try again${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN} Verification complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE} View on BaseScan:${NC}"
echo "   KYCRegistry:        https://sepolia.basescan.org/address/$KYC_CONTRACT_ADDRESS#code"
echo "   HotelAssetManager:  https://sepolia.basescan.org/address/$HOTEL_ASSET_MANAGER_ADDRESS#code"
echo "   HotelInvestment:    https://sepolia.basescan.org/address/$INVESTMENT_CONTRACT_ADDRESS#code"
echo ""
echo -e "${BLUE} View on Blockscout:${NC}"
echo "   KYCRegistry:        https://base-sepolia.blockscout.com/address/$KYC_CONTRACT_ADDRESS"
echo "   HotelAssetManager:  https://base-sepolia.blockscout.com/address/$HOTEL_ASSET_MANAGER_ADDRESS"
echo "   HotelInvestment:    https://base-sepolia.blockscout.com/address/$INVESTMENT_CONTRACT_ADDRESS"
