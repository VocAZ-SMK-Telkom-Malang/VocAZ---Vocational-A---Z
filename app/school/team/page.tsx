// app/school/team/page.tsx
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import { getSchoolTeam, getSchoolTeamStats } from '@/lib/queries/school-team'
import { SchoolTeamClient } from './team-client'

export const metadata = {
  title: 'Tim & Akses — VocAZ BKK',
}

export default async function SchoolTeamPage() {
  const ctx = await getSchoolContext()
  if (!ctx) redirect('/auth/sign-in')

  const [members, stats, school] = await Promise.all([
    getSchoolTeam(ctx.schoolId, ctx.userId),
    getSchoolTeamStats(ctx.schoolId),
    prisma.school.findUnique({
      where: { id: ctx.schoolId },
      select: {
        name: true,
        inviteToken: true,
        inviteActive: true,
      },
    }),
  ])

  if (!school) redirect('/auth/sign-in')

  return (
    <SchoolTeamClient
      members={members}
      stats={stats}
      school={{
        name: school.name,
        inviteToken: school.inviteToken,
        inviteActive: school.inviteActive,
      }}
      currentUserRole={ctx.role}
    />
  )
}