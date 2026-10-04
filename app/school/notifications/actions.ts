// app/school/notifications/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import { revalidatePath } from 'next/cache'

export async function markAsReadAction(notificationId: string) {
  const ctx = await getSchoolContext()
  if (!ctx) return { ok: false, error: 'Unauthorized' }

  try {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId: ctx.userId },
      data: { isRead: true },
    })
    revalidatePath('/school/notifications')
    revalidatePath('/school/dashboard')
    return { ok: true }
  } catch (err: any) {
    console.error('[markAsRead]', err?.message)
    return { ok: false, error: 'Gagal' }
  }
}

export async function markAllAsReadAction() {
  const ctx = await getSchoolContext()
  if (!ctx) return { ok: false, error: 'Unauthorized' }

  try {
    await prisma.notification.updateMany({
      where: { userId: ctx.userId, isRead: false },
      data: { isRead: true },
    })
    revalidatePath('/school/notifications')
    revalidatePath('/school/dashboard')
    return { ok: true }
  } catch (err: any) {
    console.error('[markAllAsRead]', err?.message)
    return { ok: false, error: 'Gagal' }
  }
}

export async function deleteNotificationAction(notificationId: string) {
  const ctx = await getSchoolContext()
  if (!ctx) return { ok: false, error: 'Unauthorized' }

  try {
    await prisma.notification.deleteMany({
      where: { id: notificationId, userId: ctx.userId },
    })
    revalidatePath('/school/notifications')
    revalidatePath('/school/dashboard')
    return { ok: true }
  } catch (err: any) {
    console.error('[deleteNotification]', err?.message)
    return { ok: false, error: 'Gagal' }
  }
}

export async function clearAllReadAction() {
  const ctx = await getSchoolContext()
  if (!ctx) return { ok: false, error: 'Unauthorized' }

  try {
    await prisma.notification.deleteMany({
      where: { userId: ctx.userId, isRead: true },
    })
    revalidatePath('/school/notifications')
    revalidatePath('/school/dashboard')
    return { ok: true }
  } catch (err: any) {
    console.error('[clearAllRead]', err?.message)
    return { ok: false, error: 'Gagal' }
  }
}