// components/shared/logout-button.tsx
'use client'

import { useState } from 'react'
import { Loader2, LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth/client'

type Props = {
  className?: string
  variant?: 'menu' | 'inline'
}

export function LogoutButton({ className, variant = 'menu' }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    if (loading) return
    setLoading(true)

    try {
      // 1. Sign out client-side Neon Auth
      await authClient.signOut().catch(() => {})

      // 2. Hapus cookie session server
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      })
    } catch (err) {
      console.error('[logout] error:', err)
    }

    // 3. Redireksi penuh ke Landing Page utama
    window.location.href = '/'
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className={
          className ??
          'text-sm text-gray-500 hover:text-red-600 underline disabled:opacity-50'
        }
      >
        {loading ? 'Keluar...' : 'Keluar'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={
        className ??
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50'
      }
    >
      {loading ? (
        <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold">
          {loading ? 'Keluar...' : 'Keluar'}
        </div>
        <div className="text-[11px] text-rose-500/80">
          Logout dari akun ini
        </div>
      </div>
    </button>
  )
}