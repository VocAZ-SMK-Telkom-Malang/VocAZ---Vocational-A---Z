// app/company/layout.tsx
import { redirect } from 'next/navigation'
import { getCompanyIdentity } from '@/lib/queries/company-dashboard'
import { CompanyShell } from '@/components/company/layout/company-shell'

export default async function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const identity = await getCompanyIdentity()

  if (!identity) {
    redirect('/')
  }

  return (
    <CompanyShell
      companyName={identity.companyName}
      companyLogo={identity.companyLogoUrl}
      userName={identity.userName}
      userAvatar={identity.userAvatarUrl}
    >
      {children}
    </CompanyShell>
  )
}