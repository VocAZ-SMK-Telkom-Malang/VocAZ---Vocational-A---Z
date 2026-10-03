// components/student/layout/student-topbar.tsx
'use client'

import { Menu, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NotificationDropdown } from '@/components/shared/notifications/notification-dropdown'
import { StudentUserMenu } from './student-user-menu'
import { LogoutButton } from '@/components/shared/logout-button'

type Props = {
  onMenuClick: () => void
  onOpenCommandPalette: () => void
  user: {
    fullName: string | null
    email: string
    avatarUrl: string | null
  }
  // Optional — dikirim shell tapi gak dipake di sini
  onToggleCollapse?: () => void
  collapsed?: boolean
}

export function StudentTopbar({
  onMenuClick,
  onOpenCommandPalette,
  user,
}: Props) {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(
      typeof navigator !== 'undefined' &&
        /Mac|iPhone|iPad/.test(navigator.platform)
    )
  }, [])

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30 flex items-center gap-2 sm:gap-3 px-3 sm:px-6">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
        aria-label="Buka menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search trigger */}
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

      {/* Right actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Notifications */}
        <NotificationDropdown />

        {/* User menu — dropdown kaya Company */}
        <StudentUserMenu user={user} />
      </div>
    </header>
  )
}