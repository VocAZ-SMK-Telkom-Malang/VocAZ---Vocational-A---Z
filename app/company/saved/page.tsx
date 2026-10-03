// app/company/saved/page.tsx
import { redirect } from 'next/navigation'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import {
  getSavedTalents,
  getSavedFilterOptions,
  getSavedStats,
} from '@/lib/queries/company-saved'
import { CompanySavedClient } from './saved-client'

export const metadata = {
  title: 'Talent Pool — VocAZ',
}

type SearchParams = {
  search?: string
  city?: string
  skill?: string
  openToWork?: string
  sortBy?: string
  page?: string
}

export default async function CompanySavedPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const sp = await searchParams

  const filters = {
    search: sp.search?.trim() ?? '',
    city: sp.city ?? 'all',
    skill: sp.skill ?? 'all',
    openToWorkOnly: sp.openToWork === '1',
    sortBy: sp.sortBy ?? 'newest',
    page: Number(sp.page) || 1,
    pageSize: 12,
  }

  const [result, filterOptions, stats] = await Promise.all([
    getSavedTalents(ctx.companyId, filters),
    getSavedFilterOptions(ctx.companyId),
    getSavedStats(ctx.companyId),
  ])

  return (
    <CompanySavedClient
      talents={result.talents}
      pagination={result.pagination}
      stats={stats}
      filterOptions={filterOptions}
      initialFilters={{
        search: filters.search,
        city: filters.city,
        skill: filters.skill,
        openToWorkOnly: filters.openToWorkOnly,
        sortBy: filters.sortBy,
      }}
    />
  )
}