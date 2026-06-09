// scripts/createDummyAdmin.ts

import prisma from "../src/config/database";

async function main() {
  const user = await prisma.user.create({
    data: {
      email: "admin@dra.local",
      password: "dummy-password",
      role: "ADMIN",
      walletAddress: "0x27C975D0179aB7E52E83f9Ee5c8213D85b0f278f",
      isEmailVerified: true,
    },
  });

  console.log("Admin ID:", user.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());