// components/company/saved/saved-header.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Bookmark, Star, BadgeCheck, TrendingUp } from 'lucide-react'

type Props = {
  stats: {
    total: number
    openToWork: number
    verified: number
    thisWeek: number
  }
}

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    })
    return controls.stop
  }, [value, count])

  useEffect(() => {
    return rounded.on('change', (latest) => setDisplay(latest))
  }, [rounded])

  return <>{display.toLocaleString('id-ID')}</>
}

export function SavedHeader({ stats }: Props) {
  const statItems = [
    { label: 'Total Tersimpan', value: stats.total, icon: Bookmark },
    { label: 'Open to Work', value: stats.openToWork, icon: Star },
    { label: 'Verified', value: stats.verified, icon: BadgeCheck },
    { label: 'Minggu Ini', value: stats.thisWeek, icon: TrendingUp },
  ]

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FDFBF7] via-[#FFF8F5] to-[#FFEFEA] border border-primary/10 shadow-[0_8px_40px_-12px_rgba(183,0,17,0.15)]">
      <div className="absolute -top-32 -right-20 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-20 w-[350px] h-[350px] rounded-full bg-tertiary/8 blur-[100px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #b70011 1px, transparent 1px), linear-gradient(to bottom, #b70011 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 p-6 md:p-10 lg:p-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
          <Bookmark className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-primary">
            Talent Pool
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-[52px] font-black tracking-[-0.03em] leading-[1.05] text-on-surface max-w-3xl">
          Kandidat{' '}
          <span className="bg-gradient-to-r from-primary via-primary-container to-tertiary bg-clip-text text-transparent">
            Favorit Kamu.
          </span>
        </h1>

        <p className="text-base md:text-lg text-on-surface-variant mt-4 max-w-2xl leading-relaxed">
          Kandidat yang kamu simpan dari Smart Talent Match, Video Showcase,
          atau halaman pelamar — semua di satu tempat.
        </p>

        <div className="mt-8">
          <div className="inline-flex items-stretch divide-x divide-primary/10 rounded-2xl bg-white/60 backdrop-blur-md border border-primary/10 overflow-hidden shadow-[0_4px_20px_-8px_rgba(183,0,17,0.15)]">
            {statItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="group flex flex-col items-start gap-1 px-6 py-4 min-w-[130px] hover:bg-primary/[0.03] transition-colors"
                >
                  <Icon className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                  <span className="text-3xl font-black text-on-surface tracking-tight leading-none mt-1.5">
                    <AnimatedNumber value={item.value} />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/60 font-bold mt-1">
                    {item.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}