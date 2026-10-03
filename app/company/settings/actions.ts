// app/company/settings/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

// ============================================
// HELPER
// ============================================

async function requireCompanyUser() {
  const session = await getServerSession()
  if (!session?.user?.id) return { error: 'Unauthorized' as const }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: {
      id: true,
      role: true,
      ownedCompany: { select: { id: true } },
      companyMembers: {
        select: { companyId: true, role: true },
      },
    },
  })

  if (!user || user.role !== 'company') {
    return { error: 'Hanya recruiter' as const }
  }

  const isOwner = !!user.ownedCompany
  const isAdmin = user.companyMembers.some(
    (m) => m.role === 'owner' || m.role === 'admin'
  )

  if (!isOwner && !isAdmin) {
    return { error: 'Hanya owner/admin' as const }
  }

  const companyId =
    user.ownedCompany?.id ?? user.companyMembers[0]?.companyId
  if (!companyId) return { error: 'Company tidak ditemukan' as const }

  return { userId: user.id, companyId }
}

// ============================================
// UPDATE PROFILE SETTINGS
// ============================================

const profileSchema = z.object({
  fullName: z.string().max(120).nullable(),
  phone: z.string().max(30).nullable(),
  jobTitle: z.string().max(120).nullable(),
})

export async function updateCompanyProfileSettings(input: unknown) {
  const ctx = await requireCompanyUser()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  try {
    await prisma.user.update({
      where: { id: ctx.userId },
      data: {
        fullName: parsed.data.fullName || null,
        phone: parsed.data.phone || null,
        jobTitle: parsed.data.jobTitle || null,
      },
    })

    revalidatePath('/company/settings')
    return { ok: true }
  } catch (err: any) {
    console.error('[updateCompanyProfileSettings] Error:', err?.message)
    return { ok: false, error: 'Gagal simpan' }
  }
}

// ============================================
// NOTIFICATION PREFERENCES
// ============================================

const notifSchema = z.object({
  emailNotifications: z.boolean(),
  applicationUpdates: z.boolean(),
  newMessages: z.boolean(),
  talentRecommendations: z.boolean(),
})

export type CompanyNotificationPrefs = z.infer<typeof notifSchema>

const DEFAULT_NOTIF: CompanyNotificationPrefs = {
  emailNotifications: true,
  applicationUpdates: true,
  newMessages: true,
  talentRecommendations: true,
}

export async function getCompanyNotificationPreferences(
  userId: string
): Promise<CompanyNotificationPrefs> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { notificationPrefs: true },
  })

  if (!user?.notificationPrefs) return DEFAULT_NOTIF

  const prefs = user.notificationPrefs as Record<string, unknown>
  const parsed = notifSchema.safeParse(prefs)

  return parsed.success ? parsed.data : DEFAULT_NOTIF
}

export async function updateCompanyNotificationPreferences(input: unknown) {
  const ctx = await requireCompanyUser()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const parsed = notifSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Data tidak valid',
    }
  }

  try {
    await prisma.user.update({
      where: { id: ctx.userId },
      data: {
        notificationPrefs: parsed.data,
      },
    })

    revalidatePath('/company/settings')
    return { ok: true }
  } catch (err: any) {
    console.error('[updateCompanyNotificationPreferences] Error:', err?.message)
    return { ok: false, error: 'Gagal simpan' }
  }
}