'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Menunggu Review' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
  { value: 'all', label: 'Semua Status' },
]

export function VerificationsFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(
    searchParams.get('status') || 'pending'
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL({ search, status })
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  function updateURL(overrides: { search?: string; status?: string }) {
    const params = new URLSearchParams(searchParams.toString())

    const newSearch = overrides.search ?? search
    const newStatus = overrides.status ?? status

    if (newSearch) params.set('search', newSearch)
    else params.delete('search')

    if (newStatus && newStatus !== 'pending') params.set('status', newStatus)
    else if (newStatus === 'pending') params.delete('status')
    else params.delete('status')

    router.push(`${pathname}?${params.toString()}`)
  }

  function handleStatusChange(value: string) {
    setStatus(value)
    updateURL({ status: value })
  }

  function clearSearch() {
    setSearch('')
    updateURL({ search: '' })
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama perusahaan..."
          className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-outline-variant/50 bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        {search && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className="px-3 py-2.5 rounded-lg border border-outline-variant/50 bg-white text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 cursor-pointer"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}