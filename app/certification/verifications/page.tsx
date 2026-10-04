// app/certification/verifications/page.tsx
import { redirect } from 'next/navigation'
import { getCertContext } from '@/lib/queries/cert-context'
import { getVerifications } from '@/lib/queries/cert-verifications'
import { VerificationsClient } from './verifications-client'

export const metadata = {
  title: 'Pengajuan Verifikasi — VocAZ Verifier',
}

type SearchParams = Promise<{
  status?: string
  q?: string
  badge?: string
  page?: string
}>

export default async function VerificationsPage({
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
  const page = sp.page ? Number(sp.page) : 1

  const data = await getVerifications(ctx.institutionId, {
    status,
    search,
    badgeType,
    page,
    pageSize: 20,
  })

  return (
    <VerificationsClient
      verifications={data.verifications}
      pagination={{
        page: data.page,
        totalPages: data.totalPages,
        total: data.total,
      }}
      counts={data.counts}
      filters={{ status, search, badgeType }}
    />
  )
}