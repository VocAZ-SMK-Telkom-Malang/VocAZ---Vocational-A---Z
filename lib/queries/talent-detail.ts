// lib/queries/talent-detail.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// GET TALENT DETAIL BY ID
// ============================================

export async function getTalentById(studentProfileId: string) {
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },
      school: { select: { name: true, city: true } },
      educations: { orderBy: { startYear: 'desc' } },
      experiences: { orderBy: { startDate: 'desc' } },
      skills: {
        include: { skill: true },
        orderBy: [{ skill: { category: 'asc' } }, { skill: { name: 'asc' } }],
      },
      achievements: { orderBy: { dateAchieved: 'desc' } },
      portfolios: {
        include: { media: true },
        orderBy: { startDate: 'desc' },
      },
      certificates: {
        include: { institution: true },
        orderBy: { issuedDate: 'desc' },
      },
      showcaseVideos: {
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: 12,
      },
    },
  })

  if (!profile) return null

  return {
    id: profile.id,
    userId: profile.user.id,
    fullName: profile.user.fullName ?? 'Student',
    email: profile.user.email,
    avatarUrl: profile.user.avatarUrl,
    headline: profile.headline,
    bio: profile.bio,
    city: profile.city,
    province: profile.province,
    isOpenToWork: profile.isOpenToWork,
    isPublic: profile.isPublic,
    followerCount: profile.followerCount,
    followingCount: profile.followingCount,
    school: profile.school
      ? { name: profile.school.name, city: profile.school.city }
      : null,
    educations: profile.educations.map((e) => ({
      id: e.id,
      schoolName: e.schoolName,
      major: e.major,
      degree: e.degree,
      startYear: e.startYear,
      endYear: e.endYear,
      gpa: e.gpa ? Number(e.gpa) : null,
      description: e.description,
    })),
    experiences: profile.experiences.map((e) => ({
      id: e.id,
      title: e.title,
      companyName: e.companyName,
      employmentType: e.employmentType,
      location: e.location,
      startDate: e.startDate?.toISOString() ?? null,
      endDate: e.endDate?.toISOString() ?? null,
      isCurrent: e.isCurrent,
      description: e.description,
    })),
    skills: profile.skills.map((s) => ({
      id: s.id,
      name: s.skill.name,
      category: s.skill.category,
      proficiency: s.proficiency,
    })),
    achievements: profile.achievements.map((a) => ({
      id: a.id,
      title: a.title,
      issuer: a.issuer,
      level: a.level,
      dateAchieved: a.dateAchieved?.toISOString() ?? null,
      description: a.description,
      certificateUrl: a.certificateUrl,
    })),
    portfolios: profile.portfolios.map((po) => ({
      id: po.id,
      title: po.title,
      description: po.description,
      projectUrl: po.projectUrl,
      thumbnailUrl: po.thumbnailUrl,
      startDate: po.startDate?.toISOString() ?? null,
      endDate: po.endDate?.toISOString() ?? null,
      media: po.media.map((m) => ({
        id: m.id,
        url: m.url,
        type: m.mediaType,
      })),
    })),
    certificates: profile.certificates.map((c) => ({
      id: c.id,
      title: c.title,
      issuedDate: c.issuedDate?.toISOString() ?? null,
      documentUrl: c.documentUrl,
      badgeType: c.badgeType,
      verificationStatus: c.verificationStatus,
      institutionName: c.institution?.name ?? null,
    })),
    showcaseVideos: profile.showcaseVideos.map((v) => ({
      id: v.id,
      title: v.title,
      thumbnailUrl: v.thumbnailUrl,
      videoUrl: v.videoUrl,
      videoSource: v.videoSource,
      durationSec: v.durationSec,
      viewCount: Number(v.viewCount),
      likeCount: v.likeCount,
      publishedAt: v.publishedAt?.toISOString() ?? null,
    })),
  }
}

export type TalentDetail = NonNullable<Awaited<ReturnType<typeof getTalentById>>>

// ============================================
// FOLLOW STATUS
// ============================================

export async function isFollowingTalent(
  targetStudentProfileId: string
): Promise<boolean> {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) return false

    const user = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      select: { id: true },
    })

    if (!user) return false

    const existing = await prisma.studentFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetStudentProfileId,
        },
      },
      select: { id: true },
    })

    return !!existing
  } catch {
    return false
  }
}

// ============================================
// CURRENT USER CONTEXT
// ============================================

export async function getCurrentUserContext() {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) return null

    const user = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      select: {
        id: true,
        role: true,
        studentProfile: { select: { id: true } },
      },
    })

    return user
  } catch {
    return null
  }
}