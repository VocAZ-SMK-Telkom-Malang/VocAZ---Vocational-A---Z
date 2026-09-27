import 'dotenv/config'
import { PrismaClient } from './generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🔍 typeof prisma.skill:', typeof prisma.skill)
  console.log('🔍 typeof prisma.industry:', typeof prisma.industry)
  console.log('🔍 typeof prisma.province:', typeof prisma.province)

  const count = await prisma.industry.count()
  console.log('✅ industries count:', count)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })