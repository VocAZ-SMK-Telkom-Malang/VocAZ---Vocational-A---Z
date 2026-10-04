// app/certification/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCertContext, getCertIdentity } from '@/lib/queries/cert-context'
import {
  getCertDashboardStats,
  getRecentRequests,
  getVerificationTrend,
} from '@/lib/queries/cert-dashboard'
import { CertDashboardClient } from './dashboard-client'

export const metadata = {
  title: 'Dashboard — VocAZ Verifier',
}

export default async function CertDashboardPage() {
  const ctx = await getCertContext()
  if (!ctx) redirect('/auth/sign-in')

  const identity = await getCertIdentity()
  if (!identity) redirect('/auth/sign-in')

  const [stats, recent, trend, institution] = await Promise.all([
    getCertDashboardStats(ctx.institutionId),
    getRecentRequests(ctx.institutionId, 5),
    getVerificationTrend(ctx.institutionId, 7),
    prisma.certificationInstitution.findUnique({
      where: { id: ctx.institutionId },
      select: { name: true, type: true },
    }),
  ])

  return (
    <CertDashboardClient
      institutionName={institution?.name ?? identity.institutionName}
      institutionType={institution?.type ?? identity.institutionType}
      stats={stats}
      recent={recent}
      trend={trend}
    />
  )
}