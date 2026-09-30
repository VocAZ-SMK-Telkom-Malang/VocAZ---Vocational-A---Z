// test-prisma.ts
import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const p = new PrismaClient({ adapter })

console.log('savedCompany:', typeof (p as any).savedCompany)
console.log('savedJob:', typeof (p as any).savedJob)
console.log('company:', typeof (p as any).company)

process.exit(0)