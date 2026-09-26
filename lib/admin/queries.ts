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