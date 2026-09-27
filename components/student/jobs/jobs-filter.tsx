// components/student/jobs/jobs-filter.tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'

type Props = {
  cities: string[]
}

const EMPLOYMENT_TYPES = [
  { value: 'all', label: 'Semua Tipe' },
  { value: 'internship', label: 'Magang' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'full_time', label: 'Full-time' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'contract', label: 'Kontrak' },
]

const WORK_MODES = [
  { value: 'all', label: 'Semua Mode' },
  { value: 'onsite', label: 'Onsite' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
]

export function JobsFilter({ cities }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const city = searchParams.get('city') || 'all'
  const employmentType = searchParams.get('type') || 'all'
  const workMode = searchParams.get('mode') || 'all'

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete('page') // reset page
    router.push(`/student/jobs?${params.toString()}`)
  }

  function resetFilters() {
    const params = new URLSearchParams()
    const q = searchParams.get('q')
    if (q) params.set('q', q)
    router.push(`/student/jobs?${params.toString()}`)
  }

  const hasActiveFilter =
    city !== 'all' || employmentType !== 'all' || workMode !== 'all'

  return (
    <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-on-surface-variant" />
        <h3 className="font-display text-sm font-bold text-on-surface">
          Filter
        </h3>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={resetFilters}
            className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* City */}
        <div>
          <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
            Lokasi
          </label>
          <select
            value={city}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="all">Semua Kota</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
            Tipe Pekerjaan
          </label>
          <select
            value={employmentType}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Work Mode */}
        <div>
          <label className="block text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
            Mode Kerja
          </label>
          <select
            value={workMode}
            onChange={(e) => updateFilter('mode', e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            {WORK_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
