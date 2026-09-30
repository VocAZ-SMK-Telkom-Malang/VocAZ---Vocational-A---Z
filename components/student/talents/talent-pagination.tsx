// components/student/talents/talent-pagination.tsx
'use client'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

type Props = {
  page: number
  totalPages: number
  pageSize: number
  startIndex: number
  endIndex: number
  totalItems: number
  onPageChange: (p: number) => void
  onPageSizeChange: (s: number) => void
  pageSizeOptions?: number[]
}

export function TalentPagination({
  page,
  totalPages,
  pageSize,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 9, 12, 18],
}: Props) {
  const canPrev = page > 1
  const canNext = page < totalPages

  function getPageNumbers(): (number | '...')[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const range: (number | '...')[] = [1]
    const left = Math.max(2, page - 1)
    const right = Math.min(totalPages - 1, page + 1)
    if (left > 2) range.push('...')
    for (let i = left; i <= right; i++) range.push(i)
    if (right < totalPages - 1) range.push('...')
    range.push(totalPages)
    return range
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-6 border-t border-outline-variant/30">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <p className="text-xs text-on-surface-variant">
          Menampilkan{' '}
          <span className="font-bold text-on-surface">
            {startIndex + 1}–{endIndex}
          </span>{' '}
          dari <span className="font-bold text-on-surface">{totalItems}</span>{' '}
          talent
        </p>

        <div className="flex items-center gap-2">
          <label
            htmlFor="talentPageSize"
            className="text-xs text-on-surface-variant font-medium"
          >
            Per halaman
          </label>
          <select
            id="talentPageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-xs font-bold bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-2 py-1.5 text-on-surface hover:border-primary/40 focus:outline-none focus:border-primary/60 cursor-pointer"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!canPrev}
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman pertama"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          className="flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((n, i) =>
          n === '...' ? (
            <span
              key={`e-${i}`}
              className="w-9 h-9 flex items-center justify-center text-on-surface-variant text-sm select-none"
            >
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              aria-current={n === page ? 'page' : undefined}
              className={`min-w-[36px] h-9 px-2.5 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                n === page
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'text-on-surface hover:bg-surface-container'
              }`}
            >
              {n}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          className="flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={!canNext}
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Halaman terakhir"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  )
}