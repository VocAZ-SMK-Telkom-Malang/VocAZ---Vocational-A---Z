// app/student/settings/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { getNotificationPreferences } from '@/app/actions/settings'
import { SettingsClient } from '@/components/student/settings/settings-client'

export const dynamic = 'force-dynamic'

export default async function StudentSettingsPage() {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: {
      studentProfile: {
        select: {
          isPublic: true,
          isOpenToWork: true,
        },
      },
    },
  })

  if (!user) redirect('/onboarding')

  const notificationPrefs = await getNotificationPreferences(user.id)

  return (
    <SettingsClient
      user={{
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
      }}
      profile={user.studentProfile}
      notificationPrefs={notificationPrefs}
    />
  )
}