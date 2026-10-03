// components/company/team/team-header.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Users, Mail, Shield, UserCheck } from 'lucide-react'

type Props = {
  stats: {
    totalMembers: number
    pendingInvites: number
    admins: number
    recruiters: number
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

export function TeamHeader({ stats }: Props) {
  const statItems = [
    { label: 'Total Anggota', value: stats.totalMembers, icon: Users },
    { label: 'Pending Undangan', value: stats.pendingInvites, icon: Mail },
    { label: 'Admin', value: stats.admins, icon: Shield },
    { label: 'Recruiter', value: stats.recruiters, icon: UserCheck },
  ]

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FDFBF7] via-[#FFF8F5] to-[#FFEFEA] border border-primary/10 shadow-[0_8px_40px_-12px_rgba(183,0,17,0.15)]">
      <div className="absolute -top-32 -right-20 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #b70011 1px, transparent 1px), linear-gradient(to bottom, #b70011 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 p-6 md:p-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-primary">
            Team & Access
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-[-0.03em] leading-[1.05] text-on-surface max-w-3xl">
          Kelola Tim &{' '}
          <span className="bg-gradient-to-r from-primary via-primary-container to-tertiary bg-clip-text text-transparent">
            Akses Perusahaan.
          </span>
        </h1>

        <p className="text-sm md:text-base text-on-surface-variant mt-4 max-w-2xl leading-relaxed">
          Atur siapa saja yang bisa mengakses dashboard perusahaan, mengelola
          lowongan, dan melihat pelamar.
        </p>

        <div className="mt-6">
          <div className="inline-flex items-stretch divide-x divide-primary/10 rounded-2xl bg-white/60 backdrop-blur-md border border-primary/10 overflow-hidden shadow-[0_4px_20px_-8px_rgba(183,0,17,0.15)]">
            {statItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="group flex flex-col items-start gap-1 px-5 md:px-7 py-4 min-w-[120px] md:min-w-[140px] hover:bg-primary/[0.03] transition-colors"
                >
                  <Icon className="w-4 h-4 text-primary/40 group-hover:text-primary transition-colors" />
                  <span className="text-2xl md:text-3xl font-black text-on-surface tracking-tight leading-none mt-1.5">
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