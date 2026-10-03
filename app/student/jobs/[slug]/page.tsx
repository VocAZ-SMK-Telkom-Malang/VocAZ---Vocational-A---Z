// app/student/jobs/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { getStudentJobDetail } from '@/lib/queries/student-jobs'
import { JobDetailClient } from './job-detail-client'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const job = await prisma.job.findUnique({
    where: { slug },
    select: { title: true, company: { select: { name: true } } },
  })
  if (!job) return { title: 'Lowongan — VocAZ' }
  return {
    title: `${job.title} di ${job.company.name} — VocAZ`,
  }
}

export default async function StudentJobDetailPage({ params }: Props) {
  const { slug } = await params

  const session = await getServerSession()
  let studentProfileId: string | null = null
  let defaultCvUrl: string | null = null
  let defaultCvKey: string | null = null
  let isLoggedIn = false

  if (session?.user?.id) {
    isLoggedIn = true
    const user = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      select: {
        role: true,
        studentProfile: {
          select: { id: true, cvUrl: true, cvKey: true },
        },
      },
    })
    if (user?.role === 'student' && user.studentProfile) {
      studentProfileId = user.studentProfile.id
      defaultCvUrl = user.studentProfile.cvUrl
      defaultCvKey = user.studentProfile.cvKey
    }
  }

  const job = await getStudentJobDetail(slug, studentProfileId)
  if (!job) notFound()

  // ✅ Fetch screening questions
  const screeningQuestionsRaw = await prisma.screeningQuestion.findMany({
    where: { jobId: job.id },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      question: true,
      description: true,
      type: true,
      options: true,
      isRequired: true,
      sortOrder: true,
    },
  })

  const screeningQuestions = screeningQuestionsRaw.map((q) => ({
    id: q.id,
    question: q.question,
    description: q.description ?? undefined,
    type: q.type as 'yes_no' | 'text' | 'number' | 'multiple_choice',
    options: q.options,
    isRequired: q.isRequired,
    sortOrder: q.sortOrder,
  }))

  return (
    <JobDetailClient
      job={job}
      hasCv={!!defaultCvUrl}
      defaultCvUrl={defaultCvUrl}
      defaultCvKey={defaultCvKey}
      isLoggedIn={isLoggedIn}
      screeningQuestions={screeningQuestions}
    />
  )
}