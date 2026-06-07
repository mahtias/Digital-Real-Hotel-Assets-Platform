import { Request, Response } from "express";
import prisma from "../config/database";
import { decodeEventLog } from "viem";
import crypto from "crypto";

import { hotelFactory } from "../blockchain/hotelFactory";
import { createPublicClient, http } from "viem";
import { abi as hotelAbi } from "../blockchain/abis/HotelAssetToken.json";
// -------------------------------------------------------
// GET HOTELS
// -------------------------------------------------------

const client = createPublicClient({
  transport: http(process.env.RPC_URL!)
});

export const getHotels = async (req: Request, res: Response) => {

  try {

    const hotels = await prisma.hotelAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: 6
    });

    const enrichedHotels = await Promise.all(
      hotels.map(async (hotel) => {

        if (!hotel.tokenAddress) return hotel;

        try {

        const [totalSupply, maxSupply, decimals] = await Promise.all([
              client.readContract({
                address: hotel.tokenAddress as `0x${string}`,
                abi: hotelAbi,
                functionName: "totalSupply",
              }) as Promise<bigint>,

              client.readContract({
                address: hotel.tokenAddress as `0x${string}`,
                abi: hotelAbi,
                functionName: "maxSupply",
              }) as Promise<bigint>,

              client.readContract({
                address: hotel.tokenAddress as `0x${string}`,
                abi: hotelAbi,
                functionName: "decimals",
              }) as Promise<number>,
            ]);

              const totalSupplyScaled =
        Number(totalSupply) /
        Math.pow(10, Number(decimals));

      const maxSupplyScaled =
        Number(maxSupply) /
        Math.pow(10, Number(decimals));

      const soldPercentage =
        maxSupplyScaled > 0
          ? (totalSupplyScaled / maxSupplyScaled) * 100
          : 0;

      return {
        ...hotel,

        totalSupply: totalSupply.toString(),
        maxSupply: maxSupply.toString(),
        decimals: Number(decimals),

        soldPercentage,

        status:
          soldPercentage >= 100
            ? "SOLD_OUT"
            : hotel.status
      };

        } catch (err) {
          console.log("Blockchain read failed:", hotel.name);
          return hotel;
        }
      })
    );

    return res.status(200).json(enrichedHotels);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed load hotels"
    });
  }
};


// -------------------------------------------------------
// GET HOTEL
// -------------------------------------------------------

export const getHotelById=async(
 req:Request,
 res:Response
)=>{

try{

const {id}=req.params;

let hotel;

if(!isNaN(Number(id))){

 hotel=
 await prisma.hotelAsset.findFirst({
   where:{
      blockchainId:Number(id)
   }
 });

}

if(!hotel){

 hotel=
 await prisma.hotelAsset.findUnique({
   where:{id}
 });

}

if(!hotel){

 return res.status(404)
 .json({
   error:"Hotel not found"
 });

}

return res.json(hotel);

}catch(error){

 console.error(error);

 return res.status(500)
 .json({
   error:"Failed"
 });

}

};


// -------------------------------------------------------
// CREATE HOTEL
// -------------------------------------------------------

export const createHotel=async(
 req:any,
 res:Response
)=>{

try{

const payload=req.body;

const createdById=
req.user?.id;

if(!createdById){

 return res.status(400)
 .json({
   error:"User not authenticated"
 });

}

const hotelId=
crypto.randomUUID();

console.log(
"[createHotel] deploying..."
);

const hash=
await hotelFactory.wallet.writeContract({

 address:
 hotelFactory.address,

 abi:
 hotelFactory.abi,

 functionName:
 "deployHotelToken",

 args:[ hotelId,

   payload.name,

   payload.location,

   payload.tokenSymbol
   || "HAT",

   BigInt(
    payload.totalTokens
   ),

   BigInt(
    payload.tokenPrice
   ),
 process.env.TREASURY_ADDRESS as `0x${string}`, 0] });

console.log(
"TX HASH:",
hash
);

const receipt=
await hotelFactory.public
.waitForTransactionReceipt({
 hash
});

const log=
receipt.logs.find(
(l:any)=>{

try{

const decoded=
decodeEventLog({

 abi:
 hotelFactory.abi,

 data:l.data,

 topics:l.topics

}) as any;

return(
decoded.eventName
==="TokenDeployed"
);

}catch{

return false;

}

});

if(!log){

throw new Error(
"TokenDeployed missing"
);

}

const decoded=
decodeEventLog({

 abi:
 hotelFactory.abi,

 data:log.data,

 topics:log.topics

}) as any;

const tokenAddress=
decoded.args.tokenAddress;

const hotel=
await prisma.hotelAsset.create({

data:{

id:hotelId,

name:
payload.name,

location:
payload.location,

country:
payload.country || null,

imageUrl:
payload.imageUrl || null,

description:
payload.description || null,

tokenSymbol:
payload.tokenSymbol || "HAT",

totalTokens:
Number(
payload.totalTokens
),

tokenPrice:
Number(
payload.tokenPrice
),

tokenAddress,

status:
"FUNDRAISING",

createdById

}

});

return res
.status(201)
.json(hotel);

}catch(error){

console.error(
"CREATE ERROR:",
error
);

return res
.status(500)
.json({

error:
"Failed create hotel"

});

}

};


// -------------------------------------------------------
// UPDATE HOTEL
// DB only for now
// -------------------------------------------------------

export const updateHotel=
async(
req:Request,
res:Response
)=>{

try{

const hotel=
await prisma.hotelAsset
.update({

where:{
id:req.params.id
},

data:req.body

});

return res.json(
hotel
);

}catch(error){

console.error(error);

return res.status(500)
.json({
error:"Failed"
});

}

};


// -------------------------------------------------------
// DELETE HOTEL
// -------------------------------------------------------

export const deleteHotel=
async(
req:Request,
res:Response
)=>{

try{

await prisma.hotelAsset
.delete({

where:{
id:req.params.id
}

});

return res.json({
success:true
});

}catch(error){

console.error(error);

return res.status(500)
.json({
error:"Failed"
});

}

}; 