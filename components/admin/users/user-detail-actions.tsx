'use client'

import { useTransition, useState } from 'react'
import { Power, Trash2, Loader2 } from 'lucide-react'
import { toggleUserActive, softDeleteUser } from '@/lib/admin/actions'

type Props = {
  userId: string
  isActive: boolean
  isDeleted: boolean
}

export function UserDetailActions({ userId, isActive, isDeleted }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showDelete, setShowDelete] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleToggle() {
    startTransition(async () => {
      await toggleUserActive(userId)
    })
  }

  function handleDelete() {
    if (reason.trim().length < 3) {
      setError('Alasan minimal 3 karakter')
      return
    }

    startTransition(async () => {
      const res = await softDeleteUser({ userId, reason: reason.trim() })
      if (!res.ok) {
        setError(res.error || 'Gagal')
        return
      }
      setShowDelete(false)
    })
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 sticky top-24">
        <h3 className="font-display text-base font-bold text-on-surface mb-4">
          Aksi Admin
        </h3>

        <div className="space-y-2">
          <button
            onClick={handleToggle}
            disabled={isPending || isDeleted}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Power className="w-4 h-4" />
            )}
            {isActive ? 'Suspend User' : 'Aktifkan User'}
          </button>

          <button
            onClick={() => setShowDelete(true)}
            disabled={isPending || isDeleted}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-red-50 border border-red-200 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Hapus User
          </button>
        </div>

        <p className="text-[11px] text-on-surface-variant mt-4 leading-relaxed">
          ⚠️ Aksi admin akan tercatat di audit log. Hati-hati saat menghapus
          user.
        </p>
      </div>

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDelete(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="font-display text-lg font-bold text-on-surface mb-2">
              Hapus User
            </h3>
            <p className="text-sm text-on-surface-variant mb-4">
              Yakin ingin menghapus user ini? User tidak akan bisa login lagi.
            </p>

            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider">
              Alasan
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />

            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                onClick={() => setShowDelete(false)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-surface-container transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}