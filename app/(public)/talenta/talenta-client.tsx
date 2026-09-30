// app/(public)/talenta/talenta-client.tsx
'use client'

import { LandingHeader } from '@/components/landing/header'
import { LandingFooter } from '@/components/landing/footer'
import { TalentsFilter } from '@/components/talenta/talents-filter'
import { TalentsGrid } from '@/components/talenta/talents-grid'
import { TalentsCta } from '@/components/talenta/talents-cta'
import type { PublicTalent } from '@/lib/talenta/queries'

type Props = {
  talents: PublicTalent[]
  stats: {
    totalTalents: number
    verifiedTalents: number
    openToWork: number
    totalSkills: number
  }
  options: {
    cities: string[]
    programs: string[]
  }
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
  initialFilters: {
    search: string
    city: string
    major: string
    status: string
  }
}

export function TalentaClient({
  talents,
  stats,
  options,
  pagination,
  initialFilters,
}: Props) {
  return (
    <>
      <LandingHeader />

      <main className="w-full min-h-screen pt-24 bg-gradient-to-b from-[#FDFBF7] via-[#FFF8F5] to-[#FAF8F5]">
        <TalentsFilter options={options} stats={stats} />

        <TalentsGrid
          talents={talents}
          pagination={pagination}
          searchParams={initialFilters}
        />

        <TalentsCta totalTalents={stats.totalTalents} />
      </main>

      <LandingFooter />
    </>
  )
}