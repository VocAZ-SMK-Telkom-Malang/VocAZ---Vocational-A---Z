// lib/queries/saved.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type SavedJobItem = {
  id: string
  jobId: string
  jobSlug: string
  jobTitle: string
  jobType: string
  jobMode: string
  jobLocation: string
  salaryMin: number
  salaryMax: number
  skills: string[]
  postedAt: string

  companySlug: string
  companyName: string
  companyVerified: boolean
  companyLogoColor: string

  savedAt: string
}

export type SavedCompanyItem = {
  id: string
  companyId: string
  companySlug: string
  companyName: string
  tagline: string
  industry: string
  location: string
  size: string
  verified: boolean
  featured: boolean
  logoColor: string
  activeJobs: number
  employees: string
  rating: number
  reviewCount: number
  savedAt: string
}

// ============================================
// HELPER: Konversi userId → studentProfile.id
// ============================================

async function getProfileIdFromUserId(userId: string): Promise<string | null> {
  const profile = await prisma.studentProfile.findUnique({
    where: { userId },
    select: { id: true },
  })
  return profile?.id ?? null
}

// ============================================
// QUERY: SAVED JOBS
// ============================================

export async function getSavedJobs(
  studentUserId: string
): Promise<SavedJobItem[]> {
  const profileId = await getProfileIdFromUserId(studentUserId)
  if (!profileId) return []

  const items = await prisma.savedJob.findMany({
    where: { studentId: profileId },
    include: {
      job: {
        include: {
          company: {
            select: {
              slug: true,
              name: true,
              verificationStatus: true,
            },
          },
          skills: {
            include: { skill: { select: { name: true } } },
          },
        },
      },
    },
    orderBy: { savedAt: 'desc' },
  })

  return items.map((s: (typeof items)[number]) => ({
    id: s.id,
    jobId: s.job.id,
    jobSlug: s.job.slug,
    jobTitle: s.job.title,
    jobType: formatEmploymentType(s.job.employmentType),
    jobMode: formatWorkMode(s.job.workMode),
    jobLocation: s.job.location ?? s.job.city ?? 'Remote',
    salaryMin: s.job.salaryMin ? Number(s.job.salaryMin) / 1_000_000 : 0,
    salaryMax: s.job.salaryMax ? Number(s.job.salaryMax) / 1_000_000 : 0,
    skills: s.job.skills.map((js: (typeof s.job.skills)[number]) => js.skill.name),
    postedAt:
      s.job.publishedAt?.toISOString() ?? s.job.createdAt.toISOString(),

    companySlug: s.job.company.slug,
    companyName: s.job.company.name,
    companyVerified: s.job.company.verificationStatus === 'verified',
    companyLogoColor: pickLogoColor(s.job.company.name),

    savedAt: s.savedAt.toISOString(),
  }))
}

// ============================================
// QUERY: SAVED COMPANIES
// ============================================

export async function getSavedCompanies(
  studentUserId: string
): Promise<SavedCompanyItem[]> {
  const profileId = await getProfileIdFromUserId(studentUserId)
  if (!profileId) return []

  const items = await prisma.savedCompany.findMany({
    where: { studentId: profileId },
    include: {
      company: {
        include: {
          _count: { select: { jobs: true } },
        },
      },
    },
    orderBy: { savedAt: 'desc' },
  })

  return items.map((s: (typeof items)[number]) => ({
    id: s.id,
    companyId: s.company.id,
    companySlug: s.company.slug,
    companyName: s.company.name,
    tagline: s.company.tagline ?? '',
    industry: s.company.industry ?? 'Lainnya',
    location: s.company.city ?? s.company.province ?? 'Indonesia',
    size: formatCompanySize(s.company.companySize),
    verified: s.company.verificationStatus === 'verified',
    featured: s.company.featured ?? false,
    logoColor: s.company.logoColor ?? pickLogoColor(s.company.name),
    activeJobs: s.company._count.jobs,
    employees: s.company.employeeRange ?? '-',
    rating: s.company.rating ?? 0,
    reviewCount: s.company.reviewCount ?? 0,
    savedAt: s.savedAt.toISOString(),
  }))
}

// ============================================
// STATS
// ============================================

export async function getSavedStats(studentUserId: string) {
  const profileId = await getProfileIdFromUserId(studentUserId)
  if (!profileId) {
    return { savedJobs: 0, savedCompanies: 0 }
  }

  const [savedJobs, savedCompanies] = await Promise.all([
    prisma.savedJob.count({ where: { studentId: profileId } }),
    prisma.savedCompany.count({ where: { studentId: profileId } }),
  ])

  return { savedJobs, savedCompanies }
}

// ============================================
// HELPERS
// ============================================

function formatEmploymentType(t: string): string {
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

function formatWorkMode(m: string): string {
  const map: Record<string, string> = {
    onsite: 'Onsite',
    remote: 'Remote',
    hybrid: 'Hybrid',
  }
  return map[m] ?? m
}

function formatCompanySize(s: string | null): string {
  const map: Record<string, string> = {
    s1_10: 'Startup',
    s11_50: 'Kecil',
    s51_200: 'Menengah',
    s201_500: 'Besar',
    s500plus: 'Enterprise',
  }
  return s ? map[s] ?? s : '-'
}

function pickLogoColor(name: string): string {
  const colors = [
    '#DC2626',
    '#EA580C',
    '#CA8A04',
    '#16A34A',
    '#0D9488',
    '#0369A1',
    '#1E40AF',
    '#7C3AED',
    '#BE185D',
    '#9333EA',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}