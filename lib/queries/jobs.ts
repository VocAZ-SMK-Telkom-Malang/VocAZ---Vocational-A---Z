// lib/queries/jobs.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// GET JOBS FROM DB
// ============================================

export async function getJobsFromDB() {
  const jobs = await prisma.job.findMany({
    orderBy: { publishedAt: 'desc' },
    include: {
      company: {
        select: {
          name: true,
          verificationStatus: true,
        },
      },
      skills: {
        include: {
          skill: { select: { name: true } },
        },
      },
    },
  })

  return jobs.map((j) => ({
    id: j.id,
    slug: j.slug,
    title: j.title,
    company: j.company.name,
    companyVerified: j.company.verificationStatus === 'verified',
    location: j.location ?? j.city ?? 'Remote',
    type: mapType(j.employmentType),
    mode: mapMode(j.workMode),
    salaryMin: j.salaryMin ? Number(j.salaryMin) / 1_000_000 : 0,
    salaryMax: j.salaryMax ? Number(j.salaryMax) / 1_000_000 : 0,
    postedAt: formatPostedAt(j.publishedAt ?? j.createdAt),
    applicants: 0,
    skills: j.skills.map((js) => js.skill.name),
    saved: false,
  }))
}

// ============================================
// GET SAVED JOB IDS (dari user student pertama)
// ============================================

export async function getSavedJobIdsFromDB(): Promise<string[]> {
  const session = await getServerSession()
  if (!session?.user?.id) return []

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: true },
  })

  if (!user?.studentProfile) return []

  const saved = await prisma.savedJob.findMany({
    where: { studentId: user.studentProfile.id },
    select: { jobId: true },
  })

  return saved.map((s) => s.jobId)
}

// ============================================
// HELPERS
// ============================================

function mapType(t: string): string {
  const map: Record<string, string> = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    internship: 'Magang',
    contract: 'Kontrak',
    freelance: 'Freelance',
    volunteer: 'Volunteer',
  }
  return map[t] ?? t
}

function mapMode(m: string): string {
  const map: Record<string, string> = {
    onsite: 'Onsite',
    remote: 'Remote',
    hybrid: 'Hybrid',
  }
  return map[m] ?? m
}

function formatPostedAt(d: Date): string {
  const diff = Date.now() - d.getTime()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)

  if (hours < 1) return 'Baru saja'
  if (hours < 24) return `${hours} jam lalu`
  if (days === 1) return 'Kemarin'
  if (days < 7) return `${days} hari lalu`
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`
  return `${Math.floor(days / 30)} bulan lalu`
}