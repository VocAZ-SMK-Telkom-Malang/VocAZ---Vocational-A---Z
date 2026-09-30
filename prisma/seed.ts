// prisma/seed.ts
import 'dotenv/config'
import {
  PrismaClient,
  CompanySize,
  VerificationStatus,
  EmploymentType,
  WorkMode,
  ExperienceLevel,
  JobStatus,
} from '../generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

// =====================================================
// MASTER SKILLS
// =====================================================

const skills = [
  { name: 'JavaScript', category: 'Pemrograman' },
  { name: 'TypeScript', category: 'Pemrograman' },
  { name: 'Python', category: 'Pemrograman' },
  { name: 'Java', category: 'Pemrograman' },
  { name: 'PHP', category: 'Pemrograman' },
  { name: 'C++', category: 'Pemrograman' },
  { name: 'C#', category: 'Pemrograman' },
  { name: 'Go', category: 'Pemrograman' },
  { name: 'Kotlin', category: 'Pemrograman' },
  { name: 'Swift', category: 'Pemrograman' },
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'Vue.js', category: 'Frontend' },
  { name: 'Angular', category: 'Frontend' },
  { name: 'Svelte', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Bootstrap', category: 'Frontend' },
  { name: 'HTML', category: 'Frontend' },
  { name: 'CSS', category: 'Frontend' },
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express.js', category: 'Backend' },
  { name: 'NestJS', category: 'Backend' },
  { name: 'Laravel', category: 'Backend' },
  { name: 'Django', category: 'Backend' },
  { name: 'Flask', category: 'Backend' },
  { name: 'Spring Boot', category: 'Backend' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'MySQL', category: 'Database' },
  { name: 'MongoDB', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'SQLite', category: 'Database' },
  { name: 'React Native', category: 'Mobile' },
  { name: 'Flutter', category: 'Mobile' },
  { name: 'Android Development', category: 'Mobile' },
  { name: 'iOS Development', category: 'Mobile' },
  { name: 'Figma', category: 'Desain' },
  { name: 'Adobe XD', category: 'Desain' },
  { name: 'Photoshop', category: 'Desain' },
  { name: 'Illustrator', category: 'Desain' },
  { name: 'CorelDRAW', category: 'Desain' },
  { name: 'Canva', category: 'Desain' },
  { name: 'UI/UX Design', category: 'Desain' },
  { name: 'AutoCAD', category: 'Teknik' },
  { name: 'SolidWorks', category: 'Teknik' },
  { name: 'PLC', category: 'Teknik' },
  { name: 'Arduino', category: 'Teknik' },
  { name: 'Raspberry Pi', category: 'Teknik' },
  { name: 'IoT', category: 'Teknik' },
  { name: '3D Printing', category: 'Teknik' },
  { name: 'Jaringan Komputer', category: 'Jaringan' },
  { name: 'Cisco', category: 'Jaringan' },
  { name: 'Mikrotik', category: 'Jaringan' },
  { name: 'Linux', category: 'Jaringan' },
  { name: 'Windows Server', category: 'Jaringan' },
  { name: 'Microsoft Excel', category: 'Office' },
  { name: 'Microsoft Word', category: 'Office' },
  { name: 'Microsoft PowerPoint', category: 'Office' },
  { name: 'Google Workspace', category: 'Office' },
  { name: 'Public Speaking', category: 'Soft Skill' },
  { name: 'Teamwork', category: 'Soft Skill' },
  { name: 'Leadership', category: 'Soft Skill' },
  { name: 'Problem Solving', category: 'Soft Skill' },
  { name: 'Time Management', category: 'Soft Skill' },
  { name: 'Communication', category: 'Soft Skill' },
  { name: 'Critical Thinking', category: 'Soft Skill' },
  { name: 'Adaptability', category: 'Soft Skill' },
  { name: 'Bahasa Inggris', category: 'Bahasa' },
  { name: 'Bahasa Jepang', category: 'Bahasa' },
  { name: 'Bahasa Korea', category: 'Bahasa' },
  { name: 'Bahasa Mandarin', category: 'Bahasa' },
  { name: 'Bahasa Jerman', category: 'Bahasa' },
  { name: 'Premiere Pro', category: 'Desain' },
  { name: 'After Effects', category: 'Desain' },
  { name: 'Social Media', category: 'Marketing' },
  { name: 'Content Writing', category: 'Marketing' },
  { name: 'Machine Learning', category: 'Data' },
  { name: 'SQL', category: 'Database' },
  { name: 'Excel', category: 'Office' },
  { name: 'Selenium', category: 'Testing' },
  { name: 'Jest', category: 'Testing' },
  { name: 'Playwright', category: 'Testing' },
  { name: 'ERP', category: 'Business' },
  { name: 'Odoo', category: 'Business' },
  { name: 'Business Analysis', category: 'Business' },
  { name: 'Telemedicine', category: 'Kesehatan' },
  { name: 'Komunikasi', category: 'Soft Skill' },
  { name: 'Data Entry', category: 'Office' },
  { name: 'Design System', category: 'Desain' },
  { name: 'Prototyping', category: 'Desain' },
]

// =====================================================
// SYSTEM SETTINGS
// =====================================================

const systemSettings = [
  { key: 'platform.name', value: { text: 'VocAZ' }, description: 'Nama platform' },
  { key: 'platform.tagline', value: { text: 'Ekosistem Talenta SMK Indonesia' }, description: 'Tagline platform' },
  { key: 'platform.version', value: { text: '0.1.0' }, description: 'Versi platform' },
  { key: 'platform.maintenance', value: { enabled: false }, description: 'Mode maintenance' },
  { key: 'verification.company.auto_approve', value: { enabled: false }, description: 'Auto-approve verifikasi perusahaan' },
  { key: 'verification.certificate.auto_approve', value: { enabled: false }, description: 'Auto-approve verifikasi sertifikat' },
  { key: 'moderation.auto_flag_threshold', value: { count: 5 }, description: 'Jumlah report sebelum konten otomatis di-flag' },
  { key: 'showcase.max_duration_sec', value: { seconds: 300 }, description: 'Durasi maksimal video showcase (detik)' },
  { key: 'showcase.max_size_mb', value: { mb: 100 }, description: 'Ukuran maksimal video showcase (MB)' },
  { key: 'upload.max_avatar_size_mb', value: { mb: 5 }, description: 'Ukuran maksimal avatar (MB)' },
]

// =====================================================
// SCHOOL PROGRAMS
// =====================================================

const schoolPrograms = [
  { name: 'Rekayasa Perangkat Lunak', code: 'RPL' },
  { name: 'Teknik Komputer dan Jaringan', code: 'TKJ' },
  { name: 'Multimedia', code: 'MM' },
  { name: 'Desain Komunikasi Visual', code: 'DKV' },
  { name: 'Teknik Kendaraan Ringan Otomotif', code: 'TKRO' },
  { name: 'Teknik Sepeda Motor', code: 'TSM' },
  { name: 'Teknik Instalasi Tenaga Listrik', code: 'TITL' },
  { name: 'Teknik Pemesinan', code: 'TP' },
  { name: 'Teknik Pengelasan', code: 'TPL' },
  { name: 'Akuntansi dan Keuangan Lembaga', code: 'AKL' },
  { name: 'Otomatisasi dan Tata Kelola Perkantoran', code: 'OTKP' },
  { name: 'Bisnis Daring dan Pemasaran', code: 'BDP' },
  { name: 'Perhotelan', code: 'PH' },
  { name: 'Tata Boga', code: 'TB' },
  { name: 'Tata Busana', code: 'TBS' },
  { name: 'Agribisnis Tanaman Pangan dan Hortikultura', code: 'ATPH' },
]

// =====================================================
// INDUSTRIES
// =====================================================

const industries = [
  { name: 'Manufacturing', slug: 'manufacturing', icon: 'factory' },
  { name: 'Technology', slug: 'technology', icon: 'cpu' },
  { name: 'Automotive', slug: 'automotive', icon: 'car' },
  { name: 'Construction', slug: 'construction', icon: 'hard-hat' },
  { name: 'Retail', slug: 'retail', icon: 'shopping-bag' },
  { name: 'Hospitality', slug: 'hospitality', icon: 'hotel' },
  { name: 'Healthcare', slug: 'healthcare', icon: 'heart-pulse' },
  { name: 'Education', slug: 'education', icon: 'graduation-cap' },
  { name: 'Finance', slug: 'finance', icon: 'banknote' },
  { name: 'Agriculture', slug: 'agriculture', icon: 'sprout' },
  { name: 'Logistics', slug: 'logistics', icon: 'truck' },
  { name: 'Energy', slug: 'energy', icon: 'zap' },
  { name: 'Telecommunications', slug: 'telecommunications', icon: 'radio' },
  { name: 'Creative & Design', slug: 'creative-design', icon: 'palette' },
  { name: 'Food & Beverage', slug: 'food-beverage', icon: 'utensils' },
  { name: 'Other', slug: 'other', icon: 'briefcase' },
]

// =====================================================
// PROVINCES
// =====================================================

const provinces = [
  { name: 'DKI Jakarta', code: 'JK' },
  { name: 'Jawa Barat', code: 'JB' },
  { name: 'Jawa Tengah', code: 'JT' },
  { name: 'Jawa Timur', code: 'JI' },
  { name: 'Banten', code: 'BT' },
  { name: 'DI Yogyakarta', code: 'YO' },
  { name: 'Bali', code: 'BA' },
  { name: 'Sumatera Utara', code: 'SU' },
  { name: 'Sumatera Barat', code: 'SB' },
  { name: 'Sumatera Selatan', code: 'SS' },
  { name: 'Riau', code: 'RI' },
  { name: 'Kalimantan Timur', code: 'KI' },
  { name: 'Kalimantan Selatan', code: 'KS' },
  { name: 'Kalimantan Barat', code: 'KB' },
  { name: 'Sulawesi Selatan', code: 'SN' },
  { name: 'Sulawesi Utara', code: 'SA' },
  { name: 'Nusa Tenggara Barat', code: 'NB' },
  { name: 'Nusa Tenggara Timur', code: 'NT' },
  { name: 'Papua', code: 'PA' },
  { name: 'Aceh', code: 'AC' },
]

// =====================================================
// COMPANIES
// =====================================================

const companies = [
  {
    slug: 'garuda-spark-innovation',
    name: 'Garuda Spark Innovation',
    tagline: "Building tomorrow's digital infrastructure",
    description:
      'Garuda Spark Innovation adalah perusahaan teknologi yang berfokus pada solusi digital untuk enterprise dan UMKM. Kami membangun produk SaaS, mobile apps, dan sistem terintegrasi untuk klien di seluruh Indonesia.',
    industry: 'Teknologi Informasi',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    address: 'Jl. TB Simatupang No. 18, Jakarta Selatan',
    companySize: CompanySize.s51_200,
    verificationStatus: VerificationStatus.verified,
    featured: true,
    logoColor: '#DC2626',
    website: 'https://garudaspark.id',
    email: 'careers@garudaspark.id',
    phone: '+62 21 5000 1234',
    foundedYear: 2018,
    employeeRange: '50-200 karyawan',
    rating: 4.7,
    reviewCount: 128,
  },
  {
    slug: 'komdigi-cyber-shield',
    name: 'Komdigi Cyber Shield',
    tagline: 'National cyber defense for digital Indonesia',
    description:
      'Lembaga mitra pemerintah di bidang keamanan siber. Kami merekrut talenta muda untuk memperkuat pertahanan digital nasional.',
    industry: 'Teknologi Informasi',
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    companySize: CompanySize.s201_500,
    verificationStatus: VerificationStatus.verified,
    featured: true,
    logoColor: '#1E40AF',
    website: 'https://cybershield.go.id',
    email: 'rekrutmen@cybershield.go.id',
    phone: '+62 21 3800 9900',
    foundedYear: 2015,
    employeeRange: '500-1000 karyawan',
    rating: 4.8,
    reviewCount: 89,
  },
  {
    slug: 'nusantara-digital',
    name: 'Nusantara Digital',
    tagline: 'Crafting beautiful digital experiences',
    description:
      'Studio digital yang fokus pada UI/UX, mobile apps, dan branding.',
    industry: 'Kreatif & Media',
    city: 'Bandung',
    province: 'Jawa Barat',
    companySize: CompanySize.s11_50,
    verificationStatus: VerificationStatus.verified,
    featured: true,
    logoColor: '#7C3AED',
    website: 'https://nusantaradigital.id',
    email: 'hello@nusantaradigital.id',
    foundedYear: 2020,
    employeeRange: '20-50 karyawan',
    rating: 4.6,
    reviewCount: 42,
  },
  {
    slug: 'bank-digital-indonesia',
    name: 'Bank Digital Indonesia',
    tagline: 'Banking for the digital generation',
    description:
      'Bank digital pertama di Indonesia yang melayani generasi milenial dan Gen Z.',
    industry: 'Perbankan & Finansial',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    companySize: CompanySize.s500plus,
    verificationStatus: VerificationStatus.verified,
    featured: true,
    logoColor: '#0369A1',
    website: 'https://bankdigital.id',
    email: 'talent@bankdigital.id',
    phone: '+62 21 5050 8888',
    foundedYear: 2019,
    employeeRange: '1000+ karyawan',
    rating: 4.6,
    reviewCount: 512,
  },
  {
    slug: 'merah-putih-media',
    name: 'Merah Putih Media',
    tagline: 'Stories that move the nation',
    description:
      'Agensi kreatif yang fokus pada content marketing, video production, dan digital campaign.',
    industry: 'Kreatif & Media',
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    companySize: CompanySize.s51_200,
    verificationStatus: VerificationStatus.verified,
    featured: false,
    logoColor: '#EA580C',
    website: 'https://merahputihmedia.id',
    email: 'career@merahputihmedia.id',
    foundedYear: 2016,
    employeeRange: '50-200 karyawan',
    rating: 4.5,
    reviewCount: 67,
  },
  {
    slug: 'sistem-terpadu-nusantara',
    name: 'Sistem Terpadu Nusantara',
    tagline: 'Enterprise solutions, Indonesian made',
    description:
      'Konsultan dan pengembang sistem enterprise untuk BUMN, perbankan, dan pemerintahan.',
    industry: 'Teknologi Informasi',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    companySize: CompanySize.s201_500,
    verificationStatus: VerificationStatus.verified,
    featured: false,
    logoColor: '#0891B2',
    website: 'https://stn.co.id',
    email: 'hrd@stn.co.id',
    foundedYear: 2010,
    employeeRange: '500-1000 karyawan',
    rating: 4.3,
    reviewCount: 210,
  },
  {
    slug: 'telko-nusantara',
    name: 'Telko Nusantara',
    tagline: 'Connecting every island',
    description:
      'Operator telekomunikasi nasional dengan jaringan fiber optik dan 5G.',
    industry: 'Telekomunikasi',
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    companySize: CompanySize.s500plus,
    verificationStatus: VerificationStatus.verified,
    featured: false,
    logoColor: '#BE185D',
    website: 'https://telkonusantara.id',
    email: 'rekrutmen@telkonusantara.id',
    foundedYear: 2005,
    employeeRange: '1000+ karyawan',
    rating: 4.2,
    reviewCount: 340,
  },
  {
    slug: 'mitra-karya-utama',
    name: 'Mitra Karya Utama',
    tagline: 'Your trusted business partner',
    description:
      'Perusahaan manufaktur komponen elektronik yang memasok berbagai brand lokal dan internasional.',
    industry: 'Manufaktur',
    city: 'Bekasi',
    province: 'Jawa Barat',
    companySize: CompanySize.s51_200,
    verificationStatus: VerificationStatus.unverified,
    featured: false,
    logoColor: '#CA8A04',
    foundedYear: 2012,
    employeeRange: '100-500 karyawan',
    rating: 4.0,
    reviewCount: 45,
  },
  {
    slug: 'sehat-selalu',
    name: 'Sehat Selalu Healthcare',
    tagline: 'Kesehatan untuk semua',
    description:
      'Jaringan klinik dan platform kesehatan digital yang menyediakan layanan telemedicine, apotek online, dan laboratorium.',
    industry: 'Kesehatan',
    city: 'Bandung',
    province: 'Jawa Barat',
    companySize: CompanySize.s201_500,
    verificationStatus: VerificationStatus.verified,
    featured: false,
    logoColor: '#0D9488',
    website: 'https://sehatselalu.id',
    email: 'hr@sehatselalu.id',
    foundedYear: 2014,
    employeeRange: '200-500 karyawan',
    rating: 4.5,
    reviewCount: 98,
  },
  {
    slug: 'edukasi-cerdas',
    name: 'Edukasi Cerdas',
    tagline: 'Belajar tanpa batas',
    description:
      'Platform edtech yang menyediakan kursus online, bootcamp, dan sertifikasi untuk talenta digital Indonesia.',
    industry: 'Pendidikan',
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    companySize: CompanySize.s11_50,
    verificationStatus: VerificationStatus.verified,
    featured: false,
    logoColor: '#9333EA',
    website: 'https://edukasicerdas.id',
    email: 'talent@edukasicerdas.id',
    foundedYear: 2019,
    employeeRange: '20-50 karyawan',
    rating: 4.7,
    reviewCount: 76,
  },
  {
    slug: 'tokoku-online',
    name: 'Tokoku Online',
    tagline: 'Belanja gampang, hidup senang',
    description:
      'Marketplace terbesar di Indonesia dengan jutaan seller dan pembeli aktif setiap hari.',
    industry: 'Retail & E-Commerce',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    companySize: CompanySize.s500plus,
    verificationStatus: VerificationStatus.verified,
    featured: false,
    logoColor: '#DC2626',
    website: 'https://tokoku.id',
    email: 'careers@tokoku.id',
    foundedYear: 2017,
    employeeRange: '1000+ karyawan',
    rating: 4.4,
    reviewCount: 623,
  },
  {
    slug: 'startup-karya-bangsa',
    name: 'Startup Karya Bangsa',
    tagline: 'Empowering local founders',
    description:
      'Venture builder yang membantu founder lokal membangun startup dari ide sampai scale-up.',
    industry: 'Teknologi Informasi',
    city: 'Surabaya',
    province: 'Jawa Timur',
    companySize: CompanySize.s1_10,
    verificationStatus: VerificationStatus.unverified,
    featured: false,
    logoColor: '#059669',
    foundedYear: 2022,
    employeeRange: '5-20 karyawan',
    rating: 4.4,
    reviewCount: 15,
  },
]

// =====================================================
// JOBS
// =====================================================

const jobsData = [
  {
    slug: 'junior-data-analyst-garuda',
    title: 'Junior Data Analyst',
    companySlug: 'garuda-spark-innovation',
    description: 'Kami mencari Junior Data Analyst untuk bergabung dengan tim analytics.',
    requirements: '- Minimal SMK/D3/S1\n- Menguasai SQL dan Excel\n- Familiar Python\n- Komunikasi baik',
    benefits: '- BPJS\n- Tunjangan makan & transport\n- Mentoring\n- Remote-friendly',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.remote,
    experienceLevel: ExperienceLevel.junior,
    location: 'Jakarta',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    salaryMin: BigInt(5000000),
    salaryMax: BigInt(7000000),
    isSalaryVisible: true,
    applicants: 0,
    status: JobStatus.active,
    skillNames: ['SQL', 'Excel', 'Python'],
  },
  {
    slug: 'android-developer-kotlin-garuda',
    title: 'Android Developer (Junior Kotlin)',
    companySlug: 'garuda-spark-innovation',
    description: 'Bergabung dengan tim mobile untuk mengembangkan aplikasi Android menggunakan Kotlin.',
    requirements: '- Kotlin & Android Studio\n- Jetpack Compose\n- REST API\n- Portofolio',
    benefits: '- Gaji kompetitif\n- Laptop disediakan\n- Hybrid\n- Learning budget',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.hybrid,
    experienceLevel: ExperienceLevel.junior,
    location: 'Jakarta Selatan',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    salaryMin: BigInt(5000000),
    salaryMax: BigInt(6000000),
    isSalaryVisible: true,
    applicants: 0,
    status: JobStatus.active,
    skillNames: ['Kotlin', 'Android Development'],
  },
  {
    slug: 'frontend-web-developer-garuda',
    title: 'Frontend Web Developer (Junior React / Tailwind)',
    companySlug: 'garuda-spark-innovation',
    description: 'Membangun antarmuka web modern menggunakan React, Next.js, dan Tailwind CSS.',
    requirements: '- React & TypeScript\n- Next.js App Router\n- Tailwind CSS',
    benefits: '- Flexible hours\n- Remote-friendly\n- BPJS\n- Annual bonus',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.hybrid,
    experienceLevel: ExperienceLevel.junior,
    location: 'Jakarta Selatan',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    salaryMin: BigInt(5000000),
    salaryMax: BigInt(7000000),
    isSalaryVisible: true,
    applicants: 0,
    status: JobStatus.active,
    skillNames: ['React', 'Tailwind CSS', 'Next.js'],
  },
  {
    slug: 'qa-engineer-garuda',
    title: 'QA Engineer (Manual + Automation)',
    companySlug: 'garuda-spark-innovation',
    description: 'Bertanggung jawab atas kualitas produk melalui testing manual dan automation.',
    requirements: '- Selenium/Playwright\n- Testing framework JS\n- Detail-oriented',
    benefits: '- BPJS\n- Remote\n- Learning budget',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.remote,
    experienceLevel: ExperienceLevel.junior,
    location: 'Jakarta',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    salaryMin: BigInt(6000000),
    salaryMax: BigInt(8000000),
    isSalaryVisible: true,
    applicants: 2,
    status: JobStatus.active,
    skillNames: ['Selenium', 'Jest', 'Playwright'],
  },
  {
    slug: 'cyber-security-soc-komdigi',
    title: 'Cyber Security Junior Analyst (SOC Level 1)',
    companySlug: 'komdigi-cyber-shield',
    description: 'Bergabung dengan Security Operations Center untuk monitoring keamanan siber.',
    requirements: '- Linux & networking\n- SIEM tools\n- Bersedia shift',
    benefits: '- Tunjangan shift\n- Pelatihan sertifikasi\n- BPJS',
    employmentType: EmploymentType.internship,
    workMode: WorkMode.onsite,
    experienceLevel: ExperienceLevel.junior,
    location: 'Jakarta Pusat',
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    salaryMin: BigInt(0),
    salaryMax: BigInt(0),
    isSalaryVisible: false,
    applicants: 0,
    status: JobStatus.active,
    skillNames: ['Linux', 'Jaringan Komputer'],
  },
  {
    slug: 'ui-ux-designer-nusantara',
    title: 'UI/UX Designer Junior',
    companySlug: 'nusantara-digital',
    description: 'Merancang pengalaman pengguna untuk aplikasi mobile dan web klien kami.',
    requirements: '- Mahir Figma\n- Portofolio kuat\n- Design system',
    benefits: '- Remote\n- Flexible hours\n- MacBook Pro',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.remote,
    experienceLevel: ExperienceLevel.junior,
    location: 'Bandung',
    city: 'Bandung',
    province: 'Jawa Barat',
    salaryMin: BigInt(4000000),
    salaryMax: BigInt(6000000),
    isSalaryVisible: true,
    applicants: 3,
    status: JobStatus.active,
    skillNames: ['Figma', 'UI/UX Design'],
  },
  {
    slug: 'mobile-developer-flutter-nusantara',
    title: 'Mobile Developer Flutter',
    companySlug: 'nusantara-digital',
    description: 'Mengembangkan aplikasi mobile cross-platform menggunakan Flutter.',
    requirements: '- Flutter & Dart\n- State management\n- Portofolio',
    benefits: '- Remote\n- Kompetitif\n- BPJS',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.remote,
    experienceLevel: ExperienceLevel.junior,
    location: 'Remote',
    city: 'Bandung',
    province: 'Jawa Barat',
    salaryMin: BigInt(7000000),
    salaryMax: BigInt(10000000),
    isSalaryVisible: true,
    applicants: 4,
    status: JobStatus.active,
    skillNames: ['Flutter', 'React Native'],
  },
  {
    slug: 'backend-engineer-bankdigital',
    title: 'Backend Engineer (Go / Node.js)',
    companySlug: 'bank-digital-indonesia',
    description: 'Membangun sistem backend perbankan digital yang scalable dan aman.',
    requirements: '- Go atau Node.js\n- Microservices\n- PostgreSQL, Redis',
    benefits: '- Gaji very competitive\n- Bonus tahunan\n- Asuransi premium',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.hybrid,
    experienceLevel: ExperienceLevel.mid,
    location: 'Jakarta Selatan',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    salaryMin: BigInt(12000000),
    salaryMax: BigInt(20000000),
    isSalaryVisible: true,
    applicants: 45,
    status: JobStatus.active,
    skillNames: ['Go', 'Node.js', 'PostgreSQL', 'Redis'],
  },
  {
    slug: 'data-scientist-bankdigital',
    title: 'Data Scientist',
    companySlug: 'bank-digital-indonesia',
    description: 'Membangun model machine learning untuk credit scoring dan fraud detection.',
    requirements: '- Python & ML\n- Data besar\n- Statistika',
    benefits: '- Kompetitif\n- Remote-friendly\n- Learning budget',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.hybrid,
    experienceLevel: ExperienceLevel.mid,
    location: 'Jakarta Selatan',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    salaryMin: BigInt(15000000),
    salaryMax: BigInt(25000000),
    isSalaryVisible: true,
    applicants: 32,
    status: JobStatus.active,
    skillNames: ['Python', 'Machine Learning', 'SQL'],
  },
  {
    slug: 'digital-marketing-intern-mpm',
    title: 'Digital Marketing Intern',
    companySlug: 'merah-putih-media',
    description: 'Belajar langsung menangani social media, content creation, dan campaign.',
    requirements: '- Aktif sosmed\n- Kreatif\n- Content writing',
    benefits: '- Uang saku\n- Sertifikat\n- Mentoring',
    employmentType: EmploymentType.internship,
    workMode: WorkMode.onsite,
    experienceLevel: ExperienceLevel.junior,
    location: 'Yogyakarta',
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    salaryMin: BigInt(0),
    salaryMax: BigInt(2000000),
    isSalaryVisible: true,
    applicants: 12,
    status: JobStatus.active,
    skillNames: ['Social Media', 'Content Writing'],
  },
  {
    slug: 'video-editor-mpm',
    title: 'Video Editor',
    companySlug: 'merah-putih-media',
    description: 'Editing video untuk campaign brand dan konten sosial media.',
    requirements: '- Premiere Pro / After Effects\n- Portofolio',
    benefits: '- Kompetitif\n- Proyek beragam',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.onsite,
    experienceLevel: ExperienceLevel.junior,
    location: 'Yogyakarta',
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    salaryMin: BigInt(4000000),
    salaryMax: BigInt(6000000),
    isSalaryVisible: true,
    applicants: 8,
    status: JobStatus.active,
    skillNames: ['Premiere Pro', 'After Effects'],
  },
  {
    slug: 'backend-nodejs-stn',
    title: 'Backend Developer (Node.js)',
    companySlug: 'sistem-terpadu-nusantara',
    description: 'Membangun API dan microservices untuk sistem enterprise klien.',
    requirements: '- Node.js & TypeScript\n- PostgreSQL',
    benefits: '- BPJS\n- Tunjangan\n- Hybrid',
    employmentType: EmploymentType.contract,
    workMode: WorkMode.hybrid,
    experienceLevel: ExperienceLevel.mid,
    location: 'Surabaya',
    city: 'Surabaya',
    province: 'Jawa Timur',
    salaryMin: BigInt(6000000),
    salaryMax: BigInt(9000000),
    isSalaryVisible: true,
    applicants: 5,
    status: JobStatus.active,
    skillNames: ['Node.js', 'PostgreSQL'],
  },
  {
    slug: 'network-engineer-telko',
    title: 'Network Engineer',
    companySlug: 'telko-nusantara',
    description: 'Maintenance & optimasi jaringan fiber optik dan 5G.',
    requirements: '- Mikrotik & Cisco\n- Routing & switching',
    benefits: '- Kompetitif\n- BPJS\n- Tunjangan',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.onsite,
    experienceLevel: ExperienceLevel.junior,
    location: 'Jakarta Pusat',
    city: 'Jakarta Pusat',
    province: 'DKI Jakarta',
    salaryMin: BigInt(5000000),
    salaryMax: BigInt(7000000),
    isSalaryVisible: true,
    applicants: 8,
    status: JobStatus.active,
    skillNames: ['Mikrotik', 'Cisco'],
  },
  {
    slug: 'frontend-health-sehat',
    title: 'Frontend Developer (Health Tech)',
    companySlug: 'sehat-selalu',
    description: 'Mengembangkan aplikasi web untuk klinik dan pasien.',
    requirements: '- React & TypeScript\n- Tailwind',
    benefits: '- BPJS\n- Remote-friendly',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.hybrid,
    experienceLevel: ExperienceLevel.junior,
    location: 'Bandung',
    city: 'Bandung',
    province: 'Jawa Barat',
    salaryMin: BigInt(5000000),
    salaryMax: BigInt(8000000),
    isSalaryVisible: true,
    applicants: 7,
    status: JobStatus.active,
    skillNames: ['React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    slug: 'frontend-engineer-tokoku',
    title: 'Frontend Engineer',
    companySlug: 'tokoku-online',
    description: 'Membangun UI e-commerce dengan performa tinggi.',
    requirements: '- React/Vue\n- Web performance\n- TypeScript',
    benefits: '- Kompetitif\n- Bonus\n- Asuransi',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.hybrid,
    experienceLevel: ExperienceLevel.mid,
    location: 'Jakarta',
    city: 'Jakarta',
    province: 'DKI Jakarta',
    salaryMin: BigInt(10000000),
    salaryMax: BigInt(18000000),
    isSalaryVisible: true,
    applicants: 67,
    status: JobStatus.active,
    skillNames: ['React', 'TypeScript', 'Next.js'],
  },
  {
    slug: 'fullstack-startup-kb',
    title: 'Fullstack Developer',
    companySlug: 'startup-karya-bangsa',
    description: 'Membangun MVP untuk startup portofolio kami.',
    requirements: '- Next.js + Node.js\n- Mandiri',
    benefits: '- Equity\n- Flexible\n- Remote',
    employmentType: EmploymentType.full_time,
    workMode: WorkMode.remote,
    experienceLevel: ExperienceLevel.junior,
    location: 'Surabaya',
    city: 'Surabaya',
    province: 'Jawa Timur',
    salaryMin: BigInt(5000000),
    salaryMax: BigInt(9000000),
    isSalaryVisible: true,
    applicants: 11,
    status: JobStatus.active,
    skillNames: ['Next.js', 'Node.js', 'PostgreSQL'],
  },
]

// =====================================================
// MAIN SEED
// =====================================================

async function main() {
  console.log('🌱 Mulai seeding...\n')

  // 1. Skills
  console.log('📚 Seeding skills...')
  let skillCount = 0
  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { category: skill.category },
      create: skill,
    })
    skillCount++
  }
  console.log(`   ✅ ${skillCount} skills\n`)

  // 2. System settings
  console.log('⚙️  Seeding system settings...')
  let settingCount = 0
  for (const setting of systemSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting,
    })
    settingCount++
  }
  console.log(`   ✅ ${settingCount} settings\n`)

  // 3. School programs
  console.log('🏫 Seeding school programs...')
  await prisma.systemSetting.upsert({
    where: { key: 'master.school_programs' },
    update: { value: { programs: schoolPrograms }, description: 'Master program keahlian SMK' },
    create: { key: 'master.school_programs', value: { programs: schoolPrograms }, description: 'Master program keahlian SMK' },
  })
  console.log(`   ✅ ${schoolPrograms.length} program keahlian\n`)

  // 4. Industries
  console.log('🏢 Seeding industries...')
  let industryCount = 0
  for (const ind of industries) {
    await prisma.industry.upsert({
      where: { slug: ind.slug },
      update: { name: ind.name, icon: ind.icon },
      create: ind,
    })
    industryCount++
  }
  console.log(`   ✅ ${industryCount} industries\n`)

  // 5. Provinces
  console.log('🗺️  Seeding provinces...')
  let provinceCount = 0
  for (const prov of provinces) {
    await prisma.province.upsert({
      where: { name: prov.name },
      update: { code: prov.code },
      create: prov,
    })
    provinceCount++
  }
  console.log(`   ✅ ${provinceCount} provinces\n`)

  // 6. COMPANIES
  console.log('🏢 Seeding companies...')
  const companyMap: Record<string, string> = {}
  for (const c of companies) {
    const company = await prisma.company.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    })
    companyMap[c.slug] = company.id
    console.log(`   ✓ ${c.name}`)
  }
  console.log(`   ✅ ${companies.length} companies\n`)

  // 7. JOBS
  console.log('💼 Seeding jobs + relasi skills...')
  let jobCount = 0
  for (const j of jobsData) {
    const { companySlug, skillNames, ...jobData } = j
    const companyId = companyMap[companySlug]
    if (!companyId) {
      console.warn(`   ⚠ Company ${companySlug} not found, skip ${j.slug}`)
      continue
    }

    // Upsert skills
    const skillIds: string[] = []
    for (const name of skillNames) {
      const skill = await prisma.skill.upsert({
        where: { name },
        update: {},
        create: { name, category: 'Umum' },
      })
      skillIds.push(skill.id)
    }

    // Upsert job
    const job = await prisma.job.upsert({
      where: { slug: j.slug },
      update: { ...jobData, companyId },
      create: { ...jobData, companyId },
    })

    // Reset relasi job skills
    await prisma.jobSkill.deleteMany({ where: { jobId: job.id } })
    await prisma.jobSkill.createMany({
      data: skillIds.map((skillId) => ({
        jobId: job.id,
        skillId,
        isRequired: true,
      })),
    })

    jobCount++
    console.log(`   ✓ ${j.title}`)
  }
  console.log(`   ✅ ${jobCount} jobs\n`)

  console.log('🎉 Seeding selesai!\n')
  console.log('Ringkasan:')
  console.log(`  - Skills       : ${skillCount}`)
  console.log(`  - Settings     : ${settingCount + 1}`)
  console.log(`  - Programs     : ${schoolPrograms.length}`)
  console.log(`  - Industries   : ${industryCount}`)
  console.log(`  - Provinces    : ${provinceCount}`)
  console.log(`  - Companies    : ${companies.length}`)
  console.log(`  - Jobs         : ${jobCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })