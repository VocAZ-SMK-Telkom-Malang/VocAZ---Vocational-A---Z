// components/student/talents/talent-hero.tsx
'use client'

import { Users, Compass, Sparkles, TrendingUp } from 'lucide-react'

type Props = {
  search: string
  onSearchChange: (v: string) => void
  onFilterClick: () => void
  activeFilterCount: number
  totalTalents: number
  openToWorkCount: number
  verifiedCount: number
}

export function TalentHero({
  search,
  onSearchChange,
  onFilterClick,
  activeFilterCount,
  totalTalents,
  openToWorkCount,
  verifiedCount,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50/60 via-surface-container-lowest to-surface-container-lowest border border-outline-variant/30 p-6 sm:p-8">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold uppercase tracking-wider mb-3">
          <Compass className="w-3 h-3" />
          Talent Network
        </div>

        {/* Title + stats */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight leading-tight">
              Jelajahi Talent
            </h1>
            <p className="text-sm text-on-surface-variant mt-2">
              Temukan talenta SMK terverifikasi. Lihat portfolio, skill, dan
              showcase video mereka.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <StatChip
              icon={<Users className="w-4 h-4" />}
              label="Talent"
              value={totalTalents}
              accent="bg-indigo-100 text-indigo-700"
            />
            <StatChip
              icon={<Sparkles className="w-4 h-4" />}
              label="Open to Work"
              value={openToWorkCount}
              accent="bg-emerald-100 text-emerald-700"
            />
            <StatChip
              icon={<TrendingUp className="w-4 h-4" />}
              label="Verified"
              value={verifiedCount}
              accent="bg-amber-100 text-amber-700"
            />
          </div>
        </div>

        {/* Search bar canggih */}
        <div className="flex items-center gap-2 mt-6">
          <div className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-sm">
            <svg
              className="w-5 h-5 text-on-surface-variant shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth="2" />
              <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama, skill, atau lokasi..."
              className="flex-1 bg-transparent border-0 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
                aria-label="Clear"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onFilterClick}
            className={`
              relative flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold
              transition-all shrink-0 shadow-sm
              ${
                activeFilterCount > 0
                  ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                  : 'bg-surface-container-lowest border border-outline-variant/30 text-on-surface hover:bg-surface-container hover:border-primary/40'
              }
            `}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="ml-0.5 min-w-[20px] h-5 px-1.5 rounded-full bg-white/25 text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function StatChip({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: number
  accent: string
}) {
  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest/80 backdrop-blur-sm ring-1 ring-outline-variant/30">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${accent}`}
      >
        {icon}
      </div>
      <div className="leading-none">
        <p className="text-base font-black text-on-surface">
          {value.toLocaleString('id-ID')}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-0.5">
          {label}
        </p>
      </div>
    </div>
  )
}