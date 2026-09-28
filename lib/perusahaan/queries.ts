// lib/perusahaan/queries.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type PublicCompany = {
  id: string
  name: string
  slug: string
  industry: string | null
  companySize: string | null
  foundedYear: number | null
  logoUrl: string | null
  city: string | null
  province: string | null
  description: string | null
  website: string | null
  verificationStatus: string
  verifiedAt: string | null
  createdAt: string
  jobsCount: number
  openJobsCount: number
}

export type CompanyFilters = {
  search?: string
  industry?: string
  verified?: boolean
  page?: number
  pageSize?: number
}

// ============================================
// HELPERS
// ============================================

function mapCompany(c: any): PublicCompany {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    industry: c.industry,
    companySize: c.companySize,
    foundedYear: c.foundedYear,
    logoUrl: c.logoUrl,
    city: c.city,
    province: c.province,
    description: c.description,
    website: c.website,
    verificationStatus: c.verificationStatus,
    verifiedAt: c.verifiedAt?.toISOString() || null,
    createdAt: c.createdAt.toISOString(),
    jobsCount: c._count?.jobs || 0,
    openJobsCount: c._count?.openJobs || 0,
  }
}

// ============================================
// MAIN QUERY
// ============================================

export async function getPublicCompanies(filters: CompanyFilters = {}) {
  const {
    search,
    industry,
    verified,
    page = 1,
    pageSize = 9,
  } = filters

  const where: any = {
    deletedAt: null,
  }

  if (verified) {
    where.verificationStatus = 'verified'
  }

  if (industry && industry !== 'all') {
    where.industry = industry
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { industry: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy: [
        { verificationStatus: 'asc' }, // 'verified' > 'pending' > 'unverified' (alphabetical asc: pending, unverified, verified... hmm)
        { createdAt: 'desc' },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: {
          select: {
            jobs: true,
          },
        },
      },
    }),
    prisma.company.count({ where }),
  ])

  // Count open jobs per company (separate query)
  const companyIds = companies.map((c) => c.id)
  const openJobsData = await prisma.job.groupBy({
    by: ['companyId'],
    where: {
      companyId: { in: companyIds },
      status: 'active',
      deletedAt: null,
    },
    _count: true,
  })
  const openJobsMap = new Map(
    openJobsData.map((j) => [j.companyId, j._count])
  )

  const mapped = companies.map((c) =>
    mapCompany({
      ...c,
      _count: {
        jobs: c._count.jobs,
        openJobs: openJobsMap.get(c.id) || 0,
      },
    })
  )

  // Sort: verified dulu, lalu berdasarkan jumlah jobs
  mapped.sort((a, b) => {
    if (a.verificationStatus === 'verified' && b.verificationStatus !== 'verified') return -1
    if (a.verificationStatus !== 'verified' && b.verificationStatus === 'verified') return 1
    return b.openJobsCount - a.openJobsCount
  })

  return {
    companies: mapped,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
      totalItems: total,
      pageSize,
    },
  }
}

// ============================================
// STATS
// ============================================

export async function getPublicCompanyStats() {
  const [totalCompanies, verifiedCompanies, totalJobs] = await Promise.all([
    prisma.company.count({ where: { deletedAt: null } }),
    prisma.company.count({
      where: { deletedAt: null, verificationStatus: 'verified' },
    }),
    prisma.job.count({
      where: { status: 'active', deletedAt: null },
    }),
  ])

  return { totalCompanies, verifiedCompanies, totalJobs }
}

// ============================================
// INDUSTRIES (untuk filter)
// ============================================

export async function getPublicCompanyIndustries(): Promise<string[]> {
  const rows = await prisma.company.findMany({
    where: { deletedAt: null, industry: { not: null } },
    select: { industry: true },
    distinct: ['industry'],
    orderBy: { industry: 'asc' },
  })
  return rows.map((r) => r.industry).filter((i): i is string => !!i)
}

// ============================================
// DETAIL BY SLUG
// ============================================

export async function getPublicCompanyBySlug(slug: string) {
  const company = await prisma.company.findFirst({
    where: { slug, deletedAt: null },
    include: {
      _count: {
        select: { jobs: true },
      },
      jobs: {
        where: { status: 'active', deletedAt: null },
        orderBy: { publishedAt: 'desc' },
        take: 6,
        include: {
          skills: {
            include: { skill: { select: { name: true } } },
            take: 3,
          },
        },
      },
    },
  })

  if (!company) return null

  return {
    ...mapCompany({
      ...company,
      _count: {
        jobs: company._count.jobs,
        openJobs: company.jobs.length,
      },
    }),
    address: company.address,
    email: company.email,
    phone: company.phone,
    jobs: company.jobs.map((j) => ({
      id: j.id,
      title: j.title,
      slug: j.slug,
      employmentType: j.employmentType,
      workMode: j.workMode,
      city: j.city,
      salaryMin: j.salaryMin ? Number(j.salaryMin) : null,
      salaryMax: j.salaryMax ? Number(j.salaryMax) : null,
      isSalaryVisible: j.isSalaryVisible,
      publishedAt: j.publishedAt?.toISOString() || null,
      skills: j.skills.map((s) => s.skill.name),
    })),
  }
}