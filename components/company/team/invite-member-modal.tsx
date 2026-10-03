// components/company/team/invite-member-modal.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Loader2,
  Mail,
  UserPlus,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { inviteTeamMemberAction } from '@/app/company/team/actions'

const ROLE_OPTIONS = [
  {
    value: 'admin',
    label: 'Admin',
    desc: 'Bisa kelola semua kecuali hapus perusahaan',
  },
  {
    value: 'recruiter',
    label: 'Recruiter',
    desc: 'Bisa post job, lihat pelamar, chat kandidat',
  },
  {
    value: 'viewer',
    label: 'Viewer',
    desc: 'Read-only — hanya bisa melihat',
  },
]

type Props = {
  open: boolean
  onClose: () => void
}

export function InviteMemberModal({ open, onClose }: Props) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'recruiter' | 'viewer'>('recruiter')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit() {
    if (!email.trim()) {
      setError('Email wajib diisi')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await inviteTeamMemberAction({ email, role })

      if (!res.ok) {
        setError(res.error ?? 'Gagal kirim undangan')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setEmail('')
        setRole('recruiter')
        setSuccess(false)
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-outline-variant/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">
                Undang Anggota Baru
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Kirim undangan via email
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Email <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="anggota@perusahaan.com"
                disabled={submitting || success}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition disabled:opacity-60"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Role <span className="text-error">*</span>
            </label>
            <div className="space-y-2">
              {ROLE_OPTIONS.map((opt) => {
                const isActive = role === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value as any)}
                    disabled={submitting || success}
                    className={`
                      w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all
                      ${
                        isActive
                          ? 'border-primary bg-primary/5'
                          : 'border-outline-variant/40 hover:border-primary/30'
                      }
                      disabled:opacity-60
                    `}
                  >
                    <div
                      className={`
                        w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center
                        ${
                          isActive
                            ? 'border-primary bg-primary'
                            : 'border-outline-variant'
                        }
                      `}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`text-sm font-bold ${
                          isActive ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        {opt.label}
                      </div>
                      <div className="text-[11px] text-on-surface-variant mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-error/5 border border-error/20">
              <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
              <p className="text-xs text-error">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-xs font-semibold text-emerald-800">
                Undangan berhasil dikirim!
              </p>
            </div>
          )}

          {/* Info */}
          {!success && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-[11px] text-blue-800">
                Undangan berlaku 7 hari. Anggota akan menerima email untuk
                bergabung.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-outline-variant/30 bg-surface-container-low/30">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-full bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high disabled:opacity-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || success || !email.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white text-sm font-bold hover:brightness-110 disabled:opacity-60 transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengirim...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Terkirim
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Kirim Undangan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}