// lib/queries/talents.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// TYPES
// ============================================

export type TalentListItem = {
  id: string
  userId: string
  fullName: string
  email: string
  avatarUrl: string | null
  coverImageUrl: string | null       // ← TAMBAH INI
  headline: string | null
  bio: string | null
  city: string | null
  province: string | null
  isOpenToWork: boolean
  followerCount: number
  followingCount: number
  schoolName: string | null
  schoolCity: string | null
  schoolYear: number | null
  skills: {
    id: string
    name: string
    category: string | null
    proficiency: string
  }[]
  topSkills: string[]
  portfolioCount: number
  certificateCount: number
  verifiedCertCount: number
  showcaseCount: number
  achievementCount: number
  isFollowing: boolean
  hasVerifiedCert: boolean
  bestVideo: {
    id: string
    title: string
    thumbnailUrl: string | null
    videoUrl: string
    videoSource: string
  } | null
  bestProject: {
    id: string
    title: string
    thumbnailUrl: string | null
  } | null
}

// ============================================
// GET TALENTS
// ============================================

export async function getTalents(): Promise<TalentListItem[]> {
  const session = await getServerSession()
  let currentUserId: string | null = null
  let currentStudentProfileId: string | null = null

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      include: { studentProfile: { select: { id: true } } },
    })
    currentUserId = user?.id ?? null
    currentStudentProfileId = user?.studentProfile?.id ?? null
  }

  const talents = await prisma.studentProfile.findMany({
    where: {
      isPublic: true,
      ...(currentStudentProfileId && { id: { not: currentStudentProfileId } }),
    },
    orderBy: [{ updatedAt: 'desc' }],
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },
      // coverImageUrl udah ada di field StudentProfile langsung, ga perlu include
      school: {
        select: { name: true, city: true },
      },
      educations: {
        orderBy: { startYear: 'desc' },
        take: 1,
        select: { endYear: true },
      },
      skills: {
        include: { skill: true },
        orderBy: [{ skill: { category: 'asc' } }, { skill: { name: 'asc' } }],
      },
      certificates: {
        where: { verificationStatus: 'verified' },
        select: { id: true },
      },
      showcaseVideos: {
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: 1,
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
          videoUrl: true,
          videoSource: true,
        },
      },
      portfolios: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          id: true,
          title: true,
          thumbnailUrl: true,
        },
      },
      _count: {
        select: {
          portfolios: true,
          certificates: true,
          showcaseVideos: true,
          achievements: true,
        },
      },
    },
    take: 100,
  })

  let followingIds: string[] = []
  if (currentUserId) {
    const follows = await prisma.studentFollow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    })
    followingIds = follows.map((f) => f.followingId)
  }

  return talents.map((t) => ({
    id: t.id,
    userId: t.user.id,
    fullName: t.user.fullName ?? 'Student',
    email: t.user.email,
    avatarUrl: t.user.avatarUrl,
    coverImageUrl: t.coverImageUrl,       // ← TAMBAH INI
    headline: t.headline,
    bio: t.bio,
    city: t.city,
    province: t.province,
    isOpenToWork: t.isOpenToWork,
    followerCount: t.followerCount,
    followingCount: t.followingCount,
    schoolName: t.school?.name ?? null,
    schoolCity: t.school?.city ?? null,
    schoolYear: t.educations[0]?.endYear ?? null,
    skills: t.skills.map((s) => ({
      id: s.id,
      name: s.skill.name,
      category: s.skill.category,
      proficiency: s.proficiency,
    })),
    topSkills: t.skills.slice(0, 5).map((s) => s.skill.name),
    portfolioCount: t._count.portfolios,
    certificateCount: t._count.certificates,
    verifiedCertCount: t.certificates.length,
    showcaseCount: t._count.showcaseVideos,
    achievementCount: t._count.achievements,
    isFollowing: followingIds.includes(t.id),
    hasVerifiedCert: t.certificates.length > 0,
    bestVideo: t.showcaseVideos[0]
      ? {
          id: t.showcaseVideos[0].id,
          title: t.showcaseVideos[0].title,
          thumbnailUrl: t.showcaseVideos[0].thumbnailUrl,
          videoUrl: t.showcaseVideos[0].videoUrl,
          videoSource: t.showcaseVideos[0].videoSource,
        }
      : null,
    bestProject: t.portfolios[0]
      ? {
          id: t.portfolios[0].id,
          title: t.portfolios[0].title,
          thumbnailUrl: t.portfolios[0].thumbnailUrl,
        }
      : null,
  }))
}

export type TalentItem = Awaited<ReturnType<typeof getTalents>>[number]

// ============================================
// GET FILTER OPTIONS
// ============================================

export async function getTalentFilterOptions() {
  const skills = await prisma.skill.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, category: true },
  })

  const cities = await prisma.studentProfile.findMany({
    where: { city: { not: null }, isPublic: true },
    select: { city: true },
    distinct: ['city'],
  })

  const schools = await prisma.school.findMany({
    select: { id: true, name: true, city: true },
    orderBy: { name: 'asc' },
  })

  return {
    skills,
    cities: cities.map((c) => c.city!).filter(Boolean),
    schools,
  }
}

export type FilterOptions = Awaited<ReturnType<typeof getTalentFilterOptions>>