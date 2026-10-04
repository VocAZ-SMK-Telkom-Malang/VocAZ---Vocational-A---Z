import type { Metadata } from 'next'
import { TalentaClient } from './talenta-client'
import {
  getPublicTalents,
  getPublicTalentStats,
  getTalentFilterOptions,
} from '@/lib/talenta/queries'

export const metadata: Metadata = {
  title: 'Talenta SMK — VocAZ',
  description: 'Temukan talenta SMK terverifikasi di VocAZ.',
}

type Props = {
  searchParams: Promise<{
    search?: string
    city?: string
    major?: string
    status?: string
    page?: string
  }>
}

export default async function TalentaPage({ searchParams }: Props) {
  const params = await searchParams
  const search = params.search?.trim() || ''
  const city = params.city || 'all'
  const major = params.major || 'all'
  const status =
    params.status === 'open_to_work' || params.status === 'verified'
      ? params.status
      : 'all'
  const requestedPage = Number(params.page)
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

  const [result, stats, options] = await Promise.all([
    getPublicTalents({ search, city, major, status, page, pageSize: 9 }),
    getPublicTalentStats(),
    getTalentFilterOptions(),
  ])

  return (
    <TalentaClient
      talents={result.talents}
      stats={stats}
      options={options}
      pagination={result.pagination}
      initialFilters={{ search, city, major, status }}
    />
  )
}
