// components/student/settings/tabs/privacy-tab.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, Eye, Briefcase, Search } from 'lucide-react'
import { updateProfileSettings } from '@/app/actions/settings'

type Props = {
  profile: {
    isPublic: boolean
    isOpenToWork: boolean
  }
}

export function PrivacyTab({ profile }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const [prefs, setPrefs] = useState({
    isPublic: profile.isPublic,
    isOpenToWork: profile.isOpenToWork,
  })

  function handleToggle(key: 'isPublic' | 'isOpenToWork') {
    const newPrefs = { ...prefs, [key]: !prefs[key] }
    setPrefs(newPrefs)

    startTransition(async () => {
      const result = await updateProfileSettings({ [key]: newPrefs[key] })
      if (result.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 1500)
        router.refresh()
      } else {
        setPrefs(profile)
        alert(result.error)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-on-surface mb-1">Privasi</h2>
          <p className="text-sm text-on-surface-variant">
            Atur visibilitas profil kamu
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

      <div className="space-y-3">
        <Toggle
          icon={<Eye className="w-4 h-4" />}
          label="Profil Publik"
          description="Kalau aktif, profilmu bisa dilihat di Jelajahi Talent oleh recruiter dan talent lain. Kalau nonaktif, cuma kamu yang bisa lihat."
          checked={prefs.isPublic}
          onChange={() => handleToggle('isPublic')}
        />

        <Toggle
          icon={<Search className="w-4 h-4" />}
          label="Open to Work"
          description="Tampilkan badge 'Open to Work' di profilmu biar recruiter tahu kamu sedang mencari kerja."
          checked={prefs.isOpenToWork}
          onChange={() => handleToggle('isOpenToWork')}
        />
      </div>

      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface mb-1">
              Info penting
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Kalau profilmu dinonaktifkan, lamaran yang sudah kamu kirim tetap
              diproses oleh recruiter. Cuma visibilitas profil publik yang
              dimatikan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Toggle({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex items-start gap-4 p-4 rounded-2xl border border-outline-variant/30 cursor-pointer hover:border-primary/40 transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className="w-9 h-9 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      <div
        className={`relative w-10 h-6 rounded-full shrink-0 mt-1 transition-colors ${
          checked ? 'bg-primary' : 'bg-surface-container-high'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${
            checked ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </div>
    </label>
  )
}