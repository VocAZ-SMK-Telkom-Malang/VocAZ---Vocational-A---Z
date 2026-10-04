// app/certification/profile/page.tsx
import { redirect } from 'next/navigation'
import { getCertContext } from '@/lib/queries/cert-context'
import { getCertProfile } from '@/lib/queries/cert-profile'
import { CertProfileClient } from './profile-client'

export const metadata = {
  title: 'Profil Institusi — VocAZ Verifier',
}

export default async function CertProfilePage() {
  const ctx = await getCertContext()
  if (!ctx) redirect('/auth/sign-in')

  const profile = await getCertProfile(ctx.institutionId)
  if (!profile) redirect('/auth/sign-in')

  return <CertProfileClient profile={profile} userRole={ctx.role} />
}