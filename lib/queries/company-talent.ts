// lib/queries/company-talent.ts
import { prisma } from '@/lib/prisma'
import { calculateMatchScore } from '@/lib/matching/score'
import { MatchWeights, DEFAULT_WEIGHTS } from '@/lib/matching/types'

// ============================================
// TYPES
// ============================================

export type TalentCard = {
  id: string
  userId: string
  fullName: string
  initials: string
  avatarUrl: string | null
  coverImageUrl: string | null
  headline: string | null
  bio: string | null
  city: string | null
  province: string | null
  isOpenToWork: boolean
  followerCount: number
  matchScore: number | null
  matchBreakdown: any | null
  school: {
    id: string
    name: string
    city: string | null
  } | null
  topSkills: string[]
  certificateCount: number
  isVerified: boolean
  hasBeenInvited: boolean
  hasApplied: boolean
}

export type TalentFilters = {
  search?: string
  jobId?: string
  minScore?: number
  city?: string
  skill?: string
  openToWorkOnly?: boolean
  sortBy?: 'match' | 'newest' | 'name'
  page?: number
  pageSize?: number
}

export type TalentFilterOptions = {
  cities: string[]
  skills: { id: string; name: string }[]
  jobs: {
    id: string
    title: string
    companyName: string
  }[]
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

// ============================================
// GET TALENTS
// ============================================

export async function getCompanyTalents(
  companyId: string,
  filters: TalentFilters = {}
): Promise<{
  talents: TalentCard[]
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
    city,
    skill,
    openToWorkOnly = false,
    sortBy = 'match',
    page = 1,
    pageSize = 12,
  } = filters

  // 1. Build where clause
  const where: any = {
    isPublic: true,
    user: { deletedAt: null, isActive: true },
    ...(openToWorkOnly ? { isOpenToWork: true } : {}),
    ...(city && city !== 'all' ? { city } : {}),
    ...(search
      ? {
          OR: [
            { headline: { contains: search, mode: 'insensitive' } },
            { bio: { contains: search, mode: 'insensitive' } },
            { user: { fullName: { contains: search, mode: 'insensitive' } } },
            { school: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {}),
    ...(skill && skill !== 'all'
      ? {
          skills: { some: { skillId: skill } },
        }
      : {}),
  }

  // 2. Get company matching weights
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    select: { matchingWeights: true },
  })

  const weights: MatchWeights = company?.matchingWeights
    ? (company.matchingWeights as unknown as MatchWeights)
    : DEFAULT_WEIGHTS

  // 3. Get target job (kalau ada)
  let job: any = null
  if (jobId) {
    job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        skills: { include: { skill: true } },
      },
    })
  }

  // 4. Fetch candidates
  const allTalents = await prisma.studentProfile.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      school: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
      skills: {
        include: { skill: true },
        orderBy: { proficiency: 'desc' },
      },
      educations: true,
      experiences: true,
      certificates: {
        where: { verificationStatus: 'verified' },
        select: { id: true, badgeType: true, verificationStatus: true },
      },
    },
  })

  // 5. Hitung match score
  const talentsWithScore: TalentCard[] = allTalents.map((t) => {
    let matchScore: number | null = null
    let matchBreakdown: any = null

    if (job) {
      try {
        const breakdown = calculateMatchScore(
          {
            candidateSkills: t.skills.map((s) => ({
              id: s.id,
              name: s.skill.name,
              category: s.skill.category,
              proficiency: s.proficiency,
            })),
            candidateExperiences: t.experiences.map((e) => ({
              startDate: e.startDate?.toISOString() ?? null,
              endDate: e.endDate?.toISOString() ?? null,
              isCurrent: e.isCurrent,
            })),
            candidateEducations: t.educations.map((e) => ({
              schoolName: e.schoolName,
              major: e.major,
              degree: e.degree,
            })),
            candidateCertificates: t.certificates.map((c) => ({
              badgeType: c.badgeType,
              verificationStatus: c.verificationStatus,
            })),
            candidateCity: t.city,
            candidateProvince: t.province,

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
      id: t.id,
      userId: t.user.id,
      fullName: t.user.fullName ?? 'Siswa',
      initials: getInitials(t.user.fullName),
      avatarUrl: t.user.avatarUrl,
      coverImageUrl: t.coverImageUrl,   // ✅ TAMBAH
      headline: t.headline,
      bio: t.bio,
      city: t.city,
      province: t.province,
      isOpenToWork: t.isOpenToWork,
      followerCount: t.followerCount,
      matchScore,
      matchBreakdown,
      school: t.school
        ? {
            id: t.school.id,
            name: t.school.name,
            city: t.school.city,
          }
        : null,
      topSkills: t.skills.slice(0, 4).map((s) => s.skill.name),
      certificateCount: t.certificates.length,
      isVerified: t.certificates.length > 0,
      hasBeenInvited: false,
      hasApplied: false,
    }
  })

  // 6. Filter by min score
  let filtered = talentsWithScore.filter((t) => {
    if (minScore > 0 && t.matchScore !== null && t.matchScore < minScore) {
      return false
    }
    return true
  })

  // 7. Sort
  if (sortBy === 'match' && job) {
    filtered.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => a.fullName.localeCompare(b.fullName))
  }

  // 8. Pagination
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)
  const talentIds = paginated.map((t) => t.id)

  if (talentIds.length > 0 && job) {
    const [invitations, applications] = await Promise.all([
      prisma.talentInvitation.findMany({
        where: {
          jobId: job.id,
          studentId: { in: talentIds },
        },
        select: { studentId: true },
      }),
      prisma.application.findMany({
        where: {
          jobId: job.id,
          studentId: { in: talentIds },
        },
        select: { studentId: true },
      }),
    ])

    const invitedSet = new Set(invitations.map((i) => i.studentId))
    const appliedSet = new Set(applications.map((a) => a.studentId))

    paginated.forEach((t) => {
      t.hasBeenInvited = invitedSet.has(t.id)
      t.hasApplied = appliedSet.has(t.id)
    })
  }

  return {
    talents: paginated,
    pagination: {
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      totalItems: filtered.length,
      pageSize,
    },
  }
}

// ============================================
// GET TALENT FILTER OPTIONS
// ============================================

export async function getCompanyTalentFilterOptions(
  companyId: string
): Promise<TalentFilterOptions> {
  const [cities, skills, jobs] = await Promise.all([
    prisma.studentProfile
      .findMany({
        where: { isPublic: true, city: { not: null } },
        select: { city: true },
        distinct: ['city'],
        orderBy: { city: 'asc' },
      })
      .then((r) => r.map((s) => s.city!).filter(Boolean)),

    prisma.skill.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),

    prisma.job.findMany({
      where: {
        companyId,
        status: 'active',
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        company: { select: { name: true } },
      },
      orderBy: { publishedAt: 'desc' },
    }),
  ])

  return {
    cities,
    skills,
    jobs: jobs.map((j) => ({
      id: j.id,
      title: j.title,
      companyName: j.company.name,
    })),
  }
}

// ============================================
// GET COMPANY TALENT STATS
// ============================================

export async function getCompanyTalentStats(companyId: string) {
  const [totalTalents, openToWork, withCertificates, activeJobs] =
    await Promise.all([
      prisma.studentProfile.count({
        where: { isPublic: true, user: { isActive: true, deletedAt: null } },
      }),
      prisma.studentProfile.count({
        where: {
          isPublic: true,
          isOpenToWork: true,
          user: { isActive: true, deletedAt: null },
        },
      }),
      prisma.studentProfile.count({
        where: {
          isPublic: true,
          certificates: { some: { verificationStatus: 'verified' } },
          user: { isActive: true, deletedAt: null },
        },
      }),
      prisma.job.count({
        where: { companyId, status: 'active', deletedAt: null },
      }),
    ])

  return {
    totalTalents,
    openToWork,
    withCertificates,
    activeJobs,
  }
}