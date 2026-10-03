// app/company/jobs/new/page.tsx
import { redirect } from 'next/navigation'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import { getSkillsForFormAction } from './actions'
import { NewJobClient } from './new-job-client'

export const metadata = {
  title: 'Posting Lowongan Baru — VocAZ',
}

export default async function NewJobPage() {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const { all: skills } = await getSkillsForFormAction()

  return (
    <NewJobClient
      skills={skills}
      companyName={ctx.companyName}
      companyLogo={ctx.companyLogo}
      companyVerified={ctx.verificationStatus === 'verified'}
    />
  )
}