// components/student/layout/student-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Award,
  FileCheck,
  Settings,
  ChevronLeft,
  FolderGit2,
  X,
} from 'lucide-react'


type Props = {
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const NAV_GROUPS = [
  { label: null, items: [{ href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'Career Hub', items: [
    { href: '/student/jobs', label: 'Cari Lowongan', icon: Briefcase },
    { href: '/student/companies', label: 'Perusahaan', icon: Building2 },
    { href: '/student/applications', label: 'Lamaran Saya', icon: Send },
    { href: '/student/saved', label: 'Tersimpan', icon: Bookmark },
  ] },
  { label: 'Talent Network', items: [{ href: '/student/talents', label: 'Jelajahi Talent', icon: Users }] },
  { label: 'Showcase', items: [
    { href: '/student/showcase/feed', label: 'Jelajahi Video', icon: Video },
    { href: '/student/showcase/my', label: 'Showcase Saya', icon: Video },
  ] },
  { label: 'Komunikasi', items: [{ href: '/student/messages', label: 'Pesan', icon: MessageSquare }] },
  {
    label: 'Akun',
    items: [
      { href: '/student/profile', label: 'Profil Saya', icon: User },
      { href: '/student/profile/portfolio', label: 'Portfolio & Prestasi', icon: FolderGit2 },
      { href: '/student/profile/certifications', label: 'Sertifikat Saya', icon: FileCheck },
      { href: '/student/settings', label: 'Pengaturan', icon: Settings },
    ],
  },
]

export function StudentSidebar({ isOpen, onClose, collapsed, onToggleCollapse }: Props) {
  const pathname = usePathname()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-surface-container-lowest
          border-r border-outline-variant/30 flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-64'}
          w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand header — chevron desktop DIHAPUS, tinggal X mobile */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-outline-variant/30 shrink-0">
          <Link
            href="/student/dashboard"
            className="flex items-center gap-2.5 min-w-0"
            onClick={onClose}
          >
            <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
              V
            </div>
            {!collapsed && (
              <span className="font-bold text-base text-on-surface truncate">
                Voc<span className="text-primary">AZ</span>
              </span>
            )}
          </Link>

          {/* Close X — MOBILE ONLY */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Tutup sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-5' : ''}>
              {group.label && !collapsed && (
                <p className="px-3 mb-1.5 font-mono text-[10px] uppercase tracking-[0.1em] font-bold text-on-surface-variant/50">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname?.startsWith(item.href + '/')
                  const Icon = item.icon

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        title={collapsed ? item.label : undefined}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg
                          text-sm font-medium transition-colors
                          ${isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                          }
                          ${collapsed ? 'lg:justify-center lg:px-2' : ''}
                        `}
                      >
                        <Icon className="w-4.5 h-4.5 shrink-0" />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer — Full-width "Perkecil" button (DESKTOP) */}
        <div className="hidden lg:block px-3 py-3 border-t border-outline-variant/30 shrink-0">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors text-sm font-medium"
            title={collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
          >
            <ChevronLeft
              className={`w-4 h-4 shrink-0 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            />
            {!collapsed && <span>Perkecil</span>}
          </button>
        </div>
      </aside>
    </>
  )
}