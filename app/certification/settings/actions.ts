// app/certification/settings/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getCertContext } from '@/lib/queries/cert-context'
import { revalidatePath } from 'next/cache'

async function requireCertUser() {
  const ctx = await getCertContext()
  if (!ctx) return { error: 'Unauthorized' as const }
  return ctx
}

// ============================================
// UPDATE PROFILE SETTINGS
// ============================================

const profileSchema = z.object({
  fullName: z.string().max(120).nullable(),
  phone: z.string().max(30).nullable(),
  jobTitle: z.string().max(120).nullable(),
})

export async function updateCertProfileSettingsAction(input: unknown) {
  const ctx = await requireCertUser()
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

    revalidatePath('/certification/settings')
    return { ok: true }
  } catch (err: any) {
    console.error('[updateCertProfileSettings]', err?.message)
    return { ok: false, error: 'Gagal simpan' }
  }
}

// ============================================
// NOTIFICATION PREFERENCES
// ============================================

const notifSchema = z.object({
  emailNotifications: z.boolean(),
  newRequests: z.boolean(),
  urgentReminders: z.boolean(),
  weeklyDigest: z.boolean(),
})

export type CertNotificationPrefs = z.infer<typeof notifSchema>

const DEFAULT_NOTIF: CertNotificationPrefs = {
  emailNotifications: true,
  newRequests: true,
  urgentReminders: true,
  weeklyDigest: false,
}

export async function getCertSettings(
  userId: string
): Promise<CertNotificationPrefs> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { notificationPrefs: true },
  })

  if (!user?.notificationPrefs) return DEFAULT_NOTIF

  const prefs = user.notificationPrefs as Record<string, unknown>
  const parsed = notifSchema.safeParse(prefs)

  return parsed.success ? parsed.data : DEFAULT_NOTIF
}

export async function updateCertNotificationsAction(input: unknown) {
  const ctx = await requireCertUser()
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
      data: { notificationPrefs: parsed.data },
    })

    revalidatePath('/certification/settings')
    return { ok: true }
  } catch (err: any) {
    console.error('[updateCertNotifications]', err?.message)
    return { ok: false, error: 'Gagal simpan' }
  }
}