// app/company/verification/page.tsx
import { redirect } from 'next/navigation'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import { getVerificationState } from '@/lib/queries/company-verification'
import { CompanyVerificationClient } from './verification-client'

export const metadata = {
  title: 'Verifikasi Perusahaan — VocAZ',
  description: 'Ajukan verifikasi perusahaan untuk mendapatkan badge Verified.',
}

export default async function CompanyVerificationPage() {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const state = await getVerificationState(ctx.companyId)

  return <CompanyVerificationClient state={state} />
}
