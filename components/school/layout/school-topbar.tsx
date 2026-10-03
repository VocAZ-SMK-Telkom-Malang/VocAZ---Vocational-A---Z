// components/school/layout/school-topbar.tsx
'use client'

import Link from 'next/link'
import { Bell, HelpCircle, Menu } from 'lucide-react'
import { SchoolUserMenu } from './school-user-menu'

type Props = {
  schoolName: string
  schoolLogo: string | null
  userName: string
  userAvatar: string | null
  onOpenSidebar: () => void
}

export function SchoolTopbar({
  schoolName,
  schoolLogo,
  userName,
  userAvatar,
  onOpenSidebar,
}: Props) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30">
      <div className="h-full px-4 md:px-6 flex items-center gap-3 w-full">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-xl">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari siswa, lowongan, atau industri..."
              className="w-full pl-10 pr-16 py-2 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-auto">
          <Link
            href="/school/notifications"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
          </Link>

          <Link
            href="/school/help"
            className="w-9 h-9 rounded-lg hidden md:flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Bantuan"
          >
            <HelpCircle className="w-5 h-5" />
          </Link>

          <div className="w-px h-6 bg-outline-variant/40 mx-1 hidden md:block" />

          <SchoolUserMenu
            schoolName={schoolName}
            schoolLogo={schoolLogo}
            userName={userName}
            userAvatar={userAvatar}
          />
        </div>
      </div>
    </header>
  )
}