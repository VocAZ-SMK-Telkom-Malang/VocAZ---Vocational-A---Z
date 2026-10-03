// lib/queries/company-jobs.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type JobListItem = {
  id: string
  title: string
  slug: string
  location: string | null
  city: string | null
  province: string | null
  employmentType: string
  workMode: string
  experienceLevel: string | null
  status: string
  publishedAt: string | null
  expiredAt: string | null
  createdAt: string
  quota: number

  // Counts
  totalApplicants: number
  newApplicants: number
  shortlisted: number
  hired: number

  // Meta
  daysLeft: number | null
  isExpired: boolean
}

export type JobStats = {
  activeJobs: number
  totalApplicants: number
  shortlisted: number
  hiringPipeline: number  // = interview + offered + hired
}

export type JobFilter = {
  search?: string
  status?: 'all' | 'active' | 'draft' | 'closed' | 'archived'
  employmentType?: 'all' | string
  workMode?: 'all' | string
  city?: 'all' | string
  sort?: 'newest' | 'oldest' | 'most_applicants' | 'deadline'
  page?: number
  pageSize?: number
}

// ============================================
// GET JOBS LIST
// ============================================

export async function getCompanyJobs(
  companyId: string,
  filter: JobFilter = {}
) {
  const {
    search,
    status = 'all',
    employmentType = 'all',
    workMode = 'all',
    city = 'all',
    sort = 'newest',
    page = 1,
    pageSize = 10,
  } = filter

  const where: any = {
    companyId,
    deletedAt: null,
    ...(status !== 'all' ? { status } : {}),
    ...(employmentType !== 'all' ? { employmentType } : {}),
    ...(workMode !== 'all' ? { workMode } : {}),
    ...(city !== 'all' ? { city } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const orderBy: any =
    sort === 'oldest'
      ? { createdAt: 'asc' }
      : sort === 'most_applicants'
      ? { applications: { _count: 'desc' } }
      : sort === 'deadline'
      ? { expiredAt: 'asc' }
      : { createdAt: 'desc' }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: {
          select: { applications: true },
        },
        applications: {
          where: {
            status: { in: ['shortlisted', 'interview', 'offered', 'hired'] },
          },
          select: { status: true },
        },
      },
    }),
    prisma.job.count({ where }),
  ])

  const now = Date.now()

  const mapped: JobListItem[] = jobs.map((j) => {
    const totalApplicants = j._count.applications
    const shortlisted = j.applications.filter(
      (a) => a.status === 'shortlisted'
    ).length
    const hired = j.applications.filter((a) => a.status === 'hired').length
    // "New" = total - semua yang sudah di-review (shortlist ke atas)
    const inPipeline = j.applications.length
    const newApplicants = Math.max(0, totalApplicants - inPipeline)

    const daysLeft = j.expiredAt
      ? Math.ceil((j.expiredAt.getTime() - now) / (24 * 60 * 60 * 1000))
      : null
    const isExpired = j.expiredAt ? j.expiredAt.getTime() < now : false

    return {
      id: j.id,
      title: j.title,
      slug: j.slug,
      location: j.location,
      city: j.city,
      province: j.province,
      employmentType: j.employmentType,
      workMode: j.workMode,
      experienceLevel: j.experienceLevel,
      status: j.status,
      publishedAt: j.publishedAt?.toISOString() ?? null,
      expiredAt: j.expiredAt?.toISOString() ?? null,
      createdAt: j.createdAt.toISOString(),
      quota: j.quota,
      totalApplicants,
      newApplicants,
      shortlisted,
      hired,
      daysLeft,
      isExpired,
    }
  })

  return {
    jobs: mapped,
    pagination: {
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      totalItems: total,
      pageSize,
    },
  }
}

// ============================================
// GET JOBS STATS (untuk stat strip)
// ============================================

export async function getCompanyJobsStats(
  companyId: string
): Promise<JobStats> {
  const [activeJobs, allApps, shortlisted, pipeline] = await Promise.all([
    prisma.job.count({
      where: { companyId, status: 'active', deletedAt: null },
    }),
    prisma.application.count({
      where: { job: { companyId, deletedAt: null } },
    }),
    prisma.application.count({
      where: {
        job: { companyId, deletedAt: null },
        status: 'shortlisted',
      },
    }),
    prisma.application.count({
      where: {
        job: { companyId, deletedAt: null },
        status: { in: ['interview', 'offered', 'hired'] },
      },
    }),
  ])

  return {
    activeJobs,
    totalApplicants: allApps,
    shortlisted,
    hiringPipeline: pipeline,
  }
}

// ============================================
// GET FILTER OPTIONS (untuk dropdown)
// ============================================

export async function getCompanyJobsFilterOptions(companyId: string) {
  const jobs = await prisma.job.findMany({
    where: { companyId, deletedAt: null },
    select: { city: true, employmentType: true, workMode: true },
  })

  const cities = Array.from(
    new Set(jobs.map((j) => j.city).filter((c): c is string => Boolean(c)))
  ).sort()

  const employmentTypes = Array.from(
    new Set(jobs.map((j) => j.employmentType))
  ).sort()

  const workModes = Array.from(new Set(jobs.map((j) => j.workMode))).sort()

  return { cities, employmentTypes, workModes }
}