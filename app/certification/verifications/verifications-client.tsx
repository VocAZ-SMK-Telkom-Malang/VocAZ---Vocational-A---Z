// app/certification/verifications/verifications-client.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Check,
  CheckCheck,
  Filter,
} from 'lucide-react'
import { bulkReviewVerificationsAction } from './actions'

type Verification = {
  id: string
  status: string
  submittedAt: string
  submittedAtRelative: string
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
    city: string | null
  }
}

type Props = {
  verifications: Verification[]
  pagination: { page: number; totalPages: number; total: number }
  counts: {
    all: number
    pending: number
    in_review: number
    verified: number
    rejected: number
  }
  filters: { status: string; search: string; badgeType: string }
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  in_review: 'bg-blue-100 text-blue-700',
  verified: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  in_review: 'Review',
  verified: 'Verified',
  rejected: 'Rejected',
}

const BADGE_LABEL: Record<string, string> = {
  lsp_bnsp: 'LSP/BNSP',
  industry: 'Industry',
  training: 'Training',
}

export function VerificationsClient({
  verifications,
  pagination,
  counts,
  filters: initialFilters,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(initialFilters.search)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | null>(null)
  const [bulkNotes, setBulkNotes] = useState('')
  const [bulkSaving, setBulkSaving] = useState(false)
  const [bulkError, setBulkError] = useState<string | null>(null)

  const selectableIds = verifications
    .filter((v) => v.status === 'pending' || v.status === 'in_review')
    .map((v) => v.id)

  const allSelected =
    selectableIds.length > 0 && selectableIds.every((id) => selectedIds.has(id))

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') params.set(key, value)
    else params.delete(key)
    params.delete('page')
    startTransition(() => {
      router.push(`/certification/verifications?${params.toString()}`)
    })
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    applyFilter('q', search)
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(selectableIds))
    }
  }

  async function handleBulkSubmit() {
    if (!bulkAction) return
    setBulkSaving(true)
    setBulkError(null)
    try {
      const res = await bulkReviewVerificationsAction({
        requestIds: Array.from(selectedIds),
        action: bulkAction,
        notes: bulkNotes.trim() || null,
      })
      if (!res.ok) {
        setBulkError(res.error ?? 'Gagal')
        return
      }
      setSelectedIds(new Set())
      setBulkAction(null)
      setBulkNotes('')
      router.refresh()
    } catch {
      setBulkError('Terjadi kesalahan')
    } finally {
      setBulkSaving(false)
    }
  }

  const tabs = [
    { id: 'all', label: 'Semua', count: counts.all },
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'in_review', label: 'Review', count: counts.in_review },
    { id: 'verified', label: 'Verified', count: counts.verified },
    { id: 'rejected', label: 'Rejected', count: counts.rejected },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-on-surface">
          Pengajuan Verifikasi
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Review sertifikat yang diajukan siswa.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => applyFilter('status', t.id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap
              ${
                initialFilters.status === t.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }
            `}
          >
            {t.label}
            {t.count > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                  initialFilters.status === t.id
                    ? 'bg-primary/10 text-primary'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + badge filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama siswa, judul, atau nomor sertifikat..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition-colors"
            />
          </div>
        </form>

        <select
          value={initialFilters.badgeType}
          onChange={(e) => applyFilter('badge', e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm font-bold"
        >
          <option value="all">Semua Badge</option>
          <option value="lsp_bnsp">LSP/BNSP</option>
          <option value="industry">Industry</option>
          <option value="training">Training</option>
        </select>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="sticky top-20 z-20 flex items-center gap-3 p-3 rounded-2xl bg-primary text-white shadow-lg">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold">
              {selectedIds.size} dipilih
            </span>
          </div>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setBulkAction('approve')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-emerald-600 text-xs font-bold hover:bg-emerald-50 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approve
          </button>
          <button
            type="button"
            onClick={() => setBulkAction('reject')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-rose-600 text-xs font-bold hover:bg-rose-50 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>
        </div>
      )}

      {/* Loading */}
      {isPending && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      )}

      {/* List */}
      {!isPending && verifications.length === 0 ? (
        <EmptyState hasFilter={initialFilters.status !== 'all' || !!initialFilters.search} />
      ) : (
        <>
          {/* Select all */}
          {selectableIds.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-xs text-on-surface-variant">
                Pilih semua yang pending/review ({selectableIds.length})
              </span>
            </div>
          )}

          <div className="space-y-2">
            {verifications.map((v) => (
              <VerificationRow
                key={v.id}
                verification={v}
                selected={selectedIds.has(v.id)}
                canSelect={v.status === 'pending' || v.status === 'in_review'}
                onToggle={() => toggleSelect(v.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 pt-4">
          <span className="text-xs text-on-surface-variant">
            Halaman {pagination.page} dari {pagination.totalPages} ·{' '}
            {pagination.total} total
          </span>

          <div className="flex items-center gap-2">
            <PaginationBtn
              href={buildPageUrl(searchParams, pagination.page - 1)}
              disabled={pagination.page <= 1}
              icon={ChevronLeft}
            />
            <PaginationBtn
              href={buildPageUrl(searchParams, pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              icon={ChevronRight}
            />
          </div>
        </div>
      )}

      {/* Bulk modal */}
      {bulkAction && (
        <BulkConfirmModal
          action={bulkAction}
          count={selectedIds.size}
          notes={bulkNotes}
          setNotes={setBulkNotes}
          saving={bulkSaving}
          error={bulkError}
          onClose={() => {
            setBulkAction(null)
            setBulkError(null)
          }}
          onConfirm={handleBulkSubmit}
        />
      )}
    </div>
  )
}

// ============================================
// ROW
// ============================================

function VerificationRow({
  verification,
  selected,
  canSelect,
  onToggle,
}: {
  verification: Verification
  selected: boolean
  canSelect: boolean
  onToggle: () => void
}) {
  const initials = verification.student.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const statusStyle = STATUS_STYLE[verification.status] ?? STATUS_STYLE.pending
  const statusLabel = STATUS_LABEL[verification.status] ?? verification.status
  const badgeLabel = BADGE_LABEL[verification.certificate.badgeType] ?? verification.certificate.badgeType

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-2xl border transition-colors
        ${
          selected
            ? 'bg-primary/5 border-primary/40'
            : 'bg-surface-container-lowest border-outline-variant/30 hover:border-primary/30'
        }
      `}
    >
      {canSelect && (
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary shrink-0"
        />
      )}

      {verification.student.avatarUrl ? (
        <img
          src={verification.student.avatarUrl}
          alt={verification.student.fullName}
          className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/30"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <span className="text-xs font-black">{initials}</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-bold text-on-surface truncate">
            {verification.certificate.title}
          </h3>
          <span className="px-1.5 py-0.5 rounded bg-surface-container text-[9px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
            {badgeLabel}
          </span>
        </div>
        <div className="text-[11px] text-on-surface-variant truncate mt-0.5">
          {verification.student.fullName}
          {verification.certificate.certificateNumber && (
            <>
              {' · '}
              <span className="font-mono">
                {verification.certificate.certificateNumber}
              </span>
            </>
          )}
        </div>
        <div className="text-[10px] text-on-surface-variant/70 font-mono mt-0.5">
          {verification.submittedAtRelative}
        </div>
      </div>

      <span
        className={`px-2 py-1 rounded font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusStyle}`}
      >
        {statusLabel}
      </span>

      <Link
        href={`/certification/verifications/${verification.id}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shrink-0"
      >
        <Eye className="w-3.5 h-3.5" />
        Review
      </Link>
    </div>
  )
}

// ============================================
// BULK MODAL
// ============================================

function BulkConfirmModal({
  action,
  count,
  notes,
  setNotes,
  saving,
  error,
  onClose,
  onConfirm,
}: {
  action: 'approve' | 'reject'
  count: number
  notes: string
  setNotes: (v: string) => void
  saving: boolean
  error: string | null
  onClose: () => void
  onConfirm: () => void
}) {
  const isApprove = action === 'approve'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            {isApprove ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600" />
            )}
            <h2 className="text-base font-black text-on-surface">
              {isApprove ? 'Approve' : 'Reject'} {count} Sertifikat
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-on-surface-variant">
            {isApprove
              ? `Semua sertifikat yang dipilih akan ditandai sebagai verified.`
              : `Semua sertifikat yang dipilih akan ditandai sebagai rejected.`}
          </p>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-2">
              {isApprove ? 'Catatan (opsional)' : 'Alasan Penolakan (opsional)'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={
                isApprove
                  ? 'Catatan internal...'
                  : 'Jelaskan alasan penolakan supaya siswa tau...'
              }
              className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={saving}
              className={`
                inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white text-sm font-bold disabled:opacity-50 transition-colors
                ${isApprove ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}
              `}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isApprove ? (
                <CheckCheck className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {saving
                ? 'Memproses...'
                : isApprove
                  ? `Approve ${count}`
                  : `Reject ${count}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// HELPERS
// ============================================

function buildPageUrl(params: URLSearchParams, page: number) {
  const next = new URLSearchParams(params.toString())
  if (page <= 1) next.delete('page')
  else next.set('page', String(page))
  return `/certification/verifications?${next.toString()}`
}

function PaginationBtn({
  href,
  disabled,
  icon: Icon,
}: {
  href: string
  disabled: boolean
  icon: any
}) {
  if (disabled) {
    return (
      <span className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant/40 cursor-not-allowed">
        <Icon className="w-4 h-4" />
      </span>
    )
  }

  return (
    <Link
      href={href}
      className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
    >
      <Icon className="w-4 h-4" />
    </Link>
  )
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-lowest p-12 text-center">
      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
        <Inbox className="w-6 h-6 text-on-surface-variant" />
      </div>
      <h3 className="text-sm font-bold text-on-surface mb-1">
        {hasFilter ? 'Tidak ada yang cocok' : 'Belum ada pengajuan'}
      </h3>
      <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
        {hasFilter
          ? 'Coba ubah filter atau reset pencarian.'
          : 'Pengajuan verifikasi sertifikat dari siswa akan muncul di sini.'}
      </p>
    </div>
  )
}