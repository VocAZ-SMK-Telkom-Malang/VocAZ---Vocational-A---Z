// lib/queries/school-dashboard.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// CONTEXT (guard + schoolId)
// ============================================

export type SchoolContext = {
  userId: string
  schoolId: string
  role: 'owner' | 'admin' | 'member'
}

export async function getSchoolContext(): Promise<SchoolContext | null> {
  const session = await getServerSession()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      ownedSchool: { select: { id: true } },
      schoolMembers: {
        select: { schoolId: true, role: true },
      },
    },
  })

  if (!user || user.role !== 'school') return null

  if (user.ownedSchool) {
    return { userId: user.id, schoolId: user.ownedSchool.id, role: 'owner' }
  }

  const member = user.schoolMembers[0]
  if (!member) return null

  return {
    userId: user.id,
    schoolId: member.schoolId,
    role: member.role as 'owner' | 'admin' | 'member',
  }
}

// ============================================
// IDENTITY (untuk topbar)
// ============================================

export type SchoolIdentity = {
  schoolId: string
  schoolName: string
  schoolSlug: string
  schoolLogoUrl: string | null
  isVerified: boolean

  userId: string
  userName: string
  userEmail: string
  userAvatarUrl: string | null
  userRole: 'owner' | 'admin' | 'member'
}

export async function getSchoolIdentity(): Promise<SchoolIdentity | null> {
  const ctx = await getSchoolContext()
  if (!ctx) return null

  const [school, user] = await Promise.all([
    prisma.school.findUnique({
      where: { id: ctx.schoolId },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        isVerified: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { fullName: true, email: true, avatarUrl: true },
    }),
  ])

  if (!school || !user) return null

  return {
    schoolId: school.id,
    schoolName: school.name,
    schoolSlug: school.slug,
    schoolLogoUrl: school.logoUrl ?? null,
    isVerified: school.isVerified,

    userId: ctx.userId,
    userName: user.fullName ?? user.email,
    userEmail: user.email,
    userAvatarUrl: user.avatarUrl ?? null,
    userRole: ctx.role,
  }
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getSchoolDashboardStats(schoolId: string) {
  const [
    totalStudents,
    activeStudents,
    alumniStudents,
    totalPlacements,
    studentsThisMonth,
    partnerCount,
  ] = await Promise.all([
    prisma.schoolStudent.count({ where: { schoolId } }),
    prisma.schoolStudent.count({ where: { schoolId, status: 'active' } }),
    prisma.schoolStudent.count({ where: { schoolId, status: 'graduated' } }),
    prisma.careerMonitoring.count({
      where: { schoolId, stage: 'placed' },
    }),
    prisma.schoolStudent.count({
      where: {
        schoolId,
      },
    }),
    prisma.industryPartner.count({ where: { schoolId } }),
  ])

  return {
    totalStudents,
    activeStudents,
    alumniStudents,
    totalPlacements,
    studentsThisMonth,
    partnerCount,
  }
}