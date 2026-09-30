// components/student/jobs/filter-drawer.tsx
'use client'

import { useEffect, useState } from 'react'
import { X, RotateCcw, Check } from 'lucide-react'
import {
  LOCATION_OPTIONS,
  TYPE_OPTIONS,
  MODE_OPTIONS,
  DEFAULT_FILTERS,
  type JobFilters,
} from './types'

type Props = {
  open: boolean
  onClose: () => void
  filters: JobFilters
  onApply: (filters: JobFilters) => void
}

export function FilterDrawer({ open, onClose, filters, onApply }: Props) {
  const [draft, setDraft] = useState<JobFilters>(filters)

  // Sync draft pas drawer dibuka
  useEffect(() => {
    if (open) setDraft(filters)
  }, [open, filters])

  // Lock scroll + ESC
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
    (draft.location !== 'Semua Kota' ? 1 : 0) +
    draft.types.length +
    draft.modes.length

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 right-0 z-[70] h-screen w-full sm:w-[420px]
          bg-surface-container-lowest shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
        aria-hidden={!open}
      >
        {/* Header */}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
          {/* LOKASI */}
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">
              Lokasi
            </h3>
            <div className="space-y-1">
              {LOCATION_OPTIONS.map((loc) => {
                const selected = draft.location === loc
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setDraft({ ...draft, location: loc })}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      selected
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span>{loc}</span>
                    {selected && <Check className="w-4 h-4" />}
                  </button>
                )
              })}
            </div>
          </section>

          {/* TIPE PEKERJAAN */}
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">
              Tipe Pekerjaan
            </h3>
            <div className="space-y-1">
              {TYPE_OPTIONS.map((t) => {
                const checked = draft.types.includes(t)
                return (
                  <label
                    key={t}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      checked ? 'bg-primary/5' : 'hover:bg-surface-container'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setDraft({ ...draft, types: toggleArray(draft.types, t) })
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
                    <span className="text-sm font-medium text-on-surface">{t}</span>
                  </label>
                )
              })}
            </div>
          </section>

          {/* MODE KERJA */}
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">
              Mode Kerja
            </h3>
            <div className="space-y-1">
              {MODE_OPTIONS.map((m) => {
                const checked = draft.modes.includes(m)
                return (
                  <label
                    key={m}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                      checked ? 'bg-primary/5' : 'hover:bg-surface-container'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setDraft({ ...draft, modes: toggleArray(draft.modes, m) })
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
                    <span className="text-sm font-medium text-on-surface">{m}</span>
                  </label>
                )
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-outline-variant/30 shrink-0">
          <button
            type="button"
            onClick={() => setDraft(DEFAULT_FILTERS)}
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