// app/actions/settings.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

type ActionResult = { ok: boolean; error?: string; data?: any }

// ============================================
// HELPER
// ============================================

async function getCurrentUser() {
  const session = await getServerSession()
  if (!session?.user?.id) return null

  return prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: true },
  })
}

// ============================================
// UPDATE PROFILE SETTINGS
// ============================================

export async function updateProfileSettings(input: {
  fullName?: string
  phone?: string
  isPublic?: boolean
  isOpenToWork?: boolean
  showEmail?: boolean
}): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    if (!user) return { ok: false, error: 'Harus login' }

    // Update User (fullName + phone)
    if (input.fullName !== undefined || input.phone !== undefined) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(input.fullName !== undefined && {
            fullName: input.fullName.trim() || null,
          }),
          ...(input.phone !== undefined && {
            phone: input.phone.trim() || null,
          }),
        },
      })
    }

    // Update StudentProfile (isPublic + isOpenToWork)
    if (user.studentProfile) {
      await prisma.studentProfile.update({
        where: { id: user.studentProfile.id },
        data: {
          ...(input.isPublic !== undefined && { isPublic: input.isPublic }),
          ...(input.isOpenToWork !== undefined && {
            isOpenToWork: input.isOpenToWork,
          }),
        },
      })
    }

    revalidatePath('/student/settings')
    revalidatePath('/student/profile')
    revalidatePath('/student/talents')

    return { ok: true }
  } catch (err) {
    console.error('Update settings error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal simpan',
    }
  }
}

// ============================================
// UPDATE NOTIFICATION PREFERENCES
// ============================================

export async function updateNotificationPreferences(input: {
  emailJobAlerts?: boolean
  emailApplicationUpdates?: boolean
  emailMessages?: boolean
  emailMarketing?: boolean
  pushMessages?: boolean
  pushApplications?: boolean
}): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    if (!user) return { ok: false, error: 'Harus login' }

    // Simpan ke SystemSetting per user (simple approach)
    // Key: user.{userId}.notifications
    const key = `user.${user.id}.notifications`
    const value = {
      emailJobAlerts: input.emailJobAlerts ?? true,
      emailApplicationUpdates: input.emailApplicationUpdates ?? true,
      emailMessages: input.emailMessages ?? true,
      emailMarketing: input.emailMarketing ?? false,
      pushMessages: input.pushMessages ?? true,
      pushApplications: input.pushApplications ?? true,
    }

    await prisma.systemSetting.upsert({
      where: { key },
      update: { value, description: 'User notification preferences' },
      create: {
        key,
        value,
        description: 'User notification preferences',
      },
    })

    revalidatePath('/student/settings')
    return { ok: true }
  } catch (err) {
    console.error('Update notification error:', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Gagal simpan',
    }
  }
}

// ============================================
// GET NOTIFICATION PREFERENCES
// ============================================

export async function getNotificationPreferences(userId: string) {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key: `user.${userId}.notifications` },
    })

    const value = (setting?.value as any) ?? {}

    return {
      emailJobAlerts: value.emailJobAlerts ?? true,
      emailApplicationUpdates: value.emailApplicationUpdates ?? true,
      emailMessages: value.emailMessages ?? true,
      emailMarketing: value.emailMarketing ?? false,
      pushMessages: value.pushMessages ?? true,
      pushApplications: value.pushApplications ?? true,
    }
  } catch {
    return {
      emailJobAlerts: true,
      emailApplicationUpdates: true,
      emailMessages: true,
      emailMarketing: false,
      pushMessages: true,
      pushApplications: true,
    }
  }
}