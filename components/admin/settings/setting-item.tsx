'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Save,
  X,
  Edit3,
  Loader2,
  AlertCircle,
  Check,
  Trash2,
  RotateCcw,
  User,
  Clock,
} from 'lucide-react'
import { updateSystemSetting, deleteSystemSetting } from '@/lib/admin/actions'

type Setting = {
  id: string
  key: string
  value: any
  description: string | null
  updatedAt: Date
  updatedByUser: {
    id: string
    fullName: string | null
    email: string
  } | null
}

type Props = {
  setting: Setting
}

export function SettingItem({ setting }: Props) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedValue, setEditedValue] = useState(
    JSON.stringify(setting.value, null, 2)
  )
  const [editedDescription, setEditedDescription] = useState(
    setting.description || ''
  )
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Cek apakah value-nya boolean atau nested object
  const isBoolean =
    setting.value !== null &&
    typeof setting.value === 'object' &&
    typeof setting.value.enabled === 'boolean'

  function handleSave() {
    setError(null)

    let parsedValue: any

    if (isBoolean) {
      parsedValue = { enabled: !setting.value.enabled }
    } else {
      try {
        parsedValue = JSON.parse(editedValue)
      } catch {
        setError('Format JSON tidak valid')
        return
      }
    }

    startTransition(async () => {
      const result = await updateSystemSetting({
        key: setting.key,
        value: parsedValue,
        description: editedDescription,
      })

      if (!result.ok) {
        setError(result.error || 'Gagal menyimpan')
        return
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      setIsEditing(false)
      router.refresh()
    })
  }

  function handleToggleBoolean() {
    const newValue = { enabled: !setting.value.enabled }

    startTransition(async () => {
      const result = await updateSystemSetting({
        key: setting.key,
        value: newValue,
      })

      if (result.ok) {
        router.refresh()
      }
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteSystemSetting(setting.key)

      if (!result.ok) {
        setError(result.error || 'Gagal menghapus')
        return
      }

      setShowDelete(false)
      router.refresh()
    })
  }

  function handleCancel() {
    setEditedValue(JSON.stringify(setting.value, null, 2))
    setEditedDescription(setting.description || '')
    setError(null)
    setIsEditing(false)
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-outline-variant/30 p-4 hover:border-primary/20 transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <code className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                {setting.key}
              </code>

              {/* Boolean toggle badge */}
              {isBoolean && (
                <button
                  onClick={handleToggleBoolean}
                  disabled={isPending}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                    setting.value.enabled
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {setting.value.enabled ? 'ENABLED' : 'DISABLED'}
                </button>
              )}

              {success && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                  <Check className="w-3 h-3" />
                  TERSIMPAN
                </span>
              )}
            </div>

            {setting.description && !isEditing && (
              <p className="text-xs text-on-surface-variant mt-1">
                {setting.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDelete(true)}
                  className="p-2 rounded-lg text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isPending}
                  className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
                  title="Batal"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-surface-tint transition-colors disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  Simpan
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {!isEditing ? (
          <pre className="text-xs bg-surface-container-low p-3 rounded-lg overflow-x-auto font-mono text-on-surface-variant">
            {JSON.stringify(setting.value, null, 2)}
          </pre>
        ) : (
          <div className="space-y-3">
            {/* Value input */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Value (JSON)
              </label>
              <textarea
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 text-xs font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
              />
            </div>

            {/* Description input */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Deskripsi
              </label>
              <input
                type="text"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Deskripsi setting (opsional)"
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
        )}

        {/* Footer metadata */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(setting.updatedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          {setting.updatedByUser && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {setting.updatedByUser.fullName || setting.updatedByUser.email}
            </span>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !isPending && setShowDelete(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-display text-lg font-bold text-on-surface mb-2">
              Hapus Setting?
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Setting{' '}
              <code className="font-mono text-xs bg-surface-container px-1.5 py-0.5 rounded">
                {setting.key}
              </code>{' '}
              akan dihapus permanen. Aksi ini tidak bisa dibatalkan.
            </p>

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setShowDelete(false)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-surface-container transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-5 py-2 text-sm font-semibold rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}