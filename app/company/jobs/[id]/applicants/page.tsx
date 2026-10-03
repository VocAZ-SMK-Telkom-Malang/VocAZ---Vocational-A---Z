// app/company/jobs/[id]/applicants/page.tsx
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import { getJobApplicants } from '@/lib/queries/company-job-detail'
import { getJobDetail } from '@/lib/queries/company-job-detail'
import { ApplicantsListClient } from './applicants-list-client'

type Props = {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Daftar Pelamar — VocAZ',
}

export default async function JobApplicantsPage({ params }: Props) {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const { id } = await params

  const [job, applicants] = await Promise.all([
    getJobDetail(id, ctx.companyId),
    getJobApplicants(id, ctx.companyId),
  ])

  if (!job) notFound()

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <Link
        href={`/company/jobs/${id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke detail lowongan
      </Link>

      <ApplicantsListClient job={job} applicants={applicants} />
    </div>
  )
}