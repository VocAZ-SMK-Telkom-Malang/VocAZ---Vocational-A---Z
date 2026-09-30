// app/student/talents/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { getTalents, getTalentFilterOptions } from '@/lib/queries/talents'
import { TalentsClient } from '@/components/student/talents/talents-client'

export const dynamic = 'force-dynamic'

export default async function TalentsPage() {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: { select: { id: true } } },
  })

  if (!user) redirect('/onboarding')

  const [talents, filterOptions] = await Promise.all([
    getTalents(),
    getTalentFilterOptions(),
  ])

  return (
    <TalentsClient
      initialTalents={talents}
      filterOptions={filterOptions}
      currentStudentProfileId={user.studentProfile?.id ?? null}
    />
  )
}