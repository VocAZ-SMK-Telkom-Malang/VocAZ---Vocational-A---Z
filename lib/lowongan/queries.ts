// lib/lowongan/queries.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type PublicJob = {
  id: string
  title: string
  slug: string
  description: string | null
  employmentType: string
  workMode: string
  experienceLevel: string | null
  city: string | null
  province: string | null
  location: string | null
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  isSalaryVisible: boolean
  quota: number
  publishedAt: string | null
  expiredAt: string | null
  createdAt: string
  viewCount: number
  skills: string[]
  company: {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    industry: string | null
    city: string | null
    province: string | null
    verificationStatus: string
  }
}

export type JobFilterOptions = {
  cities: string[]
  industries: string[]
  employmentTypes: string[]
}

export type PublicJobFilters = {
  search?: string
  city?: string
  employmentType?: string
  workMode?: string
  experienceLevel?: string
  page?: number
  pageSize?: number
}

// ============================================
// HELPERS
// ============================================

function mapJob(j: any): PublicJob {
  return {
    id: j.id,
    title: j.title,
    slug: j.slug,
    description: j.description,
    employmentType: j.employmentType,
    workMode: j.workMode,
    experienceLevel: j.experienceLevel,
    city: j.city,
    province: j.province,
    location: j.location,
    salaryMin: j.salaryMin ? Number(j.salaryMin) : null,
    salaryMax: j.salaryMax ? Number(j.salaryMax) : null,
    salaryCurrency: j.salaryCurrency,
    isSalaryVisible: j.isSalaryVisible,
    quota: j.quota,
    publishedAt: j.publishedAt?.toISOString() || null,
    expiredAt: j.expiredAt?.toISOString() || null,
    createdAt: j.createdAt.toISOString(),
    viewCount: Number(j.viewCount),
    skills: j.skills?.map((s: any) => s.skill?.name).filter(Boolean) || [],
    company: {
      id: j.company.id,
      name: j.company.name,
      slug: j.company.slug,
      logoUrl: j.company.logoUrl,
      industry: j.company.industry,
      city: j.company.city,
      province: j.company.province,
      verificationStatus: j.company.verificationStatus,
    },
  }
}

// ============================================
// MAIN QUERY
// ============================================

export async function getPublicJobs(filters: PublicJobFilters = {}) {
  const {
    search,
    city,
    employmentType,
    workMode,
    experienceLevel,
    page = 1,
    pageSize = 9,
  } = filters

  const where: any = {
    status: 'active',
    deletedAt: null,
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { requirements: { contains: search, mode: 'insensitive' } },
      { company: { name: { contains: search, mode: 'insensitive' } } },
    ]
  }

  if (city && city !== 'all') where.city = city
  if (employmentType && employmentType !== 'all')
    where.employmentType = employmentType
  if (workMode && workMode !== 'all') where.workMode = workMode
  if (experienceLevel && experienceLevel !== 'all')
    where.experienceLevel = experienceLevel

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            industry: true,
            city: true,
            province: true,
            verificationStatus: true,
          },
        },
        skills: {
          include: { skill: { select: { name: true } } },
          take: 5,
        },
      },
    }),
    prisma.job.count({ where }),
  ])

  return {
    jobs: jobs.map(mapJob),
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

export async function getPublicJobStats() {
  const [totalJobs, totalCompanies, activeJobs] = await Promise.all([
    prisma.job.count({ where: { status: 'active', deletedAt: null } }),
    prisma.job
      .findMany({
        where: { status: 'active', deletedAt: null },
        select: { companyId: true },
        distinct: ['companyId'],
      })
      .then((r) => r.length),
    prisma.job.count({ where: { status: 'active', deletedAt: null } }),
  ])

  return { totalJobs, totalCompanies, activeJobs }
}

// ============================================
// FILTER OPTIONS
// ============================================

export async function getPublicJobFilterOptions(): Promise<JobFilterOptions> {
  const [cities, industries] = await Promise.all([
    prisma.job.findMany({
      where: { status: 'active', deletedAt: null, city: { not: null } },
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' },
    }),
    prisma.company.findMany({
      where: { deletedAt: null, industry: { not: null } },
      select: { industry: true },
      distinct: ['industry'],
      orderBy: { industry: 'asc' },
    }),
  ])

  return {
    cities: cities.map((c) => c.city).filter((c): c is string => !!c),
    industries: industries
      .map((i) => i.industry)
      .filter((i): i is string => !!i),
    employmentTypes: [
      'internship',
      'part_time',
      'full_time',
      'freelance',
      'volunteer',
      'contract',
    ],
  }
}

// ============================================
// DETAIL BY SLUG
// ============================================

export async function getPublicJobBySlug(slug: string) {
  const job = await prisma.job.findFirst({
    where: { slug, status: 'active', deletedAt: null },
    include: {
      company: true,
      skills: {
        include: { skill: true },
      },
    },
  })

  if (!job) return null

  return {
    ...mapJob(job),
    description: job.description,
    requirements: job.requirements,
    responsibilities: job.responsibilities,
    company: {
      ...mapJob(job).company,
      description: job.company.description,
      website: job.company.website,
      address: job.company.address,
      companySize: job.company.companySize,
      foundedYear: job.company.foundedYear,
    },
  }
}