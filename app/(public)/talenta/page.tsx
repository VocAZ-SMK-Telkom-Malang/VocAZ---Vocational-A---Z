// app/(public)/talenta/page.tsx
import type { Metadata } from 'next'
import { TalentaClient } from './talenta-client'
import {
  getPublicTalents,
  getPublicTalentStats,
  getTalentFilterOptions,
} from '@/lib/talenta/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Talenta SMK — VocAZ',
  description:
    'Etalase talenta SMK terverifikasi BNSP & BKK. Setiap profil didukung portofolio nyata.',
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
    (params.status as 'all' | 'open_to_work' | 'verified') || 'all'
  const page = Number(params.page) || 1

  const [result, stats, options] = await Promise.all([
    getPublicTalents({
      search,
      city,
      major,
      status,
      page,
      pageSize: 9,
    }),
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