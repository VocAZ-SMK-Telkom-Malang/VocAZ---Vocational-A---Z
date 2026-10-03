// components/company/saved/saved-grid.tsx
'use client'

import { SavedCard } from './saved-card'
import { SavedEmptyState } from './saved-empty-state'
import { ChevronLeft, ChevronRight, Bookmark } from 'lucide-react'
import type { SavedTalentItem } from '@/lib/queries/company-saved'

type Props = {
  talents: SavedTalentItem[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
  onPageChange: (page: number) => void
  onReset: () => void
}

export function SavedGrid({
  talents,
  pagination,
  onPageChange,
  onReset,
}: Props) {
  if (talents.length === 0) {
    return <SavedEmptyState onReset={onReset} />
  }

  const { currentPage, totalPages, totalItems, pageSize } = pagination
  const start = (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalItems)

  const pages: (number | '...')[] = []
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Bookmark className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold text-on-surface">
          Talent Pool Saya
        </h2>
        <span className="font-mono text-[11px] text-on-surface-variant">
          · {totalItems} kandidat
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {talents.map((t) => (
          <SavedCard key={t.id} talent={t} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 pt-4">
          <div className="text-xs text-on-surface-variant">
            Menampilkan{' '}
            <span className="font-bold text-on-surface">
              {start}–{end}
            </span>{' '}
            dari <span className="font-bold text-on-surface">{totalItems}</span>{' '}
            kandidat
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {pages.map((p, i) =>
              p === '...' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-8 h-8 flex items-center justify-center text-xs text-on-surface-variant"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={
                    p === currentPage
                      ? 'w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-white text-xs font-bold'
                      : 'w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container text-xs font-medium transition-colors'
                  }
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}