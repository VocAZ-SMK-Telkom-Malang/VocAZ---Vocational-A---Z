// components/certification/layout/cert-sidebar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShieldCheck,
  Award,
  Building2,
  Bell,
  Settings,
  ChevronLeft,
  X,
} from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const NAV_GROUPS = [
  {
    label: null,
    items: [
      { href: '/certification/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Verifikasi',
    items: [
      { href: '/certification/verifications', label: 'Pengajuan', icon: ShieldCheck },
      { href: '/certification/records', label: 'Riwayat', icon: Award },
    ],
  },
  {
    label: 'Institusi',
    items: [
      { href: '/certification/profile', label: 'Profil Institusi', icon: Building2 },
      { href: '/certification/notifications', label: 'Notifikasi', icon: Bell },
      { href: '/certification/settings', label: 'Pengaturan', icon: Settings },
    ],
  },
]

export function CertSidebar({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}: Props) {
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
        <div className="h-16 flex items-center justify-between px-4 border-b border-outline-variant/30 shrink-0">
          <Link
            href="/certification/dashboard"
            className="flex items-center gap-2.5 min-w-0"
            onClick={onClose}
          >
            <Image
              src="/vocaz.png"
              alt="VocAZ"
              width={collapsed ? 32 : 100}
              height={32}
              className={`object-contain transition-all ${
                collapsed ? 'h-8 w-8' : 'h-8 w-auto'
              }`}
              priority
            />
            {!collapsed && (
              <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-container shrink-0">
                Verifier
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Tutup sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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
                          ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                          }
                          ${collapsed ? 'lg:justify-center lg:px-2' : ''}
                        `}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="hidden lg:block px-3 py-3 border-t border-outline-variant/30 shrink-0">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors text-sm font-medium"
            title={collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
          >
            <ChevronLeft
              className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                collapsed ? 'rotate-180' : ''
              }`}
            />
            {!collapsed && <span>Perkecil</span>}
          </button>
        </div>
      </aside>
    </>
  )
}