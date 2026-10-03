// app/student/applications/page.tsx
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { ApplicationsClientView } from '@/components/student/applications/applications-client-view'
import type {
  Application,
  ApplicationStatus,
} from '@/components/student/applications/types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Lamaran Saya — VocAZ',
}

// ============================================
// HELPERS
// ============================================

const EMPLOYMENT_LABEL: Record<string, string> = {
  internship: 'Internship',
  part_time: 'Part Time',
  full_time: 'Full Time',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
  contract: 'Contract',
}

const WORK_MODE_LABEL: Record<string, string> = {
  onsite: 'On-site',
  remote: 'Remote',
  hybrid: 'Hybrid',
}

function toJuta(value: bigint | null): number {
  if (!value) return 0
  return Math.round(Number(value) / 1_000_000)
}

function logoColorFromName(name: string): string {
  const colors = [
    '#DC2626', '#EA580C', '#D97706', '#059669',
    '#0891B2', '#2563EB', '#7C3AED', '#DB2777',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// ============================================
// FETCH
// ============================================

async function getApplicationsData(studentProfileId: string) {
  const apps = await prisma.application.findMany({
    where: { studentId: studentProfileId },
    orderBy: { updatedAt: 'desc' },
    include: {
      job: {
        include: {
          company: {
            select: {
              name: true,
              slug: true,
              verificationStatus: true,
            },
          },
        },
      },
      history: { orderBy: { createdAt: 'asc' } },
    },
  })

  const applications: Application[] = apps.map((a) => ({
    id: a.id,
    status: a.status as ApplicationStatus,
    jobSlug: a.job.slug,
    jobTitle: a.job.title,
    jobType: EMPLOYMENT_LABEL[a.job.employmentType] ?? a.job.employmentType,
    jobMode: WORK_MODE_LABEL[a.job.workMode] ?? a.job.workMode,
    jobLocation: a.job.city ?? a.job.location ?? 'Indonesia',
    salaryMin: toJuta(a.job.salaryMin),
    salaryMax: toJuta(a.job.salaryMax),
    companySlug: a.job.company.slug,
    companyName: a.job.company.name,
    companyVerified: a.job.company.verificationStatus === 'verified',
    companyLogoColor: logoColorFromName(a.job.company.name),
    matchScore: a.matchScore ?? 0,
    appliedAt: a.appliedAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
    nextStep: a.nextStep ?? undefined,
    interviewDate: a.interviewDate?.toISOString(),
    recruiterName: a.recruiterName ?? undefined,
    notes: a.notes ?? undefined,
    timeline: a.history.map((h) => ({
      status: h.status as ApplicationStatus,
      at: h.createdAt.toISOString(),
      note: h.notes ?? undefined,
    })),
  }))

  const stats = {
    total: applications.length,
    active: applications.filter((a) =>
      ['submitted', 'reviewed', 'shortlisted', 'interview'].includes(a.status)
    ).length,
    review: applications.filter((a) => a.status === 'reviewed').length,
    interview: applications.filter((a) => a.status === 'interview').length,
    offered: applications.filter((a) => a.status === 'offered').length,
    hired: applications.filter((a) => a.status === 'hired').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  }

  return { applications, stats }
}

// ============================================
// PAGE
// ============================================

export default async function StudentApplicationsPage() {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      role: true,
      studentProfile: { select: { id: true } },
    },
  })

  if (!user || user.role !== 'student' || !user.studentProfile) {
    redirect('/onboarding')
  }

  const { applications, stats } = await getApplicationsData(
    user.studentProfile.id
  )

  return (
    <ApplicationsClientView
      initialApplications={applications}
      initialStats={stats}
    />
  )
}