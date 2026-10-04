// app/school/settings/actions.ts
'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import { revalidatePath } from 'next/cache'

// ============================================
// HELPER
// ============================================

async function requireSchoolUser() {
  const ctx = await getSchoolContext()
  if (!ctx) return { error: 'Unauthorized' as const }
  return ctx
}

async function requireSchoolOwnerOrAdmin() {
  const ctx = await getSchoolContext()
  if (!ctx) return { error: 'Unauthorized' as const }

  if (ctx.role !== 'owner' && ctx.role !== 'admin') {
    return { error: 'Hanya owner/admin' as const }
  }
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

export async function updateSchoolProfileSettingsAction(input: unknown) {
  const ctx = await requireSchoolUser()
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

    revalidatePath('/school/settings')
    return { ok: true }
  } catch (err: any) {
    console.error('[updateSchoolProfileSettings]', err?.message)
    return { ok: false, error: 'Gagal simpan' }
  }
}

// ============================================
// NOTIFICATION PREFERENCES
// ============================================

const notifSchema = z.object({
  emailNotifications: z.boolean(),
  newStudents: z.boolean(),
  recruitmentUpdates: z.boolean(),
  partnerUpdates: z.boolean(),
})

export type SchoolNotificationPrefs = z.infer<typeof notifSchema>

const DEFAULT_NOTIF: SchoolNotificationPrefs = {
  emailNotifications: true,
  newStudents: true,
  recruitmentUpdates: true,
  partnerUpdates: true,
}

export async function getSchoolSettings(
  userId: string
): Promise<SchoolNotificationPrefs> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { notificationPrefs: true },
  })

  if (!user?.notificationPrefs) return DEFAULT_NOTIF

  const prefs = user.notificationPrefs as Record<string, unknown>
  const parsed = notifSchema.safeParse(prefs)

  return parsed.success ? parsed.data : DEFAULT_NOTIF
}

export async function updateSchoolNotificationsAction(input: unknown) {
  const ctx = await requireSchoolUser()
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

    revalidatePath('/school/settings')
    return { ok: true }
  } catch (err: any) {
    console.error('[updateSchoolNotifications]', err?.message)
    return { ok: false, error: 'Gagal simpan' }
  }
}