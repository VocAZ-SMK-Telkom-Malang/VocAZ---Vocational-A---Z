// components/company/profile/benefits-form.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Plus, X, CheckCircle2, Gift } from 'lucide-react'
import { updateBenefitsAction } from '@/app/company/profile/actions'

const SUGGESTED_BENEFITS = [
  'BPJS Kesehatan',
  'BPJS Ketenagakerjaan',
  'Tunjangan Makan',
  'Tunjangan Transport',
  'Laptop Disetujui',
  'Remote-Friendly',
  'Hybrid Working',
  'Flexible Hours',
  'Annual Bonus',
  'Learning Budget',
  'Mentoring Program',
  'Career Development',
  'Health Insurance',
  'Gym Membership',
  'Free Snacks',
  'Team Building',
]

type Props = {
  benefits: string[]
}

export function BenefitsForm({ benefits }: Props) {
  const router = useRouter()
  const [items, setItems] = useState<string[]>(benefits)
  const [newItem, setNewItem] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addBenefit(b: string) {
    const trimmed = b.trim()
    if (!trimmed || items.includes(trimmed) || items.length >= 20) return
    setItems([...items, trimmed])
    setNewItem('')
  }

  function removeBenefit(idx: number) {
    setItems(items.filter((_, i) => i !== idx))
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await updateBenefitsAction({ benefits: items })
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

  const remainingSuggestions = SUGGESTED_BENEFITS.filter(
    (b) => !items.includes(b)
  ).slice(0, 8)

  return (
    <div className="space-y-6">
      {/* Current benefits */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-3">
          Benefit yang Ditawarkan ({items.length}/20)
        </label>
        {items.length === 0 ? (
          <div className="py-8 text-center bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/40">
            <Gift className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
            <p className="text-xs text-on-surface-variant">
              Belum ada benefit. Tambahkan di bawah.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((b, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold"
              >
                {b}
                <button
                  type="button"
                  onClick={() => removeBenefit(idx)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Add custom */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Tambah Benefit
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addBenefit(newItem)
              }
            }}
            placeholder="Contoh: Tunjangan Pendidikan"
            maxLength={100}
            className="flex-1 px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition"
          />
          <button
            type="button"
            onClick={() => addBenefit(newItem)}
            disabled={!newItem.trim() || items.length >= 20}
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-container disabled:opacity-40 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>
      </div>

      {/* Suggested */}
      {remainingSuggestions.length > 0 && (
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">
            Saran Benefit
          </label>
          <div className="flex flex-wrap gap-1.5">
            {remainingSuggestions.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => addBenefit(b)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary text-xs font-medium transition-colors"
              >
                <Plus className="w-3 h-3" />
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-6 border-t border-outline-variant/30">
        <div>
          {error && <p className="text-sm text-error">{error}</p>}
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