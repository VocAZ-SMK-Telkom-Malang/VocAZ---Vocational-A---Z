// lib/queries/applications.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type ApplicationListItem = {
  id: string
  jobSlug: string
  jobTitle: string
  jobType: string
  jobMode: string
  jobLocation: string
  salaryMin: number
  salaryMax: number

  companySlug: string
  companyName: string
  companyVerified: boolean
  companyLogoColor: string

  status: string
  matchScore: number
  appliedAt: string
  updatedAt: string

  nextStep?: string
  interviewDate?: string
  recruiterName?: string
  notes?: string

  timeline: {
    status: string
    at: string
    note?: string
  }[]
}

export type ApplicationStats = {
  total: number
  active: number
  review: number
  interview: number
  offered: number
  hired: number
  rejected: number
}

// ============================================
// QUERY: LIST APPLICATIONS BY STUDENT
// ============================================

export async function getApplicationsByStudent(
  studentUserId: string
): Promise<ApplicationListItem[]> {
  // Cari StudentProfile dari userId
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: studentUserId },
    select: { id: true },
  })

  if (!studentProfile) return []

  const apps = await prisma.application.findMany({
    where: { studentId: studentProfile.id },
    include: {
      job: {
        include: {
          company: {
            select: {
              slug: true,
              name: true,
              verificationStatus: true,
              logoUrl: true,
            },
          },
        },
      },
      history: {
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return apps.map((a) => ({
    id: a.id,
    jobSlug: a.job.slug,
    jobTitle: a.job.title,
    jobType: formatEmploymentType(a.job.employmentType),
    jobMode: formatWorkMode(a.job.workMode),
    jobLocation: a.job.location ?? a.job.city ?? 'Remote',
    salaryMin: a.job.salaryMin ? Number(a.job.salaryMin) / 1_000_000 : 0,
    salaryMax: a.job.salaryMax ? Number(a.job.salaryMax) / 1_000_000 : 0,

    companySlug: a.job.company.slug,
    companyName: a.job.company.name,
    companyVerified: a.job.company.verificationStatus === 'verified',
    companyLogoColor: pickLogoColor(a.job.company.name),

    status: a.status,
    matchScore: a.matchScore ?? 0,
    appliedAt: a.appliedAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),

    nextStep: a.nextStep ?? undefined,
    interviewDate: a.interviewDate?.toISOString(),
    recruiterName: a.recruiterName ?? undefined,
    notes: a.notes ?? undefined,

    timeline: a.history.map((h) => ({
      status: h.status,
      at: h.createdAt.toISOString(),
      note: h.notes ?? undefined,
    })),
  }))
}

// ============================================
// QUERY: GET APPLICATION BY ID
// ============================================

export async function getApplicationById(id: string) {
  return prisma.application.findUnique({
    where: { id },
    include: {
      job: {
        include: {
          company: true,
          skills: { include: { skill: true } },
        },
      },
      student: {
        include: {
          user: { select: { fullName: true, email: true, avatarUrl: true } },
          skills: { include: { skill: true } },
        },
      },
      history: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

// ============================================
// QUERY: STATS
// ============================================

export async function getApplicationStats(
  studentUserId: string
): Promise<ApplicationStats> {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: studentUserId },
    select: { id: true },
  })

  if (!studentProfile) {
    return {
      total: 0,
      active: 0,
      review: 0,
      interview: 0,
      offered: 0,
      hired: 0,
      rejected: 0,
    }
  }

  const apps = await prisma.application.findMany({
    where: { studentId: studentProfile.id },
    select: { status: true },
  })

  return {
    total: apps.length,
    active: apps.filter((a) =>
      ['submitted', 'reviewed', 'shortlisted', 'interview'].includes(a.status)
    ).length,
    review: apps.filter((a) =>
      ['reviewed', 'shortlisted'].includes(a.status)
    ).length,
    interview: apps.filter((a) => a.status === 'interview').length,
    offered: apps.filter((a) => a.status === 'offered').length,
    hired: apps.filter((a) => a.status === 'hired').length,
    rejected: apps.filter((a) => a.status === 'rejected').length,
  }
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

// Warna logo deterministic dari nama perusahaan
function pickLogoColor(name: string): string {
  const colors = [
    '#DC2626', '#EA580C', '#CA8A04', '#16A34A', '#0D9488',
    '#0369A1', '#1E40AF', '#7C3AED', '#BE185D', '#9333EA',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}