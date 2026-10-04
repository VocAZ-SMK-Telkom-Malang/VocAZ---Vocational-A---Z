// app/certification/settings/page.tsx
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCertContext } from '@/lib/queries/cert-context'
import { getCertSettings } from './actions'
import { CertSettingsClient } from './settings-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Pengaturan — VocAZ Verifier',
}

export default async function CertSettingsPage() {
  const ctx = await getCertContext()
  if (!ctx) redirect('/auth/sign-in')

  const [user, inst] = await Promise.all([
    prisma.user.findUnique({
      where: { id: ctx.userId },
      select: {
        email: true,
        fullName: true,
        phone: true,
        jobTitle: true,
      },
    }),
    prisma.certificationInstitution.findUnique({
      where: { id: ctx.institutionId },
      select: { name: true, type: true, isApproved: true },
    }),
  ])

  if (!user || !inst) redirect('/auth/sign-in')

  const notificationPrefs = await getCertSettings(ctx.userId)

  return (
    <CertSettingsClient
      user={{
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        jobTitle: user.jobTitle,
      }}
      institution={{
        name: inst.name,
        type: inst.type,
        isApproved: inst.isApproved,
      }}
      notificationPrefs={notificationPrefs}
      userRole={ctx.role}
    />
  )
}