// app/company/saved/saved-client.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SavedHeader } from '@/components/company/saved/saved-header'
import { SavedFilters } from '@/components/company/saved/saved-filters'
import { SavedGrid } from '@/components/company/saved/saved-grid'
import type {
  SavedTalentItem,
  SavedFilterOptions,
} from '@/lib/queries/company-saved'

type Props = {
  talents: SavedTalentItem[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
  stats: {
    total: number
    openToWork: number
    verified: number
    thisWeek: number
  }
  filterOptions: SavedFilterOptions
  initialFilters: {
    search: string
    city: string
    skill: string
    openToWorkOnly: boolean
    sortBy: string
  }
}

export function CompanySavedClient({
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
    router.push(`/company/saved?${params.toString()}`)
  }

  function handleReset() {
    router.push('/company/saved')
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <SavedHeader stats={stats} />

      <SavedFilters
        filterOptions={filterOptions}
        initialFilters={initialFilters}
      />

      <SavedGrid
        talents={talents}
        pagination={pagination}
        onPageChange={handlePageChange}
        onReset={handleReset}
      />
    </div>
  )
}