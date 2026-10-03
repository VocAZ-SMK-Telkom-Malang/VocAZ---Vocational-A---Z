// app/company/jobs/[id]/edit/page.tsx
import { notFound, redirect } from 'next/navigation'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import { getJobDetail } from '@/lib/queries/company-job-detail'
import { getSkillsForFormAction } from '@/app/company/jobs/new/actions'
import { EditJobClient } from './edit-job-client'

export const metadata = {
  title: 'Edit Lowongan — VocAZ',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditJobPage({ params }: Props) {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const { id } = await params

  const [job, { all: skills }] = await Promise.all([
    getJobDetail(id, ctx.companyId),
    getSkillsForFormAction(),
  ])

  if (!job) notFound()

  return <EditJobClient job={job} skills={skills} />
}