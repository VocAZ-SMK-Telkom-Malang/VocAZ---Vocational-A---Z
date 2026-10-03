// components/student/settings/tabs/notifications-tab.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Mail, Smartphone, Loader2, Check } from 'lucide-react'
import { updateNotificationPreferences } from '@/app/actions/settings'

type Props = {
  preferences: {
    emailJobAlerts: boolean
    emailApplicationUpdates: boolean
    emailMessages: boolean
    emailMarketing: boolean
    pushMessages: boolean
    pushApplications: boolean
  }
}

export function NotificationsTab({ preferences }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [prefs, setPrefs] = useState(preferences)

  function handleToggle(key: keyof typeof prefs) {
    const newPrefs = { ...prefs, [key]: !prefs[key] }
    setPrefs(newPrefs)

    startTransition(async () => {
      const result = await updateNotificationPreferences(newPrefs)
      if (result.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 1500)
        router.refresh()
      } else {
        // Rollback
        setPrefs(preferences)
        alert(result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-on-surface mb-1">
            Notifikasi
          </h2>
          <p className="text-sm text-on-surface-variant">
            Pilih notifikasi yang mau kamu terima
          </p>
        </div>
        {isPending && (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        )}
        {saved && !isPending && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
            <Check className="w-3.5 h-3.5" />
            Tersimpan
          </span>
        )}
      </div>

      {/* Email section */}
      <Section
        title="Email"
        icon={<Mail className="w-4 h-4" />}
        description="Notifikasi yang dikirim ke email kamu"
      >
        <Toggle
          label="Info lowongan baru"
          description="Dapatkan email lowongan yang cocok dengan profilmu"
          checked={prefs.emailJobAlerts}
          onChange={() => handleToggle('emailJobAlerts')}
        />
        <Toggle
          label="Update lamaran"
          description="Status lamaran, interview, dan offering"
          checked={prefs.emailApplicationUpdates}
          onChange={() => handleToggle('emailApplicationUpdates')}
        />
        <Toggle
          label="Pesan baru"
          description="Notifikasi saat ada pesan dari recruiter atau talent"
          checked={prefs.emailMessages}
          onChange={() => handleToggle('emailMessages')}
        />
        <Toggle
          label="Promo & tips karier"
          description="Info event, webinar, dan tips dari VocAZ"
          checked={prefs.emailMarketing}
          onChange={() => handleToggle('emailMarketing')}
        />
      </Section>

      {/* Push section */}
      <Section
        title="Push Notification"
        icon={<Smartphone className="w-4 h-4" />}
        description="Notifikasi langsung di browser"
      >
        <Toggle
          label="Pesan baru"
          description="Notif saat ada chat masuk"
          checked={prefs.pushMessages}
          onChange={() => handleToggle('pushMessages')}
        />
        <Toggle
          label="Update lamaran"
          description="Status lamaran berubah"
          checked={prefs.pushApplications}
          onChange={() => handleToggle('pushApplications')}
        />
      </Section>
    </div>
  )
}

function Section({
  title,
  icon,
  description,
  children,
}: {
  title: string
  icon: React.ReactNode
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-outline-variant/30 overflow-hidden">
      <div className="px-5 py-4 border-b border-outline-variant/30 bg-surface-container-low/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {icon}
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">{title}</p>
            <p className="text-[11px] text-on-surface-variant">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="divide-y divide-outline-variant/20">{children}</div>
    </div>
  )
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-start gap-3 px-5 py-3.5 cursor-pointer hover:bg-surface-container/30 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`relative w-10 h-6 rounded-full shrink-0 mt-0.5 transition-colors ${
          checked ? 'bg-primary' : 'bg-surface-container-high'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${
            checked ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-on-surface">{label}</p>
        <p className="text-[11px] text-on-surface-variant mt-0.5">
          {description}
        </p>
      </div>
    </label>
  )
}