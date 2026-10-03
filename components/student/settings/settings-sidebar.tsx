// components/student/settings/settings-sidebar.tsx
'use client'

import {
  User,
  Bell,
  Lock,
  Palette,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'

export type SettingsTab =
  | 'account'
  | 'notifications'
  | 'privacy'
  | 'appearance'
  | 'danger'

type TabItem = {
  id: SettingsTab
  label: string
  description: string
  icon: LucideIcon
}

export const SETTINGS_TABS: TabItem[] = [
  {
    id: 'account',
    label: 'Akun',
    description: 'Email, nama, nomor HP',
    icon: User,
  },
  {
    id: 'notifications',
    label: 'Notifikasi',
    description: 'Preferensi email & push',
    icon: Bell,
  },
  {
    id: 'privacy',
    label: 'Privasi',
    description: 'Profil publik & visibilitas',
    icon: Lock,
  },
  {
    id: 'appearance',
    label: 'Tampilan',
    description: 'Tema & bahasa',
    icon: Palette,
  },
  {
    id: 'danger',
    label: 'Zona Berbahaya',
    description: 'Hapus akun permanen',
    icon: AlertTriangle,
  },
]

type Props = {
  active: SettingsTab
  onChange: (tab: SettingsTab) => void
}

export function SettingsSidebar({ active, onChange }: Props) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-20 space-y-1">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === active
          const isDanger = tab.id === 'danger'

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-colors
                ${
                  isActive
                    ? isDanger
                      ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                      : 'bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }
              `}
            >
              <Icon
                className={`w-4 h-4 shrink-0 mt-0.5 ${
                  isActive
                    ? isDanger
                      ? 'text-rose-600'
                      : 'text-primary'
                    : ''
                }`}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-bold ${
                    isDanger && !isActive ? 'text-rose-600' : ''
                  }`}
                >
                  {tab.label}
                </p>
                <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                  {tab.description}
                </p>
              </div>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export function SettingsTabsMobile({
  active,
  onChange,
}: {
  active: SettingsTab
  onChange: (tab: SettingsTab) => void
}) {
  return (
    <div className="lg:hidden -mx-4 px-4 overflow-x-auto">
      <div className="flex items-center gap-2 pb-1">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === active
          const isDanger = tab.id === 'danger'

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-colors
                ${
                  isActive
                    ? isDanger
                      ? 'bg-rose-600 text-white'
                      : 'bg-primary text-white'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}