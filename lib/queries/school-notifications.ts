// lib/queries/school-notifications.ts
import { prisma } from '@/lib/prisma'

export type NotificationItem = {
  id: string
  type: string
  title: string
  body: string | null
  actionUrl: string | null
  isRead: boolean
  createdAt: string
  createdAtRelative: string
}

export type NotificationsFilter = {
  filter?: 'all' | 'unread' | 'read'
  page?: number
  pageSize?: number
}

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

export async function getSchoolNotifications(
  userId: string,
  filters: NotificationsFilter = {}
) {
  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? 20
  const skip = (page - 1) * pageSize
  const filter = filters.filter ?? 'all'

  const where: any = { userId }
  if (filter === 'unread') where.isRead = false
  if (filter === 'read') where.isRead = true

  const [rows, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where }),
    prisma.notification.count({
      where: { userId, isRead: false },
    }),
  ])

  return {
    notifications: rows.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title ?? 'Notifikasi', // ← title nullable, kasih fallback
      body: n.body ?? null,
      actionUrl: n.actionUrl ?? null,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
      createdAtRelative: relativeTime(n.createdAt),
    })),
    total,
    unreadCount,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}