'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { SettingsStats } from '@/components/admin/settings/settings-stats'
import { SettingsList } from '@/components/admin/settings/settings-list'
import { SettingCreateModal } from '@/components/admin/settings/setting-create-modal'

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
  stats: {
    total: number
    grouped: Record<string, number>
    recentlyUpdated: number
  }
}

export function SettingsClient({ settings, stats }: Props) {
  const [showCreate, setShowCreate] = useState(false)

  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            System Settings
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola konfigurasi platform VocAZ
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white text-sm font-semibold shadow-[0_4px_16px_rgba(220,38,38,0.25)] hover:brightness-105 active:scale-95 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Setting Baru</span>
        </button>
      </div>

      <div className="mb-6">
        <SettingsStats stats={stats} />
      </div>

      <SettingsList settings={settings} />

      {showCreate && (
        <SettingCreateModal onClose={() => setShowCreate(false)} />
      )}
    </>
  )
}