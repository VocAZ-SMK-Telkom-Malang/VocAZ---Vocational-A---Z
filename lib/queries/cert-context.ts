// lib/queries/cert-context.ts
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'

// ============================================
// CONTEXT
// ============================================

export type CertContext = {
  userId: string
  institutionId: string
  role: 'owner' | 'admin' | 'verifier'
}

export async function getCertContext(): Promise<CertContext | null> {
  const session = await getServerSession()
  if (!session?.user?.id) return null

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      ownedInstitution: { select: { id: true } },
    },
  })

  if (!user || user.role !== 'certification') return null

  const ownedInstitution = user.ownedInstitution as { id: string } | null

  if (ownedInstitution) {
    return {
      userId: user.id,
      institutionId: ownedInstitution.id,
      role: 'owner',
    }
  }

  return null
}

// ============================================
// IDENTITY
// ============================================

export type CertIdentity = {
  institutionId: string
  institutionName: string
  institutionSlug: string
  institutionType: string
  institutionLogoUrl: string | null
  isApproved: boolean

  userId: string
  userName: string
  userEmail: string
  userAvatarUrl: string | null
  userRole: 'owner' | 'admin' | 'verifier'
}

export async function getCertIdentity(): Promise<CertIdentity | null> {
  const ctx = await getCertContext()
  if (!ctx) return null

  const [inst, user] = await Promise.all([
    prisma.certificationInstitution.findUnique({
      where: { id: ctx.institutionId },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        logoUrl: true,
      },
    }),
    prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { fullName: true, email: true, avatarUrl: true },
    }),
  ])

  if (!inst || !user) return null

  return {
    institutionId: inst.id,
    institutionName: inst.name,
    institutionSlug: inst.slug,
    institutionType: inst.type,
    institutionLogoUrl: inst.logoUrl ?? null,
    isApproved: true, // ganti kalau lo tambah field isApproved

    userId: ctx.userId,
    userName: user.fullName ?? user.email,
    userEmail: user.email,
    userAvatarUrl: user.avatarUrl ?? null,
    userRole: ctx.role,
  }
}