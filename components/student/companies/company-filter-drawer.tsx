// components/student/companies/company-filter-drawer.tsx
'use client'

import { useEffect, useState } from 'react'
import { X, RotateCcw, Check, BadgeCheck } from 'lucide-react'
import {
  INDUSTRY_OPTIONS,
  COMPANY_LOCATION_OPTIONS,
  SIZE_OPTIONS,
  DEFAULT_COMPANY_FILTERS,
  type CompanyFilters,
} from './types'

type Props = {
  open: boolean
  onClose: () => void
  filters: CompanyFilters
  onApply: (filters: CompanyFilters) => void
}

export function CompanyFilterDrawer({ open, onClose, filters, onApply }: Props) {
  const [draft, setDraft] = useState<CompanyFilters>(filters)

  useEffect(() => {
    if (open) setDraft(filters)
  }, [open, filters])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  function toggleArray(arr: string[], val: string) {
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
  }

  const activeCount =
    draft.industries.length +
    draft.locations.length +
    draft.sizes.length +
    (draft.verifiedOnly ? 1 : 0)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 z-[70] h-screen w-full sm:w-[420px]
          bg-surface-container-lowest shadow-2xl flex flex-col
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-on-surface">Filter</h2>
            {activeCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold">
                {activeCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Tutup filter"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
          <section>
            <label
              className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors border ${
                draft.verifiedOnly
                  ? 'bg-primary/5 border-primary/30'
                  : 'border-outline-variant/30 hover:bg-surface-container'
              }`}
            >
              <input
                type="checkbox"
                checked={draft.verifiedOnly}
                onChange={(e) =>
                  setDraft({ ...draft, verifiedOnly: e.target.checked })
                }
                className="sr-only"
              />
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  draft.verifiedOnly
                    ? 'bg-primary text-white'
                    : 'bg-surface-container ring-1 ring-outline-variant/50'
                }`}
              >
                {draft.verifiedOnly && <Check className="w-3.5 h-3.5" />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-on-surface">
                    Hanya perusahaan terverifikasi
                  </span>
                </div>
              </div>
            </label>
          </section>

          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">
              Industri
            </h3>
            <div className="space-y-1">
              {INDUSTRY_OPTIONS.map((ind) => {
                const checked = draft.industries.includes(ind)
                return (
                  <label
                    key={ind}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      checked ? 'bg-primary/5' : 'hover:bg-surface-container'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setDraft({
                          ...draft,
                          industries: toggleArray(draft.industries, ind),
                        })
                      }
                      className="sr-only"
                    />
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                        checked
                          ? 'bg-primary text-white'
                          : 'bg-surface-container ring-1 ring-outline-variant/50'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-sm font-medium text-on-surface">
                      {ind}
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">
              Lokasi
            </h3>
            <div className="flex flex-wrap gap-2">
              {COMPANY_LOCATION_OPTIONS.map((loc) => {
                const checked = draft.locations.includes(loc)
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        locations: toggleArray(draft.locations, loc),
                      })
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      checked
                        ? 'bg-primary text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {loc}
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">
              Ukuran Perusahaan
            </h3>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((s) => {
                const checked = draft.sizes.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      setDraft({ ...draft, sizes: toggleArray(draft.sizes, s) })
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      checked
                        ? 'bg-primary text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </section>
        </div>

        <div className="flex items-center gap-3 px-5 py-4 border-t border-outline-variant/30 shrink-0">
          <button
            type="button"
            onClick={() => setDraft(DEFAULT_COMPANY_FILTERS)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Terapkan{activeCount > 0 ? ` (${activeCount})` : ''}
          </button>
        </div>
      </aside>
    </>
  )
}