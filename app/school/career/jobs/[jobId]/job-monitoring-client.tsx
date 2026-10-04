// app/school/career/jobs/[jobId]/job-monitoring-client.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Users,
  Calendar,
  Search,
  Check,
  Loader2,
  X,
} from 'lucide-react'
import { upsertCareerMonitoringAction } from '@/app/school/career/actions'

type Job = {
  id: string
  title: string
  description: string | null
  city: string | null
  workMode: string | null
  employmentType: string
  applicants: number
  expiredAt: string | null
  company: {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    industry: string | null
    city: string | null
  }
}

type Student = {
  profileId: string
  fullName: string
  avatarUrl: string | null
  programName: string | null
  currentStage: string | null
}

type Props = {
  job: Job
  students: Student[]
}

const STAGES = [
  { value: 'opportunity', label: 'Cari Peluang', color: 'bg-blue-100 text-blue-700' },
  { value: 'recommended', label: 'Rekomendasi', color: 'bg-purple-100 text-purple-700' },
  { value: 'applied', label: 'Lamaran', color: 'bg-amber-100 text-amber-700' },
  { value: 'interview', label: 'Interview', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'offered', label: 'Ditawari', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'placed', label: 'Diterima', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'not_placed', label: 'Belum Dapat', color: 'bg-slate-100 text-slate-700' },
] as const

export function JobMonitoringClient({ job, students }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [localStages, setLocalStages] = useState<Record<string, string>>(
    Object.fromEntries(
      students.map((s) => [s.profileId, s.currentStage ?? ''])
    )
  )

  const filtered = students.filter((s) => {
    const matchSearch =
      !search ||
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      (s.programName ?? '').toLowerCase().includes(search.toLowerCase())

    const matchFilter =
      filter === 'all' ||
      (filter === 'unassigned' && !localStages[s.profileId]) ||
      localStages[s.profileId] === filter

    return matchSearch && matchFilter
  })

  async function updateStage(studentId: string, stage: string) {
    setSaving(studentId)
    try {
      const res = await upsertCareerMonitoringAction({
        studentId,
        jobId: job.id,
        companyId: job.company.id,
        stage,
      })
      if (!res.ok) {
        alert(res.error ?? 'Gagal update')
        return
      }
      setLocalStages((prev) => ({ ...prev, [studentId]: stage }))
      setSelectedStudent(null)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto">
      <Link
        href="/school/career?tab=opportunities"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Kembali ke Career Monitoring
      </Link>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 md:p-8">
        <div className="flex items-start gap-5 flex-wrap">
          {job.company.logoUrl ? (
            <img
              src={job.company.logoUrl}
              alt={job.company.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover ring-2 ring-white shadow-lg shrink-0"
            />
          ) : (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
              <Briefcase className="w-8 h-8" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight">
              {job.title}
            </h1>
            <p className="text-sm font-bold text-primary mt-1">
              {job.company.name}
            </p>

            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {job.city && (
                <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.city}
                </span>
              )}
              {job.workMode && (
                <span className="px-2 py-0.5 rounded bg-surface-container text-[10px] font-mono uppercase tracking-wider font-bold text-on-surface-variant">
                  {job.workMode}
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-surface-container text-[10px] font-mono uppercase tracking-wider font-bold text-on-surface-variant">
                {job.employmentType}
              </span>
              {job.expiredAt && (
                <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(job.expiredAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <div className="text-3xl font-black text-on-surface font-mono">
              {job.applicants}
            </div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
              Total Pelamar
            </div>
          </div>
        </div>

        {job.description && (
          <div className="mt-6 p-4 rounded-2xl bg-white/70 backdrop-blur border border-primary/10">
            <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-primary mb-2">
              Deskripsi
            </div>
            <p className="text-sm text-on-surface leading-relaxed line-clamp-4">
              {job.description}
            </p>
          </div>
        )}
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 lg:p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h2 className="text-base font-black text-on-surface">
              Monitoring Siswa
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Update status siswa untuk lowongan ini.
            </p>
          </div>
          <div className="text-xs text-on-surface-variant font-mono">
            {students.length} siswa aktif
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari siswa..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:outline-none text-sm"
          >
            <option value="all">Semua</option>
            <option value="unassigned">Belum di-assign</option>
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="w-8 h-8 text-on-surface-variant mx-auto mb-2" />
            <p className="text-sm text-on-surface-variant">
              {students.length === 0
                ? 'Belum ada siswa aktif'
                : 'Tidak ada siswa cocok'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((s) => {
              const currentStage = localStages[s.profileId]
              const stageCfg = STAGES.find((st) => st.value === currentStage)
              const initials = s.fullName
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()

              return (
                <div
                  key={s.profileId}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low/40 hover:bg-surface-container-low transition-colors"
                >
                  {s.avatarUrl ? (
                    <img
                      src={s.avatarUrl}
                      alt={s.fullName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="text-xs font-black">{initials}</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-on-surface truncate">
                      {s.fullName}
                    </div>
                    {s.programName && (
                      <div className="text-[11px] text-on-surface-variant truncate">
                        {s.programName}
                      </div>
                    )}
                  </div>

                  {stageCfg ? (
                    <span
                      className={`px-2 py-1 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${stageCfg.color}`}
                    >
                      {stageCfg.label}
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-surface-container text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
                      Belum
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedStudent(s)}
                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shrink-0"
                  >
                    Update
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-outline-variant/30">
              <div>
                <div className="text-sm font-black text-on-surface">
                  Update Status
                </div>
                <div className="text-[11px] text-on-surface-variant">
                  {selectedStudent.fullName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-1.5">
              {STAGES.map((st) => {
                const isCurrent =
                  localStages[selectedStudent.profileId] === st.value
                const isSaving = saving === selectedStudent.profileId

                return (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() =>
                      updateStage(selectedStudent.profileId, st.value)
                    }
                    disabled={!!saving}
                    className={`
                      w-full flex items-center justify-between gap-3 p-3 rounded-xl text-left transition-colors
                      ${
                        isCurrent
                          ? 'bg-primary/10 ring-1 ring-primary/20'
                          : 'hover:bg-surface-container-low'
                      }
                      ${saving ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${st.color}`}
                    >
                      {st.label}
                    </span>

                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                    ) : isCurrent ? (
                      <Check className="w-4 h-4 text-primary shrink-0" />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}