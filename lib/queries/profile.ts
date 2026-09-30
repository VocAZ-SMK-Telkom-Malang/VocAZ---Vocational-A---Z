// lib/queries/profile.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// AMBIL PROFILE DARI SESSION USER (PER-USER)
// ============================================

export async function getCurrentStudentProfile() {
  const session = await getServerSession()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: {
      studentProfile: {
        include: {
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
            take: 6,
          },
        },
      },
    },
  })

  if (!user?.studentProfile) return null

  const p = user.studentProfile

  return {
    // User
    userId: user.id,
    email: user.email,
    fullName: user.fullName ?? p.headline ?? 'Student',
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    avatarKey: user.avatarKey,

    // Profile
    id: p.id,
    nisn: p.nisn,
    headline: p.headline,
    bio: p.bio,
    dateOfBirth: p.dateOfBirth?.toISOString() ?? null,
    gender: p.gender,
    address: p.address,
    city: p.city,
    province: p.province,
    coverImageUrl: p.coverImageUrl,
    coverImageKey: p.coverImageKey,
    isOpenToWork: p.isOpenToWork,
    isPublic: p.isPublic,
    profileCompletion: p.profileCompletion,
    careerReadiness: p.careerReadiness,
    followerCount: p.followerCount,
    followingCount: p.followingCount,

    // School
    school: p.school ? { name: p.school.name, city: p.school.city } : null,

    // Educations
    educations: p.educations.map((e) => ({
      id: e.id,
      schoolName: e.schoolName,
      major: e.major,
      degree: e.degree,
      startYear: e.startYear,
      endYear: e.endYear,
      gpa: e.gpa ? Number(e.gpa) : null,
      description: e.description,
    })),

    // Experiences
    experiences: p.experiences.map((e) => ({
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

    // Skills
    skills: p.skills.map((s) => ({
      id: s.id,
      skillId: s.skill.id,
      name: s.skill.name,
      category: s.skill.category,
      proficiency: s.proficiency,
    })),

    // Achievements
    achievements: p.achievements.map((a) => ({
      id: a.id,
      title: a.title,
      issuer: a.issuer,
      level: a.level,
      dateAchieved: a.dateAchieved?.toISOString() ?? null,
      description: a.description,
      certificateUrl: a.certificateUrl,
      certificateKey: a.certificateKey,
    })),

    // Portfolios
    portfolios: p.portfolios.map((po) => ({
      id: po.id,
      title: po.title,
      description: po.description,
      projectUrl: po.projectUrl,
      thumbnailUrl: po.thumbnailUrl,
      thumbnailKey: po.thumbnailKey,
      startDate: po.startDate?.toISOString() ?? null,
      endDate: po.endDate?.toISOString() ?? null,
      media: po.media.map((m) => ({
        id: m.id,
        url: m.url,
        key: m.key,
        type: m.mediaType,
      })),
    })),

    // Certificates
    certificates: p.certificates.map((c) => ({
      id: c.id,
      title: c.title,
      certificateNumber: c.certificateNumber,
      issuedDate: c.issuedDate?.toISOString() ?? null,
      expiredDate: c.expiredDate?.toISOString() ?? null,
      documentUrl: c.documentUrl,
      documentKey: c.documentKey,
      badgeType: c.badgeType,
      verificationStatus: c.verificationStatus,
      verifiedAt: c.verifiedAt?.toISOString() ?? null,
      institution: c.institution
        ? { id: c.institution.id, name: c.institution.name, type: c.institution.type }
        : null,
    })),

    // Showcase
    showcaseVideos: p.showcaseVideos.map((v) => ({
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

export type CurrentStudentProfile = NonNullable<
  Awaited<ReturnType<typeof getCurrentStudentProfile>>
>

// ============================================
// STATS
// ============================================

export async function getProfileStats() {
  const profile = await getCurrentStudentProfile()
  if (!profile) return null

  return {
    skills: profile.skills.length,
    experiences: profile.experiences.length,
    educations: profile.educations.length,
    certificates: profile.certificates.length,
    verifiedCertificates: profile.certificates.filter(
      (c) => c.verificationStatus === 'verified'
    ).length,
    portfolios: profile.portfolios.length,
    showcases: profile.showcaseVideos.length,
    achievements: profile.achievements.length,
  }
}