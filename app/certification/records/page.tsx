// app/certification/records/page.tsx
import { redirect } from 'next/navigation'
import { getCertContext } from '@/lib/queries/cert-context'
import { getCertRecords, getCertRecordsStats } from '@/lib/queries/cert-records'
import { RecordsClient } from './records-client'

export const metadata = {
  title: 'Riwayat Verifikasi — VocAZ Verifier',
}

type SearchParams = Promise<{
  status?: string
  q?: string
  badge?: string
  period?: string
  page?: string
}>

export default async function RecordsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const ctx = await getCertContext()
  if (!ctx) redirect('/auth/sign-in')

  const sp = await searchParams
  const status = (sp.status as any) ?? 'all'
  const search = sp.q ?? ''
  const badgeType = sp.badge ?? 'all'
  const period = (sp.period as any) ?? 'all'
  const page = sp.page ? Number(sp.page) : 1

  const [data, stats] = await Promise.all([
    getCertRecords(ctx.institutionId, {
      status,
      search,
      badgeType,
      period,
      page,
      pageSize: 20,
    }),
    getCertRecordsStats(ctx.institutionId),
  ])

  return (
    <RecordsClient
      records={data.records}
      pagination={{
        page: data.page,
        totalPages: data.totalPages,
        total: data.total,
      }}
      counts={data.counts}
      stats={stats}
      filters={{ status, search, badgeType, period }}
    />
  )
}