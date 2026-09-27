import { prisma } from '@/lib/prisma'
import { buildPaginationMeta, DEFAULT_PAGE_SIZE } from '@/lib/pagination'

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats() {
  const [
    totalUsers,
    totalStudents,
    totalCompanies,
    totalSchools,
    totalCertInstitutions,
    totalJobs,
    totalApplications,
    pendingVerifications,
    reportedContent,
    pendingCertificates,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { role: 'student', deletedAt: null } }),
    prisma.user.count({ where: { role: 'company', deletedAt: null } }),
    prisma.user.count({ where: { role: 'school', deletedAt: null } }),
    prisma.user.count({
      where: { role: 'certification', deletedAt: null },
    }),
    prisma.job.count({ where: { deletedAt: null } }),
    prisma.application.count(),
    prisma.companyVerification.count({ where: { status: 'pending' } }),
    prisma.contentReport.count({ where: { status: 'pending' } }),
    prisma.verificationRequest.count({ where: { status: 'pending' } }),
  ])

  return {
    totalUsers,
    totalStudents,
    totalCompanies,
    totalSchools,
    totalCertInstitutions,
    totalJobs,
    totalApplications,
    pendingVerifications,
    reportedContent,
    pendingCertificates,
  }
}

// ============================================
// RECENT ACTIVITY
// ============================================

export async function getRecentUsers(limit = 5) {
  return prisma.user.findMany({
    where: { deletedAt: null },
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
      avatarUrl: true,
    },
  })
}

export async function getRecentJobs(limit = 5) {
  return prisma.job.findMany({
    where: { deletedAt: null },
    take: limit,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      createdAt: true,
      company: {
        select: { name: true },
      },
    },
  })
}

// ============================================
// PENDING ACTIONS
// ============================================

export async function getPendingCompanyVerifications(limit = 5) {
  return prisma.companyVerification.findMany({
    where: { status: 'pending' },
    take: limit,
    orderBy: { submittedAt: 'desc' },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          industry: true,
        },
      },
    },
  })
}

export async function getReportedContent(limit = 5) {
  return prisma.contentReport.findMany({
    where: { status: 'pending' },
    take: limit,
    orderBy: { createdAt: 'desc' },
  })
}

// ============================================
// CHART DATA
// ============================================

export async function getUserGrowthData(days = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const users = await prisma.user.findMany({
    where: {
      createdAt: { gte: since },
      deletedAt: null,
    },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  // Group by date
  const grouped: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    grouped[key] = 0
  }

  users.forEach((u) => {
    const key = u.createdAt.toISOString().slice(0, 10)
    if (grouped[key] !== undefined) {
      grouped[key]++
    }
  })

  // Cumulative
  let cumulative = 0
  return Object.entries(grouped).map(([date, count]) => {
    cumulative += count
    return {
      date: new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      }),
      new: count,
      total: cumulative,
    }
  })
}

export async function getRoleDistribution() {
  const [students, companies, schools, certifications, admins] =
    await Promise.all([
      prisma.user.count({ where: { role: 'student', deletedAt: null } }),
      prisma.user.count({ where: { role: 'company', deletedAt: null } }),
      prisma.user.count({ where: { role: 'school', deletedAt: null } }),
      prisma.user.count({
        where: { role: 'certification', deletedAt: null },
      }),
      prisma.user.count({ where: { role: 'admin', deletedAt: null } }),
    ])

  return [
    { name: 'Student', value: students, color: '#3b82f6' },
    { name: 'Company', value: companies, color: '#10b981' },
    { name: 'School', value: schools, color: '#f59e0b' },
    { name: 'Certification', value: certifications, color: '#ec4899' },
    { name: 'Admin', value: admins, color: '#8b5cf6' },
  ].filter((item) => item.value > 0)
}

export async function getActivityData() {
  const [jobs, applications, verifications, certificates] = await Promise.all([
    prisma.job.count({ where: { deletedAt: null } }),
    prisma.application.count(),
    prisma.companyVerification.count({
      where: { status: 'approved' },
    }),
    prisma.certificate.count({
      where: { verificationStatus: 'verified' },
    }),
  ])

  return [
    { label: 'Jobs', value: jobs, color: '#ef4444' },
    { label: 'Applications', value: applications, color: '#f97316' },
    { label: 'Verifications', value: verifications, color: '#10b981' },
    { label: 'Certificates', value: certificates, color: '#8b5cf6' },
  ]
}

// ============================================
// USER MANAGEMENT
// ============================================

export type UserFilter = {
  role?: string
  search?: string
  page?: number
  pageSize?: number
}

export async function getUsers(filter: UserFilter = {}) {
  const page = filter.page || 1
  const pageSize = filter.pageSize || DEFAULT_PAGE_SIZE

  const where: any = { deletedAt: null }

  if (filter.role && filter.role !== 'all') {
    where.role = filter.role
  }

  if (filter.search) {
    where.OR = [
      { fullName: { contains: filter.search, mode: 'insensitive' } },
      { email: { contains: filter.search, mode: 'insensitive' } },
    ]
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        avatarUrl: true,
      },
    }),
    prisma.user.count({ where }),
  ])

  return {
    users,
    pagination: buildPaginationMeta(totalCount, page, pageSize),
  }
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      studentProfile: {
        include: {
          skills: { include: { skill: true } },
          educations: true,
          experiences: true,
        },
      },
      company: true,
      school: true,
      certInstitution: true,
    },
  })
}

export async function getUserStats() {
  const [total, active, suspended, byRole] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { deletedAt: null, isActive: true } }),
    prisma.user.count({ where: { deletedAt: null, isActive: false } }),
    prisma.user.groupBy({
      by: ['role'],
      where: { deletedAt: null },
      _count: true,
    }),
  ])

  return {
    total,
    active,
    suspended,
    byRole: byRole.reduce((acc, item) => {
      acc[item.role] = item._count
      return acc
    }, {} as Record<string, number>),
  }
}

// ============================================
// COMPANY VERIFICATIONS
// ============================================

export type VerificationFilter = {
  status?: 'pending' | 'approved' | 'rejected' | 'all'
  search?: string
  page?: number
  pageSize?: number
}

export async function getVerifications(filter: VerificationFilter = {}) {
  const page = filter.page || 1
  const pageSize = filter.pageSize || DEFAULT_PAGE_SIZE

  const where: any = {}

  if (filter.status && filter.status !== 'all') {
    where.status = filter.status
  }

  if (filter.search) {
    where.company = {
      name: { contains: filter.search, mode: 'insensitive' },
    }
  }

  const [verifications, totalCount] = await Promise.all([
    prisma.companyVerification.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true,
            city: true,
            province: true,
            logoUrl: true,
            verificationStatus: true,
          },
        },
      },
    }),
    prisma.companyVerification.count({ where }),
  ])

  return {
    verifications,
    pagination: buildPaginationMeta(totalCount, page, pageSize),
  }
}

export async function getVerificationById(id: string) {
  return prisma.companyVerification.findUnique({
    where: { id },
    include: {
      company: {
        include: {
          owner: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
            },
          },
          _count: {
            select: {
              jobs: true,
            },
          },
        },
      },
    },
  })
}

export async function getVerificationStats() {
  const [pending, approved, rejected, total] = await Promise.all([
    prisma.companyVerification.count({ where: { status: 'pending' } }),
    prisma.companyVerification.count({ where: { status: 'approved' } }),
    prisma.companyVerification.count({ where: { status: 'rejected' } }),
    prisma.companyVerification.count(),
  ])

  return { pending, approved, rejected, total }
}

// ============================================
// CONTENT REPORTS / MODERATION
// ============================================

export type ReportFilter = {
  status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed' | 'all'
  contentType?: string
  search?: string
  page?: number
  pageSize?: number
}

export async function getContentReports(filter: ReportFilter = {}) {
  const page = filter.page || 1
  const pageSize = filter.pageSize || DEFAULT_PAGE_SIZE

  const where: any = {}

  if (filter.status && filter.status !== 'all') {
    where.status = filter.status
  }

  if (filter.contentType && filter.contentType !== 'all') {
    where.contentType = filter.contentType
  }

  const [reports, totalCount] = await Promise.all([
    prisma.contentReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        reporter: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    }),
    prisma.contentReport.count({ where }),
  ])

  return {
    reports,
    pagination: buildPaginationMeta(totalCount, page, pageSize),
  }
}

export async function getContentReportById(id: string) {
  const report = await prisma.contentReport.findUnique({
    where: { id },
    include: {
      reporter: {
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
        },
      },
    },
  })

  if (!report) return null

  // Ambil konten yang dilaporkan berdasarkan type
  let reportedContent: any = null

  try {
    switch (report.contentType) {
      case 'showcase_video':
        reportedContent = await prisma.showcaseVideo.findUnique({
          where: { id: report.contentId },
          include: {
            student: {
              include: {
                user: { select: { fullName: true, email: true } },
              },
            },
          },
        })
        break

      case 'portfolio':
        reportedContent = await prisma.studentPortfolio.findUnique({
          where: { id: report.contentId },
          include: {
            student: {
              include: {
                user: { select: { fullName: true, email: true } },
              },
            },
          },
        })
        break

      case 'profile':
        reportedContent = await prisma.studentProfile.findUnique({
          where: { id: report.contentId },
          include: {
            user: { select: { fullName: true, email: true } },
          },
        })
        break

      case 'company':
        reportedContent = await prisma.company.findUnique({
          where: { id: report.contentId },
        })
        break

      case 'job':
        reportedContent = await prisma.job.findUnique({
          where: { id: report.contentId },
          include: {
            company: { select: { name: true, slug: true } },
          },
        })
        break
    }
  } catch (err) {
    console.error('Error fetching reported content:', err)
  }

  return {
    ...report,
    reportedContent,
  }
}

export async function getModerationStats() {
  const [pending, reviewed, resolved, dismissed, total, byType] =
    await Promise.all([
      prisma.contentReport.count({ where: { status: 'pending' } }),
      prisma.contentReport.count({ where: { status: 'reviewed' } }),
      prisma.contentReport.count({ where: { status: 'resolved' } }),
      prisma.contentReport.count({ where: { status: 'dismissed' } }),
      prisma.contentReport.count(),
      prisma.contentReport.groupBy({
        by: ['contentType'],
        _count: true,
      }),
    ])

  return {
    pending,
    reviewed,
    resolved,
    dismissed,
    total,
    byType: byType.reduce((acc, item) => {
      acc[item.contentType] = item._count
      return acc
    }, {} as Record<string, number>),
  }
}

// ============================================
// PLATFORM MONITORING
// ============================================

export async function getMonitoringOverview() {
  const [
    totalUsers,
    totalStudents,
    totalCompanies,
    totalSchools,
    totalCertInstitutions,
    totalJobs,
    activeJobs,
    totalApplications,
    hiredApplications,
    totalCertificates,
    verifiedCertificates,
    totalPlacements,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({ where: { role: 'student', deletedAt: null } }),
    prisma.user.count({ where: { role: 'company', deletedAt: null } }),
    prisma.user.count({ where: { role: 'school', deletedAt: null } }),
    prisma.user.count({ where: { role: 'certification', deletedAt: null } }),
    prisma.job.count({ where: { deletedAt: null } }),
    prisma.job.count({ where: { status: 'active', deletedAt: null } }),
    prisma.application.count(),
    prisma.application.count({ where: { status: 'hired' } }),
    prisma.certificate.count(),
    prisma.certificate.count({ where: { verificationStatus: 'verified' } }),
    prisma.careerMonitoring.count({ where: { stage: 'placed' } }),
  ])

  // Hitung pertumbuhan 30 hari terakhir
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  const [usersLast30, usersLast60to30] = await Promise.all([
    prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo }, deletedAt: null },
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        deletedAt: null,
      },
    }),
  ])

  const userGrowthPercent =
    usersLast60to30 > 0
      ? Math.round(((usersLast30 - usersLast60to30) / usersLast60to30) * 100)
      : usersLast30 > 0
      ? 100
      : 0

  return {
    totalUsers,
    totalStudents,
    totalCompanies,
    totalSchools,
    totalCertInstitutions,
    totalJobs,
    activeJobs,
    totalApplications,
    hiredApplications,
    totalCertificates,
    verifiedCertificates,
    totalPlacements,
    userGrowthPercent,
    usersLast30,
  }
}

export async function getGrowthTrend(days = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const [users, jobs, applications] = await Promise.all([
    prisma.user.findMany({
      where: { createdAt: { gte: since }, deletedAt: null },
      select: { createdAt: true },
    }),
    prisma.job.findMany({
      where: { createdAt: { gte: since }, deletedAt: null },
      select: { createdAt: true },
    }),
    prisma.application.findMany({
      where: { appliedAt: { gte: since } },
      select: { appliedAt: true },
    }),
  ])

  // Group by date
  const grouped: Record<string, { users: number; jobs: number; apps: number }> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    grouped[key] = { users: 0, jobs: 0, apps: 0 }
  }

  users.forEach((u) => {
    const key = u.createdAt.toISOString().slice(0, 10)
    if (grouped[key]) grouped[key].users++
  })

  jobs.forEach((j) => {
    const key = j.createdAt.toISOString().slice(0, 10)
    if (grouped[key]) grouped[key].jobs++
  })

  applications.forEach((a) => {
    const key = a.appliedAt.toISOString().slice(0, 10)
    if (grouped[key]) grouped[key].apps++
  })

  return Object.entries(grouped).map(([date, counts]) => ({
    date: new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    }),
    users: counts.users,
    jobs: counts.jobs,
    applications: counts.apps,
  }))
}

export async function getTopCompanies(limit = 5) {
  const companies = await prisma.company.findMany({
    where: { deletedAt: null },
    take: limit,
    orderBy: {
      jobs: { _count: 'desc' },
    },
    include: {
      _count: {
        select: {
          jobs: true,
        },
      },
    },
  })

  // Hitung total applications untuk tiap company
  const companiesWithApps = await Promise.all(
    companies.map(async (c) => {
      const appsCount = await prisma.application.count({
        where: {
          job: { companyId: c.id },
        },
      })
      return {
        ...c,
        applicationsCount: appsCount,
      }
    })
  )

  return companiesWithApps
}

export async function getTopSchools(limit = 5) {
  const schools = await prisma.school.findMany({
    take: limit,
    orderBy: {
      students: { _count: 'desc' },
    },
    include: {
      _count: {
        select: {
          students: true,
        },
      },
    },
  })

  return schools
}

export async function getRecentActivity(limit = 10) {
  const activities = await prisma.auditLog.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      actor: {
        select: {
          fullName: true,
          email: true,
          role: true,
        },
      },
    },
  })

  return activities
}

export async function getPlatformHealth() {
  const [
    pendingVerifications,
    pendingReports,
    pendingCertificates,
    inactiveUsers,
    draftJobs,
  ] = await Promise.all([
    prisma.companyVerification.count({ where: { status: 'pending' } }),
    prisma.contentReport.count({ where: { status: 'pending' } }),
    prisma.verificationRequest.count({ where: { status: 'pending' } }),
    prisma.user.count({ where: { isActive: false, deletedAt: null } }),
    prisma.job.count({ where: { status: 'draft', deletedAt: null } }),
  ])

  return {
    pendingVerifications,
    pendingReports,
    pendingCertificates,
    inactiveUsers,
    draftJobs,
  }
}

// ============================================
// SYSTEM SETTINGS
// ============================================

export async function getSystemSettings() {
  const settings = await prisma.systemSetting.findMany({
    orderBy: { key: 'asc' },
  })

  // Fetch updatedBy users manually
  const userIds = settings
    .map((s) => s.updatedBy)
    .filter((id): id is string => !!id)

  const users =
    userIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, fullName: true, email: true },
        })
      : []

  const userMap = new Map(users.map((u) => [u.id, u]))

  return settings.map((s) => ({
    ...s,
    updatedByUser: s.updatedBy ? userMap.get(s.updatedBy) || null : null,
  }))
}

export async function getSettingsStats() {
  const settings = await prisma.systemSetting.findMany({
    select: { key: true, updatedAt: true, updatedBy: true },
  })

  // Group by prefix (platform, verification, moderation, dll)
  const grouped = settings.reduce((acc, s) => {
    const prefix = s.key.split('.')[0]
    acc[prefix] = (acc[prefix] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Recently updated — count settings yang pernah diubah admin
  const recentlyUpdated = settings.filter((s) => s.updatedBy).length

  return {
    total: settings.length,
    grouped,
    recentlyUpdated,
  }
}

import {
  LayoutDashboard,
  Users,
  BadgeCheck,
  Flag,
  BarChart3,
  Settings,
  Database,        // ← tambah
} from 'lucide-react'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/verifications', label: 'Verifikasi', icon: BadgeCheck },
  { href: '/admin/moderation', label: 'Moderation', icon: Flag },
  { href: '/admin/monitoring', label: 'Monitoring', icon: BarChart3 },
  { href: '/admin/master-data', label: 'Master Data', icon: Database },  // ← BARU
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

// ============================================
// MASTER DATA
// ============================================

export async function getSkills(filter: { search?: string } = {}) {
  const where: any = {}
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: 'insensitive' } },
      { category: { contains: filter.search, mode: 'insensitive' } },
    ]
  }

  const [skills, totalCount] = await Promise.all([
    prisma.skill.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { students: true, jobSkills: true },
        },
      },
    }),
    prisma.skill.count({ where }),
  ])

  return { skills, totalCount }
}

export async function getIndustries() {
  return prisma.industry.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getProvinces() {
  return prisma.province.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { cities: true } },
    },
  })
}

export async function getSchoolPrograms() {
  const setting = await prisma.systemSetting.findUnique({
    where: { key: 'master.school_programs' },
  })

  return (setting?.value as any)?.programs || []
}

export async function getMasterDataStats() {
  const [skillsCount, industriesCount, provincesCount] = await Promise.all([
    prisma.skill.count(),
    prisma.industry.count(),
    prisma.province.count(),
  ])

  const schoolPrograms = await getSchoolPrograms()

  return {
    skills: skillsCount,
    industries: industriesCount,
    provinces: provincesCount,
    schoolPrograms: schoolPrograms.length,
  }
}