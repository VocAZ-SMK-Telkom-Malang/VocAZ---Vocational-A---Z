// components/student/settings/settings-client.tsx
'use client'

import { useState } from 'react'
import {
  SettingsSidebar,
  SettingsTabsMobile,
  type SettingsTab,
} from './settings-sidebar'
import { AccountTab } from './tabs/account-tab'
import { NotificationsTab } from './tabs/notifications-tab'
import { PrivacyTab } from './tabs/privacy-tab'
import { AppearanceTab } from './tabs/appearance-tab'
import { DangerTab } from './tabs/danger-tab'

type Props = {
  user: {
    email: string
    fullName: string | null
    phone: string | null
  }
  profile: {
    isPublic: boolean
    isOpenToWork: boolean
  } | null
  notificationPrefs: {
    emailJobAlerts: boolean
    emailApplicationUpdates: boolean
    emailMessages: boolean
    emailMarketing: boolean
    pushMessages: boolean
    pushApplications: boolean
  }
}

export function SettingsClient({ user, profile, notificationPrefs }: Props) {
  const [active, setActive] = useState<SettingsTab>('account')

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black text-on-surface tracking-tight">
          Pengaturan
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Kelola akun, privasi, dan preferensi kamu
        </p>
      </div>

      {/* Mobile tabs */}
      <SettingsTabsMobile active={active} onChange={setActive} />

      {/* Content layout */}
      <div className="flex gap-8">
        {/* Sidebar (desktop) */}
        <SettingsSidebar active={active} onChange={setActive} />

        {/* Content */}
        <div className="flex-1 min-w-0 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
          {active === 'account' && <AccountTab user={user} />}
          {active === 'notifications' && (
            <NotificationsTab preferences={notificationPrefs} />
          )}
          {active === 'privacy' && profile && <PrivacyTab profile={profile} />}
          {active === 'privacy' && !profile && (
            <p className="text-sm text-on-surface-variant">
              Profile belum dibuat.
            </p>
          )}
          {active === 'appearance' && <AppearanceTab />}
          {active === 'danger' && <DangerTab />}
        </div>
      </div>
    </div>
  )
}