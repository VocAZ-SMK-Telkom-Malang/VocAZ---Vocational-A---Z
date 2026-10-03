// components/school/layout/school-user-menu.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  User,
  Settings,
  Building2,
  Users,
  GraduationCap,
  LogOut,
  Loader2,
} from 'lucide-react'
import { authClient } from '@/lib/auth/client'

type Props = {
  schoolName: string
  schoolLogo: string | null
  userName: string
  userAvatar: string | null
}

export function SchoolUserMenu({
  schoolName,
  schoolLogo,
  userName,
  userAvatar,
}: Props) {
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [open])

  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await authClient.signOut().catch(() => {})
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      }).catch(() => {})
    } catch (err) {
      console.error('[logout]', err)
    }
    window.location.href = '/'
  }

  const schoolInitials = schoolName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const userInitials = userName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-surface-container transition-colors"
      >
        {schoolLogo ? (
          <img
            src={schoolLogo}
            alt={schoolName}
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-outline-variant/30"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
            <span className="text-xs font-black">{schoolInitials}</span>
          </div>
        )}

        <div className="hidden md:flex flex-col items-start leading-tight max-w-[160px]">
          <span className="text-xs font-bold text-on-surface truncate w-full text-left">
            {schoolName}
          </span>
          <span className="text-[10px] text-on-surface-variant truncate w-full text-left">
            Akun Sekolah
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-on-surface-variant transition-transform shrink-0 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="p-4 bg-primary/5 border-b border-outline-variant/30">
            <div className="flex items-start gap-3">
              {schoolLogo ? (
                <img
                  src={schoolLogo}
                  alt={schoolName}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-outline-variant/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                  <span className="text-sm font-black">{schoolInitials}</span>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-on-surface truncate">
                  {schoolName}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-4 h-4 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-black">
                        {userInitials}
                      </span>
                    </div>
                  )}
                  <span className="text-[11px] text-on-surface-variant truncate">
                    {userName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="p-1.5">
            <div className="px-3 pt-2 pb-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant/60">
                Sekolah
              </span>
            </div>

            <MenuLink
              href="/school/profile"
              icon={Building2}
              label="Profil Sekolah"
              desc="Kelola info sekolah & BKK"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/school/students"
              icon={GraduationCap}
              label="Siswa"
              desc="Kelola siswa & alumni"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/school/partners"
              icon={Users}
              label="Partner Industri"
              desc="Kelola hubungan industri"
              onClick={() => setOpen(false)}
            />

            <div className="my-1 h-px bg-outline-variant/30" />

            <div className="px-3 pt-1 pb-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant/60">
                Akun Saya
              </span>
            </div>

            <MenuLink
              href="/school/settings"
              icon={User}
              label="Profil Saya"
              desc={userName}
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/school/settings"
              icon={Settings}
              label="Pengaturan"
              desc="Akun & preferensi"
              onClick={() => setOpen(false)}
            />

            <div className="my-1 h-px bg-outline-variant/30" />

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold">
                  {loggingOut ? 'Keluar...' : 'Keluar'}
                </div>
                <div className="text-[11px] text-rose-500/80">
                  Logout dari akun ini
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MenuLink({
  href,
  icon: Icon,
  label,
  desc,
  onClick,
}: {
  href: string
  icon: any
  label: string
  desc?: string
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-on-surface hover:bg-surface-container transition-colors"
    >
      <Icon className="w-4 h-4 text-on-surface-variant shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold truncate">{label}</div>
        {desc && (
          <div className="text-[11px] text-on-surface-variant truncate">
            {desc}
          </div>
        )}
      </div>
    </Link>
  )
}