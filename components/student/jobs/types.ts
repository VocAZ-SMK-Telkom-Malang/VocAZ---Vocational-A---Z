// components/student/jobs/types.ts

export type JobType = 'Full-time' | 'Magang' | 'Kontrak' | 'Part-time'
export type JobMode = 'Remote' | 'Hybrid' | 'Onsite'

export type Job = {
  id: string
  slug: string
  title: string
  company: string
  companyVerified: boolean
  location: string
  type: string   // ← ganti dari JobType
  mode: string   // ← ganti dari JobMode
  salaryMin: number
  salaryMax: number
  postedAt: string
  applicants: number
  skills: string[]
  saved: boolean
  description?: string
}

export type JobFilters = {
  location: string
  types: string[]
  modes: string[]
}

export const DEFAULT_FILTERS: JobFilters = {
  location: 'Semua Kota',
  types: [],
  modes: [],
}

export const LOCATION_OPTIONS = [
  'Semua Kota',
  'Jakarta',
  'Jakarta Selatan',
  'Jakarta Pusat',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
  'Bekasi',
  'Remote',
] as const

export const TYPE_OPTIONS = ['Full-time', 'Magang', 'Kontrak', 'Part-time'] as const
export const MODE_OPTIONS = ['Remote', 'Hybrid', 'Onsite'] as const

// ============================================
// DUMMY DATA — ganti nanti dengan DB
// ============================================

export const JOBS: Job[] = [
  {
    id: 'j1',
    slug: 'junior-data-analyst-garuda-spark',
    title: 'Junior Data Analyst',
    company: 'Garuda Spark Innovation',
    companyVerified: true,
    location: 'Jakarta',
    type: 'Full-time',
    mode: 'Remote',
    salaryMin: 5,
    salaryMax: 7,
    postedAt: 'Kemarin',
    applicants: 0,
    skills: ['SQL', 'Excel', 'Python'],
    saved: false,
  },
  {
    id: 'j2',
    slug: 'android-developer-junior-kotlin',
    title: 'Android Developer (Junior Kotlin)',
    company: 'Garuda Spark Innovation',
    companyVerified: true,
    location: 'Jakarta Selatan',
    type: 'Full-time',
    mode: 'Hybrid',
    salaryMin: 5,
    salaryMax: 6,
    postedAt: 'Kemarin',
    applicants: 0,
    skills: ['Kotlin', 'Android Studio', 'Jetpack Compose'],
    saved: true,
  },
  {
    id: 'j3',
    slug: 'frontend-web-developer-junior-react',
    title: 'Frontend Web Developer (Junior React / Tailwind)',
    company: 'Garuda Spark Innovation',
    companyVerified: true,
    location: 'Jakarta Selatan',
    type: 'Full-time',
    mode: 'Hybrid',
    salaryMin: 5,
    salaryMax: 7,
    postedAt: 'Kemarin',
    applicants: 0,
    skills: ['React', 'Tailwind CSS', 'Next.js'],
    saved: false,
  },
  {
    id: 'j4',
    slug: 'cyber-security-junior-analyst-soc',
    title: 'Cyber Security Junior Analyst (SOC Level 1)',
    company: 'Komdigi Cyber Shield',
    companyVerified: true,
    location: 'Jakarta Pusat',
    type: 'Magang',
    mode: 'Onsite',
    salaryMin: 0,
    salaryMax: 0,
    postedAt: 'Kemarin',
    applicants: 0,
    skills: ['Linux', 'Jaringan Komputer'],
    saved: false,
  },
  {
    id: 'j5',
    slug: 'ui-ux-designer-junior-nusantara',
    title: 'UI/UX Designer Junior',
    company: 'Nusantara Digital',
    companyVerified: true,
    location: 'Bandung',
    type: 'Full-time',
    mode: 'Remote',
    salaryMin: 4,
    salaryMax: 6,
    postedAt: '2 hari lalu',
    applicants: 3,
    skills: ['Figma', 'Prototyping'],
    saved: false,
  },
  {
    id: 'j6',
    slug: 'backend-developer-nodejs',
    title: 'Backend Developer (Node.js)',
    company: 'Startup Karya Bangsa',
    companyVerified: false,
    location: 'Surabaya',
    type: 'Kontrak',
    mode: 'Hybrid',
    salaryMin: 6,
    salaryMax: 9,
    postedAt: '3 hari lalu',
    applicants: 5,
    skills: ['Node.js', 'PostgreSQL', 'REST API'],
    saved: true,
  },
  {
    id: 'j7',
    slug: 'digital-marketing-intern',
    title: 'Digital Marketing Intern',
    company: 'Merah Putih Media',
    companyVerified: true,
    location: 'Yogyakarta',
    type: 'Magang',
    mode: 'Onsite',
    salaryMin: 0,
    salaryMax: 2,
    postedAt: '4 hari lalu',
    applicants: 12,
    skills: ['Social Media', 'Content Writing'],
    saved: false,
  },
  {
    id: 'j8',
    slug: 'qa-engineer-manual-automation',
    title: 'QA Engineer (Manual + Automation)',
    company: 'Sistem Terpadu Nusantara',
    companyVerified: true,
    location: 'Jakarta',
    type: 'Full-time',
    mode: 'Remote',
    salaryMin: 6,
    salaryMax: 8,
    postedAt: '5 hari lalu',
    applicants: 2,
    skills: ['Selenium', 'Jest', 'Playwright'],
    saved: false,
  },
  {
    id: 'j9',
    slug: 'network-engineer-telko',
    title: 'Network Engineer',
    company: 'Telko Nusantara',
    companyVerified: true,
    location: 'Jakarta Pusat',
    type: 'Full-time',
    mode: 'Onsite',
    salaryMin: 5,
    salaryMax: 7,
    postedAt: '1 minggu lalu',
    applicants: 8,
    skills: ['Mikrotik', 'Cisco'],
    saved: false,
  },
  {
    id: 'j10',
    slug: 'mobile-developer-flutter',
    title: 'Mobile Developer Flutter',
    company: 'Nusantara Digital',
    companyVerified: true,
    location: 'Remote',
    type: 'Full-time',
    mode: 'Remote',
    salaryMin: 7,
    salaryMax: 10,
    postedAt: '1 minggu lalu',
    applicants: 4,
    skills: ['Flutter', 'Dart'],
    saved: false,
  },
  {
    id: 'j11',
    slug: 'data-entry-specialist',
    title: 'Data Entry Specialist',
    company: 'Mitra Karya Utama',
    companyVerified: false,
    location: 'Bekasi',
    type: 'Kontrak',
    mode: 'Onsite',
    salaryMin: 3,
    salaryMax: 4,
    postedAt: '1 minggu lalu',
    applicants: 20,
    skills: ['Excel', 'Data Entry'],
    saved: false,
  },
]

// ============================================
// HELPERS
// ============================================

export function formatSalary(min: number, max: number): string {
  if (min === 0 && max === 0) return 'Tidak disebutkan'
  if (min === max) return `IDR ${min}jt`
  return `IDR ${min}jt - ${max}jt`
}