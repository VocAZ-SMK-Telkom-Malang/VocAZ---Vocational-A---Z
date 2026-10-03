// app/company/settings/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { getCompanyNotificationPreferences } from './actions'
import { CompanySettingsClient } from '@/components/company/settings/settings-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Pengaturan — VocAZ',
}

export default async function CompanySettingsPage() {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: {
      ownedCompany: {
        select: {
          id: true,
          name: true,
          slug: true,
          verificationStatus: true,
        },
      },
      companyMembers: {
        select: {
          companyId: true,
          role: true,
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              verificationStatus: true,
            },
          },
        },
      },
    },
  })

  if (!user || user.role !== 'company') redirect('/auth/sign-in')

  const company = user.ownedCompany ?? user.companyMembers[0]?.company
  if (!company) redirect('/register/company/1')

  const notificationPrefs = await getCompanyNotificationPreferences(user.id)

  return (
    <CompanySettingsClient
      user={{
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        jobTitle: user.jobTitle,
      }}
      company={{
        name: company.name,
        slug: company.slug,
        verificationStatus: company.verificationStatus,
      }}
      notificationPrefs={notificationPrefs}
    />
  )
}