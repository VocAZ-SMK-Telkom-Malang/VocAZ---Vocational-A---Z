// lib/talenta/queries.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type PublicTalent = {
  id: string
  userId: string
  name: string
  initials: string
  headline: string | null
  bio: string | null
  avatarUrl: string | null
  coverImageUrl: string | null
  city: string | null
  province: string | null
  school: string | null
  major: string | null
  graduationYear: number | null
  isVerified: boolean
  certTier: 'lsp_bnsp' | 'industry' | 'training' | null
  certCount: number
  isOpenToWork: boolean
  skills: string[]
  profileCompletion: number
  showcaseCount: number
  portfolioCount: number
  featuredPortfolio: {
    id: string
    title: string
    thumbnailUrl: string | null
  } | null
  featuredVideo: {
    id: string
    title: string
    category: string | null
    thumbnailUrl: string | null
    videoUrl: string
    durationFormatted: string | null
  } | null
}

export type TalentFilters = {
  search?: string
  city?: string
  major?: string
  status?: 'all' | 'open_to_work' | 'verified'
  page?: number
  pageSize?: number
}

// ============================================
// HELPERS
// ============================================

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function formatDuration(sec: number | null): string | null {
  if (!sec) return null
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function mapTalent(p: any): PublicTalent {
  const name = p.user?.fullName || 'Anonim'
  const featured = p.showcaseVideos?.[0] || null
  const featuredPortfolio = p.portfolios?.[0] || null

  // Hitung cert tier tertinggi
  const certs = p.certificates || []
  const hasLspBnsp = certs.some((c: any) => c.institution?.type === 'lsp_bnsp')
  const hasIndustry = certs.some((c: any) => c.institution?.type === 'industry')
  const hasTraining = certs.some((c: any) => c.institution?.type === 'training')

  let certTier: 'lsp_bnsp' | 'industry' | 'training' | null = null
  const certCount = certs.length
  if (hasLspBnsp) certTier = 'lsp_bnsp'
  else if (hasIndustry) certTier = 'industry'
  else if (hasTraining) certTier = 'training'

  return {
    id: p.id,
    userId: p.userId,
    name,
    initials: getInitials(name),
    headline: p.headline,
    bio: p.bio,
    avatarUrl: p.user?.avatarUrl || null,
    coverImageUrl: p.coverImageUrl || null,
    city: p.city,
    province: p.province,
    school: p.school?.name || null,
    major: p.schoolEnrollments?.[0]?.program?.name || null,
    graduationYear: p.schoolEnrollments?.[0]?.graduationYear || null,
    isVerified: certCount > 0,
    certTier,
    certCount,
    isOpenToWork: p.isOpenToWork,
    skills: p.skills?.map((s: any) => s.skill?.name).filter(Boolean) || [],
    profileCompletion: p.profileCompletion || 0,
    showcaseCount: p._count?.showcaseVideos || 0,
    portfolioCount: p._count?.portfolios || 0,
    featuredPortfolio: featuredPortfolio
      ? {
          id: featuredPortfolio.id,
          title: featuredPortfolio.title,
          thumbnailUrl: featuredPortfolio.thumbnailUrl,
        }
      : null,
    featuredVideo: featured
      ? {
          id: featured.id,
          title: featured.title,
          category: featured.category,
          thumbnailUrl: featured.thumbnailUrl,
          videoUrl: featured.videoUrl,
          durationFormatted: formatDuration(featured.durationSec),
        }
      : null,
  }
}

// ============================================
// MAIN QUERY
// ============================================

export async function getPublicTalents(filters: TalentFilters = {}) {
  const {
    search,
    city,
    major,
    status = 'all',
    page = 1,
    pageSize = 9,
  } = filters

  const where: any = { isPublic: true }

  if (status === 'open_to_work') {
    where.isOpenToWork = true
  }

  if (city && city !== 'all') {
    where.city = city
  }

  if (major && major !== 'all') {
    where.schoolEnrollments = {
      some: { program: { name: major } },
    }
  }

  if (search) {
    where.OR = [
      { headline: { contains: search, mode: 'insensitive' } },
      { bio: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { user: { fullName: { contains: search, mode: 'insensitive' } } },
      { school: { name: { contains: search, mode: 'insensitive' } } },
      {
        skills: {
          some: { skill: { name: { contains: search, mode: 'insensitive' } } },
        },
      },
    ]
  }

  const [profiles, total] = await Promise.all([
    prisma.studentProfile.findMany({
      where,
      orderBy: [{ profileCompletion: 'desc' }, { updatedAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: { fullName: true, avatarUrl: true },
        },
        school: {
          select: { name: true },
        },
        schoolEnrollments: {
          include: {
            program: { select: { name: true } },
          },
          take: 1,
        },
        skills: {
          include: { skill: { select: { name: true } } },
          take: 8,
        },
        portfolios: {
          where: { isPublic: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            title: true,
            thumbnailUrl: true,
          },
        },
        showcaseVideos: {
          where: { status: 'published' },
          orderBy: { viewCount: 'desc' },
          take: 1,
          select: {
            id: true,
            title: true,
            category: true,
            thumbnailUrl: true,
            videoUrl: true,
            durationSec: true,
          },
        },
        certificates: {
          where: { verificationStatus: 'verified' },
          include: {
            institution: { select: { name: true, type: true } },
          },
          take: 5,
        },
        _count: {
          select: {
            showcaseVideos: { where: { status: 'published' } },
            portfolios: { where: { isPublic: true } },
            certificates: { where: { verificationStatus: 'verified' } },
          },
        },
      },
    }),
    prisma.studentProfile.count({ where }),
  ])

  return {
    talents: profiles.map(mapTalent),
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

export async function getPublicTalentStats() {
  const [totalTalents, verifiedTalents, openToWork, totalSkills] =
    await Promise.all([
      prisma.studentProfile.count({ where: { isPublic: true } }),
      prisma.studentProfile.count({
        where: {
          isPublic: true,
          certificates: { some: { verificationStatus: 'verified' } },
        },
      }),
      prisma.studentProfile.count({
        where: { isPublic: true, isOpenToWork: true },
      }),
      prisma.skill.count(),
    ])

  return { totalTalents, verifiedTalents, openToWork, totalSkills }
}

// ============================================
// FILTER OPTIONS
// ============================================

export async function getTalentFilterOptions() {
  const [cities, programs] = await Promise.all([
    prisma.studentProfile.findMany({
      where: { isPublic: true, city: { not: null } },
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' },
    }),
    prisma.schoolProgram.findMany({
      select: { name: true },
      distinct: ['name'],
      orderBy: { name: 'asc' },
    }),
  ])

  return {
    cities: cities.map((c) => c.city).filter((c): c is string => !!c),
    programs: programs.map((p) => p.name),
  }
}

// ============================================
// DETAIL
// ============================================

export async function getPublicTalentById(id: string) {
  const profile = await prisma.studentProfile.findFirst({
    where: { id, isPublic: true },
    include: {
      user: {
        select: { fullName: true, avatarUrl: true, email: true },
      },
      school: { select: { name: true } },
      schoolEnrollments: {
        include: { program: { select: { name: true } } },
      },
      skills: {
        include: { skill: true },
      },
      experiences: true,
      educations: true,
      achievements: true,
      portfolios: { 
        take: 6, 
        orderBy: { createdAt: 'desc' },
        include: { media: true } 
      },
      showcaseVideos: {
        where: { status: 'published' },
        orderBy: { viewCount: 'desc' },
        take: 6,
      },
      certificates: {
        where: { verificationStatus: 'verified' },
        include: {
          institution: { select: { name: true, type: true } },
        },
        take: 6,
      },
      _count: {
        select: {
          showcaseVideos: { where: { status: 'published' } },
          certificates: { where: { verificationStatus: 'verified' } },
          portfolios: true,
        },
      },
    },
  })

  if (!profile) return null

  return {
    ...mapTalent(profile),
    fullName: profile.user?.fullName || 'Anonim',
    skills: profile.skills.map(s => ({
      id: s.skillId,
      name: s.skill.name,
      category: s.skill.category,
      proficiency: s.proficiency
    })),
    achievements: profile.achievements,
    experiences: profile.experiences,
    educations: profile.educations,
    portfolios: profile.portfolios,
    certificates: profile.certificates,
    showcaseVideos: profile.showcaseVideos,
    counts: {
      showcaseVideos: profile._count.showcaseVideos,
      certificates: profile._count.certificates,
      portfolios: profile._count.portfolios,
    },
  }
}