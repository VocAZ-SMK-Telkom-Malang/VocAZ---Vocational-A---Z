// app/school/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { getSchoolContext, getSchoolDashboardStats } from '@/lib/queries/school-dashboard'
import { prisma } from '@/lib/prisma'
import { SchoolDashboardClient } from './dashboard-client'

export const metadata = {
  title: 'Dashboard BKK — VocAZ',
}

export default async function SchoolDashboardPage() {
  const ctx = await getSchoolContext()
  if (!ctx) redirect('/auth/sign-in')

  const [stats, school, recentStudents] = await Promise.all([
    getSchoolDashboardStats(ctx.schoolId),
    prisma.school.findUnique({
      where: { id: ctx.schoolId },
      select: { name: true },
    }),
    prisma.schoolStudent.findMany({
      where: { schoolId: ctx.schoolId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        status: true,
        enrollmentYear: true,
        student: {
          select: {
            id: true,
            headline: true,
            user: {
              select: { fullName: true, avatarUrl: true },
            },
            program: false,
          },
        },
      },
    }),
  ])

  return (
    <SchoolDashboardClient
      schoolName={school?.name ?? 'Sekolah'}
      stats={stats}
      recentStudents={recentStudents as any}
    />
  )
}