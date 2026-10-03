// lib/queries/company-dashboard.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// TYPES
// ============================================

export type CompanyContext = {
  companyId: string
  companyName: string
  companySlug: string
  companyLogo: string | null
  ownerUserId: string
  ownerName: string
  ownerAvatar: string | null
  verificationStatus: string
  isOwner: boolean
}

export type DashboardStats = {
  activeJobs: number
  activeJobsTrend: number
  totalApplicants: number
  totalApplicantsTrend: number
  talentPool: number
  newApplicantsToday: number
  newApplicantsTodayTrend: number
}

export type TrendPoint = {
  label: string
  jobId: string
  total: number
}

export type ActiveJobDTO = {
  id: string
  title: string
  slug: string
  location: string
  city: string | null
  employmentType: string
  workMode: string
  status: string
  applicantCount: number
  deadline: string | null
  daysLeft: number | null
}

export type RecentApplicantDTO = {
  id: string
  applicationId: string
  name: string
  initials: string
  avatarUrl: string | null
  headline: string | null
  school: string | null
  city: string | null
  jobId: string
  jobTitle: string
  matchScore: number | null
  isVerified: boolean
  certificateCount: number
  appliedAt: string
  appliedAtRelative: string
  status: string
}

export type SmartMatchDTO = {
  studentId: string
  name: string
  initials: string
  avatarUrl: string | null
  headline: string | null
  school: string | null
  matchScore: number
  topSkills: string[]
  certificateCount: number
  isVerified: boolean
}

export type VerificationSummary = {
  status: string
  overallScore: number
  bnspPercent: number
  schoolVerifiedPercent: number
  totalApplicantsReviewed: number
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
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function trendPercent(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 1000) / 10
}

// ============================================
// GET COMPANY CONTEXT
// ============================================

export async function getCompanyContext(): Promise<CompanyContext | null> {
  const session = await getServerSession()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      role: true,
    },
  })

  if (!user || user.role !== 'company') return null

  const company = await prisma.company.findFirst({
    where: {
      OR: [
        { ownerUserId: user.id },
        { members: { some: { userId: user.id } } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      ownerUserId: true,
      verificationStatus: true,
    },
  })

  if (!company) return null

  return {
    companyId: company.id,
    companyName: company.name,
    companySlug: company.slug,
    companyLogo: company.logoUrl,
    ownerUserId: company.ownerUserId ?? user.id,
    ownerName: user.fullName ?? 'Recruiter',
    ownerAvatar: user.avatarUrl,
    verificationStatus: company.verificationStatus,
    isOwner: company.ownerUserId === user.id,
  }
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats(companyId: string): Promise<DashboardStats> {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000)

  const [
    activeJobs,
    totalApplicants,
    talentPool,
    newApplicantsToday,
    newApplicantsYesterday,
    totalApplicantsPrev,
  ] = await Promise.all([
    prisma.job.count({
      where: { companyId, status: 'active', deletedAt: null },
    }),
    prisma.application.count({
      where: { job: { companyId, deletedAt: null } },
    }),
    prisma.application
      .findMany({
        where: { job: { companyId, deletedAt: null } },
        select: { studentId: true },
        distinct: ['studentId'],
      })
      .then((r) => r.length),
    prisma.application.count({
      where: {
        job: { companyId, deletedAt: null },
        appliedAt: { gte: startOfToday },
      },
    }),
    prisma.application.count({
      where: {
        job: { companyId, deletedAt: null },
        appliedAt: { gte: startOfYesterday, lt: startOfToday },
      },
    }),
    prisma.application.count({
      where: {
        job: { companyId, deletedAt: null },
        appliedAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    }),
  ])

  return {
    activeJobs,
    activeJobsTrend: 0,
    totalApplicants,
    totalApplicantsTrend: trendPercent(totalApplicants, totalApplicantsPrev),
    talentPool,
    newApplicantsToday,
    newApplicantsTodayTrend: trendPercent(newApplicantsToday, newApplicantsYesterday),
  }
}

// ============================================
// RECRUITMENT TREND
// ============================================

export async function getRecruitmentTrend(
  companyId: string,
  days = 30
): Promise<TrendPoint[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const jobs = await prisma.job.findMany({
    where: {
      companyId,
      deletedAt: null,
      OR: [
        { status: 'active' },
        { publishedAt: { gte: since } },
      ],
    },
    select: {
      id: true,
      title: true,
      _count: {
        select: {
          applications: {
            where: { appliedAt: { gte: since } },
          },
        },
      },
    },
    orderBy: {
      applications: { _count: 'desc' },
    },
    take: 6,
  })

  return jobs.map((j) => ({
    label: j.title,
    jobId: j.id,
    total: j._count.applications,
  }))
}

// ============================================
// ACTIVE JOBS
// ============================================

export async function getActiveJobs(
  companyId: string,
  limit = 5
): Promise<ActiveJobDTO[]> {
  const jobs = await prisma.job.findMany({
    where: {
      companyId,
      deletedAt: null,
      status: 'active',
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      _count: { select: { applications: true } },
    },
  })

  const now = Date.now()

  return jobs.map((j) => {
    const daysLeft = j.expiredAt
      ? Math.ceil((j.expiredAt.getTime() - now) / (24 * 60 * 60 * 1000))
      : null

    return {
      id: j.id,
      title: j.title,
      slug: j.slug,
      location: j.location ?? 'Indonesia',
      city: j.city,
      employmentType: j.employmentType,
      workMode: j.workMode,
      status: j.status,
      applicantCount: j._count.applications,
      deadline: j.expiredAt ? j.expiredAt.toISOString() : null,
      daysLeft,
    }
  })
}

// ============================================
// RECENT APPLICANTS
// ============================================

export async function getRecentApplicants(
  companyId: string,
  limit = 4
): Promise<RecentApplicantDTO[]> {
  const apps = await prisma.application.findMany({
    where: { job: { companyId, deletedAt: null } },
    orderBy: { appliedAt: 'desc' },
    take: limit,
    include: {
      student: {
        select: {
          id: true,
          headline: true,
          city: true,
          user: {
            select: {
              fullName: true,
              avatarUrl: true,
            },
          },
          school: {
            select: { name: true },
          },
          _count: {
            select: { certificates: { where: { verificationStatus: 'verified' } } },
          },
        },
      },
      job: {
        select: { id: true, title: true },
      },
    },
  })

  return apps.map((a) => ({
    id: a.student.id,
    applicationId: a.id,
    name: a.student.user.fullName ?? 'Siswa',
    initials: getInitials(a.student.user.fullName),
    avatarUrl: a.student.user.avatarUrl,
    headline: a.student.headline,
    school: a.student.school?.name ?? null,
    city: a.student.city,
    jobId: a.job.id,
    jobTitle: a.job.title,
    matchScore: a.matchScore,
    isVerified: (a.student._count?.certificates ?? 0) > 0,
    certificateCount: a.student._count?.certificates ?? 0,
    appliedAt: a.appliedAt.toISOString(),
    appliedAtRelative: relativeTime(a.appliedAt),
    status: a.status,
  }))
}

// ============================================
// SMART TALENT MATCH
// ============================================

export async function getSmartMatchCandidates(
  companyId: string,
  limit = 3
): Promise<SmartMatchDTO[]> {
  const apps = await prisma.application.findMany({
    where: {
      job: { companyId, deletedAt: null },
      matchScore: { not: null },
    },
    orderBy: { matchScore: 'desc' },
    take: limit,
    include: {
      student: {
        select: {
          id: true,
          headline: true,
          user: {
            select: {
              fullName: true,
              avatarUrl: true,
            },
          },
          school: {
            select: { name: true },
          },
          skills: {
            take: 3,
            include: {
              skill: { select: { name: true } },
            },
          },
          _count: {
            select: { certificates: { where: { verificationStatus: 'verified' } } },
          },
        },
      },
    },
  })

  return apps.map((a) => ({
    studentId: a.student.id,
    name: a.student.user.fullName ?? 'Siswa',
    initials: getInitials(a.student.user.fullName),
    avatarUrl: a.student.user.avatarUrl,
    headline: a.student.headline,
    school: a.student.school?.name ?? null,
    matchScore: a.matchScore ?? 0,
    topSkills: a.student.skills.map((s) => s.skill.name),
    certificateCount: a.student._count?.certificates ?? 0,
    isVerified: (a.student._count?.certificates ?? 0) > 0,
  }))
}

// ============================================
// VERIFICATION SUMMARY
// ============================================

export async function getVerificationSummary(
  companyId: string
): Promise<VerificationSummary> {
  const [company, totalApplicants, withCert] = await Promise.all([
    prisma.company.findUnique({
      where: { id: companyId },
      select: { verificationStatus: true },
    }),
    prisma.application.count({
      where: { job: { companyId, deletedAt: null } },
    }),
    prisma.application.count({
      where: {
        job: { companyId, deletedAt: null },
        student: {
          certificates: {
            some: { verificationStatus: 'verified' },
          },
        },
      },
    }),
  ])

  const bnspPercent = totalApplicants
    ? Math.round((withCert / totalApplicants) * 100)
    : 0
  const schoolPercent = bnspPercent
  const overall = Math.round((bnspPercent + schoolPercent) / 2)

  return {
    status: company?.verificationStatus ?? 'unverified',
    overallScore: overall,
    bnspPercent,
    schoolVerifiedPercent: schoolPercent,
    totalApplicantsReviewed: totalApplicants,
  }
}

// ============================================
// COMPANY IDENTITY (untuk topbar + shell)
// ============================================

export type CompanyIdentity = {
  companyId: string
  companyName: string
  companySlug: string | null
  companyLogoUrl: string | null
  verificationStatus: string
  isVerified: boolean

  userId: string
  userName: string
  userEmail: string
  userAvatarUrl: string | null
  userRole: 'owner' | 'admin' | 'member'
}

export async function getCompanyIdentity(): Promise<CompanyIdentity | null> {
  const session = await getServerSession()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      role: true,
      ownedCompany: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          verificationStatus: true,
        },
      },
      companyMembers: {
        select: {
          role: true,
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              verificationStatus: true,
            },
          },
        },
      },
    },
  })

  if (!user || user.role !== 'company') return null

  const company = user.ownedCompany ?? user.companyMembers[0]?.company
  if (!company) return null

  const role: 'owner' | 'admin' | 'member' = user.ownedCompany
    ? 'owner'
    : ((user.companyMembers[0]?.role as 'owner' | 'admin' | 'member') ??
      'member')

  return {
    companyId: company.id,
    companyName: company.name,
    companySlug: company.slug,
    companyLogoUrl: company.logoUrl ?? null,
    verificationStatus: company.verificationStatus,
    isVerified: company.verificationStatus === 'verified',

    userId: user.id,
    userName: user.fullName ?? user.email,
    userEmail: user.email,
    userAvatarUrl: user.avatarUrl ?? null,
    userRole: role,
  }
}