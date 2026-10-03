// app/company/talent/talent-client.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { TalentDiscoveryHeader } from '@/components/company/talent/talent-discovery-header'
import { TalentFilters } from '@/components/company/talent/talent-filters'
import { TalentGrid } from '@/components/company/talent/talent-grid'
import type {
  TalentCard,
  TalentFilterOptions,
} from '@/lib/queries/company-talent'

type Props = {
  talents: TalentCard[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
  stats: {
    totalTalents: number
    openToWork: number
    withCertificates: number
    activeJobs: number
  }
  filterOptions: TalentFilterOptions
  initialFilters: {
    search: string
    jobId: string
    minScore: number
    city: string
    skill: string
    openToWorkOnly: boolean
    sortBy: string
  }
}

export function CompanyTalentClient({
  talents,
  pagination,
  stats,
  filterOptions,
  initialFilters,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/company/talent?${params.toString()}`)
  }

  function handleReset() {
    router.push('/company/talent')
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <TalentDiscoveryHeader stats={stats} />

      <TalentFilters
        filterOptions={filterOptions}
        initialFilters={initialFilters}
      />

      <TalentGrid
        talents={talents}
        pagination={pagination}
        hasJobSelected={!!initialFilters.jobId}
        onPageChange={handlePageChange}
        onReset={handleReset}
      />
    </div>
  )
}