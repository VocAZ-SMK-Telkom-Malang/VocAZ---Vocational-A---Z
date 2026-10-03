// lib/queries/company-pipeline.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type PipelineJob = {
  id: string
  title: string
  slug: string
  status: string
  city: string | null
  employmentType: string
  publishedAt: string | null
  totalApplicants: number
  activeApplicants: number  // bukan rejected/withdrawn
}

export type PipelineCard = {
  applicationId: string
  studentId: string
  studentUserId: string
  fullName: string
  initials: string
  avatarUrl: string | null
  headline: string | null
  school: string | null
  city: string | null
  matchScore: number | null
  isVerified: boolean
  status: string
  appliedAt: string
  appliedAtRelative: string
  daysSinceApplied: number
  nextStep: string | null
}

export type PipelineBoard = {
  job: {
    id: string
    title: string
    slug: string
    status: string
  }
  columns: Record<string, PipelineCard[]>
  totalCount: number
}

// ============================================
// HELPERS
// ============================================

function getInitials(name: string | null): string {
  if (!name) return '??'
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} minggu lalu`
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

// ============================================
// GET PIPELINE JOBS (list)
// ============================================

export async function getPipelineJobs(companyId: string): Promise<PipelineJob[]> {
  const jobs = await prisma.job.findMany({
    where: {
      companyId,
      deletedAt: null,
      status: { in: ['active', 'closed'] },
    },
    orderBy: { publishedAt: 'desc' },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  })

  // Get active count per job
  const activeCounts = await prisma.application.groupBy({
    by: ['jobId'],
    where: {
      job: { companyId, deletedAt: null },
      status: { notIn: ['rejected', 'withdrawn'] },
    },
    _count: { _all: true },
  })

  const activeMap = new Map(
    activeCounts.map((c) => [c.jobId, c._count._all])
  )

  return jobs.map((j) => ({
    id: j.id,
    title: j.title,
    slug: j.slug,
    status: j.status,
    city: j.city,
    employmentType: j.employmentType,
    publishedAt: j.publishedAt?.toISOString() ?? null,
    totalApplicants: j._count.applications,
    activeApplicants: activeMap.get(j.id) ?? 0,
  }))
}

// ============================================
// GET PIPELINE BOARD (per job)
// ============================================

const PIPELINE_COLUMNS = [
  'submitted',
  'reviewed',
  'shortlisted',
  'interview',
  'offered',
  'hired',
  'rejected',
] as const

export async function getPipelineBoard(
  jobId: string,
  companyId: string
): Promise<PipelineBoard | null> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      companyId: true,
    },
  })

  if (!job || job.companyId !== companyId) return null

  const apps = await prisma.application.findMany({
    where: { jobId },
    orderBy: { updatedAt: 'desc' },
    include: {
      student: {
        select: {
          id: true,
          headline: true,
          city: true,
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          school: { select: { name: true } },
          _count: {
            select: {
              certificates: { where: { verificationStatus: 'verified' } },
            },
          },
        },
      },
    },
  })

  const now = Date.now()

  const cards: PipelineCard[] = apps.map((a) => {
    const daysSinceApplied = Math.floor(
      (now - a.appliedAt.getTime()) / (24 * 60 * 60 * 1000)
    )

    return {
      applicationId: a.id,
      studentId: a.student.id,
      studentUserId: a.student.user.id,
      fullName: a.student.user.fullName ?? 'Siswa',
      initials: getInitials(a.student.user.fullName),
      avatarUrl: a.student.user.avatarUrl,
      headline: a.student.headline,
      school: a.student.school?.name ?? null,
      city: a.student.city,
      matchScore: a.matchScore,
      isVerified: (a.student._count?.certificates ?? 0) > 0,
      status: a.status,
      appliedAt: a.appliedAt.toISOString(),
      appliedAtRelative: relativeTime(a.appliedAt),
      daysSinceApplied,
      nextStep: a.nextStep,
    }
  })

  // Group by status
  const columns: Record<string, PipelineCard[]> = {}
  for (const col of PIPELINE_COLUMNS) {
    columns[col] = []
  }
  for (const card of cards) {
    if (columns[card.status]) {
      columns[card.status].push(card)
    }
  }

  return {
    job: {
      id: job.id,
      title: job.title,
      slug: job.slug,
      status: job.status,
    },
    columns,
    totalCount: cards.length,
  }
}