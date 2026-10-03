// app/company/talent/[studentId]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import {
  getStudentProfileDetail,
  getViewerContext,
} from '@/lib/queries/student-profile-detail'
import { TalentDetailClient } from './talent-detail-client'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ studentId: string }>
}

export async function generateMetadata({ params }: Props) {
  const { studentId } = await params
  const profile = await getStudentProfileDetail(studentId)
  return {
    title: profile ? `${profile.fullName} — VocAZ` : 'Talenta — VocAZ',
  }
}

export default async function TalentDetailPage({ params }: Props) {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const { studentId } = await params

  const [profile, viewer, jobs, invitation, application] = await Promise.all([
    getStudentProfileDetail(studentId),
    getViewerContext(studentId),
    prisma.job.findMany({
      where: {
        companyId: ctx.companyId,
        status: 'active',
        deletedAt: null,
      },
      select: { id: true, title: true },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.talentInvitation.findFirst({
      where: {
        studentId,
        job: { companyId: ctx.companyId },
      },
      orderBy: { createdAt: 'desc' },
      include: { job: { select: { title: true } } },
    }),
    prisma.application.findFirst({
      where: {
        studentId,
        job: { companyId: ctx.companyId },
      },
      orderBy: { appliedAt: 'desc' },
      include: { job: { select: { title: true } } },
    }),
  ])

  if (!profile) notFound()

  return (
    <TalentDetailClient
      profile={profile}
      viewer={viewer}
      jobs={jobs}
      hasBeenInvited={!!invitation}
      hasApplied={!!application}
      applicationJobTitle={application?.job.title}
      invitedJobTitle={invitation?.job.title}
    />
  )
}