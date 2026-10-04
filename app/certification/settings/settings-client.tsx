// app/certification/settings/settings-client.tsx
'use client'

import { useState } from 'react'
import { CertSettingsSidebar, CertSettingsTabsMobile, type SettingsTab } from '@/components/certification/settings/settings-sidebar'
import { AccountTab } from '@/components/certification/settings/tabs/account-tab'
import { NotificationsTab } from '@/components/certification/settings/tabs/notifications-tab'
import { SecurityTab } from '@/components/certification/settings/tabs/security-tab'
import { DangerTab } from '@/components/certification/settings/tabs/danger-tab'
import type { CertNotificationPrefs } from './actions'

type Props = {
  user: {
    email: string
    fullName: string | null
    phone: string | null
    jobTitle: string | null
  }
  institution: {
    name: string
    type: string
    isApproved: boolean
  }
  notificationPrefs: CertNotificationPrefs
  userRole: 'owner' | 'admin' | 'verifier'
}

export function CertSettingsClient({
  user,
  institution,
  notificationPrefs,
  userRole,
}: Props) {
  const [tab, setTab] = useState<SettingsTab>('account')

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 lg:py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-on-surface">
          Pengaturan
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Kelola akun dan preferensi verifier kamu
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-xs text-on-surface-variant">
          <span className="font-bold">{institution.name}</span>
          <span className="text-on-surface-variant/50">·</span>
          <span className="font-mono uppercase tracking-wider text-[10px] font-bold">
            {userRole}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <CertSettingsTabsMobile active={tab} onChange={setTab} />
      </div>

      <div className="flex gap-6">
        <CertSettingsSidebar active={tab} onChange={setTab} />

        <main className="flex-1 min-w-0">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 lg:p-8">
            {tab === 'account' && <AccountTab user={user} />}
            {tab === 'notifications' && (
              <NotificationsTab prefs={notificationPrefs} />
            )}
            {tab === 'security' && <SecurityTab />}
            {tab === 'danger' && <DangerTab userRole={userRole} />}
          </div>
        </main>
      </div>
    </div>
  )
}