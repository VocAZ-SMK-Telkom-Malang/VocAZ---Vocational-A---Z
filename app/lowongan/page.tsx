// app/lowongan/page.tsx
import type { Metadata } from 'next'
import { LandingHeader } from '@/components/landing/header'
import { LandingFooter } from '@/components/landing/footer'
import { JobsFilter } from '@/components/lowongan/jobs-filter'
import { JobsGrid } from '@/components/lowongan/jobs-grid'
import {
  getPublicJobs,
  getPublicJobStats,
  getPublicJobFilterOptions,
} from '@/lib/lowongan/queries'

export const metadata: Metadata = {
  title: 'Lowongan Kerja Vokasi — VocAZ',
  description:
    'Bursa kerja terverifikasi untuk lulusan SMK. Real companies, real openings.',
}

type Props = {
  searchParams: Promise<{
    search?: string
    city?: string
    type?: string
    mode?: string
    exp?: string
    page?: string
  }>
}

export default async function LowonganPage({ searchParams }: Props) {
  const params = await searchParams

  const search = params.search?.trim() || ''
  const city = params.city || 'all'
  const employmentType = params.type || 'all'
  const workMode = params.mode || 'all'
  const experienceLevel = params.exp || 'all'
  const page = Number(params.page) || 1

  const [result, stats, options] = await Promise.all([
    getPublicJobs({
      search,
      city,
      employmentType,
      workMode,
      experienceLevel,
      page,
      pageSize: 9,
    }),
    getPublicJobStats(),
    getPublicJobFilterOptions(),
  ])

  return (
    <>
      <LandingHeader />

      <main className="w-full min-h-screen pt-24 pb-16 bg-gradient-to-b from-[#fffaf5] via-[#fef4ea] to-surface">
        <JobsFilter options={options} stats={stats} />

        <JobsGrid
          jobs={result.jobs}
          pagination={result.pagination}
          searchParams={params}
        />
      </main>

      <LandingFooter />
    </>
  )
}