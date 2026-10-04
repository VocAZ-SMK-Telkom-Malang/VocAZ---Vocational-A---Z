// lib/queries/cert-profile.ts
import { prisma } from '@/lib/prisma'

export type CertProfileData = {
  id: string
  name: string
  slug: string
  type: string
  licenseNumber: string | null
  email: string | null
  phone: string | null
  website: string | null
  address: string | null
  logoUrl: string | null
  description: string | null
  isApproved: boolean
  approvedAt: string | null
  createdAt: string

  stats: {
    totalCertificates: number
    totalVerified: number
    totalRejected: number
    pendingCount: number
    approvalRate: number
  }
}

export async function getCertProfile(
  institutionId: string
): Promise<CertProfileData | null> {
  const inst = await prisma.certificationInstitution.findUnique({
    where: { id: institutionId },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      licenseNumber: true,
      email: true,
      phone: true,
      website: true,
      address: true,
      logoUrl: true,
      description: true,
      isApproved: true,
      approvedAt: true,
      createdAt: true,
      _count: {
        select: {
          certificates: true,
          verifications: true,
        },
      },
    },
  })

  if (!inst) return null

  const [totalVerified, totalRejected, pendingCount] = await Promise.all([
    prisma.verificationRequest.count({
      where: { institutionId, status: 'verified' },
    }),
    prisma.verificationRequest.count({
      where: { institutionId, status: 'rejected' },
    }),
    prisma.verificationRequest.count({
      where: {
        institutionId,
        status: { in: ['pending', 'in_review'] },
      },
    }),
  ])

  const totalReviewed = totalVerified + totalRejected
  const approvalRate =
    totalReviewed > 0 ? Math.round((totalVerified / totalReviewed) * 100) : 0

  return {
    id: inst.id,
    name: inst.name,
    slug: inst.slug,
    type: inst.type,
    licenseNumber: inst.licenseNumber,
    email: inst.email,
    phone: inst.phone,
    website: inst.website,
    address: inst.address,
    logoUrl: inst.logoUrl,
    description: inst.description,
    isApproved: inst.isApproved,
    approvedAt: inst.approvedAt ? inst.approvedAt.toISOString() : null,
    createdAt: inst.createdAt.toISOString(),

    stats: {
      totalCertificates: inst._count.certificates,
      totalVerified,
      totalRejected,
      pendingCount,
      approvalRate,
    },
  }
}