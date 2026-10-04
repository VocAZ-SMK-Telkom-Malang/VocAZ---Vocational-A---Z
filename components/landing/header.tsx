'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User as UserIcon,
  ArrowRight,
} from 'lucide-react'
import { authClient } from '@/lib/auth/client'

const NAV_LINKS = [
  { label: 'Beranda', href: '/' },
  { label: 'Talenta SMK', href: '/talenta' },
  { label: 'Video Talent Showcase', href: '/showcase' },
  { label: 'Lowongan', href: '/lowongan' },
  { label: 'Perusahaan', href: '/perusahaan' },
]

type Props = {
  user?: {
    fullName: string | null
    email: string
    role: 'student' | 'company' | 'school' | 'certification' | 'admin'
  } | null
}

export function LandingHeader({ user }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!userMenuOpen) return
    function close() {
      setUserMenuOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [userMenuOpen])

  async function handleLogout() {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const dashboardHref = user
    ? user.role === 'admin'
      ? '/admin/dashboard'
      : `/${user.role}/dashboard`
    : '/'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-300 ${
          scrolled ? 'pt-2' : 'pt-4'
        } px-4 sm:px-6 lg:px-8 pointer-events-none`}
      >
        <div
          className={`pointer-events-auto h-16 sm:h-[72px] w-full max-w-[1240px] bg-white/95 backdrop-blur-xl rounded-full px-3 sm:px-4 flex items-center justify-between gap-3 ring-1 transition-all duration-300 ${
            scrolled
              ? 'ring-outline-variant/40 shadow-[0_16px_40px_-12px_rgba(183,0,17,0.15)]'
              : 'ring-outline-variant/20 shadow-[0_12px_32px_-8px_rgba(183,0,17,0.08)]'
          }`}
        >
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-1.5 shrink-0 pl-2 sm:pl-3"
          >
            <Image
              src="/vocaz.png"
              alt="VocAZ"
              width={120}
              height={32}
              className="h-8 sm:h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden xl:flex items-center gap-0.5 whitespace-nowrap">
            {NAV_LINKS.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3.5 py-1.5 rounded-full font-display text-sm font-semibold transition-all ${
                    active
                      ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden xl:flex items-center gap-2 shrink-0 pr-1">
            {user ? (
              <UserMenu
                user={user}
                open={userMenuOpen}
                onToggle={() => setUserMenuOpen(!userMenuOpen)}
                onLogout={handleLogout}
                dashboardHref={dashboardHref}
              />
            ) : (
              <>
                <Link
                  href="/auth/sign-in"
                  className="font-display text-sm font-semibold text-on-surface hover:text-primary px-3 py-2 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/join"
                  className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold pl-4 pr-3.5 py-2 rounded-full shadow-[0_4px_16px_rgba(183,0,17,0.25)] hover:bg-surface-tint hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="whitespace-nowrap">Join VocAZ</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/auth/sign-in"
                  aria-label="Masuk"
                  className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-surface-tint transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-white" />
                </Link>
              </>
            )}
          </div>

          {/* MOBILE ACTIONS */}
          <div className="flex xl:hidden items-center gap-2 shrink-0 pr-1">
            {user ? (
              <Link
                href={dashboardHref}
                aria-label="Dashboard"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"
              >
                <span className="text-white font-bold text-xs">
                  {(user.fullName || user.email)[0].toUpperCase()}
                </span>
              </Link>
            ) : (
              <Link
                href="/auth/sign-in"
                aria-label="Masuk"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"
              >
                <UserIcon className="w-3.5 h-3.5 text-white" />
              </Link>
            )}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-full hover:bg-surface-container transition-colors"
              aria-label="Buka menu"
            >
              <Menu className="w-5 h-5 text-on-surface" />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        onLogout={handleLogout}
        dashboardHref={dashboardHref}
      />
    </>
  )
}

// ============================================
// USER MENU (dropdown desktop)
// ============================================

function UserMenu({
  user,
  open,
  onToggle,
  onLogout,
  dashboardHref,
}: {
  user: NonNullable<Props['user']>
  open: boolean
  onToggle: () => void
  onLogout: () => void
  dashboardHref: string
}) {
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={onToggle}
        aria-label="Menu user"
        className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 hover:bg-surface-tint transition-colors relative"
      >
        <UserIcon className="w-4 h-4 text-white" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-outline-variant/30 py-1 overflow-hidden">
          <div className="px-3 py-2 border-b border-outline-variant/30">
            <p className="text-sm font-semibold text-on-surface truncate">
              {user.fullName || 'User'}
            </p>
            <p className="text-xs text-on-surface-variant truncate">
              {user.email}
            </p>
          </div>

          <Link
            href={dashboardHref}
            className="flex items-center gap-2 px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================
// MOBILE DRAWER
// ============================================

function MobileDrawer({
  open,
  onClose,
  user,
  onLogout,
  dashboardHref,
}: {
  open: boolean
  onClose: () => void
  user: Props['user']
  onLogout: () => void
  dashboardHref: string
}) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 xl:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 right-0 bottom-0 w-[280px] bg-white z-50 xl:hidden flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 px-4 border-b border-outline-variant/30 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5" onClick={onClose}>
            <Image
              src="/vocaz.png"
              alt="VocAZ"
              width={120}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-container transition-colors"
            aria-label="Tutup menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
              {(user.fullName || user.email)[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">
                {user.fullName || 'User'}
              </p>
              <p className="text-xs text-on-surface-variant truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant/30 space-y-3">
          {user ? (
            <>
              <Link
                href={dashboardHref}
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  onClose()
                  onLogout()
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-red-50 border border-red-200 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                onClick={onClose}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-full border border-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/join"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-[0_4px_16px_rgba(183,0,17,0.25)] hover:bg-surface-tint transition-all"
              >
                <span>Join VocAZ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  )
}