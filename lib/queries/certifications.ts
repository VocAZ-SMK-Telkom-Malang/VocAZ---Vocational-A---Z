// lib/queries/certifications.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// GET STUDENT CERTIFICATES
// ============================================

export async function getStudentCertificates() {
  const session = await getServerSession()
  if (!session?.user?.id) return []

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: true },
  })

  if (!user?.studentProfile) return []

  const certs = await prisma.certificate.findMany({
    where: { studentId: user.studentProfile.id },
    include: {
      institution: true,
      verificationRequests: {
        include: {
          institution: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { issuedDate: 'desc' },
  })

  return certs.map((c) => ({
    id: c.id,
    title: c.title,
    certificateNumber: c.certificateNumber,
    issuedDate: c.issuedDate?.toISOString() ?? null,
    expiredDate: c.expiredDate?.toISOString() ?? null,
    documentUrl: c.documentUrl,
    documentKey: c.documentKey,
    badgeType: c.badgeType,
    verificationStatus: c.verificationStatus,
    verifiedAt: c.verifiedAt?.toISOString() ?? null,
    institutionName: c.institution?.name ?? null,
    institutionType: c.institution?.type ?? null,
    latestRequest: c.verificationRequests[0]
      ? {
          id: c.verificationRequests[0].id,
          status: c.verificationRequests[0].status,
          institutionName: c.verificationRequests[0].institution?.name ?? null,
          createdAt: c.verificationRequests[0].createdAt.toISOString(),
          notes: c.verificationRequests[0].notes,
        }
      : null,
    createdAt: c.createdAt.toISOString(),
  }))
}

export type CertificateItem = Awaited<
  ReturnType<typeof getStudentCertificates>
>[number]

// ============================================
// LIST VERIFIER (institusi yang bisa verifikasi)
// ============================================

export async function getVerifierList() {
  const institutions = await prisma.certificationInstitution.findMany({
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      logoUrl: true,
    },
  })

  return institutions
}

export type VerifierItem = Awaited<ReturnType<typeof getVerifierList>>[number]