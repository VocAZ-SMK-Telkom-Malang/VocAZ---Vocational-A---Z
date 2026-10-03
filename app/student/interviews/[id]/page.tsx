// app/student/interviews/[id]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { AiInterviewClient } from './ai-interview-client'

type Props = {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function StudentAiInterviewPage({ params }: Props) {
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

  const { id } = await params

  const interview = await prisma.aiInterview.findUnique({
    where: { id },
    include: {
      application: {
        select: {
          id: true,
          studentId: true,
          job: {
            select: {
              title: true,
              company: { select: { name: true } },
            },
          },
        },
      },
      answers: {
        orderBy: { questionIndex: 'asc' },
      },
    },
  })

  if (!interview) notFound()
  if (interview.application.studentId !== user.studentProfile.id) notFound()

  return (
    <AiInterviewClient
      interview={{
        id: interview.id,
        status: interview.status,
        invitedAt: interview.invitedAt.toISOString(),
        completedAt: interview.completedAt?.toISOString() ?? null,
        expiresAt: interview.expiresAt?.toISOString() ?? null,
        jobTitle: interview.application.job.title,
        companyName: interview.application.job.company.name,
        applicationId: interview.application.id,
        answers: interview.answers.map((a) => ({
          id: a.id,
          questionIndex: a.questionIndex,
          question: a.question,
          answer: a.answer,
          answeredAt: a.answeredAt?.toISOString() ?? null,
        })),
      }}
    />
  )
}