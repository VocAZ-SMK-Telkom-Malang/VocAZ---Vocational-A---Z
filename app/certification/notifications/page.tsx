// app/certification/notifications/page.tsx
import { redirect } from 'next/navigation'
import { getCertContext } from '@/lib/queries/cert-context'
import { getCertNotifications } from '@/lib/queries/cert-notifications'
import { CertNotificationsClient } from './notifications-client'

export const metadata = {
  title: 'Notifikasi — VocAZ Verifier',
}

type SearchParams = Promise<{ filter?: string; page?: string }>

export default async function CertNotificationsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const ctx = await getCertContext()
  if (!ctx) redirect('/auth/sign-in')

  const sp = await searchParams
  const filter = (sp.filter as 'all' | 'unread' | 'read') ?? 'all'
  const page = sp.page ? Number(sp.page) : 1

  const data = await getCertNotifications(ctx.userId, {
    filter,
    page,
    pageSize: 20,
  })

  return (
    <CertNotificationsClient
      notifications={data.notifications}
      pagination={{
        page: data.page,
        totalPages: data.totalPages,
        total: data.total,
      }}
      filter={filter}
      unreadCount={data.unreadCount}
    />
  )
}