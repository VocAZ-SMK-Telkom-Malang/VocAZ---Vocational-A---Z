// app/certification/dashboard/dashboard-client.tsx
'use client'

import Link from 'next/link'
import {
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Award,
  Timer,
  Inbox,
  Eye,
  Users,
} from 'lucide-react'

type Props = {
  institutionName: string
  institutionType: string
  stats: {
    pending: number
    inReview: number
    verifiedThisMonth: number
    rejectedThisMonth: number
    totalVerified: number
    totalRejected: number
    avgResponseHours: number
  }
  recent: Array<{
    id: string
    certificateId: string
    studentName: string
    studentAvatarUrl: string | null
    certificateTitle: string
    certificateNumber: string | null
    badgeType: string
    status: string
    submittedAt: string
    submittedAtRelative: string
  }>
  trend: Array<{
    date: string
    label: string
    submitted: number
    verified: number
    rejected: number
  }>
}

const TYPE_LABEL: Record<string, string> = {
  lsp_bnsp: 'LSP / BNSP',
  industry: 'Industry Certification',
  training: 'Training Institution',
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

export function CertDashboardClient({
  institutionName,
  institutionType,
  stats,
  recent,
  trend,
}: Props) {
  const totalThisMonth = stats.verifiedThisMonth + stats.rejectedThisMonth
  const approvalRate =
    totalThisMonth > 0
      ? Math.round((stats.verifiedThisMonth / totalThisMonth) * 100)
      : 0

  const maxTrend = Math.max(
    ...trend.map((t) => t.submitted),
    1
  )

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-container to-[#B70011] text-white p-6 md:p-8">
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20 mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
              {TYPE_LABEL[institutionType] ?? 'Verifier'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            {institutionName}
          </h1>
          <p className="text-sm md:text-base text-white/85 mt-2 max-w-2xl">
            {stats.pending + stats.inReview > 0
              ? `Ada ${stats.pending + stats.inReview} sertifikat menunggu verifikasi kamu.`
              : 'Semua sertifikat sudah diverifikasi. Kerja bagus! 🎉'}
          </p>

          {/* Quick action */}
          <div className="mt-5">
            <Link
              href="/certification/verifications"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary font-bold text-sm shadow-md hover:brightness-105 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              Verifikasi Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Clock}
          label="Menunggu"
          value={stats.pending + stats.inReview}
          desc={`${stats.pending} pending · ${stats.inReview} review`}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          icon={CheckCircle2}
          label="Terverifikasi"
          value={stats.verifiedThisMonth}
          desc="Bulan ini"
          color="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          icon={XCircle}
          label="Ditolak"
          value={stats.rejectedThisMonth}
          desc="Bulan ini"
          color="bg-rose-100 text-rose-700"
        />
        <StatCard
          icon={Timer}
          label="Rata-rata Review"
          value={stats.avgResponseHours}
          suffix=" jam"
          desc="100 verifikasi terakhir"
          color="bg-primary/10 text-primary"
        />
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Approval rate */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-on-surface">Approval Rate</h3>
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
              Bulan ini
            </span>
          </div>

          <div className="flex items-end gap-3 mb-3">
            <div className="text-4xl font-black text-on-surface font-mono leading-none">
              {approvalRate}
              <span className="text-xl text-on-surface-variant">%</span>
            </div>
            <div className="pb-1">
              <div className="text-[11px] text-emerald-600 font-bold">
                {stats.verifiedThisMonth} ok
              </div>
              <div className="text-[11px] text-rose-600 font-bold">
                {stats.rejectedThisMonth} tolak
              </div>
            </div>
          </div>

          <div className="h-2 rounded-full bg-surface-container overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
              style={{ width: `${approvalRate}%` }}
            />
          </div>
        </div>

        {/* Total stats */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-on-surface">Sepanjang Waktu</h3>
            <Award className="w-4 h-4 text-on-surface-variant" />
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-3xl font-black text-emerald-600 font-mono leading-none">
                {stats.totalVerified}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant mt-1">
                Total Terverifikasi
              </div>
            </div>
            <div className="pt-3 border-t border-outline-variant/30">
              <div className="text-2xl font-black text-rose-600 font-mono leading-none">
                {stats.totalRejected}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant mt-1">
                Total Ditolak
              </div>
            </div>
          </div>
        </div>

        {/* Trust badge */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-black text-on-surface">Trust Level</h3>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-on-surface-variant leading-relaxed">
              Setiap verifikasi kamu berkontribusi ke ekosistem talenta SMK
              Indonesia. Badge yang kamu berikan muncul di profil siswa.
            </div>

            <div className="pt-3 mt-3 border-t border-primary/20 flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-primary">
                Verified Institution
              </span>
              <CheckCircle2 className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-black text-on-surface">
              Aktivitas 7 Hari Terakhir
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Pengajuan vs hasil verifikasi
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-on-surface-variant" />
        </div>

        <div className="flex items-end gap-2 h-40">
          {trend.map((t, idx) => {
            const submittedH = (t.submitted / maxTrend) * 100
            const verifiedH = (t.verified / maxTrend) * 100
            const rejectedH = (t.rejected / maxTrend) * 100

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center gap-0.5 h-full">
                  {/* Submitted */}
                  <div
                    className="w-full max-w-[10px] rounded-t bg-primary/30 relative group"
                    style={{
                      height: `${Math.max(submittedH, 2)}%`,
                      minHeight: '4px',
                    }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-on-surface text-white text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {t.submitted} kirim
                    </div>
                  </div>

                  {/* Verified */}
                  <div
                    className="w-full max-w-[10px] rounded-t bg-emerald-500 relative group"
                    style={{
                      height: `${Math.max(verifiedH, 2)}%`,
                      minHeight: '4px',
                    }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-on-surface text-white text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {t.verified} ok
                    </div>
                  </div>

                  {/* Rejected */}
                  <div
                    className="w-full max-w-[10px] rounded-t bg-rose-500 relative group"
                    style={{
                      height: `${Math.max(rejectedH, 2)}%`,
                      minHeight: '4px',
                    }}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-on-surface text-white text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {t.rejected} tolak
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-on-surface-variant">
                  {t.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-outline-variant/30 flex-wrap">
          <Legend color="bg-primary/30" label="Diajukan" />
          <Legend color="bg-emerald-500" label="Verified" />
          <Legend color="bg-rose-500" label="Rejected" />
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-black text-on-surface">
              Pengajuan Terbaru
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              5 pengajuan terakhir yang masuk
            </p>
          </div>
          <Link
            href="/certification/verifications"
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            Lihat semua <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6 text-on-surface-variant" />
            </div>
            <h3 className="text-sm font-bold text-on-surface mb-1">
              Belum ada pengajuan
            </h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              Pengajuan verifikasi sertifikat dari siswa akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((r) => (
              <RecentRow key={r.id} request={r} />
            ))}
          </div>
        )}
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
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-4 lg:p-5">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl lg:text-3xl font-black text-on-surface tracking-tight font-mono">
        {value}
        {suffix && (
          <span className="text-sm text-on-surface-variant ml-1">{suffix}</span>
        )}
      </div>
      <div className="text-xs font-bold text-on-surface mt-1">{label}</div>
      <div className="text-[11px] text-on-surface-variant mt-0.5">{desc}</div>
    </div>
  )
}

function RecentRow({
  request,
}: {
  request: {
    id: string
    certificateId: string
    studentName: string
    studentAvatarUrl: string | null
    certificateTitle: string
    certificateNumber: string | null
    badgeType: string
    status: string
    submittedAt: string
    submittedAtRelative: string
  }
}) {
  const initials = request.studentName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const statusStyle = STATUS_STYLE[request.status] ?? STATUS_STYLE.pending
  const statusLabel = STATUS_LABEL[request.status] ?? request.status

  return (
    <Link
      href={`/certification/verifications/${request.id}`}
      className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/40 hover:bg-surface-container-low transition-colors group"
    >
      {request.studentAvatarUrl ? (
        <img
          src={request.studentAvatarUrl}
          alt={request.studentName}
          className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/30"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <span className="text-xs font-black">{initials}</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-on-surface truncate">
          {request.certificateTitle}
        </div>
        <div className="text-[11px] text-on-surface-variant truncate">
          {request.studentName}
          {request.certificateNumber && (
            <>
              {' · '}
              <span className="font-mono">{request.certificateNumber}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${statusStyle}`}
        >
          {statusLabel}
        </span>
        <span className="text-[10px] text-on-surface-variant font-mono hidden md:block">
          {request.submittedAtRelative}
        </span>
        <Eye className="w-4 h-4 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded ${color}`} />
      <span className="text-[11px] text-on-surface-variant font-semibold">
        {label}
      </span>
    </div>
  )
}