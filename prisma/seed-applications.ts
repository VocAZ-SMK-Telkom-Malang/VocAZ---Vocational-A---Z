// prisma/seed-applications.ts
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

// ============================================
// SEED APPLICATIONS
// ============================================

const APPLICATIONS_SEED = [
  {
    jobSlug: 'frontend-web-developer-garuda',
    status: 'interview' as const,
    matchScore: 92,
    daysAgo: 5,
    nextStep: 'Interview teknis via Zoom',
    interviewInDays: 3,
    recruiterName: 'Rina Wulandari',
    history: [
      { status: 'submitted', daysAgo: 5, note: undefined },
      { status: 'reviewed', daysAgo: 4, note: 'CV lolos screening' },
      { status: 'shortlisted', daysAgo: 2, note: 'Masuk 5 besar kandidat' },
      { status: 'interview', daysAgo: 1, note: 'Dijadwalkan interview teknis' },
    ],
  },
  {
    jobSlug: 'junior-data-analyst-garuda',
    status: 'reviewed' as const,
    matchScore: 85,
    daysAgo: 7,
    nextStep: 'Menunggu hasil review HR',
    history: [
      { status: 'submitted', daysAgo: 7, note: undefined },
      { status: 'reviewed', daysAgo: 3, note: 'Sedang direview tim HR' },
    ],
  },
  {
    jobSlug: 'ui-ux-designer-nusantara',
    status: 'offered' as const,
    matchScore: 88,
    daysAgo: 12,
    nextStep: 'Review offering letter',
    recruiterName: 'Budi Santoso',
    notes: 'Penawaran: Rp 5.5jt + BPJS + Remote',
    history: [
      { status: 'submitted', daysAgo: 12, note: undefined },
      { status: 'reviewed', daysAgo: 11, note: undefined },
      { status: 'shortlisted', daysAgo: 9, note: undefined },
      { status: 'interview', daysAgo: 5, note: 'Interview user + portfolio' },
      { status: 'offered', daysAgo: 1, note: 'Offering dikirim via email' },
    ],
  },
  {
    jobSlug: 'android-developer-kotlin-garuda',
    status: 'submitted' as const,
    matchScore: 78,
    daysAgo: 2,
    nextStep: 'Menunggu review awal',
    history: [{ status: 'submitted', daysAgo: 2, note: undefined }],
  },
  {
    jobSlug: 'cyber-security-soc-komdigi',
    status: 'rejected' as const,
    matchScore: 62,
    daysAgo: 17,
    history: [
      { status: 'submitted', daysAgo: 17, note: undefined },
      { status: 'reviewed', daysAgo: 15, note: undefined },
      { status: 'rejected', daysAgo: 9, note: 'Belum sesuai requirement' },
    ],
  },
  {
    jobSlug: 'mobile-developer-flutter-nusantara',
    status: 'hired' as const,
    matchScore: 95,
    daysAgo: 30,
    nextStep: 'Onboarding 1 Oktober 2026',
    recruiterName: 'Budi Santoso',
    notes: 'Selamat! Kamu diterima sebagai Mobile Developer.',
    history: [
      { status: 'submitted', daysAgo: 30, note: undefined },
      { status: 'reviewed', daysAgo: 29, note: undefined },
      { status: 'shortlisted', daysAgo: 26, note: undefined },
      { status: 'interview', daysAgo: 22, note: undefined },
      { status: 'offered', daysAgo: 17, note: undefined },
      { status: 'hired', daysAgo: 12, note: 'Kontrak ditandatangani' },
    ],
  },
  {
    jobSlug: 'qa-engineer-garuda',
    status: 'withdrawn' as const,
    matchScore: 80,
    daysAgo: 22,
    history: [
      { status: 'submitted', daysAgo: 22, note: undefined },
      { status: 'reviewed', daysAgo: 19, note: undefined },
      { status: 'withdrawn', daysAgo: 15, note: 'Ditarik karena terima offer lain' },
    ],
  },
  {
    jobSlug: 'frontend-health-sehat',
    status: 'reviewed' as const,
    matchScore: 82,
    daysAgo: 6,
    nextStep: 'Sedang direview tim engineering',
    history: [
      { status: 'submitted', daysAgo: 6, note: undefined },
      { status: 'reviewed', daysAgo: 4, note: 'Masuk tahap screening' },
    ],
  },
  {
    jobSlug: 'fullstack-startup-kb',
    status: 'shortlisted' as const,
    matchScore: 79,
    daysAgo: 10,
    nextStep: 'Dijadwalkan technical test',
    history: [
      { status: 'submitted', daysAgo: 10, note: undefined },
      { status: 'reviewed', daysAgo: 8, note: undefined },
      { status: 'shortlisted', daysAgo: 3, note: 'Lolos tahap awal' },
    ],
  },
  {
    jobSlug: 'backend-engineer-bankdigital',
    status: 'submitted' as const,
    matchScore: 71,
    daysAgo: 1,
    nextStep: 'Menunggu review HR',
    history: [{ status: 'submitted', daysAgo: 1, note: undefined }],
  },
]

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('🌱 Seeding applications...\n')

  // 1. Cari student profile (atau bikin baru)
  let student = await prisma.studentProfile.findFirst()

  if (!student) {
    console.log('⚠ Belum ada StudentProfile, bikin user demo...\n')

    const user = await prisma.user.upsert({
      where: { email: 'demo.student@vocaz.id' },
      update: {},
      create: {
        email: 'demo.student@vocaz.id',
        neonAuthUserId: crypto.randomUUID(),
        role: 'student',
        fullName: 'Demo Student',
      },
    })

    student = await prisma.studentProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        headline: 'Frontend Developer Enthusiast',
        city: 'Jakarta',
        province: 'DKI Jakarta',
      },
    })

    console.log(`✓ StudentProfile created: ${student.id}`)
    console.log(`✓ User email: demo.student@vocaz.id\n`)
  } else {
    console.log(`✓ Using existing StudentProfile: ${student.id}\n`)
  }

  // 2. Loop seed applications
  let count = 0
  for (const item of APPLICATIONS_SEED) {
    // Cari job dari slug
    const job = await prisma.job.findUnique({
      where: { slug: item.jobSlug },
      select: { id: true, title: true },
    })

    if (!job) {
      console.warn(`  ⚠ Job "${item.jobSlug}" ga ada, skip`)
      continue
    }

    // Cek udah ada lamaran atau belum
    const existing = await prisma.application.findUnique({
      where: {
        jobId_studentId: {
          jobId: job.id,
          studentId: student.id,
        },
      },
    })

    const appliedAt = new Date(Date.now() - item.daysAgo * 86400000)
    const interviewDate = item.interviewInDays
      ? new Date(Date.now() + item.interviewInDays * 86400000)
      : null

    if (existing) {
      // Update
      await prisma.application.update({
        where: { id: existing.id },
        data: {
          status: item.status,
          matchScore: item.matchScore,
          appliedAt,
          nextStep: item.nextStep ?? null,
          interviewDate,
          recruiterName: item.recruiterName ?? null,
          notes: item.notes ?? null,
        },
      })

      // Hapus history lama, bikin baru
      await prisma.applicationStatusHistory.deleteMany({
        where: { applicationId: existing.id },
      })

      for (const h of item.history) {
        await prisma.applicationStatusHistory.create({
          data: {
            applicationId: existing.id,
            status: h.status,
            notes: h.note ?? null,
            createdAt: new Date(Date.now() - h.daysAgo * 86400000),
          },
        })
      }

      console.log(`  ✓ Updated: ${job.title}`)
    } else {
      // Create baru
      const app = await prisma.application.create({
        data: {
          jobId: job.id,
          studentId: student.id,
          status: item.status,
          matchScore: item.matchScore,
          appliedAt,
          nextStep: item.nextStep ?? null,
          interviewDate,
          recruiterName: item.recruiterName ?? null,
          notes: item.notes ?? null,
        },
      })

      for (const h of item.history) {
        await prisma.applicationStatusHistory.create({
          data: {
            applicationId: app.id,
            status: h.status,
            notes: h.note ?? null,
            createdAt: new Date(Date.now() - h.daysAgo * 86400000),
          },
        })
      }

      console.log(`  ✓ Created: ${job.title}`)
    }

    count++
  }

  console.log(`\n✅ Seed selesai!`)
  console.log(`   Total lamaran: ${count}`)
  console.log(`\n🎯 Login sebagai: demo.student@vocaz.id`)
  console.log(`   Atau set DEMO_USER_ID di page.tsx sesuai student.id di atas`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })