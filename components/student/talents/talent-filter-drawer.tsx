// components/student/talents/talent-filter-drawer.tsx
'use client'

import { useEffect, useState } from 'react'
import { X, RotateCcw, Check, MapPin, GraduationCap, Award } from 'lucide-react'

export type TalentFilters = {
  skills: string[]
  cities: string[]
  schools: string[]
  openToWorkOnly: boolean
  hasPortfolio: boolean
  hasCertificate: boolean
  sort: 'recent' | 'popular' | 'name-asc' | 'skills'
}

export const DEFAULT_FILTERS: TalentFilters = {
  skills: [],
  cities: [],
  schools: [],
  openToWorkOnly: false,
  hasPortfolio: false,
  hasCertificate: false,
  sort: 'recent',
}

type FilterOptions = {
  skills: { id: string; name: string; category: string | null }[]
  cities: string[]
  schools: { id: string; name: string; city: string | null }[]
}

type Props = {
  open: boolean
  onClose: () => void
  filters: TalentFilters
  options: FilterOptions
  onApply: (filters: TalentFilters) => void
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Terbaru' },
  { value: 'popular', label: 'Terpopuler' },
  { value: 'name-asc', label: 'Nama A-Z' },
  { value: 'skills', label: 'Skill Terbanyak' },
] as const

export function TalentFilterDrawer({
  open,
  onClose,
  filters,
  options,
  onApply,
}: Props) {
  const [draft, setDraft] = useState<TalentFilters>(filters)

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
    draft.skills.length +
    draft.cities.length +
    draft.schools.length +
    (draft.openToWorkOnly ? 1 : 0) +
    (draft.hasPortfolio ? 1 : 0) +
    (draft.hasCertificate ? 1 : 0)

  // Group skills by category
  const skillsByCategory = options.skills.reduce(
    (acc, s) => {
      const cat = s.category || 'Lainnya'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(s)
      return acc
    },
    {} as Record<string, typeof options.skills>
  )

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
          fixed top-0 right-0 z-[70] h-screen w-full sm:w-[440px]
          bg-surface-container-lowest shadow-2xl flex flex-col
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
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-7">
          {/* Open to work + Portfolio + Cert */}
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">
              Filter Cepat
            </h3>
            <div className="space-y-2">
              <ToggleCheckbox
                checked={draft.openToWorkOnly}
                onChange={(v) => setDraft({ ...draft, openToWorkOnly: v })}
                label="Open to Work"
                description="Talent yang sedang mencari kerja"
              />
              <ToggleCheckbox
                checked={draft.hasPortfolio}
                onChange={(v) => setDraft({ ...draft, hasPortfolio: v })}
                label="Punya Portfolio"
                description="Minimal 1 project di portfolio"
              />
              <ToggleCheckbox
                checked={draft.hasCertificate}
                onChange={(v) => setDraft({ ...draft, hasCertificate: v })}
                label="Punya Sertifikat Verified"
                description="Minimal 1 sertifikat terverifikasi"
              />
            </div>
          </section>

          {/* Sort */}
          <section>
            <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">
              Urutkan
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setDraft({ ...draft, sort: opt.value as any })
                  }
                  className={`p-3 rounded-xl border text-xs font-bold transition-colors ${
                    draft.sort === opt.value
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'border-outline-variant/30 text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <div className="flex items-center gap-1.5 mb-3">
              <Award className="w-3.5 h-3.5 text-on-surface-variant" />
              <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant">
                Skills
              </h3>
            </div>
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([cat, skills]) => (
                <div key={cat}>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 mb-2">
                    {cat}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => {
                      const checked = draft.skills.includes(s.name)
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() =>
                            setDraft({
                              ...draft,
                              skills: toggleArray(draft.skills, s.name),
                            })
                          }
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            checked
                              ? 'bg-primary text-white'
                              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                        >
                          {s.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cities */}
          {options.cities.length > 0 && (
            <section>
              <div className="flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-on-surface-variant" />
                <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant">
                  Lokasi
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {options.cities.map((city) => {
                  const checked = draft.cities.includes(city)
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          cities: toggleArray(draft.cities, city),
                        })
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        checked
                          ? 'bg-primary text-white'
                          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      {city}
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {/* Schools */}
          {options.schools.length > 0 && (
            <section>
              <div className="flex items-center gap-1.5 mb-3">
                <GraduationCap className="w-3.5 h-3.5 text-on-surface-variant" />
                <h3 className="font-mono text-[11px] uppercase tracking-wider font-bold text-on-surface-variant">
                  Sekolah
                </h3>
              </div>
              <div className="space-y-1">
                {options.schools.slice(0, 20).map((school) => {
                  const checked = draft.schools.includes(school.name)
                  return (
                    <label
                      key={school.id}
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
                            schools: toggleArray(draft.schools, school.name),
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
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-on-surface truncate">
                          {school.name}
                        </p>
                        {school.city && (
                          <p className="text-[10px] text-on-surface-variant">
                            {school.city}
                          </p>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>
            </section>
          )}
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

function ToggleCheckbox({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <label
      className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-colors border ${
        checked
          ? 'bg-primary/5 border-primary/30'
          : 'border-outline-variant/30 hover:bg-surface-container'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
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
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-on-surface">{label}</p>
        {description && (
          <p className="text-[11px] text-on-surface-variant mt-0.5">
            {description}
          </p>
        )}
      </div>
    </label>
  )
}