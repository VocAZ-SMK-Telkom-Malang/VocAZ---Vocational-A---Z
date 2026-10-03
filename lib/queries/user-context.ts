// lib/queries/user-context.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// GET CURRENT USER (full context)
// ============================================

export async function getCurrentUserContext() {
  const session = await getServerSession()
  if (!session?.user?.id) return null

  return prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      email: true,
      fullName: true,
      avatarUrl: true,
      role: true,
      studentProfile: {
        select: {
          id: true,
          headline: true,
        },
      },
      ownedCompany: {
        select: {
          id: true,
          slug: true,
          name: true,
          verificationStatus: true,
        },
      },
      school: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
      certInstitution: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
      },
    },
  })
}

export type CurrentUserContext = NonNullable<
  Awaited<ReturnType<typeof getCurrentUserContext>>
>

// ============================================
// FIND COMPANY OWNER USER ID
// ============================================

export async function findCompanyOwnerUserId(companySlug: string) {
  const company = await prisma.company.findUnique({
    where: { slug: companySlug },
    select: {
      ownerUserId: true,
      name: true,
      members: {
        where: { role: 'owner' },
        take: 1,
        select: { userId: true },
      },
    },
  })

  if (!company) return null

  return {
    userId: company.ownerUserId ?? company.members[0]?.userId ?? null,
    companyName: company.name,
  }
}