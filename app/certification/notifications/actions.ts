// app/certification/notifications/actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getCertContext } from '@/lib/queries/cert-context'
import { revalidatePath } from 'next/cache'

export async function markCertNotifReadAction(notificationId: string) {
  const ctx = await getCertContext()
  if (!ctx) return { ok: false, error: 'Unauthorized' }

  try {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId: ctx.userId },
      data: { isRead: true },
    })
    revalidatePath('/certification/notifications')
    revalidatePath('/certification/dashboard')
    return { ok: true }
  } catch (err: any) {
    console.error('[markCertNotifRead]', err?.message)
    return { ok: false, error: 'Gagal' }
  }
}

export async function markAllCertNotifReadAction() {
  const ctx = await getCertContext()
  if (!ctx) return { ok: false, error: 'Unauthorized' }

  try {
    await prisma.notification.updateMany({
      where: { userId: ctx.userId, isRead: false },
      data: { isRead: true },
    })
    revalidatePath('/certification/notifications')
    revalidatePath('/certification/dashboard')
    return { ok: true }
  } catch (err: any) {
    console.error('[markAllCertNotifRead]', err?.message)
    return { ok: false, error: 'Gagal' }
  }
}

export async function deleteCertNotifAction(notificationId: string) {
  const ctx = await getCertContext()
  if (!ctx) return { ok: false, error: 'Unauthorized' }

  try {
    await prisma.notification.deleteMany({
      where: { id: notificationId, userId: ctx.userId },
    })
    revalidatePath('/certification/notifications')
    revalidatePath('/certification/dashboard')
    return { ok: true }
  } catch (err: any) {
    console.error('[deleteCertNotif]', err?.message)
    return { ok: false, error: 'Gagal' }
  }
}