// app/certification/verifications/[id]/detail-client.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Award,
  User,
  Mail,
  MapPin,
  FileText,
  Calendar,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { reviewVerificationAction } from '../actions'

type Props = {
  detail: {
    id: string
    status: string
    submittedAt: string
    reviewedAt: string | null
    notes: string | null

    certificate: {
      id: string
      title: string
      certificateNumber: string | null
      issuedDate: string | null
      expiredDate: string | null
      documentUrl: string | null
      badgeType: string
      verificationStatus: string
    }

    student: {
      profileId: string
      fullName: string
      email: string
      avatarUrl: string | null
      headline: string | null
      bio: string | null
      nisn: string | null
      city: string | null
      province: string | null
      profileCompletion: number
      careerReadiness: number
      isOpenToWork: boolean
    }

    history: Array<{
      id: string
      status: string
      submittedAt: string
      reviewedAt: string | null
      notes: string | null
    }>
  }
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  in_review: 'bg-blue-100 text-blue-700',
  verified: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  in_review: 'In Review',
  verified: 'Verified',
  rejected: 'Rejected',
}

const BADGE_LABEL: Record<string, string> = {
  lsp_bnsp: 'LSP / BNSP Certified',
  industry: 'Industry Certified',
  training: 'Training Certified',
}

export function VerificationDetailClient({ detail }: Props) {
  const router = useRouter()
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState<'approve' | 'reject' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canReview =
    detail.status === 'pending' || detail.status === 'in_review'

  async function handleReview(action: 'approve' | 'reject') {
    if (action === 'reject' && !notes.trim()) {
      setError('Alasan penolakan wajib diisi')
      return
    }
    setSaving(action)
    setError(null)
    try {
      const res = await reviewVerificationAction({
        requestId: detail.id,
        action,
        notes: notes.trim() || null,
      })
      if (!res.ok) {
        setError(res.error ?? 'Gagal')
        return
      }
      router.refresh()
    } catch {
      setError('Terjadi kesalahan')
    } finally {
      setSaving(null)
    }
  }

  const initials = detail.student.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const statusStyle = STATUS_STYLE[detail.status] ?? STATUS_STYLE.pending
  const statusLabel = STATUS_LABEL[detail.status] ?? detail.status

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <Link
        href="/certification/verifications"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Pengajuan
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-on-surface">
            Review Sertifikat
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Periksa detail sertifikat sebelum memverifikasi.
          </p>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider ${statusStyle}`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT — certificate preview */}
        <div className="lg:col-span-2 space-y-4">
          {/* Certificate doc */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
            <h2 className="text-sm font-black text-on-surface mb-3">
              Dokumen Sertifikat
            </h2>

            {detail.certificate.documentUrl ? (
              <div className="rounded-xl overflow-hidden bg-surface-container-low">
                {detail.certificate.documentUrl.match(/\.pdf$/i) ? (
                  <div className="aspect-[4/3] flex items-center justify-center bg-surface-container">
                    <a
                      href={detail.certificate.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Buka PDF
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : (
                  <img
                    src={detail.certificate.documentUrl}
                    alt={detail.certificate.title}
                    className="w-full max-h-[500px] object-contain bg-white"
                  />
                )}
              </div>
            ) : (
              <div className="py-12 text-center rounded-xl bg-surface-container-low">
                <FileText className="w-8 h-8 text-on-surface-variant mx-auto mb-2" />
                <p className="text-sm text-on-surface-variant">
                  Tidak ada dokumen
                </p>
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <InfoRow
                icon={FileText}
                label="Nomor Sertifikat"
                value={detail.certificate.certificateNumber ?? '-'}
                mono
              />
              <InfoRow
                icon={Calendar}
                label="Tanggal Terbit"
                value={
                  detail.certificate.issuedDate
                    ? new Date(detail.certificate.issuedDate).toLocaleDateString(
                        'id-ID',
                        { day: 'numeric', month: 'long', year: 'numeric' }
                      )
                    : '-'
                }
              />
              <InfoRow
                icon={Calendar}
                label="Tanggal Expired"
                value={
                  detail.certificate.expiredDate
                    ? new Date(detail.certificate.expiredDate).toLocaleDateString(
                        'id-ID',
                        { day: 'numeric', month: 'long', year: 'numeric' }
                      )
                    : 'Selamanya'
                }
              />
              <InfoRow
                icon={Award}
                label="Badge Type"
                value={BADGE_LABEL[detail.certificate.badgeType] ?? '-'}
              />
            </div>
          </div>

          {/* History */}
          {detail.history.length > 1 && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
              <h2 className="text-sm font-black text-on-surface mb-3">
                Riwayat Verifikasi
              </h2>
              <div className="space-y-2">
                {detail.history.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/40"
                  >
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[h.status]}`}
                    >
                      {STATUS_LABEL[h.status]}
                    </span>
                    <span className="text-xs text-on-surface-variant font-mono">
                      {new Date(h.submittedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {h.notes && (
                      <span className="text-xs text-on-surface-variant truncate flex-1">
                        {h.notes}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — student info + actions */}
        <div className="space-y-4">
          {/* Student card */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
            <h2 className="text-sm font-black text-on-surface mb-3">
              Siswa
            </h2>

            <div className="flex items-start gap-3 mb-4">
              {detail.student.avatarUrl ? (
                <img
                  src={detail.student.avatarUrl}
                  alt={detail.student.fullName}
                  className="w-14 h-14 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/30"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="text-sm font-black">{initials}</span>
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-sm font-black text-on-surface truncate">
                  {detail.student.fullName}
                </h3>
                {detail.student.headline && (
                  <p className="text-xs text-on-surface-variant truncate mt-0.5">
                    {detail.student.headline}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <InfoRow
                icon={Mail}
                label="Email"
                value={detail.student.email}
              />
              {detail.student.nisn && (
                <InfoRow
                  icon={User}
                  label="NISN"
                  value={detail.student.nisn}
                  mono
                />
              )}
              {detail.student.city && (
                <InfoRow
                  icon={MapPin}
                  label="Kota"
                  value={`${detail.student.city}${detail.student.province ? `, ${detail.student.province}` : ''}`}
                />
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-outline-variant/30 space-y-3">
              <ProgressBar
                label="Profile Completion"
                value={detail.student.profileCompletion}
              />
              <ProgressBar
                label="Career Readiness"
                value={detail.student.careerReadiness}
                color="from-emerald-500 to-emerald-600"
              />
            </div>
          </div>

          {/* Review actions */}
          {canReview ? (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
              <h2 className="text-sm font-black text-on-surface mb-3">
                Keputusan Verifikasi
              </h2>

              <div className="mb-4">
                <label className="block text-xs font-bold text-on-surface mb-2">
                  Catatan / Alasan
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Catatan internal atau alasan penolakan..."
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm resize-none"
                />
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Wajib diisi kalau reject.
                </p>
              </div>

              {error && (
                <div className="mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleReview('approve')}
                  disabled={!!saving}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {saving === 'approve' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {saving === 'approve' ? 'Memproses...' : 'Approve Sertifikat'}
                </button>

                <button
                  type="button"
                  onClick={() => handleReview('reject')}
                  disabled={!!saving}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 disabled:opacity-50 transition-colors"
                >
                  {saving === 'reject' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {saving === 'reject' ? 'Memproses...' : 'Reject Sertifikat'}
                </button>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Keputusan tidak bisa dibatalkan. Pastikan sudah periksa dokumen
                  & nomor sertifikat sebelum verify.
                </p>
              </div>
            </div>
          ) : (
            <div
              className={`rounded-2xl border p-5 ${
                detail.status === 'verified'
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-rose-50 border-rose-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {detail.status === 'verified' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <div className="text-sm font-bold text-on-surface">
                    {detail.status === 'verified'
                      ? 'Sudah Terverifikasi'
                      : 'Sudah Ditolak'}
                  </div>
                  {detail.reviewedAt && (
                    <p className="text-[11px] text-on-surface-variant mt-0.5 font-mono">
                      {new Date(detail.reviewedAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                  {detail.notes && (
                    <p className="text-xs text-on-surface-variant mt-2">
                      {detail.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// SUB COMPONENTS
// ============================================

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: any
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-surface-container-low/50">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
        <span className="text-[11px] text-on-surface-variant">{label}</span>
      </div>
      <span
        className={`text-[11px] font-bold text-on-surface text-right truncate max-w-[60%] ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function ProgressBar({
  label,
  value,
  color = 'from-primary to-primary-container',
}: {
  label: string
  value: number
  color?: string
}) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-bold text-on-surface-variant">
          {label}
        </span>
        <span className="text-[11px] font-black text-on-surface font-mono">
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-container overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}