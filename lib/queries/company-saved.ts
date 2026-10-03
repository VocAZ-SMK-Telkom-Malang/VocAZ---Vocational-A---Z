// lib/queries/company-saved.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type SavedTalentItem = {
  id: string                // savedTalent.id
  studentId: string         // studentProfile.id
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
  school: {
    id: string
    name: string
    city: string | null
  } | null
  topSkills: string[]
  certificateCount: number
  isVerified: boolean
  note: string | null
  source: string | null
  savedAt: string
  savedAtRelative: string
}

export type SavedFilters = {
  search?: string
  city?: string
  skill?: string
  openToWorkOnly?: boolean
  sortBy?: 'newest' | 'oldest' | 'name' | 'skills'
  page?: number
  pageSize?: number
}

export type SavedFilterOptions = {
  cities: string[]
  skills: { id: string; name: string }[]
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

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} minggu lalu`
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ============================================
// GET SAVED TALENTS
// ============================================

export async function getSavedTalents(
  companyId: string,
  filters: SavedFilters = {}
): Promise<{
  talents: SavedTalentItem[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
}> {
  const {
    search,
    city,
    skill,
    openToWorkOnly = false,
    sortBy = 'newest',
    page = 1,
    pageSize = 12,
  } = filters

  const where: any = {
    companyId,
    student: {
      ...(openToWorkOnly ? { isOpenToWork: true } : {}),
      ...(city && city !== 'all' ? { city } : {}),
      ...(skill && skill !== 'all'
        ? { skills: { some: { skillId: skill } } }
        : {}),
      ...(search
        ? {
            OR: [
              { user: { fullName: { contains: search, mode: 'insensitive' } } },
              { headline: { contains: search, mode: 'insensitive' } },
              { bio: { contains: search, mode: 'insensitive' } },
              { school: { name: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    },
  }

  const orderBy: any =
    sortBy === 'oldest'
      ? { createdAt: 'asc' }
      : sortBy === 'name'
      ? { student: { user: { fullName: 'asc' } } }
      : { createdAt: 'desc' }

  const [saved, total] = await Promise.all([
    prisma.savedTalent.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        student: {
          include: {
            user: {
              select: { id: true, fullName: true, avatarUrl: true },
            },
            school: {
              select: { id: true, name: true, city: true },
            },
            skills: {
              include: { skill: true },
              orderBy: { proficiency: 'desc' },
            },
            certificates: {
              where: { verificationStatus: 'verified' },
              select: { id: true },
            },
          },
        },
      },
    }),
    prisma.savedTalent.count({ where }),
  ])

  const talents: SavedTalentItem[] = saved.map((s) => ({
    id: s.id,
    studentId: s.student.id,
    userId: s.student.user.id,
    fullName: s.student.user.fullName ?? 'Siswa',
    initials: getInitials(s.student.user.fullName),
    avatarUrl: s.student.user.avatarUrl,
    coverImageUrl: s.student.coverImageUrl,
    headline: s.student.headline,
    bio: s.student.bio,
    city: s.student.city,
    province: s.student.province,
    isOpenToWork: s.student.isOpenToWork,
    followerCount: s.student.followerCount,
    school: s.student.school
      ? {
          id: s.student.school.id,
          name: s.student.school.name,
          city: s.student.school.city,
        }
      : null,
    topSkills: s.student.skills.slice(0, 4).map((sk) => sk.skill.name),
    certificateCount: s.student.certificates.length,
    isVerified: s.student.certificates.length > 0,
    note: s.note,
    source: s.source,
    savedAt: s.createdAt.toISOString(),
    savedAtRelative: relativeTime(s.createdAt),
  }))

  return {
    talents,
    pagination: {
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      totalItems: total,
      pageSize,
    },
  }
}

// ============================================
// GET SAVED FILTER OPTIONS
// ============================================

export async function getSavedFilterOptions(
  companyId: string
): Promise<SavedFilterOptions> {
  const saved = await prisma.savedTalent.findMany({
    where: { companyId },
    select: {
      student: {
        select: { city: true },
      },
    },
  })

  const cities = Array.from(
    new Set(saved.map((s) => s.student.city).filter((c): c is string => Boolean(c)))
  ).sort()

  const skills = await prisma.skill.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
    take: 100,
  })

  return { cities, skills }
}

// ============================================
// GET SAVED STATS
// ============================================

export async function getSavedStats(companyId: string) {
  const [total, openToWork, verified, thisWeek] = await Promise.all([
    prisma.savedTalent.count({ where: { companyId } }),
    prisma.savedTalent.count({
      where: { companyId, student: { isOpenToWork: true } },
    }),
    prisma.savedTalent.count({
      where: {
        companyId,
        student: {
          certificates: { some: { verificationStatus: 'verified' } },
        },
      },
    }),
    prisma.savedTalent.count({
      where: {
        companyId,
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ])

  return { total, openToWork, verified, thisWeek }
}

// ============================================
// CHECK IF SAVED
// ============================================

export async function isSavedByCompany(
  companyId: string,
  studentId: string
): Promise<boolean> {
  const saved = await prisma.savedTalent.findUnique({
    where: {
      companyId_studentId: { companyId, studentId },
    },
    select: { id: true },
  })
  return !!saved
}

// ============================================
// GET SAVED IDS (untuk batch check)
// ============================================

export async function getSavedStudentIds(
  companyId: string
): Promise<string[]> {
  const saved = await prisma.savedTalent.findMany({
    where: { companyId },
    select: { studentId: true },
  })
  return saved.map((s) => s.studentId)
}