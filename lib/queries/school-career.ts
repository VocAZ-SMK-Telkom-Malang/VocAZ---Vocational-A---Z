// lib/queries/school-career.ts
import { prisma } from '@/lib/prisma'

export type CareerOpportunity = {
  jobId: string
  title: string
  companyName: string
  companyLogoUrl: string | null
  city: string | null
  workMode: string | null
  deadline: string | null
  applicantCount: number
  matchedStudents: number
  description: string | null
}

export type RecommendedStudent = {
  profileId: string
  fullName: string
  avatarUrl: string | null
  headline: string | null
  programName: string | null
  matchScore: number
  topSkills: string[]
  isOpenToWork: boolean
}

export type RecruitmentStatusItem = {
  linkId: string
  stage: string
  student: {
    profileId: string
    fullName: string
    avatarUrl: string | null
    programName: string | null
  }
  job: {
    id: string
    title: string
    companyName: string
  } | null
  updatedAt: string
  notes: string | null
}

export type PlacementItem = {
  linkId: string
  student: {
    profileId: string
    fullName: string
    avatarUrl: string | null
    programName: string | null
  }
  company: {
    id: string
    name: string
    logoUrl: string | null
  } | null
  job: {
    id: string
    title: string
  } | null
  placementDate: string | null
  notes: string | null
}

export type CareerStats = {
  totalActive: number
  seeking: number
  inProcess: number
  placed: number
  placementRate: number
}

export async function getCareerStats(schoolId: string): Promise<CareerStats> {
  const [totalActive, monitoring] = await Promise.all([
    prisma.schoolStudent.count({
      where: { schoolId, status: 'active' },
    }),
    prisma.careerMonitoring.findMany({
      where: { schoolId },
      select: { stage: true },
    }),
  ])

  const stageMap: Record<string, number> = {}
  monitoring.forEach((m) => {
    stageMap[m.stage] = (stageMap[m.stage] ?? 0) + 1
  })

  const seeking =
    (stageMap['opportunity'] ?? 0) + (stageMap['recommended'] ?? 0)
  const inProcess =
    (stageMap['applied'] ?? 0) +
    (stageMap['interview'] ?? 0) +
    (stageMap['offered'] ?? 0)
  const placed = stageMap['placed'] ?? 0

  const placementRate =
    totalActive > 0 ? Math.round((placed / totalActive) * 100) : 0

  return { totalActive, seeking, inProcess, placed, placementRate }
}

export async function getCareerOpportunities(
  schoolId: string,
  limit = 20
): Promise<CareerOpportunity[]> {
  const jobs = await prisma.job.findMany({
    where: { status: 'active', deletedAt: null },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      description: true,
      city: true,
      workMode: true,
      expiredAt: true,
      applicants: true,
      company: {
        select: { id: true, name: true, logoUrl: true },
      },
    },
  })

  const monitoring = await prisma.careerMonitoring.findMany({
    where: { schoolId },
    select: { jobId: true },
  })
  const jobMonitorCount = new Map<string, number>()
  monitoring.forEach((m) => {
    if (m.jobId) {
      jobMonitorCount.set(m.jobId, (jobMonitorCount.get(m.jobId) ?? 0) + 1)
    }
  })

  return jobs.map((j) => ({
    jobId: j.id,
    title: j.title,
    companyName: j.company.name,
    companyLogoUrl: j.company.logoUrl ?? null,
    city: j.city ?? null,
    workMode: j.workMode ?? null,
    deadline: j.expiredAt ? j.expiredAt.toISOString() : null,
    applicantCount: j.applicants,
    matchedStudents: jobMonitorCount.get(j.id) ?? 0,
    description: j.description ?? null,
  }))
}

export async function getRecommendedStudents(
  schoolId: string,
  limit = 20
): Promise<RecommendedStudent[]> {
  const students = await prisma.schoolStudent.findMany({
    where: {
      schoolId,
      status: 'active',
      student: { isOpenToWork: true },
    },
    take: limit,
    orderBy: { enrollmentYear: 'desc' },
    include: {
      program: { select: { name: true } },
      student: {
        include: {
          user: {
            select: { fullName: true, avatarUrl: true },
          },
          skills: {
            include: { skill: { select: { name: true } } },
            take: 5,
          },
        },
      },
    },
  })

  return students.map((s) => {
    const score = Math.round(
      (s.student.profileCompletion + s.student.careerReadiness) / 2
    )

    return {
      profileId: s.student.id,
      fullName: s.student.user.fullName ?? 'Siswa',
      avatarUrl: s.student.user.avatarUrl ?? null,
      headline: s.student.headline ?? null,
      programName: s.program?.name ?? null,
      matchScore: score,
      topSkills: s.student.skills.map((sk) => sk.skill.name),
      isOpenToWork: s.student.isOpenToWork,
    }
  })
}

export async function getRecruitmentStatus(
  schoolId: string,
  filterStage?: string
): Promise<RecruitmentStatusItem[]> {
  const where: any = { schoolId }
  if (filterStage && filterStage !== 'all') {
    where.stage = filterStage
  }

  const items = await prisma.careerMonitoring.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    take: 50,
    include: {
      student: {
        include: {
          user: { select: { fullName: true, avatarUrl: true } },
        },
      },
      job: {
        include: { company: { select: { name: true } } },
      },
      company: { select: { name: true } },
    },
  })

  return items.map((m) => ({
    linkId: m.id,
    stage: m.stage,
    student: {
      profileId: m.student.id,
      fullName: m.student.user.fullName ?? 'Siswa',
      avatarUrl: m.student.user.avatarUrl ?? null,
      programName: null,
    },
    job: m.job
      ? {
          id: m.job.id,
          title: m.job.title,
          companyName: m.job.company.name,
        }
      : m.company
        ? {
            id: '',
            title: 'Placement',
            companyName: m.company.name,
          }
        : null,
    updatedAt: m.updatedAt.toISOString(),
    notes: m.notes ?? null,
  }))
}

export async function getPlacements(
  schoolId: string,
  limit = 50
): Promise<PlacementItem[]> {
  const items = await prisma.careerMonitoring.findMany({
    where: { schoolId, stage: 'placed' },
    orderBy: { placementDate: 'desc' },
    take: limit,
    include: {
      student: {
        include: {
          user: { select: { fullName: true, avatarUrl: true } },
        },
      },
      company: { select: { id: true, name: true, logoUrl: true } },
      job: { select: { id: true, title: true } },
    },
  })

  return items.map((m) => ({
    linkId: m.id,
    student: {
      profileId: m.student.id,
      fullName: m.student.user.fullName ?? 'Siswa',
      avatarUrl: m.student.user.avatarUrl ?? null,
      programName: null,
    },
    company: m.company
      ? {
          id: m.company.id,
          name: m.company.name,
          logoUrl: m.company.logoUrl ?? null,
        }
      : null,
    job: m.job ? { id: m.job.id, title: m.job.title } : null,
    placementDate: m.placementDate ? m.placementDate.toISOString() : null,
    notes: m.notes ?? null,
  }))
}   