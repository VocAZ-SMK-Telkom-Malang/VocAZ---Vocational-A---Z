// components/company/profile/about-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import { updateAboutAction } from '@/app/company/profile/actions'

type Props = {
  description: string | null
  culture: string | null
}

export function AboutForm({ description, culture }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    description: description ?? '',
    culture: culture ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await updateAboutAction({
        description: form.description || null,
        culture: form.culture || null,
      })

      if (!res.ok) {
        setError(res.error ?? 'Gagal simpan')
        return
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Tentang Perusahaan
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={6}
          maxLength={5000}
          placeholder="Ceritakan tentang perusahaan, visi, misi, dan nilai-nilai..."
          className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm resize-y transition"
        />
        <p className="mt-1 text-[11px] text-on-surface-variant">
          {form.description.length}/5000
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Budaya Kerja (Culture)
        </label>
        <textarea
          value={form.culture}
          onChange={(e) => setForm({ ...form, culture: e.target.value })}
          rows={4}
          maxLength={3000}
          placeholder="Ceritakan tentang budaya kerja, lingkungan kerja, nilai-nilai tim..."
          className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm resize-y transition"
        />
        <p className="mt-1 text-[11px] text-on-surface-variant">
          {form.culture.length}/3000
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-outline-variant/30">
        <div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-error">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              Berhasil disimpan
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-md hover:brightness-110 disabled:opacity-60 transition-all"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan
            </>
          )}
        </button>
      </div>
    </div>
  )
}