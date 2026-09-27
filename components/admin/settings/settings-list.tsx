'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { SettingItem } from './setting-item'

type Setting = {
  id: string
  key: string
  value: any
  description: string | null
  updatedAt: Date
  updatedByUser: {
    id: string
    fullName: string | null
    email: string
  } | null
}

type Props = {
  settings: Setting[]
}

export function SettingsList({ settings }: Props) {
  const [search, setSearch] = useState('')

  // Group by prefix
  const grouped = useMemo(() => {
    const filtered = settings.filter(
      (s) =>
        s.key.toLowerCase().includes(search.toLowerCase()) ||
        (s.description || '').toLowerCase().includes(search.toLowerCase())
    )

    const groups: Record<string, Setting[]> = {}
    filtered.forEach((s) => {
      const prefix = s.key.split('.')[0]
      if (!groups[prefix]) groups[prefix] = []
      groups[prefix].push(s)
    })

    return groups
  }, [settings, search])

  const categories = Object.keys(grouped).sort()

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari setting..."
          className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-outline-variant/50 bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Empty */}
      {categories.length === 0 && (
        <div className="bg-white rounded-2xl border border-outline-variant/30 py-16 text-center">
          <p className="text-sm text-on-surface-variant">
            {search
              ? 'Tidak ada setting yang cocok.'
              : 'Belum ada setting.'}
          </p>
        </div>
      )}

      {/* Groups */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-display text-sm font-bold text-on-surface uppercase tracking-wider">
                {category}
              </h2>
              <span className="text-[10px] font-mono font-bold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
                {grouped[category].length}
              </span>
              <div className="flex-1 h-px bg-outline-variant/30" />
            </div>

            <div className="space-y-3">
              {grouped[category].map((setting) => (
                <SettingItem key={setting.id} setting={setting} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}