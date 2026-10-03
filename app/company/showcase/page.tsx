// app/company/showcase/page.tsx
import { redirect } from 'next/navigation'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import {
  getCompanyShowcaseVideos,
  getCompanyShowcaseFilterOptions,
  getCompanyShowcaseStats,
  type ShowcaseFilters,
} from '@/lib/queries/company-showcase'
import { CompanyShowcaseClient } from './showcase-client'

export const metadata = {
  title: 'Video Talent Showcase — VocAZ',
}

type SearchParams = {
  search?: string
  jobId?: string
  minScore?: string
  category?: string
  duration?: string
  sortBy?: string
  page?: string
}

export default async function CompanyShowcasePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const sp = await searchParams

  const filters = {
    search: sp.search?.trim() ?? '',
    jobId: sp.jobId ?? '',
    minScore: Number(sp.minScore) || 0,
    category: sp.category ?? 'all',
    durationFilter: sp.duration ?? 'all',
    sortBy: sp.sortBy ?? 'match',
    page: Number(sp.page) || 1,
    pageSize: 12,
  }

  const [result, filterOptions, stats] = await Promise.all([
    getCompanyShowcaseVideos(ctx.companyId, filters),
    getCompanyShowcaseFilterOptions(ctx.companyId),
    getCompanyShowcaseStats(ctx.companyId, filters.jobId),
  ])

  // Compute high match count
  const highMatch = result.videos.filter(
    (v) => (v.matchScore ?? 0) >= 80
  ).length

  return (
    <CompanyShowcaseClient
      videos={result.videos}
      pagination={result.pagination}
      stats={{
        ...stats,
        highMatch,
      }}
      filterOptions={filterOptions}
      initialFilters={{
        search: filters.search,
        jobId: filters.jobId,
        minScore: filters.minScore,
        category: filters.category,
        durationFilter: filters.durationFilter,
        sortBy: filters.sortBy,
      }}
    />
  )
}