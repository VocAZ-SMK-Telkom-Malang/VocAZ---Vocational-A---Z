// app/company/jobs/[id]/applicants/[appId]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import { getApplicantDetail } from '@/lib/queries/company-applicant-detail'
import { ApplicantDetailClient } from './applicant-detail-client'

type Props = {
  params: Promise<{ id: string; appId: string }>
  searchParams: Promise<{ from?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { appId } = await params
  const ctx = await getCompanyContext()
  if (!ctx) return { title: 'Detail Pelamar — VocAZ' }

  const detail = await getApplicantDetail(appId, ctx.companyId)
  if (!detail) return { title: 'Detail Pelamar — VocAZ' }

  return {
    title: `${detail.student.fullName} — Pelamar ${detail.job.title} — VocAZ`,
  }
}

export default async function ApplicantDetailPage({
  params,
  searchParams,
}: Props) {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const { appId } = await params
  const { from } = await searchParams

  const detail = await getApplicantDetail(appId, ctx.companyId)
  if (!detail) notFound()

  const backUrl =
    from === 'pipeline'
      ? `/company/pipeline/${detail.job.id}`
      : `/company/jobs/${detail.job.id}/applicants`

  const backLabel =
    from === 'pipeline' ? 'Kembali ke Pipeline' : 'Kembali ke daftar pelamar'

  // ✅ AI Interview data
  const aiInterview = detail.aiInterview ?? null

  return (
    <ApplicantDetailClient
      detail={detail}
      jobId={detail.job.id}
      defaultRecruiterName={ctx.ownerName}
      backUrl={backUrl}
      backLabel={backLabel}
      aiInterview={aiInterview}
    />
  )
}