// lib/student/queries.ts
import { prisma } from '@/lib/prisma'

// ============================================
// GET CURRENT STUDENT
// ============================================

export async function getCurrentStudent(neonAuthUserId: string) {
  return prisma.user.findUnique({
    where: { neonAuthUserId },
    include: {
      studentProfile: {
        include: {
          school: true,
          skills: {
            include: { skill: true },
            take: 10,
          },
        },
      },
    },
  })
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getStudentDashboardStats(studentProfileId: string) {
  const [
    activeApplications,
    savedJobs,
    showcaseVideos,
    certificates,
  ] = await Promise.all([
    prisma.application.count({
      where: {
        studentId: studentProfileId,
        status: {
          in: ['submitted', 'reviewed', 'shortlisted', 'interview', 'offered'],
        },
      },
    }),
    prisma.savedJob.count({
      where: { studentId: studentProfileId },
    }),
    prisma.showcaseVideo.count({
      where: { studentId: studentProfileId, status: 'published' },
    }),
    prisma.certificate.count({
      where: { studentId: studentProfileId },
    }),
  ])

  return {
    activeApplications,
    savedJobs,
    showcaseVideos,
    certificates,
  }
}

// ============================================
// RECOMMENDED JOBS
// ============================================

export async function getRecommendedJobs(
  studentProfileId: string,
  limit = 6
) {
  // Ambil skill IDs user
  const userSkills = await prisma.studentSkill.findMany({
    where: { studentId: studentProfileId },
    select: { skillId: true },
  })
  const skillIds = userSkills.map((s) => s.skillId)

  // Cari job yang match minimal 1 skill, status active
  const jobs = await prisma.job.findMany({
    where: {
      status: 'active',
      deletedAt: null,
      ...(skillIds.length > 0
        ? {
            skills: {
              some: { skillId: { in: skillIds } },
            },
          }
        : {}),
    },
    take: limit,
    orderBy: { publishedAt: 'desc' },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          city: true,
          province: true,
          verificationStatus: true,
        },
      },
      skills: {
        include: { skill: true },
      },
      _count: {
        select: { applications: true },
      },
    },
  })

  return jobs
}

// ============================================
// RECENT APPLICATIONS
// ============================================

export async function getRecentApplications(
  studentProfileId: string,
  limit = 5
) {
  return prisma.application.findMany({
    where: { studentId: studentProfileId },
    take: limit,
    orderBy: { appliedAt: 'desc' },
    include: {
      job: {
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
            },
          },
        },
      },
    },
  })
}

// ============================================
// RECENT NOTIFICATIONS
// ============================================

export async function getRecentNotifications(userId: string, limit = 5) {
  return prisma.notification.findMany({
    where: { userId },
    take: limit,
    orderBy: { createdAt: 'desc' },
  })
}

// ============================================
// PROFILE COMPLETION CHECKLIST
// ============================================

export async function getProfileChecklist(studentProfileId: string) {
  const profile = await prisma.studentProfile.findUnique({
    where: { id: studentProfileId },
    include: {
      skills: { take: 1 },
      educations: { take: 1 },
      experiences: { take: 1 },
      portfolios: { take: 1 },
      showcaseVideos: { take: 1 },
      certificates: { take: 1 },
    },
  })

  if (!profile) return []

  return [
    {
      label: 'Informasi personal',
      description: 'Nama, tanggal lahir, kontak',
      completed: !!(profile.headline && profile.bio),
      href: '/student/profile/personal',
    },
    {
      label: 'Pendidikan',
      description: 'Riwayat sekolah & jurusan',
      completed: profile.educations.length > 0 || !!profile.schoolId,
      href: '/student/profile/experience',
    },
    {
      label: 'Skills',
      description: 'Minimal 3 skill',
      completed: profile.skills.length >= 3,
      href: '/student/profile/skills',
    },
    {
      label: 'Pengalaman',
      description: 'PKL, magang, atau kerja',
      completed: profile.experiences.length > 0,
      href: '/student/profile/experience',
    },
    {
      label: 'Portfolio',
      description: 'Minimal 1 project',
      completed: profile.portfolios.length > 0,
      href: '/student/profile/portfolio',
    },
    {
      label: 'Video Showcase',
      description: 'Minimal 1 video',
      completed: profile.showcaseVideos.length > 0,
      href: '/student/showcase/my',
    },
    {
      label: 'Sertifikat',
      description: 'Minimal 1 sertifikat',
      completed: profile.certificates.length > 0,
      href: '/student/profile/certifications',
    },
  ]
}


// Tambahkan di lib/student/queries.ts

// ============================================
// JOBS LIST (Explore)
// ============================================

export type JobFilter = {
  search?: string
  city?: string
  employmentType?: string
  workMode?: string
  page?: number
  pageSize?: number
}

export async function getJobs(filter: JobFilter = {}) {
  const page = filter.page || 1
  const pageSize = filter.pageSize || 12
  const skip = (page - 1) * pageSize

  // Build where clause
  const where: any = {
    status: 'active',
    deletedAt: null,
  }

  if (filter.search) {
    where.OR = [
      { title: { contains: filter.search, mode: 'insensitive' } },
      { description: { contains: filter.search, mode: 'insensitive' } },
      {
        company: {
          name: { contains: filter.search, mode: 'insensitive' },
        },
      },
    ]
  }

  if (filter.city && filter.city !== 'all') {
    where.city = filter.city
  }

  if (filter.employmentType && filter.employmentType !== 'all') {
    where.employmentType = filter.employmentType
  }

  if (filter.workMode && filter.workMode !== 'all') {
    where.workMode = filter.workMode
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            city: true,
            province: true,
            verificationStatus: true,
          },
        },
        skills: {
          include: { skill: true },
          take: 5,
        },
        _count: {
          select: { applications: true },
        },
      },
    }),
    prisma.job.count({ where }),
  ])

  return {
    jobs,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

// ============================================
// FILTER OPTIONS (untuk dropdown)
// ============================================

export async function getJobFilterOptions() {
  const [cities, companies] = await Promise.all([
    prisma.job.findMany({
      where: { status: 'active', deletedAt: null, city: { not: null } },
      select: { city: true },
      distinct: ['city'],
      orderBy: { city: 'asc' },
    }),
    prisma.company.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
      take: 50,
    }),
  ])

  return {
    cities: cities
      .map((c) => c.city)
      .filter((c): c is string => c !== null),
    companies,
  }
}

// ============================================
// JOB DETAIL BY SLUG
// ============================================

export async function getJobBySlug(slug: string, studentProfileId?: string) {
  const job = await prisma.job.findUnique({
    where: { slug },
    include: {
      company: {
        include: {
          _count: {
            select: { jobs: true },
          },
        },
      },
      skills: {
        include: { skill: true },
      },
      _count: {
        select: { applications: true },
      },
    },
  })

  if (!job || job.status !== 'active' || job.deletedAt) {
    return null
  }

  // Cek sudah lamar?
  let hasApplied = false
  let application: { id: string; status: string } | null = null
  if (studentProfileId) {
    const app = await prisma.application.findUnique({
      where: {
        jobId_studentId: {
          jobId: job.id,
          studentId: studentProfileId,
        },
      },
      select: { id: true, status: true },
    })
    if (app) {
      hasApplied = true
      application = app
    }
  }

  // Cek sudah simpan?
  let hasSaved = false
  if (studentProfileId) {
    const saved = await prisma.savedJob.findUnique({
      where: {
        studentId_jobId: {
          studentId: studentProfileId,
          jobId: job.id,
        },
      },
      select: { id: true },
    })
    hasSaved = !!saved
  }

  return {
    ...job,
    hasApplied,
    application,
    hasSaved,
  }
}

// ============================================
// SIMILAR JOBS
// ============================================

export async function getSimilarJobs(
  jobId: string,
  companyId: string,
  skillIds: string[],
  limit = 4
) {
  return prisma.job.findMany({
    where: {
      id: { not: jobId },
      status: 'active',
      deletedAt: null,
      OR: [
        { companyId },
        ...(skillIds.length > 0
          ? [
              {
                skills: {
                  some: { skillId: { in: skillIds } },
                },
              },
            ]
          : []),
      ],
    },
    take: limit,
    orderBy: { publishedAt: 'desc' },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          city: true,
          verificationStatus: true,
        },
      },
      skills: {
        include: { skill: true },
        take: 3,
      },
      _count: {
        select: { applications: true },
      },
    },
  })
}

// ============================================
// CURRENT STUDENT PROFILE ID
// ============================================

export async function getCurrentStudentProfileId(
  neonAuthUserId: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { neonAuthUserId },
    select: { studentProfile: { select: { id: true } } },
  })
  return user?.studentProfile?.id || null
}


// ============================================
// SHOWCASE — MY VIDEOS
// ============================================

export async function getMyShowcaseVideos(studentProfileId: string) {
  return prisma.showcaseVideo.findMany({
    where: { studentId: studentProfileId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getShowcaseVideoById(
  videoId: string,
  studentProfileId: string
) {
  return prisma.showcaseVideo.findFirst({
    where: { id: videoId, studentId: studentProfileId },
  })
}

export async function getMyShowcaseCount(studentProfileId: string) {
  const [total, published, drafts] = await Promise.all([
    prisma.showcaseVideo.count({ where: { studentId: studentProfileId } }),
    prisma.showcaseVideo.count({
      where: { studentId: studentProfileId, status: 'published' },
    }),
    prisma.showcaseVideo.count({
      where: { studentId: studentProfileId, status: 'draft' },
    }),
  ])
  return { total, published, drafts }
}

// ============================================
// SHOWCASE — EXPLORE (public)
// ============================================

export async function getExploreVideos(limit = 12) {
  return prisma.showcaseVideo.findMany({
    where: { status: 'published' },
    take: limit,
    orderBy: { publishedAt: 'desc' },
    include: {
      student: {
        include: {
          user: { select: { fullName: true, avatarUrl: true } },
          school: { select: { name: true } },
        },
      },
    },
  })
}

// ============================================
// SHOWCASE FEED (publik — semua student)
// ============================================

// ============================================
// SHOWCASE FEED (dengan filter lengkap)
// ============================================

type ShowcaseFeedOptions = {
  page?: number
  limit?: number
  excludeStudentId?: string
  search?: string
  category?: string
  sort?: 'terbaru' | 'terpopuler' | 'trending' | 'views'
}

export async function getShowcaseFeed(options: ShowcaseFeedOptions = {}) {
  const limit = options.limit || 5
  const page = options.page || 1
  const skip = (page - 1) * limit

  const where: any = { status: 'published' }

  if (options.excludeStudentId) {
    where.studentId = { not: options.excludeStudentId }
  }

  if (options.category && options.category !== 'all') {
    where.category = options.category
  }

  if (options.search) {
    const q = options.search.trim()
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { skillTags: { has: q } },
      {
        student: {
          user: {
            OR: [
              { fullName: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
            ],
          },
        },
      },
    ]
  }

  // Sort
  let orderBy: any[] = [{ publishedAt: 'desc' }, { createdAt: 'desc' }]
  if (options.sort === 'terpopuler') {
    orderBy = [{ likeCount: 'desc' }, { publishedAt: 'desc' }]
  } else if (options.sort === 'views') {
    orderBy = [{ viewCount: 'desc' }, { publishedAt: 'desc' }]
  } else if (options.sort === 'trending') {
    orderBy = [
      { shareCount: 'desc' },
      { likeCount: 'desc' },
      { publishedAt: 'desc' },
    ]
  }

  const [videos, total] = await Promise.all([
    prisma.showcaseVideo.findMany({
      where,
      skip,
      take: limit,
      orderBy,
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
              select: { name: true },
            },
          },
        },
      },
    }),
    prisma.showcaseVideo.count({ where }),
  ])

  const mapped = videos.map((v) => ({
    id: v.id,
    title: v.title,
    description: v.description,
    videoUrl: v.videoUrl,
    videoSource: v.videoSource,
    thumbnailUrl: v.thumbnailUrl,
    skillTags: v.skillTags,
    category: v.category,
    likeCount: v.likeCount,
    commentCount: v.commentCount,
    shareCount: v.shareCount,
    viewCount: Number(v.viewCount),
    durationSec: v.durationSec,
    publishedAt: v.publishedAt,
    createdAt: v.createdAt,
    student: {
      id: v.student.id,
      userId: v.student.user.id,
      fullName: v.student.user.fullName ?? 'Student',
      avatarUrl: v.student.user.avatarUrl,
      schoolName: v.student.school?.name ?? null,
      headline: v.student.headline,
    },
  }))

  return {
    videos: mapped,
    hasMore: skip + videos.length < total,
    total,
    page,
  }
}
// ============================================
// SHOWCASE DETAIL
// ============================================

export async function getShowcaseDetail(
  videoId: string,
  currentUserId?: string
) {
  const video = await prisma.showcaseVideo.findFirst({
    where: { id: videoId, status: 'published' },
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
            select: { id: true, name: true },
          },
        },
      },
    },
  })

  if (!video) return null

  // Cek status like (kalau user login)
  let isLiked = false
  if (currentUserId) {
    const existingLike = await prisma.showcaseLike.findUnique({
      where: {
        videoId_userId: { videoId, userId: currentUserId },
      },
      select: { id: true },
    })
    isLiked = !!existingLike
  }

  // Cek status follow
  let isFollowing = false
  if (currentUserId) {
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { studentProfile: { select: { id: true } } },
    })

    if (
      currentUser?.studentProfile &&
      currentUser.studentProfile.id !== video.studentId
    ) {
      const existingFollow = await prisma.studentFollow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: video.studentId,
          },
        },
        select: { id: true },
      })
      isFollowing = !!existingFollow
    }
  }

  return {
    ...video,
    isLiked,
    isFollowing,
  }
}

// ============================================
// SHOWCASE COMMENTS
// ============================================

type CommentOptions = {
  cursor?: string
  limit?: number
}

export async function getVideoComments(
  videoId: string,
  options: CommentOptions = {}
) {
  const limit = options.limit || 20

  const where: any = { videoId }

  if (options.cursor) {
    where.id = { lt: options.cursor }
  }

  const comments = await prisma.showcaseComment.findMany({
    where,
    take: limit + 1,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          role: true,
        },
      },
    },
  })

  const hasMore = comments.length > limit
  const items = hasMore ? comments.slice(0, limit) : comments
  const nextCursor = hasMore ? items[items.length - 1]?.id : null

  return {
    comments: items,
    nextCursor,
    hasMore,
  }
}

export async function getVideoCommentCount(videoId: string) {
  return prisma.showcaseComment.count({ where: { videoId } })
}

// ============================================
// CHECK LIKE / FOLLOW (helper)
// ============================================

export async function checkUserLikedVideo(
  videoId: string,
  userId: string
): Promise<boolean> {
  const existing = await prisma.showcaseLike.findUnique({
    where: { videoId_userId: { videoId, userId } },
    select: { id: true },
  })
  return !!existing
}

export async function checkUserFollowsStudent(
  followerUserId: string,
  targetStudentProfileId: string
): Promise<boolean> {
  const existing = await prisma.studentFollow.findUnique({
    where: {
      followerId_followingId: {
        followerId: followerUserId,
        followingId: targetStudentProfileId,
      },
    },
    select: { id: true },
  })
  return !!existing
}

// ============================================
// USER CONTEXT (untuk feed)
// ============================================

export async function getCurrentUserContext(neonAuthUserId: string) {
  const user = await prisma.user.findUnique({
    where: { neonAuthUserId },
    select: {
      id: true,
      role: true,
      fullName: true,
      avatarUrl: true,
      studentProfile: {
        select: { id: true },
      },
    },
  })
  return user
}