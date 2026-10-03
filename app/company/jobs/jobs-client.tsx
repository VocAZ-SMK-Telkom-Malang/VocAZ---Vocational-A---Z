// app/company/jobs/jobs-client.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { JobsStatsStrip } from '@/components/company/jobs/jobs-stats-strip'
import { JobsFilter } from '@/components/company/jobs/jobs-filter'
import { JobsTable } from '@/components/company/jobs/jobs-table'
import { JobsEmptyState } from '@/components/company/jobs/jobs-empty-state'
import { JobsPagination } from '@/components/company/jobs/jobs-pagination'
import type {
  JobListItem,
  JobStats,
} from '@/lib/queries/company-jobs'

type Props = {
  stats: JobStats
  jobs: JobListItem[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
  filterOptions: {
    cities: string[]
    employmentTypes: string[]
    workModes: string[]
  }
  initialFilters: {
    search: string
    status: string
    employmentType: string
    workMode: string
    city: string
    sort: string
  }
}

export function JobsClient({
  stats,
  jobs,
  pagination,
  filterOptions,
  initialFilters,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [isPending, setIsPending] = useState(false)

  const updateURL = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') params.set(key, value)
      else params.delete(key)
    })
    // Reset page kalau filter berubah
    if (!('page' in overrides)) params.delete('page')

    setIsPending(true)
    startTransition(() => {
      router.push(`/company/jobs?${params.toString()}`)
      setTimeout(() => setIsPending(false), 300)
    })
  }

  const handlePageChange = (page: number) => {
    updateURL({ page: String(page) })
  }

  const handleReset = () => {
    router.push('/company/jobs')
  }

  const hasFilter = Boolean(
    initialFilters.search ||
      initialFilters.status !== 'all' ||
      initialFilters.employmentType !== 'all' ||
      initialFilters.workMode !== 'all' ||
      initialFilters.city !== 'all'
  )

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            Manajemen Rekrutmen
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola lowongan kerja aktif Anda dan tinjau pelamar yang masuk.
          </p>
        </div>

        <Link
          href="/company/jobs/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-[0_4px_16px_rgba(183,0,17,0.20)] hover:bg-primary-container transition-all hover:scale-[1.02] shrink-0"
        >
          <Plus className="w-4 h-4" />
          Posting Lowongan
        </Link>
      </div>

      {/* Stats */}
      <JobsStatsStrip stats={stats} />

      {/* Filter */}
      <JobsFilter
        initialSearch={initialFilters.search}
        initialStatus={initialFilters.status}
        initialEmploymentType={initialFilters.employmentType}
        initialWorkMode={initialFilters.workMode}
        initialCity={initialFilters.city}
        initialSort={initialFilters.sort}
        cities={filterOptions.cities}
        employmentTypes={filterOptions.employmentTypes}
        workModes={filterOptions.workModes}
        onFilterChange={updateURL}
      />

      {/* Table */}
      {jobs.length === 0 ? (
        <JobsEmptyState hasFilter={hasFilter} onReset={handleReset} />
      ) : (
        <div className={isPending ? 'opacity-60 transition-opacity' : ''}>
          <JobsTable jobs={jobs} />
          <JobsPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}