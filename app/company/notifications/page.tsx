// app/company/notifications/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import { NotificationsPage } from '@/components/shared/notifications/notifications-page'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Notifikasi — VocAZ',
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

export default async function CompanyNotificationsPage() {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const session = await getServerSession()
  if (!session?.user?.id) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    select: { id: true },
  })

  if (!user) redirect('/onboarding')

  const [notifications, unreadCount, totalCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.notification.count({ where: { userId: user.id, isRead: false } }),
    prisma.notification.count({ where: { userId: user.id } }),
  ])

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