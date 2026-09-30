// components/student/companies/types.ts

export type Company = {
  id: string
  slug: string
  name: string
  tagline: string
  description?: string
  industry: string
  location: string
  size: string
  verified: boolean
  featured: boolean
  logoColor: string
  activeJobs: number
  employees: string
  founded: number
  rating: number
  reviewCount: number
  website?: string
  email?: string
  phone?: string
  saved: boolean
}

export type CompanyFilters = {
  industries: string[]
  locations: string[]
  sizes: string[]
  verifiedOnly: boolean
}

export const DEFAULT_COMPANY_FILTERS: CompanyFilters = {
  industries: [],
  locations: [],
  sizes: [],
  verifiedOnly: false,
}

export const INDUSTRY_OPTIONS = [
  'Teknologi Informasi',
  'Perbankan & Finansial',
  'Manufaktur',
  'Retail & E-Commerce',
  'Kesehatan',
  'Pendidikan',
  'Telekomunikasi',
  'Kreatif & Media',
] as const

export const COMPANY_LOCATION_OPTIONS = [
  'Jakarta',
  'Jakarta Selatan',
  'Jakarta Pusat',
  'Bandung',
  'Surabaya',
  'Yogyakarta',
  'Bekasi',
  'Remote',
] as const

export const SIZE_OPTIONS = [
  'Startup',
  'Kecil',
  'Menengah',
  'Besar',
  'Enterprise',
] as const

// ============================================
// DUMMY — nanti diganti DB
// ============================================

export const COMPANIES: Company[] = [
  {
    id: 'c1',
    slug: 'garuda-spark-innovation',
    name: 'Garuda Spark Innovation',
    tagline: "Building tomorrow's digital infrastructure",
    description: 'Garuda Spark Innovation adalah perusahaan teknologi yang berfokus pada solusi digital untuk enterprise dan UMKM. Kami membangun produk SaaS, mobile apps, dan sistem terintegrasi untuk klien di seluruh Indonesia.',
    industry: 'Teknologi Informasi',
    location: 'Jakarta Selatan',
    size: 'Menengah',
    verified: true,
    featured: true,
    logoColor: '#DC2626',
    activeJobs: 5,
    employees: '50-200 karyawan',
    founded: 2018,
    rating: 4.7,
    reviewCount: 128,
    website: 'https://garudaspark.id',
    email: 'careers@garudaspark.id',
    phone: '+62 21 5000 1234',
    saved: false,
  },
  {
    id: 'c2',
    slug: 'komdigi-cyber-shield',
    name: 'Komdigi Cyber Shield',
    tagline: 'National cyber defense for digital Indonesia',
    description: 'Lembaga mitra pemerintah di bidang keamanan siber. Kami merekrut talenta muda untuk memperkuat pertahanan digital nasional.',
    industry: 'Teknologi Informasi',
    location: 'Jakarta Pusat',
    size: 'Besar',
    verified: true,
    featured: true,
    logoColor: '#1E40AF',
    activeJobs: 3,
    employees: '500-1000 karyawan',
    founded: 2015,
    rating: 4.8,
    reviewCount: 89,
    website: 'https://cybershield.go.id',
    email: 'rekrutmen@cybershield.go.id',
    saved: false,
  },
  {
    id: 'c3',
    slug: 'nusantara-digital',
    name: 'Nusantara Digital',
    tagline: 'Crafting beautiful digital experiences',
    description: 'Studio digital yang fokus pada UI/UX, mobile apps, dan branding.',
    industry: 'Kreatif & Media',
    location: 'Bandung',
    size: 'Kecil',
    verified: true,
    featured: true,
    logoColor: '#7C3AED',
    activeJobs: 4,
    employees: '20-50 karyawan',
    founded: 2020,
    rating: 4.6,
    reviewCount: 42,
    website: 'https://nusantaradigital.id',
    saved: true,
  },
  {
    id: 'c4',
    slug: 'bank-digital-indonesia',
    name: 'Bank Digital Indonesia',
    tagline: 'Banking for the digital generation',
    description: 'Bank digital pertama di Indonesia yang melayani generasi milenial dan Gen Z.',
    industry: 'Perbankan & Finansial',
    location: 'Jakarta Selatan',
    size: 'Besar',
    verified: true,
    featured: true,
    logoColor: '#0369A1',
    activeJobs: 12,
    employees: '1000+ karyawan',
    founded: 2019,
    rating: 4.6,
    reviewCount: 512,
    website: 'https://bankdigital.id',
    saved: false,
  },
  {
    id: 'c5',
    slug: 'merah-putih-media',
    name: 'Merah Putih Media',
    tagline: 'Stories that move the nation',
    description: 'Agensi kreatif yang fokus pada content marketing, video production, dan digital campaign.',
    industry: 'Kreatif & Media',
    location: 'Yogyakarta',
    size: 'Menengah',
    verified: true,
    featured: false,
    logoColor: '#EA580C',
    activeJobs: 3,
    employees: '50-200 karyawan',
    founded: 2016,
    rating: 4.5,
    reviewCount: 67,
    saved: false,
  },
  {
    id: 'c6',
    slug: 'sistem-terpadu-nusantara',
    name: 'Sistem Terpadu Nusantara',
    tagline: 'Enterprise solutions, Indonesian made',
    description: 'Konsultan dan pengembang sistem enterprise untuk BUMN, perbankan, dan pemerintahan.',
    industry: 'Teknologi Informasi',
    location: 'Jakarta',
    size: 'Besar',
    verified: true,
    featured: false,
    logoColor: '#0891B2',
    activeJobs: 6,
    employees: '500-1000 karyawan',
    founded: 2010,
    rating: 4.3,
    reviewCount: 210,
    saved: false,
  },
  {
    id: 'c7',
    slug: 'telko-nusantara',
    name: 'Telko Nusantara',
    tagline: 'Connecting every island',
    description: 'Operator telekomunikasi nasional dengan jaringan fiber optik dan 5G.',
    industry: 'Telekomunikasi',
    location: 'Jakarta Pusat',
    size: 'Enterprise',
    verified: true,
    featured: false,
    logoColor: '#BE185D',
    activeJobs: 8,
    employees: '1000+ karyawan',
    founded: 2005,
    rating: 4.2,
    reviewCount: 340,
    saved: false,
  },
  {
    id: 'c8',
    slug: 'mitra-karya-utama',
    name: 'Mitra Karya Utama',
    tagline: 'Your trusted business partner',
    description: 'Perusahaan manufaktur komponen elektronik yang memasok berbagai brand lokal dan internasional.',
    industry: 'Manufaktur',
    location: 'Bekasi',
    size: 'Menengah',
    verified: false,
    featured: false,
    logoColor: '#CA8A04',
    activeJobs: 1,
    employees: '100-500 karyawan',
    founded: 2012,
    rating: 4.0,
    reviewCount: 45,
    saved: false,
  },
  {
    id: 'c9',
    slug: 'sehat-selalu',
    name: 'Sehat Selalu Healthcare',
    tagline: 'Kesehatan untuk semua',
    description: 'Jaringan klinik dan platform kesehatan digital yang menyediakan layanan telemedicine, apotek online, dan laboratorium.',
    industry: 'Kesehatan',
    location: 'Bandung',
    size: 'Menengah',
    verified: true,
    featured: false,
    logoColor: '#0D9488',
    activeJobs: 4,
    employees: '200-500 karyawan',
    founded: 2014,
    rating: 4.5,
    reviewCount: 98,
    saved: false,
  },
  {
    id: 'c10',
    slug: 'edukasi-cerdas',
    name: 'Edukasi Cerdas',
    tagline: 'Belajar tanpa batas',
    description: 'Platform edtech yang menyediakan kursus online, bootcamp, dan sertifikasi untuk talenta digital Indonesia.',
    industry: 'Pendidikan',
    location: 'Yogyakarta',
    size: 'Kecil',
    verified: true,
    featured: false,
    logoColor: '#9333EA',
    activeJobs: 3,
    employees: '20-50 karyawan',
    founded: 2019,
    rating: 4.7,
    reviewCount: 76,
    saved: false,
  },
  {
    id: 'c11',
    slug: 'tokoku-online',
    name: 'Tokoku Online',
    tagline: 'Belanja gampang, hidup senang',
    description: 'Marketplace terbesar di Indonesia dengan jutaan seller dan pembeli aktif setiap hari.',
    industry: 'Retail & E-Commerce',
    location: 'Jakarta',
    size: 'Besar',
    verified: true,
    featured: false,
    logoColor: '#DC2626',
    activeJobs: 15,
    employees: '1000+ karyawan',
    founded: 2017,
    rating: 4.4,
    reviewCount: 623,
    saved: false,
  },
  {
    id: 'c12',
    slug: 'startup-karya-bangsa',
    name: 'Startup Karya Bangsa',
    tagline: 'Empowering local founders',
    description: 'Venture builder yang membantu founder lokal membangun startup dari ide sampai scale-up.',
    industry: 'Teknologi Informasi',
    location: 'Surabaya',
    size: 'Startup',
    verified: false,
    featured: false,
    logoColor: '#059669',
    activeJobs: 2,
    employees: '5-20 karyawan',
    founded: 2022,
    rating: 4.4,
    reviewCount: 15,
    saved: false,
  },
]

// ============================================
// JOBS PER COMPANY (untuk halaman detail)
// ============================================

export type CompanyJob = {
  id: string
  slug: string
  title: string
  location: string
  type: string
  mode: string
  salaryMin: number
  salaryMax: number
  postedAt: string
  applicants: number
  skills: string[]
}

export const JOBS_BY_COMPANY: Record<string, CompanyJob[]> = {
  'garuda-spark-innovation': [
    { id: 'j1', slug: 'junior-data-analyst-garuda', title: 'Junior Data Analyst', location: 'Jakarta', type: 'Full-time', mode: 'Remote', salaryMin: 5, salaryMax: 7, postedAt: 'Kemarin', applicants: 0, skills: ['SQL', 'Excel', 'Python'] },
    { id: 'j2', slug: 'android-developer-kotlin-garuda', title: 'Android Developer (Junior Kotlin)', location: 'Jakarta Selatan', type: 'Full-time', mode: 'Hybrid', salaryMin: 5, salaryMax: 6, postedAt: 'Kemarin', applicants: 0, skills: ['Kotlin', 'Android Studio'] },
    { id: 'j3', slug: 'frontend-web-developer-garuda', title: 'Frontend Web Developer (Junior React / Tailwind)', location: 'Jakarta Selatan', type: 'Full-time', mode: 'Hybrid', salaryMin: 5, salaryMax: 7, postedAt: 'Kemarin', applicants: 0, skills: ['React', 'Tailwind CSS', 'Next.js'] },
    { id: 'j4', slug: 'qa-engineer-garuda', title: 'QA Engineer (Manual + Automation)', location: 'Jakarta', type: 'Full-time', mode: 'Remote', salaryMin: 6, salaryMax: 8, postedAt: '5 hari lalu', applicants: 2, skills: ['Selenium', 'Playwright'] },
    { id: 'j5', slug: 'backend-nodejs-garuda', title: 'Backend Developer (Node.js)', location: 'Jakarta Selatan', type: 'Full-time', mode: 'Hybrid', salaryMin: 7, salaryMax: 10, postedAt: '1 minggu lalu', applicants: 4, skills: ['Node.js', 'PostgreSQL'] },
  ],
  'komdigi-cyber-shield': [
    { id: 'j6', slug: 'cyber-security-soc-komdigi', title: 'Cyber Security Junior Analyst (SOC Level 1)', location: 'Jakarta Pusat', type: 'Magang', mode: 'Onsite', salaryMin: 0, salaryMax: 0, postedAt: 'Kemarin', applicants: 0, skills: ['Linux', 'Jaringan Komputer'] },
    { id: 'j7', slug: 'pentester-komdigi', title: 'Junior Pentester', location: 'Jakarta Pusat', type: 'Full-time', mode: 'Onsite', salaryMin: 7, salaryMax: 10, postedAt: '2 hari lalu', applicants: 5, skills: ['Kali Linux', 'Burp Suite'] },
  ],
  'nusantara-digital': [
    { id: 'j8', slug: 'ui-ux-designer-nusantara', title: 'UI/UX Designer Junior', location: 'Bandung', type: 'Full-time', mode: 'Remote', salaryMin: 4, salaryMax: 6, postedAt: 'Kemarin', applicants: 3, skills: ['Figma', 'Prototyping'] },
    { id: 'j9', slug: 'mobile-developer-flutter-nusantara', title: 'Mobile Developer Flutter', location: 'Remote', type: 'Full-time', mode: 'Remote', salaryMin: 7, salaryMax: 10, postedAt: '1 minggu lalu', applicants: 4, skills: ['Flutter', 'Dart'] },
  ],
  'bank-digital-indonesia': [
    { id: 'j10', slug: 'backend-engineer-bankdigital', title: 'Backend Engineer (Go / Node.js)', location: 'Jakarta Selatan', type: 'Full-time', mode: 'Hybrid', salaryMin: 12, salaryMax: 20, postedAt: 'Kemarin', applicants: 45, skills: ['Go', 'Node.js', 'PostgreSQL'] },
    { id: 'j11', slug: 'data-scientist-bankdigital', title: 'Data Scientist', location: 'Jakarta Selatan', type: 'Full-time', mode: 'Hybrid', salaryMin: 15, salaryMax: 25, postedAt: 'Kemarin', applicants: 32, skills: ['Python', 'Machine Learning'] },
  ],
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return COMPANIES.find((c) => c.slug === slug)
}

export function getJobsByCompanySlug(slug: string): CompanyJob[] {
  return JOBS_BY_COMPANY[slug] ?? []
}

export function formatSalaryRange(min: number, max: number): string {
  if (min === 0 && max === 0) return 'Tidak disebutkan'
  if (min === max) return `IDR ${min}jt`
  return `IDR ${min}jt - ${max}jt`
}