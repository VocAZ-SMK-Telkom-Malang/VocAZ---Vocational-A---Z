// lib/queries/student-profile-detail.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// TYPES
// ============================================

export type ViewerRole = 'guest' | 'student' | 'company' | 'school' | 'admin'

export type ViewerContext = {
  userId: string | null
  role: ViewerRole
  isOwner: boolean
  studentProfileId: string | null
}

export type StudentProfileDetail = NonNullable<
  Awaited<ReturnType<typeof getStudentProfileDetail>>
>

// ============================================
// GET STUDENT PROFILE DETAIL
// ============================================

export async function getStudentProfileDetail(studentProfileId: string) {
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
          phone: true,
        },
      },
      school: {
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          province: true,
        },
      },
      educations: { orderBy: { startYear: 'desc' } },
      experiences: { orderBy: { startDate: 'desc' } },
      skills: {
        include: { skill: true },
        orderBy: [{ skill: { category: 'asc' } }, { skill: { name: 'asc' } }],
      },
      achievements: { orderBy: { dateAchieved: 'desc' } },
      portfolios: {
        include: { media: { orderBy: { sortOrder: 'asc' } } },
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
    // Basic
    id: profile.id,
    userId: profile.user.id,
    fullName: profile.user.fullName ?? 'Student',
    email: profile.user.email,
    phone: profile.user.phone,
    avatarUrl: profile.user.avatarUrl,
    headline: profile.headline,
    bio: profile.bio,
    city: profile.city,
    province: profile.province,
    dateOfBirth: profile.dateOfBirth?.toISOString() ?? null,
    gender: profile.gender,

    // Meta
    isOpenToWork: profile.isOpenToWork,
    isPublic: profile.isPublic,
    profileCompletion: profile.profileCompletion,
    careerReadiness: profile.careerReadiness,
    followerCount: profile.followerCount,
    followingCount: profile.followingCount,
    coverImageUrl: profile.coverImageUrl,

    // School
    school: profile.school,

    // Relations
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
      certificateNumber: c.certificateNumber,
      issuedDate: c.issuedDate?.toISOString() ?? null,
      expiredDate: c.expiredDate?.toISOString() ?? null,
      documentUrl: c.documentUrl,
      badgeType: c.badgeType,
      verificationStatus: c.verificationStatus,
      verifiedAt: c.verifiedAt?.toISOString() ?? null,
      institutionName: c.institution?.name ?? null,
      institutionSlug: c.institution?.slug ?? null,
    })),
    showcaseVideos: profile.showcaseVideos.map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      thumbnailUrl: v.thumbnailUrl,
      videoUrl: v.videoUrl,
      videoSource: v.videoSource,
      durationSec: v.durationSec,
      viewCount: Number(v.viewCount),
      likeCount: v.likeCount,
      commentCount: v.commentCount,
      skillTags: v.skillTags,
      category: v.category,
      publishedAt: v.publishedAt?.toISOString() ?? null,
    })),
  }
}

// ============================================
// GET VIEWER CONTEXT
// ============================================

export async function getViewerContext(
  targetStudentProfileId: string
): Promise<ViewerContext> {
  const session = await getServerSession()
  if (!session?.user?.id) {
    return {
      userId: null,
      role: 'guest',
      isOwner: false,
      studentProfileId: null,
    }
  }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      studentProfile: { select: { id: true } },
    },
  })

  if (!user) {
    return {
      userId: null,
      role: 'guest',
      isOwner: false,
      studentProfileId: null,
    }
  }

  const roleMap: Record<string, ViewerRole> = {
    student: 'student',
    company: 'company',
    school: 'school',
    admin: 'admin',
    certification: 'guest',
  }

  return {
    userId: user.id,
    role: roleMap[user.role] ?? 'guest',
    isOwner: user.studentProfile?.id === targetStudentProfileId,
    studentProfileId: user.studentProfile?.id ?? null,
  }
}

// ============================================
// FOLLOW STATUS
// ============================================

export async function isFollowingTalent(
  targetStudentProfileId: string
): Promise<boolean> {
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
}

// ============================================
// PROFILE STATS
// ============================================

export async function getStudentProfileStats(studentProfileId: string) {
  const [
    applicationsCount,
    savedJobsCount,
    feedbackCount,
    avgRating,
  ] = await Promise.all([
    prisma.application.count({ where: { studentId: studentProfileId } }),
    prisma.savedJob.count({ where: { studentId: studentProfileId } }),
    prisma.profileFeedback.count({
      where: { studentProfileId, isPublic: true },
    }),
    prisma.profileFeedback.aggregate({
      where: { studentProfileId, isPublic: true },
      _avg: { rating: true },
    }),
  ])

  return {
    applicationsCount,
    savedJobsCount,
    feedbackCount,
    avgRating: avgRating._avg.rating
      ? Math.round(avgRating._avg.rating * 10) / 10
      : null,
  }
}

// ============================================
// GET FEEDBACKS
// ============================================

export async function getProfileFeedbacks(studentProfileId: string) {
  const feedbacks = await prisma.profileFeedback.findMany({
    where: { studentProfileId, isPublic: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      giver: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          role: true,
          ownedCompany: { select: { name: true } },
        },
      },
    },
  })

  return feedbacks.map((f) => ({
    id: f.id,
    rating: f.rating,
    message: f.message,
    relationship: f.relationship,
    isVerified: f.isVerified,
    createdAt: f.createdAt.toISOString(),
    giver: {
      id: f.giver.id,
      fullName: f.giver.fullName ?? 'User',
      avatarUrl: f.giver.avatarUrl,
      role: f.giver.role,
      companyName: f.giver.ownedCompany?.name ?? null,
    },
  }))
}