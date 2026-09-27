// components/student/layout/sidebar-data.ts
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
  type LucideIcon,
} from 'lucide-react'

export type StudentMenuItem = {
  href: string
  label: string
  icon: LucideIcon
  badge?: number
}

export type StudentMenuGroup = {
  title?: string
  items: StudentMenuItem[]
}

export const STUDENT_MENU: StudentMenuGroup[] = [
  {
    items: [
      { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Career Hub',
    items: [
      { href: '/student/jobs', label: 'Cari Lowongan', icon: Briefcase },
      { href: '/student/companies', label: 'Perusahaan', icon: Building2 },
      { href: '/student/applications', label: 'Lamaran Saya', icon: Send },
      { href: '/student/saved', label: 'Tersimpan', icon: Bookmark },
    ],
  },
  {
    title: 'Talent Network',
    items: [
      { href: '/student/talents', label: 'Jelajahi Talent', icon: Users },
    ],
  },
  {
    title: 'Showcase',
    items: [
      { href: '/student/showcase/feed', label: 'Jelajahi Video', icon: Video },
      { href: '/student/showcase/my', label: 'Showcase Saya', icon: Video },
    ],
  },
  {
    title: 'Pesan',
    items: [
      { href: '/student/messages', label: 'Pesan', icon: MessageSquare },
    ],
  },
  {
    title: 'Akun',
    items: [
      { href: '/student/profile', label: 'Profil Saya', icon: User },
      { href: '/student/settings', label: 'Pengaturan', icon: Settings },
    ],
  },
]