// components/showcase/feed/showcase-filter-bar.tsx
'use client'

import { useState } from 'react'
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowDownUp,
  FolderTree,
} from 'lucide-react'

export type SortKey = 'terbaru' | 'terpopuler' | 'trending' | 'views'

type Props = {
  search: string
  onSearchChange: (v: string) => void
  category: string
  onCategoryChange: (v: string) => void
  sort: SortKey
  onSortChange: (v: SortKey) => void
  totalCount: number
}

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'Semua' },
  { value: 'software', label: 'Software' },
  { value: 'network', label: 'Jaringan' },
  { value: 'multimedia', label: 'Multimedia' },
  { value: 'mechatronics', label: 'Mekatronika' },
  { value: 'automotive', label: 'Otomotif' },
  { value: 'business', label: 'Bisnis' },
  { value: 'other', label: 'Lainnya' },
] as const

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'terpopuler', label: 'Terpopuler' },
  { value: 'trending', label: 'Trending' },
  { value: 'views', label: 'Paling Dilihat' },
]

export function ShowcaseFilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  totalCount,
}: Props) {
  const [filterOpen, setFilterOpen] = useState(false)
  const hasFilter = category !== 'all' || sort !== 'terbaru'

  return (
    <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 space-y-3">
        {/* Search + Filter button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari video, creator, atau skill..."
              className="flex-1 bg-transparent border-0 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
                aria-label="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className={`
              relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold
              transition-all shrink-0
              ${
                hasFilter
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-surface-container'
              }
            `}
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {hasFilter && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-white/25 text-[10px] font-black flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>

        {/* Filter drawer inline */}
        {filterOpen && (
          <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-4">
            {/* Category */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <FolderTree className="w-3.5 h-3.5 text-on-surface-variant" />
                <p className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                  Kategori
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => onCategoryChange(c.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      category === c.value
                        ? 'bg-primary text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ArrowDownUp className="w-3.5 h-3.5 text-on-surface-variant" />
                <p className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                  Urutkan
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => onSortChange(s.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      sort === s.value
                        ? 'bg-primary text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            {hasFilter && (
              <button
                type="button"
                onClick={() => {
                  onCategoryChange('all')
                  onSortChange('terbaru')
                }}
                className="text-xs font-bold text-primary hover:underline underline-offset-4"
              >
                Reset filter
              </button>
            )}
          </div>
        )}

        {/* Result count */}
        <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
          <span>
            <span className="font-bold text-on-surface">{totalCount}</span>{' '}
            video ditemukan
          </span>
        </div>
      </div>
    </div>
  )
}