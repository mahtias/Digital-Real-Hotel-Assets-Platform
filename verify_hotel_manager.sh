#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE} Verifying HotelAssetManager with Solidity 0.8.24...${NC}\n"

# Get latest Foundry compiler version
SOLC_VERSION=$(forge --version | grep -oP 'solc-\K[0-9]+\.[0-9]+\.[0-9]+')

echo "Using Solidity compiler: v${SOLC_VERSION}"
echo ""

forge verify-contract \
  0x572C8046A079F5782405212c17C44cA74eF9c4Ed \
  contracts/HotelAssetManager.sol:HotelAssetManager \
  --chain-id 84532 \
  --verifier etherscan \
  --etherscan-api-key $BASESCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(address,address)" "0x4CC1266e950a15f5F80e2554fc91E013644085Cf" "0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb") \
  --watch

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN} HotelAssetManager verified successfully!${NC}"
    echo ""
    echo "View at: https://sepolia.basescan.org/address/0x572C8046A079F5782405212c17C44cA74eF9c4Ed#code"
else
    echo ""
    echo " Verification failed. Trying with explicit compiler version..."
    echo ""
    
    forge verify-contract \
      0x572C8046A079F5782405212c17C44cA74eF9c4Ed \
      contracts/HotelAssetManager.sol:HotelAssetManager \
      --chain-id 84532 \
      --verifier etherscan \
      --etherscan-api-key $BASESCAN_API_KEY \
      --compiler-version "v0.8.24+commit.e11b9ed9" \
      --constructor-args $(cast abi-encode "constructor(address,address)" "0x4CC1266e950a15f5F80e2554fc91E013644085Cf" "0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb") \
      --watch
fi
