// components/student/applications/types.ts

export type ApplicationStatus =
  | 'submitted'
  | 'reviewed'
  | 'shortlisted'
  | 'interview'
  | 'offered'
  | 'hired'
  | 'rejected'
  | 'withdrawn'

export type Application = {
  id: string
  jobSlug: string
  jobTitle: string
  jobType: string
  jobMode: string
  jobLocation: string
  salaryMin: number
  salaryMax: number

  companySlug: string
  companyName: string
  companyVerified: boolean
  companyLogoColor: string

  status: ApplicationStatus
  matchScore: number
  appliedAt: string
  updatedAt: string

  nextStep?: string
  interviewDate?: string
  recruiterName?: string
  notes?: string

  timeline: {
    status: ApplicationStatus
    at: string
    note?: string
  }[]
}

export const STATUS_CONFIG: Record<
  ApplicationStatus,
  {
    label: string
    shortLabel: string
    color: string
    bg: string
    border: string
    dot: string
    icon: string
  }
> = {
  submitted: {
    label: 'Lamaran Terkirim',
    shortLabel: 'Terkirim',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    icon: '📤',
  },
  reviewed: {
    label: 'Sedang Direview',
    shortLabel: 'Direview',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    icon: '👀',
  },
  shortlisted: {
    label: 'Masuk Shortlist',
    shortLabel: 'Shortlist',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    icon: '⭐',
  },
  interview: {
    label: 'Tahap Interview',
    shortLabel: 'Interview',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500',
    icon: '🎤',
  },
  offered: {
    label: 'Penawaran Diterima',
    shortLabel: 'Offered',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    icon: '🎁',
  },
  hired: {
    label: 'Diterima Bekerja',
    shortLabel: 'Hired',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    icon: '🎉',
  },
  rejected: {
    label: 'Tidak Lolos',
    shortLabel: 'Ditolak',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    icon: '❌',
  },
  withdrawn: {
    label: 'Ditarik',
    shortLabel: 'Ditarik',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    icon: '↩️',
  },
}

export const STATUS_FLOW: ApplicationStatus[] = [
  'submitted',
  'reviewed',
  'shortlisted',
  'interview',
  'offered',
  'hired',
]

// ============================================
// HELPERS
// ============================================

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays === 1) return 'Kemarin'
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`
  return `${Math.floor(diffDays / 365)} tahun lalu`
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatSalary(min: number, max: number): string {
  if (min === 0 && max === 0) return 'Tidak disebutkan'
  if (min === max) return `IDR ${min}jt`
  return `IDR ${min}jt - ${max}jt`
}

export function isActiveStatus(s: ApplicationStatus): boolean {
  return ['submitted', 'reviewed', 'shortlisted', 'interview'].includes(s)
}

export function isCompletedStatus(s: ApplicationStatus): boolean {
  return ['hired', 'rejected', 'withdrawn', 'offered'].includes(s)
}