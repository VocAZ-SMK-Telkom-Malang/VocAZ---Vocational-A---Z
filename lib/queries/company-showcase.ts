// lib/queries/company-showcase.ts
import { prisma } from '@/lib/prisma'
import { calculateMatchScore } from '@/lib/matching/score'
import { MatchWeights, DEFAULT_WEIGHTS } from '@/lib/matching/types'

// ============================================
// TYPES
// ============================================

export type ShowcaseVideoItem = {
  id: string
  title: string
  description: string | null
  videoUrl: string
  videoSource: string
  thumbnailUrl: string | null
  durationSec: number | null
  durationFormatted: string
  category: string | null
  skillTags: string[]
  viewCount: number
  likeCount: number
  publishedAt: string | null
  matchScore: number | null
  matchBreakdown: any | null

  student: {
    id: string
    userId: string
    fullName: string
    initials: string
    avatarUrl: string | null
    headline: string | null
    city: string | null
    province: string | null
    school: {
      id: string
      name: string
      city: string | null
    } | null
    topSkills: string[]
    certificates: Array<{
      id: string
      title: string
      badgeType: string
      verificationStatus: string
    }>
    isVerified: boolean
    isOpenToWork: boolean
  }

  // Recruiter tracking
  hasSaved: boolean
  hasBeenInvited: boolean
  hasApplied: boolean
}

export type ShowcaseFilters = {
  search?: string
  jobId?: string
  minScore?: number
  category?: string
  skillIds?: string[]
  durationFilter?: 'all' | 'short' | 'medium' | 'long'
  sortBy?: 'match' | 'newest' | 'popular' | 'views'
  page?: number
  pageSize?: number
}

export type ShowcaseFilterOptions = {
  categories: string[]
  skillsByCategory: Record<string, { id: string; name: string }[]>
  jobs: {
    id: string
    title: string
    companyName: string
  }[]
}

export type ShowcaseStats = {
  totalVideos: number
  verifiedTalent: number
  highMatch: number
}

// ============================================
// HELPERS
// ============================================

function getInitials(name: string | null): string {
  if (!name) return '??'
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function formatDuration(sec: number | null): string {
  if (!sec) return '00:00'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ============================================
// GET SHOWCASE VIDEOS
// ============================================

export async function getCompanyShowcaseVideos(
  companyId: string,
  filters: ShowcaseFilters = {}
): Promise<{
  videos: ShowcaseVideoItem[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
}> {
  const {
    search,
    jobId,
    minScore = 0,
    category,
    skillIds = [],
    durationFilter = 'all',
    sortBy = 'match',
    page = 1,
    pageSize = 12,
  } = filters

  // Duration filter
  const durationWhere: any = {}
  if (durationFilter === 'short') durationWhere.lt = 60
  else if (durationFilter === 'medium') durationWhere.gte = 60
  else if (durationFilter === 'long') durationWhere.gte = 300

  const where: any = {
    status: 'published',
    ...(category && category !== 'all' ? { category } : {}),
    ...(Object.keys(durationWhere).length > 0
      ? { durationSec: durationWhere }
      : {}),
    ...(skillIds.length > 0
      ? {
          student: {
            skills: { some: { skillId: { in: skillIds } } },
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            {
              student: {
                user: { fullName: { contains: search, mode: 'insensitive' } },
              },
            },
            {
              student: {
                school: { name: { contains: search, mode: 'insensitive' } },
              },
            },
          ],
        }
      : {}),
  }

  // Get match weights
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { matchingWeights: true },
  })

  const weights: MatchWeights = company?.matchingWeights
    ? (company.matchingWeights as unknown as MatchWeights)
    : DEFAULT_WEIGHTS

  // Get target job
  let job: any = null
  if (jobId) {
    job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { skills: { include: { skill: true } } },
    })
  }

  // Fetch videos
  const allVideos = await prisma.showcaseVideo.findMany({
    where,
    include: {
      student: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          school: {
            select: { id: true, name: true, city: true },
          },
          skills: {
            include: { skill: true },
            orderBy: { proficiency: 'desc' },
          },
          educations: true,
          experiences: true,
          certificates: {
            where: { verificationStatus: 'verified' },
            select: {
              id: true,
              title: true,
              badgeType: true,
              verificationStatus: true,
            },
          },
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
  })

  // Compute match score per video
  const videosWithScore: ShowcaseVideoItem[] = allVideos.map((v) => {
    let matchScore: number | null = null
    let matchBreakdown: any = null

    if (job) {
      try {
        const breakdown = calculateMatchScore(
          {
            candidateSkills: v.student.skills.map((s) => ({
              id: s.id,
              name: s.skill.name,
              category: s.skill.category,
              proficiency: s.proficiency,
            })),
            candidateExperiences: v.student.experiences.map((e) => ({
              startDate: e.startDate?.toISOString() ?? null,
              endDate: e.endDate?.toISOString() ?? null,
              isCurrent: e.isCurrent,
            })),
            candidateEducations: v.student.educations.map((e) => ({
              schoolName: e.schoolName,
              major: e.major,
              degree: e.degree,
            })),
            candidateCertificates: v.student.certificates.map((c) => ({
              badgeType: c.badgeType,
              verificationStatus: c.verificationStatus,
            })),
            candidateCity: v.student.city,
            candidateProvince: v.student.province,
            jobSkills: job.skills.map((js: any) => ({
              id: js.skill.id,
              name: js.skill.name,
              category: js.skill.category,
              isRequired: js.isRequired,
            })),
            jobProgram: job.program,
            jobCity: job.city,
            jobProvince: job.province,
          },
          weights
        )
        matchScore = breakdown.totalScore
        matchBreakdown = breakdown
      } catch (err) {
        console.error('[Match] Error:', err)
      }
    }

    return {
      id: v.id,
      title: v.title,
      description: v.description,
      videoUrl: v.videoUrl,
      videoSource: v.videoSource,
      thumbnailUrl: v.thumbnailUrl,
      durationSec: v.durationSec,
      durationFormatted: formatDuration(v.durationSec),
      category: v.category,
      skillTags: v.skillTags,
      viewCount: Number(v.viewCount),
      likeCount: v.likeCount,
      publishedAt: v.publishedAt?.toISOString() ?? null,
      matchScore,
      matchBreakdown,

      student: {
        id: v.student.id,
        userId: v.student.user.id,
        fullName: v.student.user.fullName ?? 'Siswa',
        initials: getInitials(v.student.user.fullName),
        avatarUrl: v.student.user.avatarUrl,
        headline: v.student.headline,
        city: v.student.city,
        province: v.student.province,
        school: v.student.school
          ? {
              id: v.student.school.id,
              name: v.student.school.name,
              city: v.student.school.city,
            }
          : null,
        topSkills: v.student.skills
          .slice(0, 5)
          .map((s) => s.skill.name),
        certificates: v.student.certificates,
        isVerified: v.student.certificates.length > 0,
        isOpenToWork: v.student.isOpenToWork,
      },

      hasSaved: false,
      hasBeenInvited: false,
      hasApplied: false,
    }
  })

  // Filter min score
  let filtered = videosWithScore.filter((v) => {
    if (minScore > 0 && v.matchScore !== null && v.matchScore < minScore) {
      return false
    }
    return true
  })

  // Sort
  if (sortBy === 'match' && job) {
    filtered.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
  } else if (sortBy === 'popular') {
    filtered.sort((a, b) => b.likeCount - a.likeCount)
  } else if (sortBy === 'views') {
    filtered.sort((a, b) => b.viewCount - a.viewCount)
  }
  // 'newest' = default order

  // Pagination
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  // Check save & invitation status
  const studentIds = paginated.map((v) => v.student.id)

  if (studentIds.length > 0) {
    const [saved, invitations, applications] = await Promise.all([
      // Untuk save, asumsi ada tabel SavedTalent atau reuse bookmark
      // Sementara skip dulu (placeholder)
      Promise.resolve([]),

      job
        ? prisma.talentInvitation.findMany({
            where: {
              jobId: job.id,
              studentId: { in: studentIds },
            },
            select: { studentId: true },
          })
        : Promise.resolve([]),

      job
        ? prisma.application.findMany({
            where: {
              jobId: job.id,
              studentId: { in: studentIds },
            },
            select: { studentId: true },
          })
        : Promise.resolve([]),
    ])

    const invitedSet = new Set(invitations.map((i) => i.studentId))
    const appliedSet = new Set(applications.map((a) => a.studentId))

    paginated.forEach((v) => {
      v.hasBeenInvited = invitedSet.has(v.student.id)
      v.hasApplied = appliedSet.has(v.student.id)
    })
  }

  return {
    videos: paginated,
    pagination: {
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      totalItems: filtered.length,
      pageSize,
    },
  }
}

// ============================================
// GET FILTER OPTIONS
// ============================================

export async function getCompanyShowcaseFilterOptions(
  companyId: string
): Promise<ShowcaseFilterOptions> {
  const [categoriesData, skillsData, jobs] = await Promise.all([
    prisma.showcaseVideo.findMany({
      where: { status: 'published', category: { not: null } },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    }),

    prisma.skill.findMany({
      select: { id: true, name: true, category: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    }),

    prisma.job.findMany({
      where: { companyId, status: 'active', deletedAt: null },
      select: {
        id: true,
        title: true,
        company: { select: { name: true } },
      },
      orderBy: { publishedAt: 'desc' },
    }),
  ])

  const categories = categoriesData
    .map((c) => c.category!)
    .filter(Boolean)

  // Group skills by category
  const skillsByCategory: Record<string, { id: string; name: string }[]> = {}
  for (const s of skillsData) {
    const cat = s.category ?? 'Lainnya'
    if (!skillsByCategory[cat]) skillsByCategory[cat] = []
    skillsByCategory[cat].push({ id: s.id, name: s.name })
  }

  return {
    categories,
    skillsByCategory,
    jobs: jobs.map((j) => ({
      id: j.id,
      title: j.title,
      companyName: j.company.name,
    })),
  }
}

// ============================================
// GET SHOWCASE STATS
// ============================================

export async function getCompanyShowcaseStats(
  companyId: string,
  jobId?: string
): Promise<ShowcaseStats> {
  const [totalVideos, verifiedTalent] = await Promise.all([
    prisma.showcaseVideo.count({ where: { status: 'published' } }),
    prisma.showcaseVideo
      .findMany({
        where: {
          status: 'published',
          student: {
            certificates: { some: { verificationStatus: 'verified' } },
          },
        },
        select: { studentId: true },
        distinct: ['studentId'],
      })
      .then((r) => r.length),
  ])

  return {
    totalVideos,
    verifiedTalent,
    highMatch: 0, // computed client-side kalau ada job
  }
}