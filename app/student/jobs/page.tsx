// app/student/jobs/page.tsx
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getJobs, getJobFilterOptions } from '@/lib/student/queries'
import { JobsSearch } from '@/components/student/jobs/jobs-search'
import { JobsFilter } from '@/components/student/jobs/jobs-filter'
import { JobCard } from '@/components/student/jobs/job-card'
import { JobsEmpty } from '@/components/student/jobs/jobs-empty'

type Props = {
  searchParams: Promise<{
    q?: string
    city?: string
    type?: string
    mode?: string
    page?: string
  }>
}

export default async function StudentJobsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = params.page ? parseInt(params.page) : 1

  const [data, filterOptions] = await Promise.all([
    getJobs({
      search: params.q,
      city: params.city,
      employmentType: params.type,
      workMode: params.mode,
      page,
      pageSize: 12,
    }),
    getJobFilterOptions(),
  ])

  const { jobs, total, totalPages } = data
  const hasFilter = !!(params.q || params.city || params.type || params.mode)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
          Cari Lowongan
        </h1>
        <p className="text-sm text-on-surface-variant">
          {total > 0
            ? `Ditemukan ${total} lowongan${hasFilter ? ' sesuai filter' : ''}`
            : 'Temukan lowongan yang cocok denganmu'}
        </p>
      </div>

      {/* Search */}
      <JobsSearch />

      {/* Grid: Filter + Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter sidebar */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <JobsFilter cities={filterOptions.cities} />
          </div>
        </aside>

        {/* Jobs list */}
        <div className="lg:col-span-3 space-y-4">
          {jobs.length === 0 ? (
            <JobsEmpty hasFilter={hasFilter} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  searchParams={params}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// PAGINATION
// ============================================

function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number
  totalPages: number
  searchParams: Record<string, string | undefined>
}) {
  function buildHref(page: number) {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== 'page') params.set(k, v)
    })
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return `/student/jobs${qs ? `?${qs}` : ''}`
  }

  const pages: number[] = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-on-surface-variant/40 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
          Prev
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={`inline-flex items-center justify-center min-w-[36px] h-9 px-3 rounded-lg text-sm font-semibold transition-colors ${
            p === currentPage
              ? 'bg-primary text-white'
              : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          {p}
        </Link>
      ))}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-on-surface-variant/40 cursor-not-allowed">
          Next
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </div>
  )
}