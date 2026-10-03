// app/company/talent/page.tsx
import { redirect } from 'next/navigation'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import {
  getCompanyTalents,
  getCompanyTalentFilterOptions,
  getCompanyTalentStats,
} from '@/lib/queries/company-talent'
import { CompanyTalentClient } from './talent-client'

export const metadata = {
  title: 'Smart Talent Match — VocAZ',
}

type SearchParams = {
  search?: string
  jobId?: string
  minScore?: string
  city?: string
  skill?: string
  openToWork?: string
  sortBy?: string
  page?: string
}

export default async function CompanyTalentPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const sp = await searchParams

  const sortBy: 'name' | 'newest' | 'match' =
    sp.sortBy === 'name' || sp.sortBy === 'newest' || sp.sortBy === 'match'
      ? sp.sortBy
      : 'match'

  const filters = {
    search: sp.search?.trim() ?? '',
    jobId: sp.jobId ?? '',
    minScore: Number(sp.minScore) || 0,
    city: sp.city ?? '',
    skill: sp.skill ?? '',
    openToWorkOnly: sp.openToWork === '1',
    sortBy,
    page: Number(sp.page) || 1,
    pageSize: 12,
  }

  const [result, filterOptions, stats] = await Promise.all([
    getCompanyTalents(ctx.companyId, filters),
    getCompanyTalentFilterOptions(ctx.companyId),
    getCompanyTalentStats(ctx.companyId),
  ])

  return (
    <CompanyTalentClient
      talents={result.talents}
      pagination={result.pagination}
      stats={stats}
      filterOptions={filterOptions}
      initialFilters={{
        search: filters.search,
        jobId: filters.jobId,
        minScore: filters.minScore,
        city: filters.city,
        skill: filters.skill,
        openToWorkOnly: filters.openToWorkOnly,
        sortBy: filters.sortBy,
      }}
    />
  )
}