// app/company/jobs/[id]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import {
  getJobDetail,
  getJobApplicants,
} from '@/lib/queries/company-job-detail'
import { JobDetailClient } from './job-detail-client'


type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const ctx = await getCompanyContext()
  if (!ctx) return { title: 'Job Detail — VocAZ' }
  const job = await getJobDetail(id, ctx.companyId)
  return {
    title: job ? `${job.title} — VocAZ` : 'Job Detail — VocAZ',
  }
}

export default async function JobDetailPage({ params }: Props) {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const { id } = await params

  const [job, applicants] = await Promise.all([
    getJobDetail(id, ctx.companyId),
    getJobApplicants(id, ctx.companyId),
  ])

  if (!job) notFound()

  // Check if job is soft-deleted
  const isDeleted = job.status === 'archived' // nanti bisa diganti logic

  return (
    <JobDetailClient
      job={job}
      applicants={applicants}
      isDeleted={isDeleted}
    />
  )
}