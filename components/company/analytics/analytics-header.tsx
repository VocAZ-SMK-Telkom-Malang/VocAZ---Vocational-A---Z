// components/company/analytics/analytics-header.tsx
'use client'

import { BarChart3, Calendar } from 'lucide-react'
import type { PeriodKey } from '@/lib/queries/company-analytics'

const PERIOD_OPTIONS: Array<{ value: PeriodKey; label: string }> = [
  { value: '7d', label: '7 Hari' },
  { value: '30d', label: '30 Hari' },
  { value: '90d', label: '90 Hari' },
  { value: 'all', label: 'Semua' },
]

type Props = {
  currentPeriod: PeriodKey
  onPeriodChange: (p: PeriodKey) => void
}

export function AnalyticsHeader({ currentPeriod, onPeriodChange }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FDFBF7] via-[#FFF8F5] to-[#FFEFEA] border border-primary/10 shadow-[0_8px_40px_-12px_rgba(183,0,17,0.15)]">
      <div className="absolute -top-32 -right-20 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <BarChart3 className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-primary">
                Analytics Dashboard
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-[48px] font-black tracking-[-0.03em] leading-[1.05] text-on-surface max-w-3xl">
              Performa{' '}
              <span className="bg-gradient-to-r from-primary via-primary-container to-tertiary bg-clip-text text-transparent">
                Recruitment Kamu.
              </span>
            </h1>

            <p className="text-sm md:text-base text-on-surface-variant mt-3 max-w-2xl leading-relaxed">
              Insight lengkap tentang lowongan, pelamar, conversion rate, dan
              efisiensi hiring perusahaan.
            </p>
          </div>

          {/* Period Selector */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white shadow-sm border border-primary/10 shrink-0">
            <Calendar className="w-4 h-4 text-primary ml-3" />
            {PERIOD_OPTIONS.map((p) => {
              const isActive = currentPeriod === p.value
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onPeriodChange(p.value)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {p.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}