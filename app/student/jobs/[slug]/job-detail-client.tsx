// app/student/jobs/[slug]/job-detail-client.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  Wallet,
  Calendar,
  Building2,
  CheckCircle2,
  Bookmark,
  Share2,
  Users,
  Eye,
  Loader2,
  AlertCircle,
  BadgeCheck,
} from 'lucide-react'
import { ApplyModal } from '@/components/student/jobs/apply-modal'
import type { ScreeningQuestionInput } from '@/lib/screening/types'
import { toggleSaveJobAction } from '@/app/student/jobs/actions'
import type { JobDetail } from '@/lib/queries/student-jobs'

type Props = {
  job: JobDetail
  hasCv: boolean
  defaultCvUrl: string | null
  defaultCvKey: string | null
  isLoggedIn: boolean
  screeningQuestions: ScreeningQuestionInput[] 
}

const EMPLOYMENT_LABEL: Record<string, string> = {
  internship: 'Internship',
  part_time: 'Part Time',
  full_time: 'Full Time',
  freelance: 'Freelance',
  volunteer: 'Volunteer',
  contract: 'Contract',
}

const WORK_MODE_LABEL: Record<string, string> = {
  onsite: 'On-site',
  remote: 'Remote',
  hybrid: 'Hybrid',
}

const EXPERIENCE_LABEL: Record<string, string> = {
  entry: 'Entry Level',
  junior: 'Junior',
  mid: 'Mid Level',
  senior: 'Senior',
}

const STATUS_LABEL: Record<string, { label: string; style: string }> = {
  submitted: { label: 'Lamaran Terkirim', style: 'bg-blue-50 text-blue-700 border-blue-200' },
  reviewed: { label: 'Sedang Ditinjau', style: 'bg-amber-50 text-amber-700 border-amber-200' },
  shortlisted: { label: 'Shortlist', style: 'bg-purple-50 text-purple-700 border-purple-200' },
  interview: { label: 'Tahap Interview', style: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  offered: { label: 'Ditawari Kontrak', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  hired: { label: 'Diterima', style: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  rejected: { label: 'Tidak Lolos', style: 'bg-error/10 text-error border-error/20' },
}

function formatRupiah(v: number | null): string {
  if (!v) return '-'
  if (v >= 1_000_000) {
    const juta = v / 1_000_000
    return `Rp ${juta % 1 === 0 ? juta : juta.toFixed(1)} jt`
  }
  return `Rp ${new Intl.NumberFormat('id-ID').format(v)}`
}

function formatDate(iso: string | null): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function JobDetailClient({
  job,
  hasCv,
  defaultCvUrl,
  defaultCvKey,
  isLoggedIn,
  screeningQuestions, 
}: Props) {
  const router = useRouter()
  const [applyOpen, setApplyOpen] = useState(false)
  const [saved, setSaved] = useState<boolean>(Boolean(job.saved))
  const [savingJob, setSavingJob] = useState(false)

  async function handleToggleSave() {
    if (!isLoggedIn) {
      router.push(`/auth/sign-in?redirect=/student/jobs/${job.slug}`)
      return
    }
    setSavingJob(true)
    const res = await toggleSaveJobAction(job.id)
    setSavingJob(false)
    if (res.success) setSaved(Boolean(res.saved))
  }

  function handleApply() {
    if (!isLoggedIn) {
      router.push(`/auth/sign-in?redirect=/student/jobs/${job.slug}`)
      return
    }
    setApplyOpen(true)
  }

  const salaryLabel = job.isSalaryVisible
    ? job.salaryMin && job.salaryMax
      ? `${formatRupiah(job.salaryMin)} - ${formatRupiah(job.salaryMax)}`
      : job.salaryMin
      ? `Min ${formatRupiah(job.salaryMin)}`
      : job.salaryMax
      ? `Up to ${formatRupiah(job.salaryMax)}`
      : 'Kompetitif'
    : 'Gaji tidak ditampilkan'

  const canApply = !job.isExpired && !job.hasApplied && job.status === 'active'
  const statusCfg = job.applicationStatus
    ? STATUS_LABEL[job.applicationStatus]
    : null

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      {/* Back */}
      <Link
        href="/student/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar lowongan
      </Link>

      {/* Applied banner */}
      {job.hasApplied && statusCfg && (
        <div className={`p-4 rounded-2xl border-2 ${statusCfg.style} flex items-center gap-3`}>
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-bold">
              Kamu sudah melamar posisi ini
            </div>
            <div className="text-xs opacity-80">
              Status: {statusCfg.label}.{' '}
              <Link
                href="/student/applications"
                className="font-bold underline"
              >
                Lihat detail lamaran
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="flex items-start gap-4">
          {job.company.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={job.company.logoUrl}
              alt={job.company.name}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-primary text-white flex items-center justify-center font-black text-2xl shrink-0">
              {job.company.name.charAt(0)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-on-surface tracking-tight">
              {job.title}
            </h1>
            <Link
              href={`/perusahaan/${job.company.slug}`}
              className="inline-flex items-center gap-1.5 mt-1 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
            >
              <Building2 className="w-4 h-4" />
              {job.company.name}
              {job.company.verificationStatus === 'verified' && (
                <BadgeCheck className="w-4 h-4 text-primary" />
              )}
            </Link>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {job.city ?? job.location ?? 'Indonesia'}
                {job.province ? `, ${job.province}` : ''}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {EMPLOYMENT_LABEL[job.employmentType] ?? job.employmentType}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                {WORK_MODE_LABEL[job.workMode] ?? job.workMode}
              </span>
              {job.experienceLevel && (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {EXPERIENCE_LABEL[job.experienceLevel] ?? job.experienceLevel}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleToggleSave}
              disabled={savingJob}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                saved
                  ? 'bg-primary text-white'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
              aria-label="Simpan"
            >
              {savingJob ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
              )}
            </button>

            <button
              type="button"
              className="w-10 h-10 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high flex items-center justify-center transition-colors"
              aria-label="Bagikan"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: content */}
        <div className="lg:col-span-2 space-y-6">
          <Section title="Deskripsi Pekerjaan">
            <p className="text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed">
              {job.description ?? 'Belum ada deskripsi'}
            </p>
          </Section>

          {job.requirements && (
            <Section title="Persyaratan">
              <p className="text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed font-mono text-[13px]">
                {job.requirements}
              </p>
            </Section>
          )}

          {job.responsibilities && (
            <Section title="Tanggung Jawab">
              <p className="text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed font-mono text-[13px]">
                {job.responsibilities}
              </p>
            </Section>
          )}

          {job.benefits && (
            <Section title="Benefit">
              <p className="text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed font-mono text-[13px]">
                {job.benefits}
              </p>
            </Section>
          )}

          {job.skills.length > 0 && (
            <Section title="Skill yang Dibutuhkan">
              <div className="flex flex-wrap gap-2">
                {job.skills.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-semibold"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right: sidebar */}
        <div className="space-y-4">
          {/* Apply card */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 sticky top-24">
            <div className="mb-4">
              <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
                Rentang Gaji
              </div>
              <div className="text-lg font-black text-primary">
                {salaryLabel}
              </div>
            </div>

            {/* Deadline */}
            {job.expiredAt && (
              <div className="mb-4 pb-4 border-b border-outline-variant/30">
                <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
                  Batas Lamaran
                </div>
                <div
                  className={`text-sm font-bold ${
                    job.isExpired
                      ? 'text-error'
                      : job.daysLeft !== null && job.daysLeft <= 3
                      ? 'text-amber-600'
                      : 'text-on-surface'
                  }`}
                >
                  {formatDate(job.expiredAt)}
                  {job.daysLeft !== null && !job.isExpired && (
                    <span className="block text-xs font-medium text-on-surface-variant mt-0.5">
                      {job.daysLeft} hari lagi
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Quota */}
            <div className="mb-4 pb-4 border-b border-outline-variant/30">
              <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
                Kuota
              </div>
              <div className="text-sm font-bold text-on-surface">
                {job.quota} orang
              </div>
            </div>

            {/* Apply button */}
            {job.hasApplied ? (
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                Sudah Melamar
              </button>
            ) : job.isExpired ? (
              <button
                type="button"
                disabled
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-surface-container text-on-surface-variant font-bold text-sm cursor-not-allowed"
              >
                <AlertCircle className="w-4 h-4" />
                Lowongan Expired
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-primary text-white font-bold text-sm shadow-[0_4px_16px_rgba(183,0,17,0.20)] hover:bg-primary-container transition-all hover:scale-[1.02]"
              >
                Lamar Sekarang
              </button>
            )}

            {/* Meta */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/30 text-[11px] text-on-surface-variant">
              <span className="inline-flex items-center gap-1">
                <Users className="w-3 h-3" />
                {job.viewCount} dilihat
              </span>
              <span>
                Diposting{' '}
                {job.publishedAt
                  ? new Date(job.publishedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : '-'}
              </span>
            </div>
          </div>

          {/* Company card */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
            <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">
              Tentang Perusahaan
            </div>
            <div className="flex items-start gap-3 mb-3">
              {job.company.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={job.company.logoUrl}
                  alt={job.company.name}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center font-bold shrink-0">
                  {job.company.name.charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-on-surface truncate">
                    {job.company.name}
                  </span>
                  {job.company.verificationStatus === 'verified' && (
                    <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                  )}
                </div>
                {job.company.industry && (
                  <span className="text-[11px] text-on-surface-variant">
                    {job.company.industry}
                  </span>
                )}
              </div>
            </div>
            <Link
              href={`/perusahaan/${job.company.slug}`}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Lihat Profil Perusahaan →
            </Link>
          </div>
        </div>
      </div>

      <ApplyModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        jobId={job.id}
        jobTitle={job.title}
        companyName={job.company.name}
        defaultCvUrl={defaultCvUrl}
        defaultCvKey={defaultCvKey}
        screeningQuestions={screeningQuestions}
      />
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
      <h2 className="text-sm font-bold text-on-surface mb-3">{title}</h2>
      {children}
    </div>
  )
}