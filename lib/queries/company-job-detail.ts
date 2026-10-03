// lib/queries/company-job-detail.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type JobDetail = {
  id: string
  title: string
  slug: string
  description: string | null
  requirements: string | null
  responsibilities: string | null
  benefits: string | null
  employmentType: string
  workMode: string
  experienceLevel: string | null
  location: string | null
  city: string | null
  province: string | null
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  isSalaryVisible: boolean
  quota: number
  status: string
  publishedAt: string | null
  expiredAt: string | null
  createdAt: string
  updatedAt: string
  viewCount: number

  daysLeft: number | null
  isExpired: boolean

  skills: Array<{
    id: string
    name: string
    category: string | null
    isRequired: boolean
  }>

  stats: {
    totalApplicants: number
    new: number
    reviewed: number
    shortlisted: number
    interview: number
    offered: number
    hired: number
    rejected: number
  }

  activity: Array<{
    id: string
    type: string
    label: string
    description: string
    timestamp: string
  }>
}

export type JobApplicant = {
  applicationId: string
  studentId: string
  name: string
  initials: string
  avatarUrl: string | null
  headline: string | null
  school: string | null
  city: string | null
  matchScore: number | null
  matchScoreBreakdown: any | null   // ← TAMBAH
  isVerified: boolean
  certificateCount: number
  status: string
  appliedAt: string
  appliedAtRelative: string
  coverLetter: string | null
  resumeUrl: string | null
  skills: string[]
  interviewDate: string | null
  nextStep: string | null
  recruiterName: string | null
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
  if (mins < 60) return `${mins} menit yang lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam yang lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari yang lalu`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} minggu yang lalu`
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ============================================
// GET JOB DETAIL
// ============================================

export async function getJobDetail(
  jobId: string,
  companyId: string
): Promise<JobDetail | null> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      skills: {
        include: {
          skill: {
            select: { id: true, name: true, category: true },
          },
        },
      },
      applications: {
        select: {
          id: true,
          status: true,
          appliedAt: true,
          updatedAt: true,
          matchScore: true,
          student: {
            select: {
              id: true,
              user: { select: { fullName: true } },
            },
          },
        },
      },
    },
  })

  if (!job || job.companyId !== companyId) return null

  // Stats per status
  const stats = {
    totalApplicants: job.applications.length,
    new: 0,
    reviewed: 0,
    shortlisted: 0,
    interview: 0,
    offered: 0,
    hired: 0,
    rejected: 0,
  }

  for (const app of job.applications) {
    const s = app.status
    if (s === 'submitted') stats.new++
    else if (s === 'reviewed') stats.reviewed++
    else if (s === 'shortlisted') stats.shortlisted++
    else if (s === 'interview') stats.interview++
    else if (s === 'offered') stats.offered++
    else if (s === 'hired') stats.hired++
    else if (s === 'rejected') stats.rejected++
  }

  // Activity (build from job data + applications)
  const activity: JobDetail['activity'] = []

  activity.push({
    id: 'created',
    type: 'created',
    label: 'Lowongan dibuat',
    description: 'Lowongan pertama kali dibuat sebagai draft',
    timestamp: job.createdAt.toISOString(),
  })

  if (job.publishedAt) {
    activity.push({
      id: 'published',
      type: 'published',
      label: 'Lowongan dipublish',
      description: 'Lowongan mulai tayang dan bisa dilamar',
      timestamp: job.publishedAt.toISOString(),
    })
  }

  // Add application milestones
  const sortedApps = [...job.applications].sort(
    (a, b) => b.appliedAt.getTime() - a.appliedAt.getTime()
  )
  for (const app of sortedApps.slice(0, 10)) {
    activity.push({
      id: `app-${app.id}`,
      type: 'application',
      label: `Lamaran baru dari ${app.student.user.fullName ?? 'Kandidat'}`,
      description: `Status: ${app.status}`,
      timestamp: app.appliedAt.toISOString(),
    })
  }

  // Sort by timestamp desc
  activity.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const now = Date.now()
  const daysLeft = job.expiredAt
    ? Math.ceil((job.expiredAt.getTime() - now) / (24 * 60 * 60 * 1000))
    : null
  const isExpired = job.expiredAt ? job.expiredAt.getTime() < now : false

  return {
    id: job.id,
    title: job.title,
    slug: job.slug,
    description: job.description,
    requirements: job.requirements,
    responsibilities: job.responsibilities,
    benefits: job.benefits,
    employmentType: job.employmentType,
    workMode: job.workMode,
    experienceLevel: job.experienceLevel,
    location: job.location,
    city: job.city,
    province: job.province,
    salaryMin: job.salaryMin ? Number(job.salaryMin) : null,
    salaryMax: job.salaryMax ? Number(job.salaryMax) : null,
    salaryCurrency: job.salaryCurrency,
    isSalaryVisible: job.isSalaryVisible,
    quota: job.quota,
    status: job.status,
    publishedAt: job.publishedAt?.toISOString() ?? null,
    expiredAt: job.expiredAt?.toISOString() ?? null,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    viewCount: Number(job.viewCount),
    daysLeft,
    isExpired,
    skills: job.skills.map((js) => ({
      id: js.skill.id,
      name: js.skill.name,
      category: js.skill.category,
      isRequired: js.isRequired,
    })),
    stats,
    activity: activity.slice(0, 20),
  }
}

// ============================================
// GET JOB APPLICANTS
// ============================================

export async function getJobApplicants(
  jobId: string,
  companyId: string
): Promise<JobApplicant[]> {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, companyId: true },
  })

  if (!job || job.companyId !== companyId) return []

  const apps = await prisma.application.findMany({
    where: { jobId },
    orderBy: { appliedAt: 'desc' },
    include: {
      student: {
        select: {
          id: true,
          headline: true,
          city: true,
          user: {
            select: { fullName: true, avatarUrl: true },
          },
          school: { select: { name: true } },
          skills: {
            take: 5,
            include: { skill: { select: { name: true } } },
          },
          _count: {
            select: {
              certificates: { where: { verificationStatus: 'verified' } },
            },
          },
        },
      },
    },
  })

  return apps.map((a) => ({
    applicationId: a.id,
    studentId: a.student.id,
    name: a.student.user.fullName ?? 'Siswa',
    initials: getInitials(a.student.user.fullName),
    avatarUrl: a.student.user.avatarUrl,
    headline: a.student.headline,
    school: a.student.school?.name ?? null,
    city: a.student.city,
    matchScore: a.matchScore,
    matchScoreBreakdown:
      (a as typeof a & { matchScoreBreakdown?: JobApplicant['matchScoreBreakdown'] })
        .matchScoreBreakdown ?? null,
    isVerified: (a.student._count?.certificates ?? 0) > 0,
    certificateCount: a.student._count?.certificates ?? 0,
    status: a.status,
    appliedAt: a.appliedAt.toISOString(),
    appliedAtRelative: relativeTime(a.appliedAt),
    coverLetter: a.coverLetter,
    resumeUrl: a.resumeUrl,
    skills: a.student.skills.map((s) => s.skill.name),
    interviewDate: a.interviewDate?.toISOString() ?? null,
    nextStep: a.nextStep,
    recruiterName: a.recruiterName,
  }))
}