// components/student/layout/student-user-menu.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  User,
  Settings,
  Video,
  Award,
  Briefcase,
  Bookmark,
  LogOut,
} from 'lucide-react'
import { LogoutButton } from '@/components/shared/logout-button'

type Props = {
  user: {
    fullName: string | null
    email: string
    avatarUrl: string | null
  }
}

export function StudentUserMenu({ user }: Props) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on click outside + ESC
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

  const initials = (user.fullName || user.email)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-surface-container transition-colors"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.fullName || 'User'}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/30 shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
        )}

        {/* Name + subtitle (desktop) */}
        <div className="hidden md:flex flex-col items-start leading-tight max-w-[140px]">
          <span className="text-xs font-bold text-on-surface truncate w-full text-left">
            {user.fullName || 'Siswa'}
          </span>
          <span className="text-[10px] text-on-surface-variant truncate w-full text-left">
            Siswa SMK
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-on-surface-variant transition-transform shrink-0 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-2xl shadow-2xl ring-1 ring-outline-variant/30 overflow-hidden z-50">
          {/* Header — user identity */}
          <div className="p-4 bg-primary/5 border-b border-outline-variant/30">
            <div className="flex items-start gap-3">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || 'User'}
                  className="w-12 h-12 rounded-full object-cover shrink-0 ring-1 ring-outline-variant/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                  <span className="text-sm font-black">{initials}</span>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-on-surface truncate">
                  {user.fullName || 'Siswa'}
                </div>
                <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="p-1.5">
            {/* Section: Profil */}
            <div className="px-3 pt-2 pb-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant/60">
                Profil
              </span>
            </div>

            <MenuLink
              href="/student/profile"
              icon={User}
              label="Profil Saya"
              desc="Data pribadi & keahlian"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/student/showcase/my"
              icon={Video}
              label="Video Showcase"
              desc="Kelola video kamu"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/student/profile/certifications"
              icon={Award}
              label="Sertifikat"
              desc="Kelola sertifikat & BNSP"
              onClick={() => setOpen(false)}
            />

            <div className="my-1 h-px bg-outline-variant/30" />

            {/* Section: Karier */}
            <div className="px-3 pt-1 pb-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant/60">
                Karier
              </span>
            </div>

            <MenuLink
              href="/student/applications"
              icon={Briefcase}
              label="Lamaran Saya"
              desc="Status & riwayat lamaran"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/student/saved"
              icon={Bookmark}
              label="Lowongan Tersimpan"
              desc="Lowongan yang kamu simpan"
              onClick={() => setOpen(false)}
            />

            <div className="my-1 h-px bg-outline-variant/30" />

            {/* Section: Akun */}
            <div className="px-3 pt-1 pb-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant/60">
                Akun Saya
              </span>
            </div>

            <MenuLink
              href="/student/settings"
              icon={Settings}
              label="Pengaturan"
              desc="Akun & preferensi"
              onClick={() => setOpen(false)}
            />

            <div className="my-1 h-px bg-outline-variant/30" />

            {/* Logout */}
            <div
              className="
                [&>button]:w-full
                [&>button]:justify-start
                [&>button]:px-3
                [&>button]:py-2.5
                [&>button]:rounded-xl
                [&>button]:text-rose-600
                [&>button]:hover:bg-rose-50
                [&>button]:text-left
                [&>button]:gap-3
              "
            >
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// MENU LINK
// ============================================

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