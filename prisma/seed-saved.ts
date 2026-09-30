// prisma/seed-saved.ts
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

// Berapa banyak saved job + company yang mau di-seed
const SAVED_JOBS_COUNT = 8
const SAVED_COMPANIES_COUNT = 6

async function main() {
  console.log('🌱 Seeding saved items...\n')

  // 1. Cari student profile (dari seed sebelumnya)
  const student = await prisma.studentProfile.findFirst()

  if (!student) {
    console.error('❌ Belum ada StudentProfile.')
    console.error('   Jalankan dulu: npx tsx prisma/seed-applications.ts')
    process.exit(1)
  }

  console.log(`✓ Using StudentProfile: ${student.id}\n`)

  // ============================================
  // 2. SAVED JOBS
  // ============================================
  console.log('📌 Seeding saved jobs...')

  const jobs = await prisma.job.findMany({
    take: SAVED_JOBS_COUNT,
    orderBy: { publishedAt: 'desc' },
    select: { id: true, title: true },
  })

  if (jobs.length === 0) {
    console.warn('   ⚠ Belum ada Job di DB. Jalankan seed jobs dulu.')
  } else {
    for (const job of jobs) {
      await prisma.savedJob.upsert({
        where: {
          studentId_jobId: {
            studentId: student.id,
            jobId: job.id,
          },
        },
        update: {},
        create: {
          studentId: student.id,
          jobId: job.id,
        },
      })
      console.log(`   ✓ ${job.title}`)
    }
  }
  console.log(`   ✅ ${jobs.length} saved jobs\n`)

  // ============================================
  // 3. SAVED COMPANIES
  // ============================================
  console.log('📌 Seeding saved companies...')

  const companies = await prisma.company.findMany({
    take: SAVED_COMPANIES_COUNT,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true },
  })

  if (companies.length === 0) {
    console.warn('   ⚠ Belum ada Company di DB. Jalankan seed companies dulu.')
  } else {
    for (const company of companies) {
      await prisma.savedCompany.upsert({
        where: {
          studentId_companyId: {
            studentId: student.id,
            companyId: company.id,
          },
        },
        update: {},
        create: {
          studentId: student.id,
          companyId: company.id,
        },
      })
      console.log(`   ✓ ${company.name}`)
    }
  }
  console.log(`   ✅ ${companies.length} saved companies\n`)

  console.log('🎉 Seed selesai!')
  console.log(`   Saved jobs: ${jobs.length}`)
  console.log(`   Saved companies: ${companies.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })