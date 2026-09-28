// lib/showcase-public.ts
import { prisma } from '@/lib/prisma'

export type PublicShowcaseReel = {
  id: string
  title: string
  description: string | null
  videoUrl: string
  videoSource: string
  thumbnailUrl: string | null
  durationSec: number | null
  durationFormatted: string | null
  category: string | null
  skillTags: string[]
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  publishedAt: string | null
  createdAt: string
  student: {
    id: string
    name: string
    initials: string
    avatarUrl: string | null
    headline: string | null
    school: string | null
    city: string | null
    isVerified: boolean
  }
  verification: {
    type: 'bnsp' | 'industry' | 'bkk' | 'none'
    label: string | null
    detail: string | null
  }
}

export type PublicShowcaseFilters = {
  search?: string
  category?: string
  sort?: 'terbaru' | 'terpopuler' | 'views' | 'az'
  page?: number
  pageSize?: number
}

function formatDuration(sec: number | null): string | null {
  if (!sec) return null
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function mapReel(r: any): PublicShowcaseReel {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    videoUrl: r.videoUrl,
    videoSource: r.videoSource,
    thumbnailUrl: r.thumbnailUrl,
    durationSec: r.durationSec,
    durationFormatted: formatDuration(r.durationSec),
    category: r.category,
    skillTags: r.skillTags,
    viewCount: Number(r.viewCount),
    likeCount: r.likeCount,
    commentCount: r.commentCount,
    shareCount: r.shareCount,
    publishedAt: r.publishedAt?.toISOString() || null,
    createdAt: r.createdAt.toISOString(),
    student: {
      id: r.student.id,
      name: r.student.user.fullName || 'Anonim',
      initials: getInitials(r.student.user.fullName || 'A'),
      avatarUrl: r.student.user.avatarUrl,
      headline: r.student.headline,
      school: r.student.school?.name || null,
      city: r.student.school?.city || null,
      isVerified: true,
    },
    verification: {
      type: 'none',
      label: null,
      detail: null,
    },
  }
}

// ============================================
// MAIN QUERY — semua video dari DB
// ============================================

export async function getPublicShowcaseReels(
  filters: PublicShowcaseFilters = {}
) {
  const {
    search,
    category,
    sort = 'terpopuler', // DEFAULT: terpopuler
    page = 1,
    pageSize = 50, // ambil banyak sekaligus
  } = filters

  const where: any = { status: 'published' }

  if (category && category !== 'all') where.category = category

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { skillTags: { has: search } },
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
    ]
  }

  let orderBy: any
  if (sort === 'terbaru') {
    orderBy = [{ publishedAt: 'desc' }, { createdAt: 'desc' }]
  } else if (sort === 'terpopuler') {
    orderBy = [{ likeCount: 'desc' }, { viewCount: 'desc' }]
  } else if (sort === 'views') {
    orderBy = { viewCount: 'desc' }
  } else if (sort === 'az') {
    orderBy = { title: 'asc' }
  } else {
    orderBy = [{ viewCount: 'desc' }, { likeCount: 'desc' }]
  }

  const [reels, total] = await Promise.all([
    prisma.showcaseVideo.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        student: {
          include: {
            user: { select: { fullName: true, avatarUrl: true } },
            school: { select: { name: true, city: true } },
          },
        },
      },
    }),
    prisma.showcaseVideo.count({ where }),
  ])

  return {
    reels: reels.map(mapReel),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
      totalItems: total,
      pageSize,
    },
  }
}

export async function getPublicShowcaseStats() {
  const [totalReels, totalStudents, totalSchools] = await Promise.all([
    prisma.showcaseVideo.count({ where: { status: 'published' } }),
    prisma.showcaseVideo
      .findMany({
        where: { status: 'published' },
        select: { studentId: true },
        distinct: ['studentId'],
      })
      .then((r) => r.length),
    prisma.showcaseVideo
      .findMany({
        where: { status: 'published' },
        select: { student: { select: { schoolId: true } } },
      })
      .then(
        (rows) =>
          new Set(rows.map((r) => r.student.schoolId).filter(Boolean)).size
      ),
  ])

  return { totalReels, totalStudents, totalSchools }
}

export async function getPublicShowcaseCategories(): Promise<string[]> {
  const rows = await prisma.showcaseVideo.findMany({
    where: { status: 'published', category: { not: null } },
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  })
  return rows.map((r) => r.category).filter((c): c is string => !!c)
}

export async function getPublicShowcaseById(
  id: string
): Promise<PublicShowcaseReel | null> {
  const r = await prisma.showcaseVideo.findFirst({
    where: { id, status: 'published' },
    include: {
      student: {
        include: {
          user: { select: { fullName: true, avatarUrl: true } },
          school: { select: { name: true, city: true } },
        },
      },
    },
  })
  if (!r) return null
  return mapReel(r)
}

// lib/showcase-public.ts
// (tambahkan function ini di akhir)

export async function getShowcasePublicStats() {
  const [totalVideos, totalStudents, totalViews] = await Promise.all([
    prisma.showcaseVideo.count({ where: { status: 'published' } }),
    prisma.showcaseVideo
      .findMany({
        where: { status: 'published' },
        select: { studentId: true },
        distinct: ['studentId'],
      })
      .then((r) => r.length),
    prisma.showcaseVideo
      .aggregate({
        where: { status: 'published' },
        _sum: { viewCount: true },
      })
      .then((r) => Number(r._sum.viewCount || 0)),
  ])

  return { totalVideos, totalStudents, totalViews }
}