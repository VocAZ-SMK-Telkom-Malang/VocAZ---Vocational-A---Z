// app/company/team/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import {
  getCompanyTeam,
  getPendingInvitations,
  getTeamStats,
} from '@/lib/queries/company-team'
import { prisma } from '@/lib/prisma'
import { CompanyTeamClient } from './team-client'

export const metadata = {
  title: 'Tim & Akses — VocAZ',
}

export default async function CompanyTeamPage() {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const session = await getServerSession()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const currentUser = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      ownedCompany: { select: { id: true } },
      companyMembers: {
        where: { companyId: ctx.companyId },
        select: { id: true, role: true },
      },
    },
  })

  if (!currentUser) redirect('/onboarding')

  const [members, invitations, stats] = await Promise.all([
    getCompanyTeam(ctx.companyId),
    getPendingInvitations(ctx.companyId),
    getTeamStats(ctx.companyId),
  ])

  // ✅ Fix permission: cek owner ATAU admin
  const isOwner = currentUser.ownedCompany?.id === ctx.companyId
  const isAdmin = currentUser.companyMembers.some(
    (m) => m.role === 'owner' || m.role === 'admin'
  )
  const canManage = isOwner || isAdmin

  return (
    <CompanyTeamClient
      members={members}
      invitations={invitations}
      stats={stats}
      currentUserId={currentUser.id}
      canManage={canManage}
    />
  )
}