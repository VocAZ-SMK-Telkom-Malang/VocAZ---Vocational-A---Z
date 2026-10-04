// lib/queries/school-profile.ts
import { prisma } from '@/lib/prisma'

export type SchoolProfileData = {
  id: string
  name: string
  slug: string
  npsn: string | null
  level: string | null
  accreditation: string | null
  email: string | null
  phone: string | null
  website: string | null
  address: string | null
  city: string | null
  province: string | null
  logoUrl: string | null
  description: string | null

  bkkName: string | null
  bkkContact: string | null
  bkkEmail: string | null
  bkkPhone: string | null

  schoolCode: string | null
  enrollmentToken: string | null
  tokenActive: boolean
  tokenExpiresAt: string | null

  isVerified: boolean
  verifiedAt: string | null

  subscriptionPlan: string | null
  subscriptionStatus: string | null
  activeStudentQuota: number
  adminSeatQuota: number

  stats: {
    totalStudents: number
    activeStudents: number
    alumniStudents: number
    totalPartners: number
    totalPrograms: number
  }
}

export async function getSchoolProfile(
  schoolId: string
): Promise<SchoolProfileData | null> {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: {
      id: true,
      name: true,
      slug: true,
      npsn: true,
      level: true,
      accreditation: true,
      email: true,
      phone: true,
      website: true,
      address: true,
      city: true,
      province: true,
      logoUrl: true,
      description: true,
      bkkName: true,
      bkkContact: true,
      bkkEmail: true,
      bkkPhone: true,
      schoolCode: true,
      enrollmentToken: true,
      tokenActive: true,
      tokenExpiresAt: true,
      isVerified: true,
      verifiedAt: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      activeStudentQuota: true,
      adminSeatQuota: true,
      _count: {
        select: {
          students: true,
          programs: true,
          industryPartners: true,
        },
      },
    },
  })

  if (!school) return null

  const [activeStudents, alumniStudents] = await Promise.all([
    prisma.schoolStudent.count({
      where: { schoolId, status: 'active' },
    }),
    prisma.schoolStudent.count({
      where: { schoolId, status: 'graduated' },
    }),
  ])

  return {
    id: school.id,
    name: school.name,
    slug: school.slug,
    npsn: school.npsn,
    level: school.level,
    accreditation: school.accreditation,
    email: school.email,
    phone: school.phone,
    website: school.website,
    address: school.address,
    city: school.city,
    province: school.province,
    logoUrl: school.logoUrl,
    description: school.description,

    bkkName: school.bkkName,
    bkkContact: school.bkkContact,
    bkkEmail: school.bkkEmail,
    bkkPhone: school.bkkPhone,

    schoolCode: school.schoolCode,
    enrollmentToken: school.enrollmentToken,
    tokenActive: school.tokenActive,
    tokenExpiresAt: school.tokenExpiresAt
      ? school.tokenExpiresAt.toISOString()
      : null,

    isVerified: school.isVerified,
    verifiedAt: school.verifiedAt
      ? school.verifiedAt.toISOString()
      : null,

    subscriptionPlan: school.subscriptionPlan,
    subscriptionStatus: school.subscriptionStatus,
    activeStudentQuota: school.activeStudentQuota,
    adminSeatQuota: school.adminSeatQuota,

    stats: {
      totalStudents: school._count.students,
      activeStudents,
      alumniStudents,
      totalPartners: school._count.industryPartners,
      totalPrograms: school._count.programs,
    },
  }
}