// app/student/applications/[id]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { getMyApplicationDetail } from '@/lib/queries/student-jobs'
import { ApplicationDetailClient } from './application-detail-client'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ApplicationDetailPage({ params }: Props) {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: { role: true, studentProfile: { select: { id: true } } },
  })

  if (!user || user.role !== 'student' || !user.studentProfile) {
    redirect('/onboarding')
  }

  const { id } = await params
  const application = await getMyApplicationDetail(id, user.studentProfile.id)

  if (!application) notFound()

  return <ApplicationDetailClient application={application} />
}