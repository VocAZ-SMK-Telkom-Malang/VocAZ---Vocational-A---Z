// components/student/layout/student-topbar.tsx
'use client'

import Link from 'next/link'
import {
  Menu,
  Bell,
  Search,
  User,
  ChevronDown,
  PanelLeft,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { LogoutButton } from '@/components/shared/logout-button'

type Props = {
  onMenuClick: () => void
  onToggleCollapse: () => void
  user: {
    fullName: string | null
    email: string
    avatarUrl: string | null
  }
}

export function StudentTopbar({
  onMenuClick,
  onToggleCollapse,
  user,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const initials = (user.fullName || user.email)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="h-16 bg-white border-b border-outline-variant/30 flex items-center gap-2 sm:gap-3 px-4 sm:px-6 shrink-0">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
        aria-label="Buka menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop toggle button */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="hidden lg:flex p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
        aria-label="Toggle sidebar"
        title="Toggle sidebar"
      >
        <PanelLeft className="w-5 h-5" />
      </button>

      {/* Search (desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Cari lowongan, perusahaan..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-surface-container text-sm placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1 md:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        <Link
          href="/student/notifications"
          className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          aria-label="Notifikasi"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 p-1.5 pr-2 rounded-full hover:bg-surface-container transition-colors"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant hidden sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-outline-variant/30 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-outline-variant/30">
                <p className="text-sm font-semibold text-on-surface truncate">
                  {user.fullName || 'User'}
                </p>
                <p className="text-xs text-on-surface-variant truncate">
                  {user.email}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/student/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
                >
                  <User className="w-4 h-4 text-on-surface-variant" />
                  <span>Profil Saya</span>
                </Link>
                <Link
                  href="/student/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-surface-container transition-colors"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-on-surface-variant">
                    ⚙️
                  </span>
                  <span>Pengaturan</span>
                </Link>
              </div>

              <div className="border-t border-outline-variant/30 p-2">
                <div className="[&>button]:w-full [&>button]:justify-start [&>button]:text-red-600 [&>button]:hover:bg-red-50">
                  <LogoutButton />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}