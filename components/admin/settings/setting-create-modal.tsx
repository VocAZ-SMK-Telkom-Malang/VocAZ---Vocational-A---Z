'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2, AlertCircle, Plus } from 'lucide-react'
import { createSystemSetting } from '@/lib/admin/actions'

type Props = {
  onClose: () => void
}

export function SettingCreateModal({ onClose }: Props) {
  const router = useRouter()
  const [key, setKey] = useState('')
  const [value, setValue] = useState('{\n  \n}')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    setError(null)

    if (key.trim().length < 3) {
      setError('Key minimal 3 karakter')
      return
    }

    let parsedValue: any
    try {
      parsedValue = JSON.parse(value)
    } catch {
      setError('Format JSON tidak valid')
      return
    }

    startTransition(async () => {
      const result = await createSystemSetting({
        key: key.trim(),
        value: parsedValue,
        description: description.trim() || undefined,
      })

      if (!result.ok) {
        setError(result.error || 'Gagal membuat setting')
        return
      }

      onClose()
      router.refresh()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => !isPending && onClose()}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <h3 className="font-display text-lg font-bold text-on-surface">
              Tambah Setting Baru
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Buat konfigurasi baru untuk platform
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="contoh: platform.maintenance_mode"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 text-sm font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <p className="text-[11px] text-on-surface-variant mt-1">
              Format: <code className="font-mono">category.key_name</code>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Value (JSON) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 text-xs font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Deskripsi
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi singkat setting ini"
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-red-600">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-outline-variant/30">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-surface-container transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white hover:brightness-105 disabled:opacity-50 transition-all"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Buat Setting
          </button>
        </div>
      </div>
    </div>
  )
}