// app/school/students/[studentId]/student-detail-client.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowLeft,
  MapPin,
  Mail,
  Briefcase,
  GraduationCap,
  Award,
  Video,
  FolderOpen,
  Trophy,
  Target,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Calendar,
} from 'lucide-react'

type Student = {
  linkId: string
  status: string
  enrollmentYear: number | null
  graduationYear: number | null
  profileId: string
  fullName: string
  email: string
  avatarUrl: string | null
  headline: string | null
  bio: string | null
  nisn: string | null
  city: string | null
  province: string | null
  gender: string | null
  dateOfBirth: string | null
  isOpenToWork: boolean
  isPublic: boolean
  profileCompletion: number
  careerReadiness: number
  programName: string | null
  skillsCount: number
  portfolioCount: number
  certificationsCount: number
  experiencesCount: number
  achievementsCount: number
  careerStage: string | null
  careerNotes: string | null
  placementDate: string | null
  placedAt: string | null
}

type Skill = {
  id: string
  name: string
  category: string | null
  proficiency: string
}

type PortfolioItem = {
  id: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  projectUrl: string | null
}

type Certification = {
  id: string
  title: string
  issuer: string | null
  issueDate: string | null
  verificationStatus: string
}

type Props = {
  student: Student
  skills: Skill[]
  portfolio: PortfolioItem[]
  certifications: Certification[]
}

type Tab = 'overview' | 'skills' | 'portfolio' | 'certifications'

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  graduated: 'bg-blue-100 text-blue-700',
  transferred: 'bg-amber-100 text-amber-700',
  dropped: 'bg-rose-100 text-rose-700',
}

const STATUS_LABEL: Record<string, string> = {
  active: 'Aktif',
  graduated: 'Alumni',
  transferred: 'Pindah',
  dropped: 'Berhenti',
}

const CAREER_STAGE_LABEL: Record<string, string> = {
  opportunity: 'Cari Peluang',
  applied: 'Sudah Lamar',
  interview: 'Interview',
  placement: 'Sudah Kerja',
  placed: 'Sudah Kerja',
  unemployed: 'Belum Bekerja',
}

export function SchoolStudentDetailClient({
  student,
  skills,
  portfolio,
  certifications,
}: Props) {
  const [tab, setTab] = useState<Tab>('overview')

  const initials = student.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const statusStyle =
    STATUS_STYLE[student.status] ?? STATUS_STYLE.active
  const statusLabel =
    STATUS_LABEL[student.status] ?? student.status

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'skills', label: 'Skills', count: skills.length },
    { id: 'portfolio', label: 'Portfolio', count: portfolio.length },
    {
      id: 'certifications',
      label: 'Sertifikat',
      count: certifications.length,
    },
  ]

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      {/* Back */}
      <Link
        href="/school/students"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke daftar siswa
      </Link>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative p-6 md:p-8">
          <div className="flex items-start gap-5 flex-wrap">
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt={student.fullName}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-2 ring-white shadow-lg shrink-0"
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg">
                <span className="text-2xl md:text-3xl font-black">
                  {initials}
                </span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${statusStyle}`}
                >
                  {statusLabel}
                </span>
                {student.isOpenToWork && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    Open to Work
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
                {student.fullName}
              </h1>

              {student.headline && (
                <p className="text-sm text-on-surface-variant mt-1">
                  {student.headline}
                </p>
              )}

              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {student.programName && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {student.programName}
                  </span>
                )}
                {student.city && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <MapPin className="w-3.5 h-3.5" />
                    {student.city}
                  </span>
                )}
                {student.enrollmentYear && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    Angkatan {student.enrollmentYear}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Career Stage Banner */}
          {student.careerStage && (
            <div className="mt-6 p-4 rounded-2xl bg-white/70 backdrop-blur border border-primary/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-primary mb-0.5">
                    Status Karier
                  </div>
                  <div className="text-sm font-bold text-on-surface">
                    {CAREER_STAGE_LABEL[student.careerStage] ??
                      student.careerStage}
                  </div>
                  {student.careerNotes && (
                    <p className="text-xs text-on-surface-variant mt-1">
                      {student.careerNotes}
                    </p>
                  )}
                  {student.placementDate && (
                    <p className="text-[11px] text-on-surface-variant mt-1 font-mono">
                      Ditempatkan:{' '}
                      {new Date(student.placementDate).toLocaleDateString(
                        'id-ID',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat
          icon={Briefcase}
          label="Skills"
          value={student.skillsCount}
          color="bg-primary/10 text-primary"
        />
        <MiniStat
          icon={FolderOpen}
          label="Portfolio"
          value={student.portfolioCount}
          color="bg-blue-100 text-blue-700"
        />
        <MiniStat
          icon={Award}
          label="Sertifikat"
          value={student.certificationsCount}
          color="bg-amber-100 text-amber-700"
        />
        <MiniStat
          icon={Trophy}
          label="Pencapaian"
          value={student.achievementsCount}
          color="bg-emerald-100 text-emerald-700"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-x-auto">
        {tabs.map((t) => {
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap
                ${
                  isActive
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }
              `}
            >
              {t.label}
              {typeof t.count === 'number' && (
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

      {/* Tab Content */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        {tab === 'overview' && (
          <OverviewTab
            student={student}
            skills={skills}
            portfolio={portfolio}
            certifications={certifications}
          />
        )}
        {tab === 'skills' && <SkillsTab skills={skills} />}
        {tab === 'portfolio' && <PortfolioTab portfolio={portfolio} />}
        {tab === 'certifications' && (
          <CertificationsTab certifications={certifications} />
        )}
      </div>
    </div>
  )
}

// ============================================
// OVERVIEW TAB
// ============================================

function OverviewTab({
  student,
  skills,
  portfolio,
  certifications,
}: {
  student: Student
  skills: Skill[]
  portfolio: PortfolioItem[]
  certifications: Certification[]
}) {
  return (
    <div className="space-y-6">
      {/* Bio */}
      {student.bio && (
        <div>
          <SectionTitle icon={Sparkles} title="Tentang" />
          <p className="text-sm text-on-surface leading-relaxed mt-3">
            {student.bio}
          </p>
        </div>
      )}

      {/* Info dasar */}
      <div>
        <SectionTitle icon={Briefcase} title="Informasi Siswa" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <InfoRow label="NISN" value={student.nisn ?? '-'} mono />
          <InfoRow label="Email" value={student.email} />
          <InfoRow
            label="Angkatan"
            value={student.enrollmentYear?.toString() ?? '-'}
          />
          <InfoRow
            label="Lulus"
            value={student.graduationYear?.toString() ?? '-'}
          />
          <InfoRow label="Program" value={student.programName ?? '-'} />
          <InfoRow
            label="Jenis Kelamin"
            value={
              student.gender === 'male'
                ? 'Laki-laki'
                : student.gender === 'female'
                  ? 'Perempuan'
                  : '-'
            }
          />
        </div>
      </div>

      {/* Progress bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ProgressCard
          label="Kelengkapan Profil"
          value={student.profileCompletion}
          color="from-primary to-primary-container"
        />
        <ProgressCard
          label="Kesiapan Karier"
          value={student.careerReadiness}
          color="from-emerald-500 to-emerald-600"
        />
      </div>

      {/* Quick previews */}
      {skills.length > 0 && (
        <div>
          <SectionTitle icon={Briefcase} title={`Skills (${skills.length})`} />
          <div className="flex flex-wrap gap-1.5 mt-3">
            {skills.slice(0, 10).map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold"
              >
                {s.name}
              </span>
            ))}
            {skills.length > 10 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant text-xs font-semibold">
                +{skills.length - 10} lainnya
              </span>
            )}
          </div>
        </div>
      )}

      {portfolio.length > 0 && (
        <div>
          <SectionTitle
            icon={FolderOpen}
            title={`Portfolio (${portfolio.length})`}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {portfolio.slice(0, 3).map((p) => (
              <PortfolioMiniCard key={p.id} item={p} />
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div>
          <SectionTitle
            icon={Award}
            title={`Sertifikat (${certifications.length})`}
          />
          <div className="space-y-2 mt-3">
            {certifications.slice(0, 3).map((c) => (
              <CertificationRow key={c.id} cert={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// SKILLS TAB
// ============================================

function SkillsTab({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) {
    return <EmptyState icon={Briefcase} message="Belum ada skill terdaftar" />
  }

  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    const cat = s.category ?? 'Lainnya'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h4 className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">
            {category}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {items.map((s) => (
              <SkillChip key={s.id} skill={s} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function SkillChip({ skill }: { skill: Skill }) {
  const colors: Record<string, string> = {
    beginner: 'bg-slate-100 text-slate-700 border-slate-200',
    intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
    advanced: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    expert: 'bg-primary/10 text-primary border-primary/20',
  }
  const style = colors[skill.proficiency] ?? colors.intermediate

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${style}`}
    >
      {skill.name}
      <span className="font-mono text-[9px] uppercase opacity-70">
        {skill.proficiency}
      </span>
    </span>
  )
}

// ============================================
// PORTFOLIO TAB
// ============================================

function PortfolioTab({ portfolio }: { portfolio: PortfolioItem[] }) {
  if (portfolio.length === 0) {
    return <EmptyState icon={FolderOpen} message="Belum ada portfolio" />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {portfolio.map((p) => (
        <PortfolioCard key={p.id} item={p} />
      ))}
    </div>
  )
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <div className="rounded-2xl border border-outline-variant/30 overflow-hidden bg-surface-container-lowest hover:border-primary/30 transition-colors group">
      {item.thumbnailUrl ? (
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <FolderOpen className="w-10 h-10 text-primary/40" />
        </div>
      )}
      <div className="p-4">
        <h4 className="text-sm font-bold text-on-surface line-clamp-1">
          {item.title}
        </h4>
        {item.description && (
          <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
        {item.projectUrl && (
          <a
            href={item.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline mt-2"
          >
            Lihat proyek <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}

function PortfolioMiniCard({ item }: { item: PortfolioItem }) {
  return (
    <div className="rounded-xl border border-outline-variant/30 overflow-hidden bg-surface-container-lowest">
      {item.thumbnailUrl ? (
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="w-full h-24 object-cover"
        />
      ) : (
        <div className="w-full h-24 bg-primary/5 flex items-center justify-center">
          <FolderOpen className="w-6 h-6 text-primary/30" />
        </div>
      )}
      <div className="p-2.5">
        <h5 className="text-[11px] font-bold text-on-surface truncate">
          {item.title}
        </h5>
      </div>
    </div>
  )
}

// ============================================
// CERTIFICATIONS TAB
// ============================================

function CertificationsTab({ certifications }: { certifications: Certification[] }) {
  if (certifications.length === 0) {
    return <EmptyState icon={Award} message="Belum ada sertifikat" />
  }

  return (
    <div className="space-y-2">
      {certifications.map((c) => (
        <CertificationRow key={c.id} cert={c} />
      ))}
    </div>
  )
}

function CertificationRow({ cert }: { cert: Certification }) {
  const iconMap: Record<
    string,
    { icon: any; color: string; bg: string; label: string }
  > = {
    verified: {
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      label: 'Terverifikasi',
    },
    pending: {
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      label: 'Menunggu',
    },
    rejected: {
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-100',
      label: 'Ditolak',
    },
  }

  const cfg = iconMap[cert.verificationStatus] ?? iconMap.pending
  const Icon = cfg.icon

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/50 hover:bg-surface-container transition-colors">
      <div
        className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}
      >
        <Award className={`w-5 h-5 ${cfg.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-on-surface truncate">
          {cert.title}
        </div>
        <div className="text-[11px] text-on-surface-variant truncate">
          {cert.issuer ?? '-'}
          {cert.issueDate && (
            <>
              {' · '}
              {new Date(cert.issueDate).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </>
          )}
        </div>
      </div>

      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.color}`}
      >
        <Icon className="w-3 h-3" />
        {cfg.label}
      </span>
    </div>
  )
}

// ============================================
// SHARED COMPONENTS
// ============================================

function SectionTitle({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-primary" />
      <h3 className="text-sm font-bold text-on-surface">{title}</h3>
    </div>
  )
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-container-low/50">
      <span className="text-xs text-on-surface-variant">{label}</span>
      <span
        className={`text-xs font-bold text-on-surface truncate ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function ProgressCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  const pct = Math.max(0, Math.min(100, value))

  return (
    <div className="p-4 rounded-xl bg-surface-container-low/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-on-surface-variant">
          {label}
        </span>
        <span className="text-xs font-black text-on-surface font-mono">
          {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-container overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3.5 flex items-center gap-3">
      <div
        className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center shrink-0`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-lg font-black text-on-surface leading-none">
          {value}
        </div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant mt-1 truncate">
          {label}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <div className="py-12 text-center">
      <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-on-surface-variant" />
      </div>
      <p className="text-sm text-on-surface-variant">{message}</p>
    </div>
  )
}