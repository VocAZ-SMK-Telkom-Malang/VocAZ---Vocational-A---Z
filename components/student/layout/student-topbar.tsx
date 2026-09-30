// components/student/layout/student-topbar.tsx
'use client'

import Link from 'next/link'
import {
  PanelLeft,
  Search,
  User,
  ChevronDown,
  Bell,
  Settings,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { LogoutButton } from '@/components/shared/logout-button'

type Props = {
  onMenuClick: () => void           // buka sidebar (mobile)
  onToggleCollapse: () => void      // collapse/expand sidebar (desktop)
  collapsed: boolean                // state collapse
  onOpenCommandPalette: () => void
  user: {
    fullName: string | null
    email: string
    avatarUrl: string | null
  }
}

export function StudentTopbar({
  onMenuClick,
  onToggleCollapse,
  collapsed,
  onOpenCommandPalette,
  user,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const [isMac, setIsMac] = useState(false)
  useEffect(() => {
    setIsMac(
      typeof navigator !== 'undefined' &&
        /Mac|iPhone|iPad/.test(navigator.platform)
    )
  }, [])

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
    <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30 flex items-center gap-2 sm:gap-3 px-3 sm:px-6">
      {/* ============================================ */}
      {/* Sidebar toggle — MOBILE (buka sidebar)       */}
      {/* ============================================ */}
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
        aria-label="Buka menu"
      >
        <PanelLeft className="w-5 h-5" />
      </button>

      {/* ============================================ */}
      {/* Sidebar toggle — DESKTOP (collapse/expand)   */}
      {/* ============================================ */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="hidden lg:flex p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
        aria-label={collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
        title={collapsed ? 'Perluas sidebar' : 'Perkecil sidebar'}
      >
        <PanelLeft
          className={`w-5 h-5 transition-transform duration-300 ${
            collapsed ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* ============================================ */}
      {/* Search trigger                                */}
      {/* ============================================ */}
      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-left transition-colors group w-full max-w-md"
        aria-label="Buka pencarian"
      >
        <Search className="w-4 h-4 text-on-surface-variant shrink-0" />
        <span className="flex-1 text-sm text-on-surface-variant/70 truncate text-left">
          Cari halaman...
        </span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-container-lowest text-[10px] font-mono font-semibold text-on-surface-variant ring-1 ring-outline-variant/30">
          {isMac ? '⌘' : 'Ctrl'}+K
        </kbd>
      </button>

      {/* Mobile search icon */}
      <button
        type="button"
        onClick={onOpenCommandPalette}
        className="sm:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
        aria-label="Buka pencarian"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* ============================================ */}
      {/* Right actions                                 */}
      {/* ============================================ */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Notifications */}
        <Link
          href="/student/notifications"
          className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          aria-label="Notifikasi"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-surface-container-lowest" />
        </Link>

        {/* User menu */}
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
            <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg ring-1 ring-outline-variant/30 overflow-hidden z-50">
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
                  <Settings className="w-4 h-4 text-on-surface-variant" />
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