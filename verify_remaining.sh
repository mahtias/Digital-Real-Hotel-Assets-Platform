#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE} Verifying HotelNFT...${NC}"
forge verify-contract \
  0x4CC1266e950a15f5F80e2554fc91E013644085Cf \
  contracts/HotelNFT.sol:HotelNFT \
  --chain-id 84532 \
  --verifier blockscout \
  --verifier-url "https://base-sepolia.blockscout.com/api/" \
  --watch

echo ""
echo -e "${BLUE} Verifying BookingNFT...${NC}"
forge verify-contract \
  0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb \
  contracts/BookingNFT.sol:BookingNFT \
  --chain-id 84532 \
  --verifier blockscout \
  --verifier-url "https://base-sepolia.blockscout.com/api/" \
  --watch

echo ""
echo -e "${GREEN} All contracts verified!${NC}"
echo ""
echo "View them at:"
echo "- HotelNFT: https://base-sepolia.blockscout.com/address/0x4CC1266e950a15f5F80e2554fc91E013644085Cf"
echo "- BookingNFT: https://base-sepolia.blockscout.com/address/0x118AaA088863Af0179C5cB1fdb0df00fA52f52Cb"
echo "- HotelAssetManager: https://base-sepolia.blockscout.com/address/0x572C8046A079F5782405212c17C44cA74eF9c4Ed"
