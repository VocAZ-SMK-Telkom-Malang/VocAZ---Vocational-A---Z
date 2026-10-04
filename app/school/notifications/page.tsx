// app/school/notifications/page.tsx
import { redirect } from 'next/navigation'
import { getSchoolContext } from '@/lib/queries/school-dashboard'
import { getSchoolNotifications } from '@/lib/queries/school-notifications'
import { SchoolNotificationsClient } from './notifications-client'

export const metadata = {
  title: 'Notifikasi — VocAZ BKK',
}

type SearchParams = Promise<{
  filter?: string
  page?: string
}>

export default async function SchoolNotificationsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const ctx = await getSchoolContext()
  if (!ctx) redirect('/auth/sign-in')

  const sp = await searchParams
  const filter = (sp.filter as 'all' | 'unread' | 'read') ?? 'all'
  const page = sp.page ? Number(sp.page) : 1

  const data = await getSchoolNotifications(ctx.userId, {
    filter,
    page,
    pageSize: 20,
  })

  return (
    <SchoolNotificationsClient
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