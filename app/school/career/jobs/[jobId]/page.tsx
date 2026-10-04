// app/school/career/jobs/[jobId]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import { getCandidateStudentsForJob } from '@/app/school/career/actions'
import { JobMonitoringClient } from './job-monitoring-client'

type Props = {
  params: Promise<{ jobId: string }>
}

export async function generateMetadata({ params }: Props) {
  const { jobId } = await params
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { title: true },
  })
  return {
    title: job ? `${job.title} — VocAZ BKK` : 'Job Detail — VocAZ BKK',
  }
}

export default async function SchoolCareerJobPage({ params }: Props) {
  const ctx = await getSchoolContext()
  if (!ctx) redirect('/auth/sign-in')

  const { jobId } = await params

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          industry: true,
          city: true,
        },
      },
    },
  })

  if (!job) notFound()

  const candidatesResult = await getCandidateStudentsForJob(jobId)
  const students = candidatesResult.ok ? candidatesResult.students : []

  return (
    <JobMonitoringClient
      job={{
        id: job.id,
        title: job.title,
        description: job.description,
        city: job.city,
        workMode: job.workMode,
        employmentType: job.employmentType,
        applicants: job.applicants,
        expiredAt: job.expiredAt ? job.expiredAt.toISOString() : null,
        company: {
          id: job.company.id,
          name: job.company.name,
          slug: job.company.slug,
          logoUrl: job.company.logoUrl,
          industry: job.company.industry,
          city: job.company.city,
        },
      }}
      students={students}
    />
  )
}