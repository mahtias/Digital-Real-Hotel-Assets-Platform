import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing')
}

// Create a shared pg Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Pass pool into Prisma adapter
const adapter = new PrismaPg(pool)

// PrismaClient MUST be initialized with the adapter
const prisma = new PrismaClient({
  adapter,
})

export default prisma