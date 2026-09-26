'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import {
  Eye,
  Power,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { AdminBadge } from '@/components/admin/ui/admin-badge'
import { toggleUserActive, softDeleteUser } from '@/lib/admin/actions'

type User = {
  id: string
  fullName: string | null
  email: string
  role: string
  isActive: boolean
  createdAt: Date
  lastLoginAt: Date | null
  avatarUrl: string | null
}

type Props = {
  users: User[]
  currentAdminId: string
}

export function UsersTable({ users, currentAdminId }: Props) {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-outline-variant/30 py-16 text-center">
        <p className="text-on-surface-variant text-sm">Tidak ada user.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-surface-container-low border-b border-outline-variant/30">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Terdaftar
              </th>
              <th className="text-right px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                isSelf={user.id === currentAdminId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UserRow({ user, isSelf }: { user: User; isSelf: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  function handleToggleActive() {
    startTransition(async () => {
      await toggleUserActive(user.id)
    })
  }

  return (
    <>
      <tr className="border-b border-outline-variant/20 last:border-0 hover:bg-surface-container-low/50 transition-colors">
        {/* User */}
        <td className="px-4 py-3">
          <Link
            href={`/admin/users/${user.id}`}
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold text-xs shrink-0">
              {(user.fullName || 'A')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary">
                {user.fullName || 'Anonim'}
                {isSelf && (
                  <span className="ml-2 text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                    YOU
                  </span>
                )}
              </p>
              <p className="text-xs text-on-surface-variant truncate">
                {user.email}
              </p>
            </div>
          </Link>
        </td>

        {/* Role */}
        <td className="px-4 py-3">
          <AdminBadge
            variant={
              user.role === 'student'
                ? 'student'
                : user.role === 'company'
                ? 'company'
                : user.role === 'school'
                ? 'school'
                : user.role === 'certification'
                ? 'certification'
                : 'admin'
            }
          >
            {user.role}
          </AdminBadge>
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
              user.isActive
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {user.isActive ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                Aktif
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3" />
                Suspended
              </>
            )}
          </span>
        </td>

        {/* Created */}
        <td className="px-4 py-3">
          <span className="text-xs text-on-surface-variant">
            {new Date(user.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </td>

        {/* Actions — Eye, Power, Trash */}
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-1">
            {/* Detail (Eye) */}
            <Link
              href={`/admin/users/${user.id}`}
              title="Lihat Detail"
              className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Link>

            {/* Suspend/Activate (Power) */}
            {!isSelf && (
              <button
                onClick={handleToggleActive}
                disabled={isPending}
                title={user.isActive ? 'Suspend' : 'Aktifkan'}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                  user.isActive
                    ? 'text-on-surface-variant hover:text-amber-600 hover:bg-amber-50'
                    : 'text-on-surface-variant hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Power className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Delete (Trash) */}
            {!isSelf && (
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isPending}
                title="Hapus"
                className="p-2 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </tr>

      {showDeleteModal && (
        <DeleteUserModal
          user={user}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </>
  )
}

function DeleteUserModal({
  user,
  onClose,
}: {
  user: User
  onClose: () => void
}) {
  const [reason, setReason] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    if (reason.trim().length < 3) {
      setError('Alasan minimal 3 karakter')
      return
    }

    startTransition(async () => {
      const result = await softDeleteUser({
        userId: user.id,
        reason: reason.trim(),
      })

      if (!result.ok) {
        setError(result.error || 'Gagal menghapus')
        return
      }

      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 className="font-display text-lg font-bold text-on-surface mb-2">
          Hapus User
        </h3>
        <p className="text-sm text-on-surface-variant mb-4">
          Yakin ingin menghapus <strong>{user.fullName || user.email}</strong>?
          User tidak akan bisa login lagi.
        </p>

        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5 uppercase tracking-wider">
          Alasan
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Contoh: Melanggar aturan platform"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />

        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold rounded-full hover:bg-surface-container transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}