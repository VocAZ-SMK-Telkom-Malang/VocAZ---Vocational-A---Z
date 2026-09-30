// components/student/talents/talents-client.tsx
'use client'

import { useMemo, useState, useEffect } from 'react'
import { TalentHero } from './talent-hero'
import { TalentGrid } from './talent-grid'
import { TalentFilterDrawer } from './talent-filter-drawer'
import { TalentPagination } from './talent-pagination'
import type { TalentItem } from '@/lib/queries/talents'
import type { FilterOptions } from '@/lib/queries/talents'

type TalentFilters = {
  search?: string
  skills?: string[]
  cities?: string[]
  schools?: string[]
  openToWorkOnly?: boolean
  hasPortfolio?: boolean
  hasCertificate?: boolean
  sort?: 'recent' | 'popular' | 'name-asc' | 'skills'
}

type DrawerFilters = {
  skills: string[]
  cities: string[]
  schools: string[]
  openToWorkOnly: boolean
  hasPortfolio: boolean
  hasCertificate: boolean
  sort: 'recent' | 'popular' | 'name-asc' | 'skills'
}

type Props = {
  initialTalents: TalentItem[]
  filterOptions: FilterOptions
  currentStudentProfileId: string | null
}

const DRAWER_DEFAULT: DrawerFilters = {
  skills: [],
  cities: [],
  schools: [],
  openToWorkOnly: false,
  hasPortfolio: false,
  hasCertificate: false,
  sort: 'recent',
}

export function TalentsClient({
  initialTalents,
  filterOptions,
  currentStudentProfileId,
}: Props) {
  const [talents] = useState(initialTalents)
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerFilters, setDrawerFilters] =
    useState<DrawerFilters>(DRAWER_DEFAULT)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(9)

  // Filter
  const filtered = useMemo(() => {
    return talents.filter((t) => {
      // Search
      if (search) {
        const q = search.toLowerCase().trim()
        const hit =
          t.fullName.toLowerCase().includes(q) ||
          (t.headline ?? '').toLowerCase().includes(q) ||
          (t.city ?? '').toLowerCase().includes(q) ||
          (t.schoolName ?? '').toLowerCase().includes(q) ||
          t.topSkills.some((s) => s.toLowerCase().includes(q))
        if (!hit) return false
      }

      // Skills
      if (drawerFilters.skills.length > 0) {
        const hasSkill = drawerFilters.skills.some((s) =>
          t.topSkills.includes(s)
        )
        if (!hasSkill) return false
      }

      // Cities
      if (drawerFilters.cities.length > 0) {
        if (!t.city || !drawerFilters.cities.includes(t.city)) return false
      }

      // Schools
      if (drawerFilters.schools.length > 0) {
        if (!t.schoolName || !drawerFilters.schools.includes(t.schoolName))
          return false
      }

      // Open to work
      if (drawerFilters.openToWorkOnly && !t.isOpenToWork) return false

      // Has portfolio
      if (drawerFilters.hasPortfolio && t.portfolioCount === 0) return false

      // Has certificate
      if (drawerFilters.hasCertificate && t.certificateCount === 0) return false

      return true
    })
  }, [talents, search, drawerFilters])

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered]
    switch (drawerFilters.sort) {
      case 'popular':
        return arr.sort((a, b) => b.followerCount - a.followerCount)
      case 'name-asc':
        return arr.sort((a, b) => a.fullName.localeCompare(b.fullName))
      case 'skills':
        return arr.sort((a, b) => b.topSkills.length - a.topSkills.length)
      default:
        return arr
    }
  }, [filtered, drawerFilters.sort])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, sorted.length)
  const paginated = sorted.slice(startIndex, endIndex)

  useEffect(() => {
    setPage(1)
  }, [search, drawerFilters, pageSize])

  // Active filter count
  const activeFilterCount =
    drawerFilters.skills.length +
    drawerFilters.cities.length +
    drawerFilters.schools.length +
    (drawerFilters.openToWorkOnly ? 1 : 0) +
    (drawerFilters.hasPortfolio ? 1 : 0) +
    (drawerFilters.hasCertificate ? 1 : 0)

  // Stats
  const openToWorkCount = talents.filter((t) => t.isOpenToWork).length
  const verifiedCount = talents.filter((t) => t.certificateCount > 0).length

  const hasFilter = activeFilterCount > 0 || search.length > 0

  function handleReset() {
    setSearch('')
    setDrawerFilters(DRAWER_DEFAULT)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <TalentHero
        search={search}
        onSearchChange={setSearch}
        onFilterClick={() => setDrawerOpen(true)}
        activeFilterCount={activeFilterCount}
        totalTalents={talents.length}
        openToWorkCount={openToWorkCount}
        verifiedCount={verifiedCount}
      />

      {/* Result count */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-on-surface-variant">
          Menampilkan{' '}
          <span className="font-bold text-on-surface">{sorted.length}</span>{' '}
          talent
        </p>
        {hasFilter && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-primary hover:underline underline-offset-4"
          >
            Reset semua
          </button>
        )}
      </div>

      {/* Grid */}
      <TalentGrid
        talents={paginated}
        currentStudentProfileId={currentStudentProfileId}
        hasFilter={hasFilter}
        onReset={handleReset}
      />

      {/* Pagination */}
      {sorted.length > 0 && (
        <TalentPagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={sorted.length}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Filter Drawer */}
      <TalentFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={drawerFilters}
        options={filterOptions}
        onApply={setDrawerFilters}
      />
    </div>
  )
}