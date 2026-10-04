// app/certification/records/records-client.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  CheckCircle2,
  XCircle,
  Award,
  TrendingUp,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Download,
} from 'lucide-react'

type CertificateRecord = {
  id: string
  status: string
  reviewedAt: string | null
  reviewedAtRelative: string
  notes: string | null
  certificate: {
    id: string
    title: string
    certificateNumber: string | null
    issuedDate: string | null
    badgeType: string
    documentUrl: string | null
  }
  student: {
    profileId: string
    fullName: string
    email: string
    avatarUrl: string | null
  }
}

type Props = {
  records: CertificateRecord[]
  pagination: { page: number; totalPages: number; total: number }
  counts: { all: number; verified: number; rejected: number }
  stats: {
    totalVerified: number
    totalRejected: number
    thisMonthVerified: number
    thisMonthRejected: number
    approvalRate: number
  }
  filters: {
    status: string
    search: string
    badgeType: string
    period: string
  }
}

const STATUS_STYLE: Record<string, string> = {
  verified: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
}

const STATUS_LABEL: Record<string, string> = {
  verified: 'Verified',
  rejected: 'Rejected',
}

const BADGE_LABEL: Record<string, string> = {
  lsp_bnsp: 'LSP/BNSP',
  industry: 'Industry',
  training: 'Training',
}

export function RecordsClient({
  records,
  pagination,
  counts,
  stats,
  filters: initialFilters,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(initialFilters.search)

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') params.set(key, value)
    else params.delete(key)
    params.delete('page')
    startTransition(() => {
      router.push(`/certification/records?${params.toString()}`)
    })
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    applyFilter('q', search)
  }

  function exportCSV() {
    const rows = [
      ['Nama Siswa', 'Email', 'Sertifikat', 'Nomor', 'Badge', 'Status', 'Tanggal Review'],
      ...records.map((r) => [
        r.student.fullName,
        r.student.email,
        r.certificate.title,
        r.certificate.certificateNumber ?? '-',
        BADGE_LABEL[r.certificate.badgeType] ?? r.certificate.badgeType,
        r.status,
        r.reviewedAt
          ? new Date(r.reviewedAt).toLocaleDateString('id-ID')
          : '-',
      ]),
    ]

    const csv = rows.map((row) => row.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `records-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'all', label: 'Semua', count: counts.all },
    { id: 'verified', label: 'Verified', count: counts.verified },
    { id: 'rejected', label: 'Rejected', count: counts.rejected },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-on-surface">
            Riwayat Verifikasi
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Semua sertifikat yang pernah kamu review.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          disabled={records.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm font-bold text-on-surface hover:border-primary/40 disabled:opacity-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={CheckCircle2}
          label="Total Verified"
          value={stats.totalVerified}
          desc={`${stats.thisMonthVerified} bulan ini`}
          color="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={XCircle}
          label="Total Rejected"
          value={stats.totalRejected}
          desc={`${stats.thisMonthRejected} bulan ini`}
          color="bg-rose-100 text-rose-700"
        />
        <StatCard
          icon={TrendingUp}
          label="Approval Rate"
          value={stats.approvalRate}
          suffix="%"
          desc="Sepanjang waktu"
          color="bg-primary/10 text-primary"
        />
        <StatCard
          icon={Award}
          label="Total Review"
          value={stats.totalVerified + stats.totalRejected}
          desc="Semua keputusan"
          color="bg-blue-100 text-blue-700"
        />
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

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama siswa, judul, atau nomor..."
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

        <select
          value={initialFilters.period}
          onChange={(e) => applyFilter('period', e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm font-bold"
        >
          <option value="all">Semua Waktu</option>
          <option value="7d">7 Hari</option>
          <option value="30d">30 Hari</option>
          <option value="90d">90 Hari</option>
        </select>
      </div>

      {/* Loading */}
      {isPending && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        </div>
      )}

      {/* List */}
      {!isPending && records.length === 0 ? (
        <EmptyState
          hasFilter={
            initialFilters.status !== 'all' ||
            !!initialFilters.search ||
            initialFilters.period !== 'all'
          }
        />
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <RecordRow key={r.id} record={r} />
          ))}
        </div>
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
    </div>
  )
}

// ============================================
// ROW
// ============================================

function RecordRow({ record }: { record: CertificateRecord }) {
  const initials = record.student.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const statusStyle = STATUS_STYLE[record.status] ?? STATUS_STYLE.verified
  const statusLabel = STATUS_LABEL[record.status] ?? record.status
  const badgeLabel = BADGE_LABEL[record.certificate.badgeType] ?? record.certificate.badgeType

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/30 transition-colors group">
      {record.student.avatarUrl ? (
        <img
          src={record.student.avatarUrl}
          alt={record.student.fullName}
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
            {record.certificate.title}
          </h3>
          <span className="px-1.5 py-0.5 rounded bg-surface-container text-[9px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
            {badgeLabel}
          </span>
        </div>
        <div className="text-[11px] text-on-surface-variant truncate mt-0.5">
          {record.student.fullName}
          {record.certificate.certificateNumber && (
            <>
              {' · '}
              <span className="font-mono">
                {record.certificate.certificateNumber}
              </span>
            </>
          )}
        </div>
        {record.notes && (
          <p className="text-[10px] text-on-surface-variant/70 truncate mt-0.5">
            {record.notes}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`px-2 py-1 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${statusStyle}`}
        >
          {statusLabel}
        </span>
        <span className="text-[10px] text-on-surface-variant font-mono hidden md:block">
          {record.reviewedAtRelative}
        </span>
        <Link
          href={`/certification/verifications/${record.id}`}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
          title="Lihat"
        >
          <Eye className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

// ============================================
// SUB COMPONENTS
// ============================================

function StatCard({
  icon: Icon,
  label,
  value,
  desc,
  suffix,
  color,
}: {
  icon: any
  label: string
  value: number
  desc: string
  suffix?: string
  color: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-black text-on-surface tracking-tight font-mono">
        {value}
        {suffix && (
          <span className="text-sm text-on-surface-variant ml-0.5">
            {suffix}
          </span>
        )}
      </div>
      <div className="text-xs font-bold text-on-surface mt-1">{label}</div>
      <div className="text-[11px] text-on-surface-variant mt-0.5">{desc}</div>
    </div>
  )
}

function buildPageUrl(params: URLSearchParams, page: number) {
  const next = new URLSearchParams(params.toString())
  if (page <= 1) next.delete('page')
  else next.set('page', String(page))
  return `/certification/records?${next.toString()}`
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
        {hasFilter ? 'Tidak ada riwayat cocok' : 'Belum ada riwayat'}
      </h3>
      <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
        {hasFilter
          ? 'Coba ubah filter untuk lihat riwayat lainnya.'
          : 'Sertifikat yang sudah kamu verify atau reject akan muncul di sini.'}
      </p>
    </div>
  )
}