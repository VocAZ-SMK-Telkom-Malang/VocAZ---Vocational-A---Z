// app/actions/notifications.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/session'
import { revalidatePath } from 'next/cache'

// ============================================
// HELPER
// ============================================

async function requireUser() {
  const session = await getServerSession()
  if (!session?.user?.id) return { error: 'Unauthorized' as const }

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: { id: true, role: true },
  })

  if (!user) return { error: 'User tidak ditemukan' as const }

  return { user }
}

// ============================================
// FETCH NOTIFICATIONS (untuk dropdown)
// ============================================

export async function fetchNotifications(limit = 15) {
  const ctx = await requireUser()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  try {
    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      prisma.notification.count({
        where: { userId: ctx.user.id, isRead: false },
      }),
    ])

    return {
      ok: true,
      data: {
        items: notifications.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title ?? '',
          body: n.body,
          actionUrl: n.actionUrl,
          isRead: n.isRead,
          createdAt: n.createdAt.toISOString(),
        })),
        unreadCount,
      },
    }
  } catch (err: any) {
    console.error('[fetchNotifications] Error:', err?.message)
    return { ok: false, error: 'Gagal memuat notifikasi' }
  }
}

// ============================================
// MARK AS READ (single)
// ============================================

export async function markNotificationAsRead(notificationId: string) {
  const ctx = await requireUser()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const notif = await prisma.notification.findUnique({
    where: { id: notificationId },
    select: { id: true, userId: true, isRead: true },
  })

  if (!notif) return { ok: false, error: 'Notifikasi tidak ditemukan' }
  if (notif.userId !== ctx.user.id) return { ok: false, error: 'Tidak berhak' }
  if (notif.isRead) return { ok: true }

  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    })

    revalidatePath('/student/notifications')
    revalidatePath('/company/notifications')
    revalidatePath('/student/dashboard')
    revalidatePath('/company/dashboard')

    return { ok: true }
  } catch (err: any) {
    console.error('[markNotificationAsRead] Error:', err?.message)
    return { ok: false, error: 'Gagal update' }
  }
}

// ============================================
// MARK ALL AS READ
// ============================================

export async function markAllNotificationsAsRead() {
  const ctx = await requireUser()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  try {
    const result = await prisma.notification.updateMany({
      where: { userId: ctx.user.id, isRead: false },
      data: { isRead: true },
    })

    revalidatePath('/student/notifications')
    revalidatePath('/company/notifications')
    revalidatePath('/student/dashboard')
    revalidatePath('/company/dashboard')

    return { ok: true, count: result.count }
  } catch (err: any) {
    console.error('[markAllNotificationsAsRead] Error:', err?.message)
    return { ok: false, error: 'Gagal update' }
  }
}

// ============================================
// DELETE NOTIFICATION
// ============================================

export async function deleteNotification(notificationId: string) {
  const ctx = await requireUser()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  const notif = await prisma.notification.findUnique({
    where: { id: notificationId },
    select: { id: true, userId: true },
  })

  if (!notif) return { ok: false, error: 'Notifikasi tidak ditemukan' }
  if (notif.userId !== ctx.user.id) return { ok: false, error: 'Tidak berhak' }

  try {
    await prisma.notification.delete({ where: { id: notificationId } })

    revalidatePath('/student/notifications')
    revalidatePath('/company/notifications')

    return { ok: true }
  } catch (err: any) {
    console.error('[deleteNotification] Error:', err?.message)
    return { ok: false, error: 'Gagal hapus' }
  }
}

// ============================================
// CLEAR READ NOTIFICATIONS
// ============================================

export async function clearReadNotifications() {
  const ctx = await requireUser()
  if ('error' in ctx) return { ok: false, error: ctx.error }

  try {
    const result = await prisma.notification.deleteMany({
      where: { userId: ctx.user.id, isRead: true },
    })

    revalidatePath('/student/notifications')
    revalidatePath('/company/notifications')

    return { ok: true, count: result.count }
  } catch (err: any) {
    console.error('[clearReadNotifications] Error:', err?.message)
    return { ok: false, error: 'Gagal hapus' }
  }
}