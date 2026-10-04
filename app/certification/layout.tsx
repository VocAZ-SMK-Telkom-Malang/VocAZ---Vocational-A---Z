// app/certification/layout.tsx
import { redirect } from 'next/navigation'
import { getCertIdentity } from '@/lib/queries/cert-context'
import { CertShell } from '@/components/certification/layout/cert-shell'

export const dynamic = 'force-dynamic'

export default async function CertificationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const identity = await getCertIdentity()
  if (!identity) redirect('/auth/sign-in')

  return (
    <CertShell
      institutionName={identity.institutionName}
      institutionLogo={identity.institutionLogoUrl}
      userName={identity.userName}
      userAvatar={identity.userAvatarUrl}
    >
      {children}
    </CertShell>
  )
}