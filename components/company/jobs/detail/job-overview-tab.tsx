// components/company/jobs/detail/job-overview-tab.tsx
import {
  MapPin,
  Clock,
  Briefcase,
  Wallet,
  Calendar,
  Users,
  Eye,
  FileText,
} from 'lucide-react'
import type { JobDetail } from '@/lib/queries/company-job-detail'

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

export function JobOverviewTab({ job }: { job: JobDetail }) {
  const salaryLabel = job.isSalaryVisible
    ? job.salaryMin && job.salaryMax
      ? `${formatRupiah(job.salaryMin)} - ${formatRupiah(job.salaryMax)}`
      : job.salaryMin
      ? `Min ${formatRupiah(job.salaryMin)}`
      : job.salaryMax
      ? `Up to ${formatRupiah(job.salaryMax)}`
      : 'Kompetitif'
    : 'Gaji tidak ditampilkan'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Main content */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Description */}
        <Section title="Deskripsi Pekerjaan">
          <p className="text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed">
            {job.description ?? 'Belum ada deskripsi'}
          </p>
        </Section>

        {/* Requirements */}
        {job.requirements && (
          <Section title="Persyaratan">
            <p className="text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed font-mono text-[13px]">
              {job.requirements}
            </p>
          </Section>
        )}

        {/* Responsibilities */}
        {job.responsibilities && (
          <Section title="Tanggung Jawab">
            <p className="text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed font-mono text-[13px]">
              {job.responsibilities}
            </p>
          </Section>
        )}

        {/* Benefits */}
        {job.benefits && (
          <Section title="Benefit">
            <p className="text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed font-mono text-[13px]">
              {job.benefits}
            </p>
          </Section>
        )}

        {/* Skills */}
        <Section title="Skill Dibutuhkan">
          {job.skills.length === 0 ? (
            <p className="text-sm text-on-surface-variant">Belum ada skill</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-semibold"
                >
                  {s.name}
                  {s.category && (
                    <span className="font-mono text-[10px] text-on-surface-variant">
                      · {s.category}
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* Right: Sidebar */}
      <div className="flex flex-col gap-4">
        {/* Job Details Card */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
          <h3 className="text-sm font-bold text-on-surface mb-4">
            Informasi Lowongan
          </h3>
          <div className="flex flex-col gap-3">
            <InfoRow
              icon={Briefcase}
              label="Tipe Pekerjaan"
              value={EMPLOYMENT_LABEL[job.employmentType] ?? job.employmentType}
            />
            <InfoRow
              icon={Clock}
              label="Mode Kerja"
              value={WORK_MODE_LABEL[job.workMode] ?? job.workMode}
            />
            {job.experienceLevel && (
              <InfoRow
                icon={FileText}
                label="Level"
                value={
                  EXPERIENCE_LABEL[job.experienceLevel] ?? job.experienceLevel
                }
              />
            )}
            <InfoRow
              icon={MapPin}
              label="Lokasi"
              value={
                job.city
                  ? `${job.city}${job.province ? `, ${job.province}` : ''}`
                  : '-'
              }
            />
            <InfoRow
              icon={Wallet}
              label="Gaji"
              value={salaryLabel}
              highlight={job.isSalaryVisible}
            />
            <InfoRow icon={Users} label="Kuota" value={`${job.quota} orang`} />
            <InfoRow
              icon={Calendar}
              label="Batas Waktu"
              value={formatDate(job.expiredAt)}
              highlight={
                job.isExpired
                  ? 'danger'
                  : job.daysLeft !== null && job.daysLeft <= 3
                  ? 'warning'
                  : undefined
              }
            />
          </div>
        </div>

        {/* Meta Card */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
          <h3 className="text-sm font-bold text-on-surface mb-4">Meta</h3>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant inline-flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Dilihat
              </span>
              <span className="font-bold text-on-surface">
                {job.viewCount.toLocaleString('id-ID')}×
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Dibuat</span>
              <span className="font-medium text-on-surface">
                {formatDate(job.createdAt)}
              </span>
            </div>
            {job.publishedAt && (
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Dipublish</span>
                <span className="font-medium text-on-surface">
                  {formatDate(job.publishedAt)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Update Terakhir</span>
              <span className="font-medium text-on-surface">
                {formatDate(job.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
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
      <h3 className="text-sm font-bold text-on-surface mb-3">{title}</h3>
      {children}
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  highlight?: boolean | 'warning' | 'danger'
}) {
  let valueClass = 'font-semibold text-on-surface'
  if (highlight === 'danger') valueClass = 'font-semibold text-error'
  else if (highlight === 'warning') valueClass = 'font-semibold text-amber-600'
  else if (highlight === true) valueClass = 'font-semibold text-primary'

  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-on-surface-variant inline-flex items-center gap-1.5 shrink-0">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span className={`text-xs text-right ${valueClass}`}>{value}</span>
    </div>
  )
}