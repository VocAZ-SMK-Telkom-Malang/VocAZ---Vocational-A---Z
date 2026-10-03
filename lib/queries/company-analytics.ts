// lib/queries/company-analytics.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type PeriodKey = '7d' | '30d' | '90d' | 'all'

export type AnalyticsKPIs = {
  totalJobs: number
  totalApplications: number
  totalHired: number
  avgTimeToHire: number       // dalam hari
  conversionRate: number      // persen
}

export type TrendPoint = {
  date: string                // ISO date
  label: string               // "12 Jan"
  applications: number
  hires: number
}

export type FunnelStage = {
  key: string
  label: string
  count: number
  percent: number             // % dari stage pertama
  dropOff: number             // % dari stage sebelumnya
}

export type SkillDemand = {
  skillId: string
  skillName: string
  jobCount: number
  applicantCount: number
}

export type TopJob = {
  id: string
  title: string
  slug: string
  status: string
  publishedAt: string | null
  applicantCount: number
  hiredCount: number
  conversionRate: number
  avgMatchScore: number
  daysOpen: number
}

export type AnalyticsData = {
  kpis: AnalyticsKPIs
  trend: TrendPoint[]
  funnel: FunnelStage[]
  topSkills: SkillDemand[]
  topJobs: TopJob[]
   demographics: {
    gender: { label: string; value: number; color: string }[]
    city: { label: string; value: number; color: string }[]
  }
  skillCoverage: {
    category: string
    value: number
    fullMark: number
  }[]
}


// ============================================
// HELPERS
// ============================================

function getPeriodStart(period: PeriodKey): Date | null {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  switch (period) {
    case '7d':
      return new Date(now - 7 * day)
    case '30d':
      return new Date(now - 30 * day)
    case '90d':
      return new Date(now - 90 * day)
    case 'all':
      return null
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  })
}

// ============================================
// GET KPIs
// ============================================

async function getKPIs(
  companyId: string,
  periodStart: Date | null
): Promise<AnalyticsKPIs> {
  const whereBase: any = {
    companyId,
    deletedAt: null,
    ...(periodStart ? { createdAt: { gte: periodStart } } : {}),
  }

  const appWhere: any = {
    job: {
      companyId,
      deletedAt: null,
    },
    ...(periodStart ? { appliedAt: { gte: periodStart } } : {}),
  }

  const [totalJobs, totalApplications, totalHired, hiredApps] =
    await Promise.all([
      prisma.job.count({ where: whereBase }),
      prisma.application.count({ where: appWhere }),
      prisma.application.count({
        where: { ...appWhere, status: 'hired' },
      }),
      prisma.application.findMany({
        where: { ...appWhere, status: 'hired' },
        select: { appliedAt: true, updatedAt: true },
      }),
    ])

  // Avg time to hire
  let avgTimeToHire = 0
  if (hiredApps.length > 0) {
    const totalDays = hiredApps.reduce((sum, a) => {
      const diff = a.updatedAt.getTime() - a.appliedAt.getTime()
      return sum + diff / (24 * 60 * 60 * 1000)
    }, 0)
    avgTimeToHire = Math.round(totalDays / hiredApps.length)
  }

  const conversionRate =
    totalApplications > 0
      ? Math.round((totalHired / totalApplications) * 1000) / 10
      : 0

  return {
    totalJobs,
    totalApplications,
    totalHired,
    avgTimeToHire,
    conversionRate,
  }
}

// ============================================
// GET TREND
// ============================================

async function getApplicationTrend(
  companyId: string,
  periodStart: Date | null
): Promise<TrendPoint[]> {
  // Kalau all time, pakai 90 hari terakhir untuk chart
  const start =
    periodStart || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

  // Group by day
  const apps = await prisma.application.findMany({
    where: {
      job: { companyId, deletedAt: null },
      appliedAt: { gte: start },
    },
    select: {
      appliedAt: true,
      status: true,
    },
    orderBy: { appliedAt: 'asc' },
  })

  // Build daily map
  const dayMap = new Map<string, { applications: number; hires: number }>()
  const now = new Date()
  const cursor = new Date(start)
  cursor.setHours(0, 0, 0, 0)

  while (cursor <= now) {
    const key = cursor.toISOString().split('T')[0]
    dayMap.set(key, { applications: 0, hires: 0 })
    cursor.setDate(cursor.getDate() + 1)
  }

  for (const app of apps) {
    const key = app.appliedAt.toISOString().split('T')[0]
    const entry = dayMap.get(key)
    if (entry) {
      entry.applications++
      if (app.status === 'hired') entry.hires++
    }
  }

  return Array.from(dayMap.entries()).map(([date, data]) => ({
    date,
    label: formatDate(new Date(date)),
    applications: data.applications,
    hires: data.hires,
  }))
}

// ============================================
// GET FUNNEL
// ============================================

async function getRecruitmentFunnel(
  companyId: string,
  periodStart: Date | null
): Promise<FunnelStage[]> {
  const where: any = {
    job: { companyId, deletedAt: null },
    ...(periodStart ? { appliedAt: { gte: periodStart } } : {}),
  }

  const statuses = [
    { key: 'submitted', label: 'Lamaran Masuk' },
    { key: 'reviewed', label: 'Ditinjau' },
    { key: 'shortlisted', label: 'Shortlist' },
    { key: 'interview', label: 'Interview' },
    { key: 'offered', label: 'Penawaran' },
    { key: 'hired', label: 'Diterima' },
  ] as const

  const counts = await Promise.all(
    statuses.map((s) =>
      prisma.application.count({
        where: { ...where, status: s.key },
      })
    )
  )

  // Funnel logic: cumulatif — hitung semua yang melewati stage
  // Kita pakai logic sederhana: hitung per status aja
  const totalSubmitted = counts[0] || 1

  const stages: FunnelStage[] = statuses.map((s, idx) => {
    const count = counts[idx]
    const percent = Math.round((count / totalSubmitted) * 1000) / 10
    const prevCount = idx > 0 ? counts[idx - 1] : count
    const dropOff =
      idx > 0 && prevCount > 0
        ? Math.round(((prevCount - count) / prevCount) * 1000) / 10
        : 0

    return {
      key: s.key,
      label: s.label,
      count,
      percent,
      dropOff,
    }
  })

  return stages
}

// ============================================
// GET TOP SKILLS DEMAND
// ============================================

async function getTopSkillsDemand(
  companyId: string,
  periodStart: Date | null,
  limit = 8
): Promise<SkillDemand[]> {
  const jobs = await prisma.job.findMany({
    where: {
      companyId,
      deletedAt: null,
      ...(periodStart ? { createdAt: { gte: periodStart } } : {}),
    },
    select: {
      id: true,
      skills: {
        include: {
          skill: { select: { id: true, name: true } },
        },
      },
      _count: { select: { applications: true } },
    },
  })

  // Aggregate by skill
  const skillMap = new Map<
    string,
    { skillName: string; jobCount: number; applicantCount: number }
  >()

  for (const job of jobs) {
    for (const js of job.skills) {
      const existing = skillMap.get(js.skill.id)
      if (existing) {
        existing.jobCount++
        existing.applicantCount += job._count.applications
      } else {
        skillMap.set(js.skill.id, {
          skillName: js.skill.name,
          jobCount: 1,
          applicantCount: job._count.applications,
        })
      }
    }
  }

  return Array.from(skillMap.entries())
    .map(([skillId, data]) => ({
      skillId,
      skillName: data.skillName,
      jobCount: data.jobCount,
      applicantCount: data.applicantCount,
    }))
    .sort((a, b) => b.jobCount - a.jobCount)
    .slice(0, limit)
}

// ============================================
// GET TOP JOBS
// ============================================

async function getTopJobs(
  companyId: string,
  periodStart: Date | null,
  limit = 5
): Promise<TopJob[]> {
  const jobs = await prisma.job.findMany({
    where: {
      companyId,
      deletedAt: null,
      ...(periodStart ? { createdAt: { gte: periodStart } } : {}),
    },
    include: {
      applications: {
        select: {
          status: true,
          matchScore: true,
          appliedAt: true,
          updatedAt: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const now = Date.now()

  const mapped: TopJob[] = jobs.map((j) => {
    const applicantCount = j.applications.length
    const hiredCount = j.applications.filter(
      (a) => a.status === 'hired'
    ).length
    const conversionRate =
      applicantCount > 0
        ? Math.round((hiredCount / applicantCount) * 1000) / 10
        : 0
    const scores = j.applications
      .map((a) => a.matchScore)
      .filter((s): s is number => s !== null)
    const avgMatchScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0

    const daysOpen = j.publishedAt
      ? Math.floor((now - j.publishedAt.getTime()) / (24 * 60 * 60 * 1000))
      : 0

    return {
      id: j.id,
      title: j.title,
      slug: j.slug,
      status: j.status,
      publishedAt: j.publishedAt?.toISOString() ?? null,
      applicantCount,
      hiredCount,
      conversionRate,
      avgMatchScore,
      daysOpen,
    }
  })

  // Sort by applicant count
  return mapped
    .sort((a, b) => b.applicantCount - a.applicantCount)
    .slice(0, limit)
}

// ============================================
// GET DEMOGRAPHICS
// ============================================

async function getDemographics(
  companyId: string,
  periodStart: Date | null
) {
  const where: any = {
    job: { companyId, deletedAt: null },
    ...(periodStart ? { appliedAt: { gte: periodStart } } : {}),
  }

  const apps = await prisma.application.findMany({
    where,
    select: {
      student: {
        select: {
          gender: true,
          city: true,
        },
      },
    },
  })

  // Gender distribution
  const genderMap = new Map<string, number>()
  const cityMap = new Map<string, number>()

  for (const app of apps) {
    const g = app.student.gender ?? 'other'
    genderMap.set(g, (genderMap.get(g) ?? 0) + 1)

    const c = app.student.city ?? 'Tidak diketahui'
    cityMap.set(c, (cityMap.get(c) ?? 0) + 1)
  }

  const GENDER_LABEL: Record<string, string> = {
    male: 'Laki-laki',
    female: 'Perempuan',
    other: 'Lainnya',
  }

  const GENDER_COLOR: Record<string, string> = {
    male: '#4059aa',
    female: '#dc2626',
    other: '#894900',
  }

  const gender = Array.from(genderMap.entries())
    .map(([key, value]) => ({
      label: GENDER_LABEL[key] ?? key,
      value,
      color: GENDER_COLOR[key] ?? '#916f6b',
    }))
    .sort((a, b) => b.value - a.value)

  // City distribution — top 5 + "Lainnya"
  const cities = Array.from(cityMap.entries()).sort((a, b) => b[1] - a[1])
  const topCities = cities.slice(0, 5)
  const restCount = cities.slice(5).reduce((s, [, v]) => s + v, 0)

  const CITY_COLORS = [
    '#b70011',
    '#dc2626',
    '#ad5d00',
    '#4059aa',
    '#8fa7fe',
    '#916f6b',
  ]

  const city = topCities.map(([label, value], idx) => ({
    label,
    value,
    color: CITY_COLORS[idx] ?? '#916f6b',
  }))

  if (restCount > 0) {
    city.push({
      label: 'Lainnya',
      value: restCount,
      color: CITY_COLORS[CITY_COLORS.length - 1],
    })
  }

  return { gender, city }
}

// ============================================
// GET SKILL COVERAGE (untuk radar)
// ============================================

async function getSkillCoverage(companyId: string) {
  // Ambil top 6 skill categories
  const jobs = await prisma.job.findMany({
    where: { companyId, deletedAt: null },
    select: {
      skills: {
        include: {
          skill: { select: { category: true } },
        },
      },
    },
  })

  const categoryMap = new Map<string, number>()

  for (const job of jobs) {
    for (const js of job.skills) {
      const cat = js.skill.category ?? 'Lainnya'
      categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1)
    }
  }

  const entries = Array.from(categoryMap.entries()).sort(
    (a, b) => b[1] - a[1]
  )
  const top = entries.slice(0, 6)
  const max = Math.max(...top.map(([, v]) => v), 1)

  return top.map(([category, value]) => ({
    category,
    value,
    fullMark: max,
  }))
}

// ============================================
// MAIN
// ============================================

export async function getCompanyAnalytics(
  companyId: string,
  period: PeriodKey = '30d'
): Promise<AnalyticsData> {
  const periodStart = getPeriodStart(period)

  const [kpis, trend, funnel, topSkills, topJobs, demographics, skillCoverage] =
    await Promise.all([
      getKPIs(companyId, periodStart),
      getApplicationTrend(companyId, periodStart),
      getRecruitmentFunnel(companyId, periodStart),
      getTopSkillsDemand(companyId, periodStart),
      getTopJobs(companyId, periodStart),
      getDemographics(companyId, periodStart),
      getSkillCoverage(companyId),
    ])

  return {
    kpis,
    trend,
    funnel,
    topSkills,
    topJobs,
    demographics,
    skillCoverage,
  }
}