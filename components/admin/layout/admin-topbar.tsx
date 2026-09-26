'use client'

import { Menu, PanelLeft, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth/client'
import { useState } from 'react'

type Props = {
  user: {
    fullName: string | null
    email: string
  }
  title?: string
  onOpenMobile: () => void
  onToggleCollapse: () => void
  collapsed: boolean
}

export function AdminTopbar({
  user,
  title,
  onOpenMobile,
  onToggleCollapse,
  collapsed,
}: Props) {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="h-16 bg-white border-b border-outline-variant/30 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-2 lg:gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-container transition-colors shrink-0"
          aria-label="Buka menu"
        >
          <Menu className="w-5 h-5 text-on-surface" />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-2 rounded-lg hover:bg-surface-container transition-colors shrink-0"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelLeft
            className={`w-5 h-5 text-on-surface transition-transform ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Divider */}
        <div className="hidden lg:block w-px h-6 bg-outline-variant/40" />

        <h1 className="font-display text-base lg:text-lg font-bold text-on-surface truncate">
          {title || 'Admin'}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 lg:gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-on-surface truncate max-w-[160px]">
            {user.fullName || 'Admin'}
          </p>
          <p className="text-xs text-on-surface-variant truncate max-w-[160px]">
            {user.email}
          </p>
        </div>

        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
          {(user.fullName || 'A')[0].toUpperCase()}
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="p-2 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          aria-label="Keluar"
          title="Keluar"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}