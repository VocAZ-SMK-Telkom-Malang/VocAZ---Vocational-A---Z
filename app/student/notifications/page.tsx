// app/student/notifications/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { NotificationsPage } from '@/components/shared/notifications/notifications-page'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Notifikasi — VocAZ',
}

export async function getNotificationsForUser(userId: string) {
  const [notifications, unreadCount, totalCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.notification.count({ where: { userId, isRead: false } }),
    prisma.notification.count({ where: { userId } }),
  ])

  return { notifications, unreadCount, totalCount }
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

export default async function StudentNotificationsPage() {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: { id: true, role: true },
  })

  if (!user) redirect('/onboarding')
  if (user.role !== 'student') redirect('/company/dashboard')

  const { notifications, unreadCount, totalCount } =
    await getNotificationsForUser(user.id)

  return (
    <NotificationsPage
      notifications={notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title ?? '',
        body: n.body,
        actionUrl: n.actionUrl,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
        createdAtRelative: relativeTime(n.createdAt),
      }))}
      unreadCount={unreadCount}
      totalCount={totalCount}
    />
  )
}