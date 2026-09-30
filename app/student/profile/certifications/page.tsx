// app/student/profile/certifications/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import {
  getStudentCertificates,
  getVerifierList,
} from '@/lib/queries/certifications'
import { CertificationsClient } from './certifications-client'

export const dynamic = 'force-dynamic'

export default async function CertificationsPage() {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: true },
  })

  if (!user?.studentProfile) redirect('/login')

  const [certificates, verifiers] = await Promise.all([
    getStudentCertificates(),
    getVerifierList(),
  ])

  return (
    <CertificationsClient
      certificates={certificates}
      verifiers={verifiers}
      studentProfileId={user.studentProfile.id}
    />
  )
}