'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'

const ROLES = [
  { value: 'all', label: 'Semua Role' },
  { value: 'student', label: 'Student' },
  { value: 'company', label: 'Company' },
  { value: 'school', label: 'School' },
  { value: 'certification', label: 'Certification' },
  { value: 'admin', label: 'Admin' },
]

export function UsersFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [role, setRole] = useState(searchParams.get('role') || 'all')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL({ search, role })
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  function updateURL(overrides: { search?: string; role?: string }) {
    const params = new URLSearchParams(searchParams.toString())

    const newSearch = overrides.search ?? search
    const newRole = overrides.role ?? role

    if (newSearch) params.set('search', newSearch)
    else params.delete('search')

    if (newRole && newRole !== 'all') params.set('role', newRole)
    else params.delete('role')

    router.push(`${pathname}?${params.toString()}`)
  }

  function handleRoleChange(value: string) {
    setRole(value)
    updateURL({ role: value })
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
          placeholder="Cari nama atau email..."
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

      {/* Role filter */}
      <select
        value={role}
        onChange={(e) => handleRoleChange(e.target.value)}
        className="px-3 py-2.5 rounded-lg border border-outline-variant/50 bg-white text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 cursor-pointer"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  )
}