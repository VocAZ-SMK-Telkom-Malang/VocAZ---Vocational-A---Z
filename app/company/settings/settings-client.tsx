// app/company/settings/settings-client.tsx
'use client'

import { useState } from 'react'
import {
  SettingsSidebar,
  SettingsTabsMobile,
  type SettingsTab,
} from '@/components/company/settings/settings-sidebar'
import { AccountTab } from '@/components/company/settings/tabs/account-tab'
import { NotificationsTab } from '@/components/company/settings/tabs/notifications-tab'
import { SecurityTab } from '@/components/company/settings/tabs/security-tab'
import { DangerTab } from '@/components/company/settings/tabs/danger-tab'
import type { CompanyNotificationPrefs } from '@/app/company/settings/actions'

type Props = {
  user: {
    email: string
    fullName: string | null
    phone: string | null
    jobTitle: string | null
  }
  company: {
    name: string
    slug: string | null
    verificationStatus: string
  }
  notificationPrefs: CompanyNotificationPrefs
}

export function CompanySettingsClient({
  user,
  company,
  notificationPrefs,
}: Props) {
  const [tab, setTab] = useState<SettingsTab>('account')

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6 lg:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-on-surface">
          Pengaturan
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Kelola akun dan preferensi perusahaan kamu
        </p>
      </div>

      {/* Mobile tabs */}
      <div className="mb-4">
        <SettingsTabsMobile active={tab} onChange={setTab} />
      </div>

      {/* Layout */}
      <div className="flex gap-6">
        <SettingsSidebar active={tab} onChange={setTab} />

        <main className="flex-1 min-w-0">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 lg:p-8">
            {tab === 'account' && <AccountTab user={user} />}
            {tab === 'notifications' && (
              <NotificationsTab prefs={notificationPrefs} />
            )}
            {tab === 'security' && <SecurityTab />}
            {tab === 'danger' && <DangerTab />}
          </div>
        </main>
      </div>
    </div>
  )
}