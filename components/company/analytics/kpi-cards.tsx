// components/company/analytics/kpi-cards.tsx
'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  Briefcase,
  Users,
  Award,
  Clock,
  TrendingUp,
} from 'lucide-react'
import type { AnalyticsKPIs } from '@/lib/queries/company-analytics'

type Props = {
  kpis: AnalyticsKPIs
}

function AnimatedNumber({
  value,
  decimals = 0,
  suffix = '',
}: {
  value: number
  decimals?: number
  suffix?: string
}) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals))
  const [display, setDisplay] = useState('0')

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

  return (
    <>
      {Number(display).toLocaleString('id-ID')}
      {suffix}
    </>
  )
}

export function KPICards({ kpis }: Props) {
  const cards = [
    {
      icon: Briefcase,
      label: 'Total Lowongan',
      value: kpis.totalJobs,
      color: 'bg-primary/10 text-primary',
      suffix: '',
      decimals: 0,
    },
    {
      icon: Users,
      label: 'Total Pelamar',
      value: kpis.totalApplications,
      color: 'bg-tertiary/10 text-tertiary',
      suffix: '',
      decimals: 0,
    },
    {
      icon: Award,
      label: 'Total Diterima',
      value: kpis.totalHired,
      color: 'bg-emerald-500/10 text-emerald-600',
      suffix: '',
      decimals: 0,
    },
    {
      icon: Clock,
      label: 'Avg Time to Hire',
      value: kpis.avgTimeToHire,
      color: 'bg-blue-500/10 text-blue-600',
      suffix: ' hari',
      decimals: 0,
    },
    {
      icon: TrendingUp,
      label: 'Conversion Rate',
      value: kpis.conversionRate,
      color: 'bg-purple-500/10 text-purple-600',
      suffix: '%',
      decimals: 1,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5 hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg ${c.color} flex items-center justify-center`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="font-display text-3xl font-black text-on-surface tracking-tight leading-none">
              <AnimatedNumber
                value={c.value}
                decimals={c.decimals}
                suffix={c.suffix}
              />
            </div>
            <div className="text-xs text-on-surface-variant mt-2 font-semibold">
              {c.label}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}