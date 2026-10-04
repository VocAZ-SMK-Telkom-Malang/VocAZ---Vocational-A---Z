'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  BadgeCheck,
  Flag,
  BarChart3,
  Settings,
  Database,
  X,
} from 'lucide-react'

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/verifications', label: 'Verifikasi', icon: BadgeCheck },
  { href: '/admin/moderation', label: 'Moderation', icon: Flag },
  { href: '/admin/monitoring', label: 'Monitoring', icon: BarChart3 },
  { href: '/admin/master-data', label: 'Master Data', icon: Database },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

type Props = {
  mobileOpen: boolean
  onCloseMobile: () => void
  collapsed: boolean
}

export function AdminSidebar({
  mobileOpen,
  onCloseMobile,
  collapsed,
}: Props) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50
          bg-[#3D0C11] text-white flex flex-col
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div
          className={`h-16 border-b border-white/10 flex items-center ${
            collapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          <Link href="/admin/dashboard" className="flex items-center gap-2 min-w-0">
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
              <span className="text-[10px] text-white/60 font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 shrink-0">
                Admin
              </span>
            )}
          </Link>

          {/* Mobile close */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? item.label : undefined}
                className={`
                  flex items-center rounded-lg text-sm font-medium
                  transition-colors group relative
                  ${collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2.5'}
                  ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}

                {/* Tooltip saat collapsed */}
                {collapsed && (
                  <span
                    className="
                      absolute left-full ml-2 px-2 py-1
                      bg-gray-900 text-white text-xs rounded
                      opacity-0 group-hover:opacity-100
                      pointer-events-none whitespace-nowrap
                      transition-opacity z-50
                    "
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-white/10 text-xs text-white/40 text-center">
            © 2025 VocAZ
          </div>
        )}
      </aside>
    </>
  )
}