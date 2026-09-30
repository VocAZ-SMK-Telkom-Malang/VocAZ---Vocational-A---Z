// components/student/saved/types.ts

export type SavedJob = {
  id: string
  jobId: string
  jobSlug: string
  jobTitle: string
  jobType: string
  jobMode: string
  jobLocation: string
  salaryMin: number
  salaryMax: number
  skills: string[]
  postedAt: string

  companySlug: string
  companyName: string
  companyVerified: boolean
  companyLogoColor: string

  savedAt: string
}

export type SavedCompany = {
  id: string
  companyId: string
  companySlug: string
  companyName: string
  tagline: string
  industry: string
  location: string
  size: string
  verified: boolean
  featured: boolean
  logoColor: string
  activeJobs: number
  employees: string
  rating: number
  reviewCount: number
  savedAt: string
}

// ============================================
// HELPERS
// ============================================

export function formatSalary(min: number, max: number): string {
  if (min === 0 && max === 0) return 'Tidak disebutkan'
  if (min === max) return `IDR ${min}jt`
  return `IDR ${min}jt - ${max}jt`
}

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

export type SavedTab = 'jobs' | 'companies'
export type SortKey = 'recent' | 'oldest' | 'title-asc'