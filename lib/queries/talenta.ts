import { prisma } from '@/lib/prisma'

export type TalentFilter = {
  search?: string
  program?: string
  province?: string
  page?: number
  pageSize?: number
}

const DEFAULT_PAGE_SIZE = 9

// ============================================
// GET TALENTS (dengan filter)
// ============================================

export async function getTalents(filter: TalentFilter = {}) {
  const page = filter.page || 1
  const pageSize = filter.pageSize || DEFAULT_PAGE_SIZE

  const where: any = {
    isPublic: true,
    user: {
      deletedAt: null,
      role: 'student',
    },
  }

  // Filter by search (nama, headline, nama SMK)
  if (filter.search) {
    where.OR = [
      { user: { fullName: { contains: filter.search, mode: 'insensitive' } } },
      { headline: { contains: filter.search, mode: 'insensitive' } },
      {
        educations: {
          some: {
            schoolName: { contains: filter.search, mode: 'insensitive' },
          },
        },
      },
    ]
  }

  // Filter by program (dari educations.major)
  if (filter.program && filter.program !== 'all') {
    where.educations = {
      some: {
        major: { contains: filter.program, mode: 'insensitive' },
      },
    }
  }

  // Filter by province
  if (filter.province && filter.province !== 'all') {
    where.province = filter.province
  }

  const [students, totalCount] = await Promise.all([
    prisma.studentProfile.findMany({
      where,
      orderBy: { careerReadiness: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: { fullName: true, avatarUrl: true, email: true },
        },
        educations: {
          take: 1,
          orderBy: { startYear: 'desc' },
        },
        skills: {
          take: 3,
          include: { skill: { select: { name: true, category: true } } },
        },
        showcaseVideos: {
          where: { status: 'published' },
          take: 1,
          orderBy: { viewCount: 'desc' },
        },
        certificates: {
          where: { verificationStatus: 'verified' },
          take: 1,
        },
      },
    }),
    prisma.studentProfile.count({ where }),
  ])

  const talents = students.map((s) => {
    const fullName = s.user.fullName || 'Anonim'
    const initials = fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

    const video = s.showcaseVideos[0]

    return {
      id: s.id,
      name: fullName,
      initials,
      headline: s.headline || 'Talenta SMK',
      city: s.city,
      province: s.province,
      avatarUrl: s.user.avatarUrl,
      school: s.educations[0]?.schoolName || 'SMK',
      major: s.educations[0]?.major || '',
      graduationYear: s.educations[0]?.endYear,
      isVerified: s.certificates.length > 0,
      skills: s.skills.map((sk) => sk.skill.name),
      video: video
        ? {
            id: video.id,
            title: video.title,
            category: video.category,
            duration: video.durationSec,
            durationFormatted: video.durationSec
              ? `${String(Math.floor(video.durationSec / 60)).padStart(2, '0')}:${String(video.durationSec % 60).padStart(2, '0')}`
              : '00:00',
            thumbnailUrl: video.thumbnailUrl,
            videoUrl: video.videoUrl,
          }
        : null,
    }
  })

  return {
    talents,
    pagination: {
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
      totalItems: totalCount,
      pageSize,
    },
  }
}

// ============================================
// GET TALENT STATS
// ============================================

export async function getTalentStats() {
  const [totalTalents, totalSkills, distinctSchools] = await Promise.all([
    prisma.studentProfile.count({
      where: { isPublic: true, user: { deletedAt: null, role: 'student' } },
    }),
    prisma.skill.count(),
    prisma.studentEducation.findMany({
      select: { schoolName: true },
      distinct: ['schoolName'],
    }),
  ])

  return {
    totalTalents,
    totalSkills,
    totalSchools: distinctSchools.length,
  }
}

// ============================================
// GET TALENT BY ID (detail)
// ============================================

export async function getTalentById(id: string) {
  const student = await prisma.studentProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
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
          logoUrl: true,
        },
      },
      educations: {
        orderBy: { startYear: 'desc' },
      },
      experiences: {
        orderBy: { startDate: 'desc' },
      },
      skills: {
        include: {
          skill: { select: { name: true, category: true } },
        },
      },
      achievements: {
        orderBy: { dateAchieved: 'desc' },
      },
      portfolios: {
        where: { isPublic: true },
        orderBy: { createdAt: 'desc' },
        include: { media: true },
      },
      showcaseVideos: {
        where: { status: 'published' },
        orderBy: { viewCount: 'desc' },
      },
      certificates: {
        where: { verificationStatus: 'verified' },
        include: {
          institution: {
            select: { name: true, type: true, logoUrl: true },
          },
        },
      },
    },
  })

  if (!student) return null

  return {
    id: student.id,
    name: student.user.fullName || 'Anonim',
    email: student.user.email,
    phone: student.user.phone,
    avatarUrl: student.user.avatarUrl,
    initials: (student.user.fullName || 'A')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
    headline: student.headline || 'Talenta SMK',
    bio: student.bio,
    city: student.city,
    province: student.province,
    gender: student.gender,
    dateOfBirth: student.dateOfBirth,
    profileCompletion: student.profileCompletion,
    careerReadiness: student.careerReadiness,
    isOpenToWork: student.isOpenToWork,
    school: student.school,
    educations: student.educations,
    experiences: student.experiences,
    skills: student.skills.map((s) => ({
      id: s.id,
      name: s.skill.name,
      category: s.skill.category,
      proficiency: s.proficiency,
    })),
    achievements: student.achievements,
    portfolios: student.portfolios.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      projectUrl: p.projectUrl,
      thumbnailUrl: p.thumbnailUrl,
      startDate: p.startDate,
      endDate: p.endDate,
      media: p.media,
    })),
    showcaseVideos: student.showcaseVideos.map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      videoUrl: v.videoUrl,
      thumbnailUrl: v.thumbnailUrl,
      durationSec: v.durationSec,
      category: v.category,
      skillTags: v.skillTags,
      viewCount: Number(v.viewCount),
      publishedAt: v.publishedAt,
    })),
    certificates: student.certificates.map((c) => ({
      id: c.id,
      title: c.title,
      certificateNumber: c.certificateNumber,
      issuedDate: c.issuedDate,
      badgeType: c.badgeType,
      institution: c.institution,
    })),
  }
}