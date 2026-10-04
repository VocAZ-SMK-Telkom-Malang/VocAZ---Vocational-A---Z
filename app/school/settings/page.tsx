// app/school/settings/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import { getSchoolSettings } from './actions'
import { SchoolSettingsClient } from './settings-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Pengaturan — VocAZ BKK',
}

export default async function SchoolSettingsPage() {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const ctx = await getSchoolContext()
  if (!ctx) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { id: ctx.userId },
    select: {
      email: true,
      fullName: true,
      phone: true,
      jobTitle: true,
    },
  })

  if (!user) redirect('/auth/sign-in')

  const school = await prisma.school.findUnique({
    where: { id: ctx.schoolId },
    select: {
      name: true,
      slug: true,
      isVerified: true,
      subscriptionPlan: true,
    },
  })

  if (!school) redirect('/auth/sign-in')

  const notificationPrefs = await getSchoolSettings(ctx.userId)

  return (
    <SchoolSettingsClient
      user={{
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        jobTitle: user.jobTitle,
      }}
      school={{
        name: school.name,
        slug: school.slug,
        isVerified: school.isVerified,
        subscriptionPlan: school.subscriptionPlan,
      }}
      notificationPrefs={notificationPrefs}
      userRole={ctx.role}
    />
  )
}