// components/company/talent/talent-discovery-header.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  Users,
  Star,
  Award,
  Briefcase,
  TrendingUp,
} from 'lucide-react'

type Props = {
  stats: {
    totalTalents: number
    openToWork: number
    withCertificates: number
    activeJobs: number
  }
}

// ============================================
// VARIASI A — Animated Counter
// ============================================

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
    })

    return controls.stop
  }, [value, count])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      setDisplay(latest)
    })
    return unsubscribe
  }, [rounded])

  return <>{display.toLocaleString('id-ID')}</>
}

// ============================================
// VARIASI B — Live Ticker
// ============================================

function LiveTicker() {
  const [tickerText, setTickerText] = useState('12 kandidat baru minggu ini')

  useEffect(() => {
    const messages = [
      '12 kandidat baru minggu ini',
      '5 lowongan baru dipost',
      '23 kandidat di-shortlist',
      '8 kandidat diterima bulan ini',
    ]
    let idx = 0

    const interval = setInterval(() => {
      idx = (idx + 1) % messages.length
      setTickerText(messages[idx])
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.span
      key={tickerText}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-primary"
    >
      {tickerText}
    </motion.span>
  )
}

// ============================================
// VARIASI C — Sparkle Effect (particles)
// ============================================

function Sparkles_Background() {
  const particles = Array.from({ length: 20 })

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const size = Math.random() * 3 + 1
        const initialX = Math.random() * 100
        const initialY = Math.random() * 100
        const duration = Math.random() * 8 + 8
        const delay = Math.random() * 5

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/40"
            style={{
              width: size,
              height: size,
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
              y: [0, -30, -60],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )
      })}
    </div>
  )
}

// ============================================
// VARIASI D — SVG Illustration (abstract talent)
// ============================================

function HeroIllustration() {
  return (
    <div className="relative w-full h-full min-h-[280px] flex items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-w-[400px]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer ring */}
        <motion.circle
          cx="200"
          cy="200"
          r="160"
          stroke="url(#gradient1)"
          strokeWidth="1.5"
          strokeDasharray="8 12"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 200px' }}
        />

        <motion.circle
          cx="200"
          cy="200"
          r="130"
          stroke="url(#gradient2)"
          strokeWidth="1"
          strokeDasharray="4 8"
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 200px' }}
        />

        {/* Center badge */}
        <circle cx="200" cy="200" r="70" fill="url(#gradient3)" opacity="0.1" />
        <circle
          cx="200"
          cy="200"
          r="70"
          stroke="url(#gradient1)"
          strokeWidth="2"
        />

        {/* Icon inside — abstract person */}
        <motion.g
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <circle cx="200" cy="175" r="20" fill="url(#gradient4)" />
          <path
            d="M 165 245 Q 165 215 200 215 Q 235 215 235 245"
            stroke="url(#gradient4)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Orbiting dots */}
        <motion.g
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 200px' }}
        >
          <circle cx="200" cy="40" r="6" fill="url(#gradient5)" />
          <circle cx="360" cy="200" r="4" fill="url(#gradient5)" opacity="0.7" />
          <circle cx="200" cy="360" r="5" fill="url(#gradient5)" opacity="0.5" />
          <circle cx="40" cy="200" r="4" fill="url(#gradient5)" opacity="0.7" />
        </motion.g>

        {/* Decorative cross/plus */}
        <motion.g
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <line
            x1="80"
            y1="80"
            x2="100"
            y2="80"
            stroke="url(#gradient1)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="90"
            y1="70"
            x2="90"
            y2="90"
            stroke="url(#gradient1)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        <motion.g
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <line
            x1="310"
            y1="320"
            x2="330"
            y2="320"
            stroke="url(#gradient2)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="320"
            y1="310"
            x2="320"
            y2="330"
            stroke="url(#gradient2)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b70011" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ad5d00" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b70011" />
            <stop offset="100%" stopColor="#ad5d00" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b70011" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#ad5d00" />
          </linearGradient>
          <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#ad5d00" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating stat badges around illustration */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute top-8 left-0 px-3 py-1.5 rounded-xl bg-white shadow-lg border border-primary/10"
      >
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3 text-emerald-500" />
          <span className="font-mono text-[10px] font-bold text-on-surface">
            +24% Bulan Ini
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute bottom-8 right-0 px-3 py-1.5 rounded-xl bg-white shadow-lg border border-primary/10"
      >
        <div className="flex items-center gap-1.5">
          <Award className="w-3 h-3 text-primary" />
          <span className="font-mono text-[10px] font-bold text-on-surface">
            100% BNSP
          </span>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================
// MAIN HEADER
// ============================================

export function TalentDiscoveryHeader({ stats }: Props) {
  const statItems = [
    { label: 'Total Talenta', value: stats.totalTalents, icon: Users },
    { label: 'Open to Work', value: stats.openToWork, icon: Star },
    { label: 'BNSP Verified', value: stats.withCertificates, icon: Award },
    { label: 'Lowongan Aktif', value: stats.activeJobs, icon: Briefcase },
  ]

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FDFBF7] via-[#FFF8F5] to-[#FFEFEA] border border-primary/10 shadow-[0_8px_40px_-12px_rgba(183,0,17,0.15)]">
      {/* Sparkle background (Variasi C) */}
      <Sparkles_Background />

      {/* Ambient glow */}
      <div className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-tertiary/8 blur-[100px] pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #b70011 1px, transparent 1px), linear-gradient(to bottom, #b70011 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-10 lg:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* ============================================ */}
          {/* LEFT — Text Content */}
          {/* ============================================ */}
          <div className="lg:col-span-7">
            {/* Eyebrow + Live Ticker (Variasi B) */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-primary">
                  Smart Talent Match
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-primary/15 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <LiveTicker />
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black tracking-[-0.03em] leading-[1.02] text-on-surface">
              Temukan Talenta Terbaik.
            </h1>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black tracking-[-0.03em] leading-[1.02] mt-1.5">
              <span className="bg-gradient-to-r from-primary via-primary-container to-tertiary bg-clip-text text-transparent">
                Bukan Sekadar Nama.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-on-surface-variant mt-5 max-w-xl leading-relaxed">
              Sistem cerdas yang mencocokkan profil kandidat dengan lowongan kamu.
              Match score 0-100% berdasarkan skill, pengalaman, sertifikat, dan lokasi.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                href="/company/jobs/new"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-[0_8px_24px_-4px_rgba(183,0,17,0.4)] hover:shadow-[0_12px_32px_-4px_rgba(183,0,17,0.5)] hover:scale-[1.02] transition-all"
              >
                Posting Lowongan Baru
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <span className="text-xs text-on-surface-variant/70 font-mono">
                atau pilih lowongan di bawah untuk mulai
              </span>
            </div>

            {/* ============================================ */}
            {/* Stats — dalam 1 container */}
            {/* ============================================ */}
            <div className="mt-10">
              <div className="inline-flex items-stretch divide-x divide-primary/10 rounded-2xl bg-white/60 backdrop-blur-md border border-primary/10 overflow-hidden shadow-[0_4px_20px_-8px_rgba(183,0,17,0.15)]">
                {statItems.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={idx}
                      className="group relative flex flex-col items-start gap-1 px-5 md:px-7 py-4 min-w-[120px] md:min-w-[140px] hover:bg-primary/[0.03] transition-colors"
                    >
                      <Icon className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />

                      <span className="text-3xl font-black text-on-surface tracking-tight leading-none mt-2">
                        <AnimatedNumber value={item.value} />
                      </span>

                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/60 font-bold mt-1">
                        {item.label}
                      </span>

                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* RIGHT — Illustration (Variasi D) */}
          {/* ============================================ */}
          <div className="lg:col-span-5 hidden lg:block">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}