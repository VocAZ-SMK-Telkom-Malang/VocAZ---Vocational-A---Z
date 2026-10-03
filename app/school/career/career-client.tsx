// app/school/career/career-client.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Target,
  Briefcase,
  Sparkles,
  Users,
  Trophy,
  TrendingUp,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  Award,
  Calendar,
} from 'lucide-react'

type Props = {
  stats: {
    totalActive: number
    seeking: number
    inProcess: number
    placed: number
    placementRate: number
  }
  tab: 'opportunities' | 'recommended' | 'recruitment' | 'placement'
  stage: string
  opportunities: any[]
  recommended: any[]
  recruitment: any[]
  placements: any[]
}

const STAGE_LABEL: Record<string, string> = {
  opportunity: 'Cari Peluang',
  applied: 'Sudah Lamar',
  interview: 'Interview',
  placement: 'Sudah Kerja',
  placed: 'Sudah Kerja',
  unemployed: 'Belum Bekerja',
}

const STAGE_STYLE: Record<string, string> = {
  opportunity: 'bg-blue-100 text-blue-700',
  applied: 'bg-amber-100 text-amber-700',
  interview: 'bg-purple-100 text-purple-700',
  placement: 'bg-emerald-100 text-emerald-700',
  placed: 'bg-emerald-100 text-emerald-700',
  unemployed: 'bg-slate-100 text-slate-700',
}

export function SchoolCareerClient({
  stats,
  tab: initialTab,
  stage: initialStage,
  opportunities,
  recommended,
  recruitment,
  placements,
}: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [stage, setStage] = useState(initialStage)

  const tabs = [
    {
      id: 'opportunities' as const,
      label: 'Lowongan',
      icon: Briefcase,
      count: opportunities.length,
    },
    {
      id: 'recommended' as const,
      label: 'Recommended',
      icon: Sparkles,
      count: recommended.length,
    },
    {
      id: 'recruitment' as const,
      label: 'Status Rekrutmen',
      icon: Users,
      count: recruitment.length,
    },
    {
      id: 'placement' as const,
      label: 'Placement',
      icon: Trophy,
      count: placements.length,
    },
  ]

  function goToTab(nextTab: string, nextStage?: string) {
    const params = new URLSearchParams()
    params.set('tab', nextTab)
    if (nextStage && nextStage !== 'all') params.set('stage', nextStage)
    startTransition(() => {
      router.push(`/school/career?${params.toString()}`)
    })
  }

  function goToStage(nextStage: string) {
    setStage(nextStage)
    goToTab('recruitment', nextStage)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
          <Target className="w-3 h-3 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-primary">
            Career Monitoring
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-on-surface">
          Career Monitoring
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Pantau karier siswa, lowongan dari industri, dan hasil penempatan.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <CareerStatCard
          icon={Users}
          label="Siswa Aktif"
          value={stats.totalActive}
          desc="Terdaftar di sekolah"
          color="bg-primary/10 text-primary"
        />
        <CareerStatCard
          icon={Target}
          label="Cari Peluang"
          value={stats.seeking}
          desc="Sedang mencari kerja"
          color="bg-blue-100 text-blue-700"
        />
        <CareerStatCard
          icon={Clock}
          label="Dalam Proses"
          value={stats.inProcess}
          desc="Lamaran / interview"
          color="bg-amber-100 text-amber-700"
        />
        <CareerStatCard
          icon={Trophy}
          label="Placement"
          value={stats.placed}
          desc={`${stats.placementRate}% dari siswa aktif`}
          color="bg-emerald-100 text-emerald-700"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = initialTab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => goToTab(t.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                ${
                  isActive
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {t.label}
              {t.count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {t.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div>
        {initialTab === 'opportunities' && (
          <OpportunitiesTab items={opportunities} />
        )}
        {initialTab === 'recommended' && (
          <RecommendedTab items={recommended} />
        )}
        {initialTab === 'recruitment' && (
          <RecruitmentTab
            items={recruitment}
            stage={stage}
            onChangeStage={goToStage}
          />
        )}
        {initialTab === 'placement' && <PlacementTab items={placements} />}
      </div>
    </div>
  )
}

// ============================================
// TAB 1 — OPPORTUNITIES (Lowongan)
// ============================================

function OpportunitiesTab({ items }: { items: any[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Belum ada lowongan aktif"
        desc="Lowongan dari perusahaan partner akan muncul di sini."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((job) => (
        <Link
          key={job.jobId}
          href={`/school/career/jobs/${job.jobId}`}
          className="group rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 hover:border-primary/40 hover:shadow-md transition-all"
        >
          <div className="flex items-start gap-3">
            {job.companyLogoUrl ? (
              <img
                src={job.companyLogoUrl}
                alt={job.companyName}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-outline-variant/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                {job.companyName}
              </p>

              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {job.city && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant">
                    <MapPin className="w-3 h-3" />
                    {job.city}
                  </span>
                )}
                {job.workMode && (
                  <span className="px-1.5 py-0.5 rounded bg-surface-container text-[10px] font-mono uppercase tracking-wider font-bold text-on-surface-variant">
                    {job.workMode}
                  </span>
                )}
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0 mt-1" />
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-on-surface-variant" />
              <span className="text-[11px] text-on-surface-variant">
                <strong className="text-on-surface font-mono">
                  {job.applicantCount}
                </strong>{' '}
                pelamar
              </span>
            </div>
            {job.matchedStudents > 0 && (
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] text-on-surface-variant">
                  <strong className="text-primary font-mono">
                    {job.matchedStudents}
                  </strong>{' '}
                  siswa kamu
                </span>
              </div>
            )}
            {job.deadline && (
              <span className="ml-auto text-[10px] text-on-surface-variant font-mono">
                Deadline:{' '}
                {new Date(job.deadline).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                })}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

// ============================================
// TAB 2 — RECOMMENDED
// ============================================

function RecommendedTab({ items }: { items: any[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Belum ada rekomendasi"
        desc="Siswa dengan profil lengkap akan muncul di sini."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((s) => (
        <RecommendedCard key={s.profileId} student={s} />
      ))}
    </div>
  )
}

function RecommendedCard({ student }: { student: any }) {
  const initials = student.fullName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Link
      href={`/school/students/${student.profileId}`}
      className="group rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-5 hover:border-primary/40 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        {student.avatarUrl ? (
          <img
            src={student.avatarUrl}
            alt={student.fullName}
            className="w-12 h-12 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/30"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="text-sm font-black">{initials}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
            {student.fullName}
          </h3>
          {student.programName && (
            <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
              {student.programName}
            </p>
          )}
        </div>

        <div className="shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
            <span className="text-xs font-black text-white font-mono">
              {student.matchScore}
            </span>
          </div>
        </div>
      </div>

      {student.headline && (
        <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
          {student.headline}
        </p>
      )}

      {student.topSkills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {student.topSkills.slice(0, 3).map((sk: string, i: number) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-semibold"
            >
              {sk}
            </span>
          ))}
          {student.topSkills.length > 3 && (
            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[10px] font-semibold">
              +{student.topSkills.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}

// ============================================
// TAB 3 — RECRUITMENT STATUS
// ============================================

function RecruitmentTab({
  items,
  stage,
  onChangeStage,
}: {
  items: any[]
  stage: string
  onChangeStage: (s: string) => void
}) {
  const stages = [
    { value: 'all', label: 'Semua' },
    { value: 'opportunity', label: 'Cari Peluang' },
    { value: 'applied', label: 'Sudah Lamar' },
    { value: 'interview', label: 'Interview' },
    { value: 'placement', label: 'Placement' },
  ]

  return (
    <div className="space-y-4">
      {/* Stage filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        {stages.map((s) => {
          const isActive = stage === s.value
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => onChangeStage(s.value)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-bold transition-colors
                ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }
              `}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Belum ada data monitoring"
          desc="Status rekrutmen siswa akan muncul setelah mereka melamar lowongan."
        />
      ) : (
        <div className="space-y-2">
          {items.map((m) => (
            <RecruitmentRow key={m.linkId} item={m} />
          ))}
        </div>
      )}
    </div>
  )
}

function RecruitmentRow({ item }: { item: any }) {
  const stageStyle = STAGE_STYLE[item.stage] ?? STAGE_STYLE.opportunity
  const stageLabel = STAGE_LABEL[item.stage] ?? item.stage
  const initials = item.student.fullName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/30 transition-colors">
      {item.student.avatarUrl ? (
        <img
          src={item.student.avatarUrl}
          alt={item.student.fullName}
          className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/30"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <span className="text-xs font-black">{initials}</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/school/students/${item.student.profileId}`}
            className="text-sm font-bold text-on-surface hover:text-primary transition-colors truncate"
          >
            {item.student.fullName}
          </Link>
          <span
            className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${stageStyle}`}
          >
            {stageLabel}
          </span>
        </div>

        {item.job && (
          <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">
            {item.job.title} · {item.job.companyName}
          </p>
        )}
      </div>

      <span className="text-[10px] text-on-surface-variant font-mono shrink-0">
        {new Date(item.updatedAt).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
        })}
      </span>
    </div>
  )
}

// ============================================
// TAB 4 — PLACEMENT
// ============================================

function PlacementTab({ items }: { items: any[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="Belum ada placement"
        desc="Siswa yang sudah diterima kerja akan muncul di sini."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((p) => (
        <PlacementCard key={p.linkId} item={p} />
      ))}
    </div>
  )
}

function PlacementCard({ item }: { item: any }) {
  const initials = item.student.fullName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-5">
      <div className="flex items-start gap-3 mb-3">
        {item.student.avatarUrl ? (
          <img
            src={item.student.avatarUrl}
            alt={item.student.fullName}
            className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-emerald-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <span className="text-sm font-black">{initials}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <Link
            href={`/school/students/${item.student.profileId}`}
            className="text-sm font-bold text-on-surface hover:text-emerald-700 transition-colors truncate block"
          >
            {item.student.fullName}
          </Link>
          {item.student.programName && (
            <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
              {item.student.programName}
            </p>
          )}
        </div>

        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
          <Trophy className="w-4 h-4 text-emerald-600" />
        </div>
      </div>

      <div className="space-y-2 pt-3 border-t border-emerald-200">
        {item.company && (
          <div className="flex items-center gap-2">
            {item.company.logoUrl ? (
              <img
                src={item.company.logoUrl}
                alt={item.company.name}
                className="w-5 h-5 rounded object-cover shrink-0"
              />
            ) : (
              <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center shrink-0">
                <Briefcase className="w-3 h-3 text-emerald-600" />
              </div>
            )}
            <span className="text-xs font-bold text-on-surface truncate">
              {item.company.name}
            </span>
          </div>
        )}

        {item.job && (
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
            <span className="text-[11px] text-on-surface-variant truncate">
              {item.job.title}
            </span>
          </div>
        )}

        {item.placementDate && (
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
            <span className="text-[11px] text-on-surface-variant font-mono">
              {new Date(item.placementDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// SHARED
// ============================================

function CareerStatCard({
  icon: Icon,
  label,
  value,
  desc,
  color,
}: {
  icon: any
  label: string
  value: number
  desc: string
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
      <div className="text-2xl lg:text-3xl font-black text-on-surface tracking-tight">
        {value}
      </div>
      <div className="text-xs font-bold text-on-surface mt-1">{label}</div>
      <div className="text-[11px] text-on-surface-variant mt-0.5">{desc}</div>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  desc,
}: {
  icon: any
  title: string
  desc: string
}) {
  return (
    <div className="rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container-lowest p-12 text-center">
      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-on-surface-variant" />
      </div>
      <h3 className="text-sm font-bold text-on-surface mb-1">{title}</h3>
      <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
        {desc}
      </p>
    </div>
  )
}