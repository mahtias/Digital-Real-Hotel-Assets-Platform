import prisma from "../src/config/database";

async function main() {
  const mappings = [
    {
      hotelId: "25c38d85-6b08-48f3-8d67-3795a32a9fbf",
      symbol: "DRA-MBS",
    },
    {
      hotelId: "09c1fdb9-c592-4240-bcec-1c7a729074a7",
      symbol: "DRA-RCB",
    },
    {
      hotelId: "e009ef84-23bc-473e-b5d8-6c9a7498c784",
      symbol: "DRA-GPH",
    },
    {
      hotelId: "d7c94dc9-6e97-4b8d-ac9a-3abf1a7985ce",
      symbol: "DRA-WAM",
    },
    {
      hotelId: "12a04eed-c00f-4374-9261-2842ffcee58d",
      symbol: "DRA-MVL",
    },
    {
      hotelId: "4a0ef4cc-d255-4cbb-bffa-c4e8a7df1722",
      symbol: "DRA-MHN",
    },
  ];

  for (const item of mappings) {
    await prisma.hotelAsset.update({
      where: { id: item.hotelId },
      data: {
        tokenSymbol: item.symbol,
      },
    });

    console.log(`Updated ${item.symbol}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());