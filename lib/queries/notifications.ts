// lib/queries/notifications.ts
import { prisma } from '@/lib/prisma'

// ============================================
// TYPES
// ============================================

export type NotificationItem = {
  id: string
  type: string
  title: string | null
  body: string | null
  actionUrl: string | null
  isRead: boolean
  createdAt: string
  createdAtRelative: string
}

export type NotificationsData = {
  notifications: NotificationItem[]
  unreadCount: number
  totalCount: number
}

// ============================================
// HELPERS
// ============================================

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} jam lalu`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} hari lalu`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} minggu lalu`
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ============================================
// GET NOTIFICATIONS (userId)
// ============================================

export async function getNotifications(
  userId: string,
  options?: {
    unreadOnly?: boolean
    limit?: number
  }
): Promise<NotificationsData> {
  const { unreadOnly = false, limit } = options ?? {}

  const where: any = { userId }
  if (unreadOnly) where.isRead = false

  const [notifications, unreadCount, totalCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: limit } : {}),
    }),
    prisma.notification.count({ where: { userId, isRead: false } }),
    prisma.notification.count({ where: { userId } }),
  ])

  return {
    notifications: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      actionUrl: n.actionUrl,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
      createdAtRelative: relativeTime(n.createdAt),
    })),
    unreadCount,
    totalCount,
  }
}

// ============================================
// GET UNREAD COUNT ONLY (untuk bell badge)
// ============================================

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  })
}

// ============================================
// GET RECENT NOTIFICATIONS (untuk dropdown)
// ============================================

export async function getRecentNotifications(
  userId: string,
  limit = 5
): Promise<NotificationItem[]> {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return notifications.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body,
    actionUrl: n.actionUrl,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
    createdAtRelative: relativeTime(n.createdAt),
  }))
}

// ============================================
// GET CURRENT USER ID
// ============================================

export async function getCurrentUserId(
  neonAuthUserId: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { neonAuthUserId },
    select: { id: true },
  })
  return user?.id ?? null
}