// lib/queries/student-jobs.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type JobListItem = {
  id: string
  title: string
  slug: string
  companyName: string
  companySlug: string
  companyLogo: string | null
  companyVerified: boolean
  location: string
  city: string | null
  province: string | null
  employmentType: string
  workMode: string
  salaryMin: number | null
  salaryMax: number | null
  isSalaryVisible: boolean
  skills: string[]
  publishedAt: string | null
  expiredAt: string | null
  daysLeft: number | null
  isExpired: boolean
  applicantCount: number
  saved: boolean
}

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
  isSalaryVisible: boolean
  quota: number
  status: string
  publishedAt: string | null
  expiredAt: string | null
  daysLeft: number | null
  isExpired: boolean
  viewCount: number

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

  skills: Array<{
    id: string
    name: string
    category: string | null
    isRequired: boolean
  }>

  saved: boolean
  hasApplied: boolean
  applicationStatus: string | null
}

export type JobFilter = {
  search?: string
  employmentType?: string
  workMode?: string
  city?: string
  experienceLevel?: string
  sort?: 'newest' | 'deadline' | 'salary_high' | 'salary_low'
  page?: number
  pageSize?: number
}

// Legacy alias — biar file lama yang import MyApplication tidak break
export type MyApplication = {
  id: string
  status: string
  appliedAt: string
  appliedAtRelative: string
  matchScore: number | null
  nextStep: string | null
  interviewDate: string | null
  recruiterName: string | null
  job: {
    id: string
    title: string
    slug: string
    location: string | null
    city: string | null
    employmentType: string
    workMode: string
    companyName: string
    companySlug: string
    companyLogo: string | null
    companyVerified: boolean
  }
  lastUpdate: string
}

// ============================================
// HELPERS
// ============================================

function mapJobSkills(
  skills: Array<{ skill: { id: string; name: string; category: string | null } }>
): string[] {
  return skills.map((s) => s.skill.name)
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
// GET JOBS LIST
// ============================================

export async function getStudentJobs(
  studentProfileId: string | null,
  filter: JobFilter = {}
) {
  const {
    search,
    employmentType = 'all',
    workMode = 'all',
    city = 'all',
    experienceLevel = 'all',
    sort = 'newest',
    page = 1,
    pageSize = 12,
  } = filter

  const where: any = {
    status: 'active',
    deletedAt: null,
    OR: [{ expiredAt: null }, { expiredAt: { gte: new Date() } }],
    ...(employmentType !== 'all' ? { employmentType } : {}),
    ...(workMode !== 'all' ? { workMode } : {}),
    ...(city !== 'all' ? { city } : {}),
    ...(experienceLevel !== 'all' ? { experienceLevel } : {}),
    ...(search
      ? {
          AND: [
            {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { company: { name: { contains: search, mode: 'insensitive' } } },
              ],
            },
          ],
        }
      : {}),
  }

  const orderBy: any =
    sort === 'deadline'
      ? { expiredAt: 'asc' }
      : sort === 'salary_high'
      ? { salaryMax: 'desc' }
      : sort === 'salary_low'
      ? { salaryMin: 'asc' }
      : { publishedAt: 'desc' }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            verificationStatus: true,
          },
        },
        skills: { include: { skill: true } },
        _count: { select: { applications: true } },
      },
    }),
    prisma.job.count({ where }),
  ])

  let savedIds: Set<string> = new Set()
  let appliedJobIds: Set<string> = new Set()

  if (studentProfileId) {
    const [savedJobs, applications] = await Promise.all([
      prisma.savedJob.findMany({
        where: { studentId: studentProfileId },
        select: { jobId: true },
      }),
      prisma.application.findMany({
        where: { studentId: studentProfileId },
        select: { jobId: true },
      }),
    ])
    savedIds = new Set(savedJobs.map((s) => s.jobId))
    appliedJobIds = new Set(applications.map((a) => a.jobId))
  }

  const now = Date.now()

  const mapped: JobListItem[] = jobs.map((j) => {
    const daysLeft = j.expiredAt
      ? Math.ceil((j.expiredAt.getTime() - now) / (24 * 60 * 60 * 1000))
      : null
    const isExpired = j.expiredAt ? j.expiredAt.getTime() < now : false

    return {
      id: j.id,
      title: j.title,
      slug: j.slug,
      companyName: j.company.name,
      companySlug: j.company.slug,
      companyLogo: j.company.logoUrl,
      companyVerified: j.company.verificationStatus === 'verified',
      location: j.location ?? 'Indonesia',
      city: j.city,
      province: j.province,
      employmentType: j.employmentType,
      workMode: j.workMode,
      salaryMin: j.salaryMin ? Number(j.salaryMin) : null,
      salaryMax: j.salaryMax ? Number(j.salaryMax) : null,
      isSalaryVisible: j.isSalaryVisible,
      skills: mapJobSkills(j.skills),
      publishedAt: j.publishedAt?.toISOString() ?? null,
      expiredAt: j.expiredAt?.toISOString() ?? null,
      daysLeft,
      isExpired,
      applicantCount: j._count.applications,
      saved: savedIds.has(j.id),
    }
  })

  return {
    jobs: mapped,
    appliedJobIds: Array.from(appliedJobIds),
    pagination: {
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      totalItems: total,
      pageSize,
    },
  }
}

// ============================================
// GET JOB DETAIL
// ============================================

export async function getStudentJobDetail(
  slug: string,
  studentProfileId: string | null
): Promise<JobDetail | null> {
  const job = await prisma.job.findUnique({
    where: { slug },
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
      skills: { include: { skill: true } },
    },
  })

  if (!job || job.deletedAt) return null
  if (job.status !== 'active') return null

  prisma.job
    .update({
      where: { id: job.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch(() => {})

  let saved = false
  let hasApplied = false
  let applicationStatus: string | null = null

  if (studentProfileId) {
    const [savedJob, application] = await Promise.all([
      prisma.savedJob.findUnique({
        where: {
          studentId_jobId: { studentId: studentProfileId, jobId: job.id },
        },
        select: { id: true },
      }),
      prisma.application.findUnique({
        where: {
          jobId_studentId: { jobId: job.id, studentId: studentProfileId },
        },
        select: { status: true },
      }),
    ])
    saved = !!savedJob
    hasApplied = !!application
    applicationStatus = application?.status ?? null
  }

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
    isSalaryVisible: job.isSalaryVisible,
    quota: job.quota,
    status: job.status,
    publishedAt: job.publishedAt?.toISOString() ?? null,
    expiredAt: job.expiredAt?.toISOString() ?? null,
    daysLeft,
    isExpired,
    viewCount: Number(job.viewCount) + 1,
    company: {
      id: job.company.id,
      name: job.company.name,
      slug: job.company.slug,
      logoUrl: job.company.logoUrl,
      industry: job.company.industry,
      city: job.company.city,
      province: job.company.province,
      verificationStatus: job.company.verificationStatus,
    },
    skills: job.skills.map((js) => ({
      id: js.skill.id,
      name: js.skill.name,
      category: js.skill.category,
      isRequired: js.isRequired,
    })),
    saved,
    hasApplied,
    applicationStatus,
  }
}

// ============================================
// FILTER OPTIONS (FIX TYPE PREDICATE)
// ============================================

export async function getStudentJobFilterOptions() {
  const jobs = await prisma.job.findMany({
    where: { status: 'active', deletedAt: null },
    select: {
      city: true,
      employmentType: true,
      workMode: true,
      experienceLevel: true,
    },
  })

  const cities = Array.from(
    new Set(jobs.map((j) => j.city).filter((c): c is string => Boolean(c)))
  ).sort()

  const employmentTypes = Array.from(new Set(jobs.map((j) => j.employmentType)))

  const workModes = Array.from(new Set(jobs.map((j) => j.workMode)))

  // ✅ FIX: pakai NonNullable<typeof e> biar tipe match
  const experienceLevels = Array.from(
    new Set(
      jobs
        .map((j) => j.experienceLevel)
        .filter((e): e is NonNullable<typeof e> => e !== null)
    )
  ) as string[]

  return { cities, employmentTypes, workModes, experienceLevels }
}

// ============================================
// GET MY APPLICATIONS (legacy — dipakai file lain)
// ============================================

export async function getMyApplications(
  studentProfileId: string,
  filterStatus: string = 'all'
): Promise<MyApplication[]> {
  const where: any = { studentId: studentProfileId }
  if (filterStatus !== 'all') where.status = filterStatus

  const apps = await prisma.application.findMany({
    where,
    orderBy: { appliedAt: 'desc' },
    include: {
      job: {
        include: {
          company: {
            select: {
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

  return apps.map((a) => ({
    id: a.id,
    status: a.status,
    appliedAt: a.appliedAt.toISOString(),
    appliedAtRelative: relativeTime(a.appliedAt),
    matchScore: a.matchScore,
    nextStep: a.nextStep,
    interviewDate: a.interviewDate?.toISOString() ?? null,
    recruiterName: a.recruiterName,
    job: {
      id: a.job.id,
      title: a.job.title,
      slug: a.job.slug,
      location: a.job.location,
      city: a.job.city,
      employmentType: a.job.employmentType,
      workMode: a.job.workMode,
      companyName: a.job.company.name,
      companySlug: a.job.company.slug,
      companyLogo: a.job.company.logoUrl,
      companyVerified: a.job.company.verificationStatus === 'verified',
    },
    lastUpdate: a.updatedAt.toISOString(),
  }))
}

// ============================================
// GET APPLICATION DETAIL
// ============================================

export async function getMyApplicationDetail(
  applicationId: string,
  studentProfileId: string
) {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      job: {
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
              city: true,
              province: true,
              verificationStatus: true,
            },
          },
          skills: { include: { skill: true } },
        },
      },
      history: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!app || app.studentId !== studentProfileId) return null

  return {
    id: app.id,
    status: app.status,
    coverLetter: app.coverLetter,
    resumeUrl: app.resumeUrl,
    matchScore: app.matchScore,
    appliedAt: app.appliedAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
    nextStep: app.nextStep,
    interviewDate: app.interviewDate?.toISOString() ?? null,
    recruiterName: app.recruiterName,
    notes: app.notes,
    job: {
      id: app.job.id,
      title: app.job.title,
      slug: app.job.slug,
      description: app.job.description,
      requirements: app.job.requirements,
      responsibilities: app.job.responsibilities,
      benefits: app.job.benefits,
      employmentType: app.job.employmentType,
      workMode: app.job.workMode,
      experienceLevel: app.job.experienceLevel,
      location: app.job.location,
      city: app.job.city,
      province: app.job.province,
      salaryMin: app.job.salaryMin ? Number(app.job.salaryMin) : null,
      salaryMax: app.job.salaryMax ? Number(app.job.salaryMax) : null,
      isSalaryVisible: app.job.isSalaryVisible,
      expiredAt: app.job.expiredAt?.toISOString() ?? null,
      company: app.job.company,
      skills: app.job.skills.map((js) => ({
        id: js.skill.id,
        name: js.skill.name,
        category: js.skill.category,
      })),
    },
    history: app.history.map((h) => ({
      id: h.id,
      status: h.status,
      notes: h.notes,
      createdAt: h.createdAt.toISOString(),
    })),
  }
}