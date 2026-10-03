// app/school/layout.tsx
import { redirect } from 'next/navigation'
import { getSchoolIdentity } from '@/lib/queries/school-dashboard'
import { SchoolShell } from '@/components/school/layout/school-shell'

export const dynamic = 'force-dynamic'

export default async function SchoolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const identity = await getSchoolIdentity()
  if (!identity) redirect('/auth/sign-in')

  return (
    <SchoolShell
      schoolName={identity.schoolName}
      schoolLogo={identity.schoolLogoUrl}
      userName={identity.userName}
      userAvatar={identity.userAvatarUrl}
    >
      {children}
    </SchoolShell>
  )
}