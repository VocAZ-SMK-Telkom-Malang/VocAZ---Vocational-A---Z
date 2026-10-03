// app/company/jobs/page.tsx
import { redirect } from 'next/navigation'
import { getCompanyContext } from '@/lib/queries/company-dashboard'
import {
  getCompanyJobs,
  getCompanyJobsStats,
  getCompanyJobsFilterOptions,
  type JobFilter,
} from '@/lib/queries/company-jobs'
import { JobsClient } from './jobs-client'

export const metadata = {
  title: 'Lowongan Aktif — VocAZ',
}

type SearchParams = {
  search?: string
  status?: string
  employmentType?: string
  workMode?: string
  city?: string
  sort?: string
  page?: string
}

export default async function CompanyJobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const ctx = await getCompanyContext()
  if (!ctx) redirect('/register/company/1')

  const sp = await searchParams

  const filter: JobFilter = {
    search: sp.search?.trim() || '',
    status: (sp.status as JobFilter['status']) || 'all',
    employmentType: (sp.employmentType as JobFilter['employmentType']) || 'all',
    workMode: (sp.workMode as JobFilter['workMode']) || 'all',
    city: (sp.city as JobFilter['city']) || 'all',
    sort: (sp.sort as JobFilter['sort']) || 'newest',
    page: Number(sp.page) || 1,
  }

  const initialFilters = {
    search: filter.search ?? '',
    status: filter.status ?? 'all',
    employmentType: filter.employmentType ?? 'all',
    workMode: filter.workMode ?? 'all',
    city: filter.city ?? 'all',
    sort: filter.sort ?? 'newest',
  }

  const [stats, result, filterOptions] = await Promise.all([
    getCompanyJobsStats(ctx.companyId),
    getCompanyJobs(ctx.companyId, filter),
    getCompanyJobsFilterOptions(ctx.companyId),
  ])

  return (
    <JobsClient
      stats={stats}
      jobs={result.jobs}
      pagination={result.pagination}
      filterOptions={filterOptions}
      initialFilters={initialFilters}
    />
  )
}