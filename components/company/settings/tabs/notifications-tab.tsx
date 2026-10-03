// components/company/settings/tabs/notifications-tab.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, Bell } from 'lucide-react'
import { updateCompanyNotificationPreferences } from '@/app/company/settings/actions'
import type { CompanyNotificationPrefs } from '@/app/company/settings/actions'

const ITEMS: {
  key: keyof CompanyNotificationPrefs
  label: string
  desc: string
}[] = [
  {
    key: 'emailNotifications',
    label: 'Email Notifications',
    desc: 'Terima notifikasi penting lewat email',
  },
  {
    key: 'applicationUpdates',
    label: 'Application Updates',
    desc: 'Update saat ada kandidat baru apply ke lowongan kamu',
  },
  {
    key: 'newMessages',
    label: 'New Messages',
    desc: 'Notifikasi saat ada pesan baru dari kandidat',
  },
  {
    key: 'talentRecommendations',
    label: 'Talent Recommendations',
    desc: 'Rekomendasi talent yang cocok dengan preference kamu',
  },
]

export function NotificationsTab({
  prefs: initialPrefs,
}: {
  prefs: CompanyNotificationPrefs
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [prefs, setPrefs] = useState(initialPrefs)

  function toggle(key: keyof CompanyNotificationPrefs) {
    setPrefs({ ...prefs, [key]: !prefs[key] })
    setSaved(false)
    setError(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)

    startTransition(async () => {
      const res = await updateCompanyNotificationPreferences(prefs)
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        router.refresh()
      } else {
        setError(res.error || 'Gagal simpan')
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-on-surface mb-1">Notifikasi</h2>
        <p className="text-sm text-on-surface-variant">
          Atur notifikasi apa saja yang mau kamu terima
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        {ITEMS.map((item) => (
          <label
            key={item.key}
            className="flex items-center justify-between gap-4 p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest cursor-pointer hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-on-surface">
                  {item.label}
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  {item.desc}
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={prefs[item.key]}
              onChange={() => toggle(item.key)}
              className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary shrink-0"
            />
          </label>
        ))}

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : null}
            {isPending ? 'Menyimpan...' : saved ? 'Tersimpan' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  )
}