// components/company/layout/company-user-menu.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogoutButton } from '@/components/shared/logout-button'
import {
  ChevronDown,
  User,
  Settings,
  Building2,
  ShieldCheck,
  LogOut,
  Users,
  CheckCircle2,
} from 'lucide-react'

type Props = {
  companyName: string
  companyLogo: string | null
  userName: string
  userAvatar: string | null
}

export function CompanyUserMenu({
  companyName,
  companyLogo,
  userName,
  userAvatar,
}: Props) {
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/sign-in')
      router.refresh()
    } catch (err) {
      console.error('Logout error:', err)
      setLoggingOut(false)
    }
  }

  const companyInitials = companyName
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
      {/* Trigger — tampil COMPANY */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-surface-container transition-colors"
      >
        {/* Company logo */}
        {companyLogo ? (
          <img
            src={companyLogo}
            alt={companyName}
            className="w-8 h-8 rounded-full object-cover shrink-0 border border-outline-variant/30"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
            <span className="text-xs font-black">{companyInitials}</span>
          </div>
        )}

        {/* Company name */}
        <div className="hidden md:flex flex-col items-start leading-tight max-w-[160px]">
          <span className="text-xs font-bold text-on-surface truncate w-full text-left">
            {companyName}
          </span>
          <span className="text-[10px] text-on-surface-variant truncate w-full text-left">
            Akun Perusahaan
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-on-surface-variant transition-transform shrink-0 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-2xl overflow-hidden z-50">
          {/* Header — company sebagai identitas utama */}
          <div className="p-4 bg-primary/5 border-b border-outline-variant/30">
            <div className="flex items-start gap-3">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-outline-variant/30"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                  <span className="text-sm font-black">{companyInitials}</span>
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-on-surface truncate">
                  {companyName}
                </div>

                {/* Sub: user yang login */}
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
            {/* Section: Company */}
            <div className="px-3 pt-2 pb-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant/60">
                Perusahaan
              </span>
            </div>

            <MenuLink
              href="/company/profile"
              icon={Building2}
              label="Profil Perusahaan"
              desc="Kelola info publik"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/company/team"
              icon={Users}
              label="Tim & Akses"
              desc="Kelola anggota tim"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/company/verification"
              icon={ShieldCheck}
              label="Verifikasi"
              desc="Status verified badge"
              onClick={() => setOpen(false)}
              badge={
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              }
            />

            <div className="my-1 h-px bg-outline-variant/30" />

            {/* Section: Personal */}
            <div className="px-3 pt-1 pb-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant/60">
                Akun Saya
              </span>
            </div>

            <MenuLink
              href="/company/settings"
              icon={User}
              label="Profil Saya"
              desc={userName}
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/company/settings"
              icon={Settings}
              label="Pengaturan"
              desc="Akun & preferensi"
              onClick={() => setOpen(false)}
            />

            <div className="my-1 h-px bg-outline-variant/30" />

            {/* Logout */}
            <LogoutButton />
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
  badge,
}: {
  href: string
  icon: any
  label: string
  desc?: string
  onClick?: () => void
  badge?: React.ReactNode
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
      {badge}
    </Link>
  )
}