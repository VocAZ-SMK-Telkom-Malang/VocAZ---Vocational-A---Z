// components/perusahaan/companies-grid.tsx
import Link from 'next/link'
import { Building2, ChevronLeft, ChevronRight, SearchX } from 'lucide-react'
import { CompanyCard } from './company-card'
import type { PublicCompany } from '@/lib/perusahaan/queries'

type Props = {
  companies: PublicCompany[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
  searchParams: Record<string, string | undefined>
}

export function CompaniesGrid({ companies, pagination, searchParams }: Props) {
  if (companies.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center">
            <SearchX className="w-10 h-10 text-on-surface-variant" />
          </div>
          <h3 className="font-display text-xl font-bold text-on-surface">
            Tidak ada perusahaan yang cocok
          </h3>
          <p className="text-sm text-on-surface-variant">
            Coba ubah filter atau kata kunci pencarian kamu.
          </p>
          <Link
            href="/perusahaan"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-display font-semibold shadow-md hover:bg-primary-container transition"
          >
            Reset Filter
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-tertiary-container font-mono text-[11px] uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Mitra Industri</span>
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            Direktori Perusahaan Mitra
          </h2>
        </div>
        <p className="text-sm text-on-surface-variant">
          Menampilkan {companies.length} dari {pagination.totalItems} perusahaan
        </p>
      </div>

      {/* Grid 3 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          searchParams={searchParams}
        />
      )}
    </section>
  )
}

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
    return `/perusahaan${qs ? `?${qs}` : ''}`
  }

  const pages: (number | '...')[] = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-1 pt-10">
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-on-surface-variant/40 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </span>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            className="px-3 py-2 text-sm text-on-surface-variant"
          >
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`inline-flex items-center justify-center min-w-[38px] h-9 px-3 rounded-lg text-sm font-semibold transition-colors ${
              p === currentPage
                ? 'bg-gradient-to-r from-[#ff5757] to-[#dc2626] text-white shadow-sm'
                : 'text-on-surface hover:bg-surface-container'
            }`}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-on-surface-variant/40 cursor-not-allowed">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </div>
  )
}