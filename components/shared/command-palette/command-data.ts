// components/shared/command-palette/command-data.ts
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Send,
  Bookmark,
  Users,
  Video,
  MessageSquare,
  User,
  Settings,
  Bell,
  FileCheck,
  ShieldCheck,
  GraduationCap,
  Award,
  TrendingUp,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react'

export type Role = 'student' | 'company' | 'school' | 'certification' | 'admin'

export type MenuItem = {
  id: string
  label: string
  description?: string
  icon: LucideIcon
  href: string
  group: string
  keywords?: string[]
}

// ============================================
// STUDENT MENU
// ============================================

const STUDENT_MENU: MenuItem[] = [
  {
    id: 'student-dashboard',
    label: 'Dashboard',
    description: 'Ringkasan aktivitas kamu',
    icon: LayoutDashboard,
    href: '/student/dashboard',
    group: 'Navigasi',
    keywords: ['home', 'beranda'],
  },
  {
    id: 'student-jobs',
    label: 'Cari Lowongan',
    description: 'Jelajahi lowongan kerja',
    icon: Briefcase,
    href: '/student/jobs',
    group: 'Career Hub',
    keywords: ['job', 'kerja', 'lowongan', 'career'],
  },
  {
    id: 'student-companies',
    label: 'Perusahaan',
    description: 'Direktori mitra industri',
    icon: Building2,
    href: '/student/companies',
    group: 'Career Hub',
    keywords: ['company', 'perusahaan', 'mitra'],
  },
  {
    id: 'student-applications',
    label: 'Lamaran Saya',
    description: 'Status lamaran kamu',
    icon: Send,
    href: '/student/applications',
    group: 'Career Hub',
    keywords: ['application', 'lamaran', 'apply'],
  },
  {
    id: 'student-saved',
    label: 'Tersimpan',
    description: 'Lowongan & perusahaan tersimpan',
    icon: Bookmark,
    href: '/student/saved',
    group: 'Career Hub',
    keywords: ['saved', 'bookmark', 'tersimpan'],
  },
  {
    id: 'student-talents',
    label: 'Jelajahi Talent',
    description: 'Lihat talenta SMK lainnya',
    icon: Users,
    href: '/student/talents',
    group: 'Talent Network',
    keywords: ['talent', 'peer', 'network'],
  },
  {
    id: 'student-showcase-explore',
    label: 'Jelajahi Video',
    description: 'Tonton showcase talenta',
    icon: Video,
    href: '/showcase',
    group: 'Showcase',
    keywords: ['video', 'showcase', 'reel'],
  },
  {
    id: 'student-showcase-my',
    label: 'Showcase Saya',
    description: 'Kelola video showcase kamu',
    icon: Video,
    href: '/student/showcase/my',
    group: 'Showcase',
    keywords: ['my showcase', 'video saya'],
  },
  {
    id: 'student-messages',
    label: 'Pesan',
    description: 'Chat dengan recruiter',
    icon: MessageSquare,
    href: '/student/messages',
    group: 'Komunikasi',
    keywords: ['message', 'chat', 'pesan'],
  },
  {
    id: 'student-notifications',
    label: 'Notifikasi',
    description: 'Aktivitas terbaru',
    icon: Bell,
    href: '/student/notifications',
    group: 'Komunikasi',
    keywords: ['notification', 'notif'],
  },
  {
    id: 'student-profile',
    label: 'Profil Saya',
    description: 'Lihat & edit profil',
    icon: User,
    href: '/student/profile',
    group: 'Akun',
    keywords: ['profile', 'profil'],
  },
  {
    id: 'student-profile-skills',
    label: 'Kelola Skills',
    description: 'Atur skill & keahlian',
    icon: Award,
    href: '/student/profile/skills',
    group: 'Akun',
    keywords: ['skill', 'keahlian'],
  },
  {
    id: 'student-profile-certifications',
    label: 'Sertifikat Saya',
    description: 'Kelola & unggah sertifikat',
    icon: FileCheck,
    href: '/student/profile/certifications',
    group: 'Akun',
    keywords: ['certificate', 'sertifikat', 'sertifikasi'],
  },
  {
    id: 'student-settings',
    label: 'Pengaturan',
    description: 'Preferensi akun',
    icon: Settings,
    href: '/student/settings',
    group: 'Akun',
    keywords: ['settings', 'pengaturan'],
  },
]

// ============================================
// COMPANY MENU
// ============================================

const COMPANY_MENU: MenuItem[] = [
  {
    id: 'company-dashboard',
    label: 'Dashboard',
    description: 'Ringkasan rekrutmen',
    icon: LayoutDashboard,
    href: '/company/dashboard',
    group: 'Navigasi',
  },
  {
    id: 'company-jobs',
    label: 'Lowongan Saya',
    description: 'Kelola posting lowongan',
    icon: Briefcase,
    href: '/company/jobs',
    group: 'Rekrutmen',
    keywords: ['job', 'lowongan'],
  },
  {
    id: 'company-applicants',
    label: 'Pelamar',
    description: 'Lihat & kelola pelamar',
    icon: Users,
    href: '/company/applicants',
    group: 'Rekrutmen',
    keywords: ['applicant', 'pelamar', 'candidate'],
  },
  {
    id: 'company-talents',
    label: 'Jelajahi Talenta',
    description: 'Cari talenta SMK',
    icon: Users,
    href: '/company/talents',
    group: 'Talenta',
    keywords: ['talent', 'talenta'],
  },
  {
    id: 'company-messages',
    label: 'Pesan',
    description: 'Chat dengan kandidat',
    icon: MessageSquare,
    href: '/company/messages',
    group: 'Komunikasi',
  },
  {
    id: 'company-profile',
    label: 'Profil Perusahaan',
    description: 'Edit profil perusahaan',
    icon: Building2,
    href: '/company/profile',
    group: 'Akun',
  },
  {
    id: 'company-settings',
    label: 'Pengaturan',
    description: 'Preferensi akun',
    icon: Settings,
    href: '/company/settings',
    group: 'Akun',
  },
]

// ============================================
// SCHOOL MENU
// ============================================

const SCHOOL_MENU: MenuItem[] = [
  {
    id: 'school-dashboard',
    label: 'Dashboard',
    description: 'Ringkasan BKK',
    icon: LayoutDashboard,
    href: '/school/dashboard',
    group: 'Navigasi',
  },
  {
    id: 'school-students',
    label: 'Siswa',
    description: 'Kelola data siswa',
    icon: Users,
    href: '/school/students',
    group: 'Manajemen',
    keywords: ['student', 'siswa'],
  },
  {
    id: 'school-alumni',
    label: 'Alumni',
    description: 'Data & tracer study alumni',
    icon: GraduationCap,
    href: '/school/alumni',
    group: 'Manajemen',
    keywords: ['alumni', 'tracer'],
  },
  {
    id: 'school-approvals',
    label: 'Approval Siswa',
    description: 'Setujui siswa baru',
    icon: FileCheck,
    href: '/school/approvals',
    group: 'Manajemen',
    keywords: ['approval', 'persetujuan'],
  },
  {
    id: 'school-analytics',
    label: 'Analytics',
    description: 'Laporan & statistik',
    icon: TrendingUp,
    href: '/school/analytics',
    group: 'Manajemen',
    keywords: ['analytics', 'report', 'laporan'],
  },
  {
    id: 'school-profile',
    label: 'Profil Sekolah',
    description: 'Edit profil sekolah',
    icon: Building2,
    href: '/school/profile',
    group: 'Akun',
  },
  {
    id: 'school-settings',
    label: 'Pengaturan',
    description: 'Preferensi akun',
    icon: Settings,
    href: '/school/settings',
    group: 'Akun',
  },
]

// ============================================
// CERTIFICATION MENU
// ============================================

const CERTIFICATION_MENU: MenuItem[] = [
  {
    id: 'cert-dashboard',
    label: 'Dashboard',
    description: 'Ringkasan verifikasi',
    icon: LayoutDashboard,
    href: '/certification/dashboard',
    group: 'Navigasi',
  },
  {
    id: 'cert-verifications',
    label: 'Verifikasi',
    description: 'Review sertifikat masuk',
    icon: ShieldCheck,
    href: '/certification/verifications',
    group: 'Verifikasi',
    keywords: ['verification', 'verifikasi'],
  },
  {
    id: 'cert-issued',
    label: 'Sertifikat Terbit',
    description: 'Sertifikat yang sudah diterbitkan',
    icon: FileCheck,
    href: '/certification/issued',
    group: 'Verifikasi',
    keywords: ['issued', 'terbit'],
  },
  {
    id: 'cert-history',
    label: 'Riwayat',
    description: 'Log verifikasi',
    icon: ClipboardList,
    href: '/certification/history',
    group: 'Verifikasi',
    keywords: ['history', 'riwayat'],
  },
  {
    id: 'cert-profile',
    label: 'Profil Lembaga',
    description: 'Edit profil lembaga',
    icon: Building2,
    href: '/certification/profile',
    group: 'Akun',
  },
  {
    id: 'cert-settings',
    label: 'Pengaturan',
    description: 'Preferensi akun',
    icon: Settings,
    href: '/certification/settings',
    group: 'Akun',
  },
]

// ============================================
// ADMIN MENU
// ============================================

const ADMIN_MENU: MenuItem[] = [
  {
    id: 'admin-dashboard',
    label: 'Dashboard',
    description: 'Ringkasan platform',
    icon: LayoutDashboard,
    href: '/admin/dashboard',
    group: 'Navigasi',
  },
  {
    id: 'admin-users',
    label: 'Pengguna',
    description: 'Kelola user platform',
    icon: Users,
    href: '/admin/users',
    group: 'Manajemen',
    keywords: ['users', 'pengguna'],
  },
  {
    id: 'admin-verifications',
    label: 'Verifikasi',
    description: 'Verifikasi perusahaan & lembaga',
    icon: ShieldCheck,
    href: '/admin/verifications',
    group: 'Manajemen',
    keywords: ['verification', 'verifikasi'],
  },
  {
    id: 'admin-moderation',
    label: 'Moderasi',
    description: 'Laporan & konten',
    icon: ClipboardList,
    href: '/admin/moderation',
    group: 'Manajemen',
    keywords: ['moderation', 'moderasi', 'report'],
  },
  {
    id: 'admin-monitoring',
    label: 'Monitoring',
    description: 'Statistik & health platform',
    icon: TrendingUp,
    href: '/admin/monitoring',
    group: 'Manajemen',
    keywords: ['monitoring', 'stat'],
  },
  {
    id: 'admin-master-data',
    label: 'Master Data',
    description: 'Industri, provinsi, skill',
    icon: Building2,
    href: '/admin/master-data',
    group: 'Manajemen',
    keywords: ['master', 'data'],
  },
  {
    id: 'admin-settings',
    label: 'Pengaturan',
    description: 'Konfigurasi platform',
    icon: Settings,
    href: '/admin/settings',
    group: 'Sistem',
  },
]

// ============================================
// EXPORT
// ============================================

export const MENU_BY_ROLE: Record<Role, MenuItem[]> = {
  student: STUDENT_MENU,
  company: COMPANY_MENU,
  school: SCHOOL_MENU,
  certification: CERTIFICATION_MENU,
  admin: ADMIN_MENU,
}