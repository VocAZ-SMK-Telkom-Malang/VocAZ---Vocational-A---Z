// lib/queries/school-students.ts
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'

// ============================================
// TYPES
// ============================================

export type SchoolStudentRow = {
  id: string           // SchoolStudent link id
  studentId: string    // StudentProfile id
  fullName: string
  email: string
  avatarUrl: string | null
  nisn: string | null
  status: string
  programId: string | null
  programName: string | null
  enrollmentYear: number | null
  graduationYear: number | null
  headline: string | null
  careerReadiness: number
  profileCompletion: number
  isOpenToWork: boolean
}

export type SchoolStudentFilters = {
  search: string
  status: string
  programId?: string
  year?: number
  page: number
  pageSize: number
}

export type SchoolStudentFilterOptions = {
  programs: { id: string; name: string }[]
  years: number[]
}

export type SchoolStudentStats = {
  total: number
  active: number
  graduated: number
  dropped: number
  placed: number
}

// ============================================
// GET STUDENTS (paginated)
// ============================================

export async function getSchoolStudents(
  schoolId: string,
  filters: SchoolStudentFilters
): Promise<{
  students: SchoolStudentRow[]
  total: number
  page: number
  totalPages: number
}> {
  const where: Prisma.SchoolStudentWhereInput = {
    schoolId,
    ...(filters.status && filters.status !== 'all'
      ? { status: filters.status as 'active' | 'graduated' | 'dropped' }
      : {}),
    ...(filters.programId ? { programId: filters.programId } : {}),
    ...(filters.year ? { enrollmentYear: filters.year } : {}),
    ...(filters.search
      ? {
          student: {
            user: {
              fullName: { contains: filters.search, mode: 'insensitive' as const },
            },
          },
        }
      : {}),
  }

  const [total, rows] = await Promise.all([
    prisma.schoolStudent.count({ where }),
    prisma.schoolStudent.findMany({
      where,
      orderBy: { id: 'asc' },
      skip: (filters.page - 1) * filters.pageSize,
      take: filters.pageSize,
      include: {
        program: { select: { id: true, name: true } },
        student: {
          include: {
            user: {
              select: { fullName: true, email: true, avatarUrl: true },
            },
          },
        },
      },
    }),
  ])

  const students: SchoolStudentRow[] = rows.map((r) => ({
    id: r.id,
    studentId: r.student.id,
    fullName: r.student.user.fullName ?? 'Siswa',
    email: r.student.user.email,
    avatarUrl: r.student.user.avatarUrl ?? null,
    nisn: r.student.nisn ?? null,
    status: r.status,
    programId: r.programId ?? null,
    programName: r.program?.name ?? null,
    enrollmentYear: r.enrollmentYear ?? null,
    graduationYear: r.graduationYear ?? null,
    headline: r.student.headline ?? null,
    careerReadiness: r.student.careerReadiness,
    profileCompletion: r.student.profileCompletion,
    isOpenToWork: r.student.isOpenToWork,
  }))

  return {
    students,
    total,
    page: filters.page,
    totalPages: Math.max(1, Math.ceil(total / filters.pageSize)),
  }
}

// ============================================
// FILTER OPTIONS
// ============================================

export async function getSchoolStudentFilterOptions(
  schoolId: string
): Promise<SchoolStudentFilterOptions> {
  const [programs, yearRows] = await Promise.all([
    prisma.schoolProgram.findMany({
      where: { schoolId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.schoolStudent.findMany({
      where: { schoolId, enrollmentYear: { not: null } },
      select: { enrollmentYear: true },
      distinct: ['enrollmentYear'],
      orderBy: { enrollmentYear: 'desc' },
    }),
  ])

  return {
    programs,
    years: yearRows
      .map((r) => r.enrollmentYear)
      .filter((y): y is number => y !== null),
  }
}

// ============================================
// STATS
// ============================================

export async function getSchoolStudentStats(
  schoolId: string
): Promise<SchoolStudentStats> {
  const [total, active, graduated, dropped, placed] = await Promise.all([
    prisma.schoolStudent.count({ where: { schoolId } }),
    prisma.schoolStudent.count({ where: { schoolId, status: 'active' } }),
    prisma.schoolStudent.count({ where: { schoolId, status: 'graduated' } }),
    prisma.schoolStudent.count({ where: { schoolId, status: 'dropped' } }),
    prisma.careerMonitoring.count({ where: { schoolId, stage: 'placed' } }),
  ])

  return { total, active, graduated, dropped, placed }
}
