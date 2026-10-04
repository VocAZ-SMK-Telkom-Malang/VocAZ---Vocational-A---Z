// components/school/settings/tabs/account-tab.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Mail,
  Phone,
  Briefcase,
  Loader2,
  Check,
  Shield,
} from 'lucide-react'
import { updateSchoolProfileSettingsAction } from '@/app/school/settings/actions'

type Props = {
  user: {
    email: string
    fullName: string | null
    phone: string | null
    jobTitle: string | null
  }
}

export function AccountTab({ user }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    fullName: user.fullName ?? '',
    phone: user.phone ?? '',
    jobTitle: user.jobTitle ?? '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)

    startTransition(async () => {
      const result = await updateSchoolProfileSettingsAction({
        fullName: form.fullName || null,
        phone: form.phone || null,
        jobTitle: form.jobTitle || null,
      })

      if (result.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
        router.refresh()
      } else {
        setError(result.error || 'Gagal simpan')
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-black text-on-surface mb-1">Akun</h2>
        <p className="text-sm text-on-surface-variant">
          Informasi akun pengelola BKK kamu
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email" icon={<Mail className="w-4 h-4" />}>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container/50 text-sm text-on-surface-variant cursor-not-allowed"
          />
          <p className="text-[11px] text-on-surface-variant mt-1.5 inline-flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Email tidak bisa diubah
          </p>
        </Field>

        <Field label="Nama Lengkap" icon={<User className="w-4 h-4" />}>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Nama lengkap kamu"
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </Field>

        <Field label="Jabatan" icon={<Briefcase className="w-4 h-4" />}>
          <input
            type="text"
            value={form.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            placeholder="Contoh: Kepala BKK, Staf BKK"
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </Field>

        <Field label="Nomor HP" icon={<Phone className="w-4 h-4" />}>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+62 812 3456 7890"
            className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </Field>

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

          <button
            type="button"
            onClick={() =>
              setForm({
                fullName: user.fullName ?? '',
                phone: user.phone ?? '',
                jobTitle: user.jobTitle ?? '',
              })
            }
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  icon,
  children,
}: {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
        <span className="text-on-surface-variant/60">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  )
}