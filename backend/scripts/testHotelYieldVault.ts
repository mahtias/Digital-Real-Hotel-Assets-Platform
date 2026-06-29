// backend/scripts/testHotelYieldVault.ts

import dotenv from "dotenv";
dotenv.config();

import hotelYieldVaultService from "../src/services/HotelYieldVaultService";

async function main() {
  try {
    const investor =
      process.argv[2] as `0x${string}`;

    if (!investor) {
      throw new Error(
        "Usage: ts-node testHotelYieldVault.ts <wallet>"
      );
    }

    console.log("Investor:", investor);

    // 1 USDC (6 decimals)
    const amount = 1_000_000n;

    const tx =
      await hotelYieldVaultService.addClaimable(
        "TEST-DIST-001",
        investor,
        amount
      );

    console.log("✅ Allocation TX:", tx);

   const claimable =
  await hotelYieldVaultService.getClaimableYield(
    investor
  ) as bigint;

        console.log(
        "Claimable:",
        claimable.toString()
        );

  } catch (error) {
    console.error(error);
  }

  process.exit(0);
}

main();