// components/school/settings/tabs/security-tab.tsx
'use client'

import { Key, Shield, LogOut } from 'lucide-react'

export function SecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-on-surface mb-1">Keamanan</h2>
        <p className="text-sm text-on-surface-variant">
          Kelola keamanan akun kamu
        </p>
      </div>

      <div className="space-y-3">
        <SecurityCard
          icon={Key}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          title="Password"
          desc="Ubah password akun kamu secara berkala"
          actionLabel="Ubah Password"
        />

        <SecurityCard
          icon={Shield}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
          title="Two-Factor Authentication"
          desc="Tambah lapisan keamanan ekstra untuk akun kamu"
          actionLabel="Aktifkan 2FA"
        />

        <SecurityCard
          icon={LogOut}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
          title="Logout dari Semua Device"
          desc="Keluar dari semua sesi login di device lain"
          actionLabel="Logout Semua"
          actionVariant="danger"
        />
      </div>
    </div>
  )
}

function SecurityCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  desc,
  actionLabel,
  actionVariant = 'default',
}: {
  icon: any
  iconBg: string
  iconColor: string
  title: string
  desc: string
  actionLabel: string
  actionVariant?: 'default' | 'danger'
}) {
  return (
    <div className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest">
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-on-surface">{title}</div>
          <div className="text-[11px] text-on-surface-variant mt-0.5">
            {desc}
          </div>
          <button
            type="button"
            className={`mt-3 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              actionVariant === 'danger'
                ? 'bg-white border border-rose-300 text-rose-600 hover:bg-rose-50'
                : 'bg-white border border-outline-variant/40 text-on-surface hover:border-primary/40'
            }`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  )
}