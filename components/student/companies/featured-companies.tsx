// components/student/companies/featured-companies.tsx
'use client'

import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { BadgeCheck, Building2, Briefcase, Sparkles, Pause, Play } from 'lucide-react'
import type { Company } from './types'

type Props = {
  companies: Company[]
}

export function FeaturedCompanies({ companies }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Duplicate 3x biar seamless
  const loop = [...companies, ...companies, ...companies]

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let rafId: number
    const SCROLL_SPEED = 0.8

    function animate() {
      if (!isPaused && el) {
        el.scrollLeft += SCROLL_SPEED
        const oneThird = el.scrollWidth / 3
        if (el.scrollLeft >= oneThird) {
          el.scrollLeft -= oneThird
        }
      }
      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [isPaused])

  if (!companies || companies.length === 0) return null

  const verifiedCount = companies.filter((c) => c.verified).length
  const totalJobs = companies.reduce((sum, c) => sum + c.activeJobs, 0)

  return (
    <section className="space-y-4">
      {/* ============================================ */}
      {/* HEADER — MERGED, GA ADA DUPLIKAT              */}
      {/* ============================================ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50/60 via-surface-container-lowest to-surface-container-lowest border border-outline-variant/30 p-5 sm:p-6">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* LEFT: Badge + Title + Subtitle */}
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <Building2 className="w-5 h-5" />
              </div>
              {/* Live ping dot */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-surface-container-lowest" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider mb-1.5">
                <Sparkles className="w-2.5 h-2.5" />
                Mitra Industri
              </div>
              <h2 className="text-lg sm:text-xl font-black text-on-surface leading-tight tracking-tight">
                Perusahaan Mitra VocAZ
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {companies.length} perusahaan terdaftar
              </p>
            </div>
          </div>

          {/* RIGHT: Stats + Play/Pause toggle */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Verified stat */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <BadgeCheck className="w-4 h-4" />
              </div>
              <div className="leading-none">
                <p className="text-base font-black text-on-surface">
                  {verifiedCount}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant mt-0.5">
                  Verified
                </p>
              </div>
            </div>

            {/* Total jobs stat */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="leading-none">
                <p className="text-base font-black text-on-surface">
                  {totalJobs}
                </p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant mt-0.5">
                  Lowongan
                </p>
              </div>
            </div>

            {/* Play/Pause toggle */}
            <button
              type="button"
              onClick={() => setIsPaused((v) => !v)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                isPaused
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20'
                  : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
              }`}
              aria-label={isPaused ? 'Play scroll' : 'Pause scroll'}
              title={isPaused ? 'Play scroll' : 'Pause scroll'}
            >
              {isPaused ? (
                <Play className="w-4 h-4 fill-current" />
              ) : (
                <Pause className="w-4 h-4 fill-current" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MARQUEE                                       */}
      {/* ============================================ */}
      <div
        className="relative overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Edge fade kiri */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent z-10" />
        {/* Edge fade kanan */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-surface-container-lowest via-surface-container-lowest/80 to-transparent z-10" />

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-3 py-4 px-4 overflow-x-scroll"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {loop.map((c, idx) => {
            const initials = c.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)

            return (
              <Link
                key={`${c.id}-${idx}`}
                href={`/student/companies/${c.slug}`}
                className="group/card relative flex items-center gap-3 px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all shrink-0 w-[260px]"
                title={c.name}
                draggable={false}
              >
                {/* Logo */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm"
                  style={{ backgroundColor: c.logoColor }}
                >
                  {initials}
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-on-surface truncate group-hover/card:text-primary transition-colors">
                      {c.name}
                    </p>
                    {c.verified && (
                      <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-on-surface-variant truncate mt-0.5">
                    {c.industry}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-primary">
                      {c.activeJobs} lowongan
                    </span>
                    <span className="w-0.5 h-0.5 rounded-full bg-on-surface-variant/30" />
                    <span className="text-[9px] font-medium text-on-surface-variant truncate">
                      {c.location}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Hint */}
      <p className="text-center text-[10px] text-on-surface-variant/60 font-medium">
        Hover untuk pause · Klik untuk lihat profil perusahaan
      </p>
    </section>
  )
}