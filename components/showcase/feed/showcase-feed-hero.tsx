// components/showcase/feed/showcase-feed-hero.tsx
'use client'

import { Search, X, SlidersHorizontal, Sparkles, Video, Users, Heart } from 'lucide-react'
import { useState } from 'react'

type Props = {
  search: string
  onSearchChange: (v: string) => void
  totalVideos: number
  totalCreators: number
  totalLikes: number
  onFilterClick: () => void
  activeFilterCount: number
}

export function ShowcaseFeedHero({
  search,
  onSearchChange,
  totalVideos,
  totalCreators,
  totalLikes,
  onFilterClick,
  activeFilterCount,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-surface-container-lowest to-surface-container-lowest border border-outline-variant/30 p-6 sm:p-8">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3 h-3" />
          Showcase
        </div>

        {/* Title */}
        <div className="max-w-2xl mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight leading-tight">
            Jelajahi Video Showcase
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            Tonton demonstrasi skill talenta SMK terverifikasi. Like, komen, dan
            follow creator favorit kamu.
          </p>
        </div>

        {/* Search bar canggih */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-sm">
            <Search className="w-5 h-5 text-on-surface-variant shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari video, creator, atau skill tag..."
              className="flex-1 bg-transparent border-0 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
                aria-label="Clear"
              >
                <X className="w-4 h-4" />
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
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {activeFilterCount > 0 && (
              <span className="ml-0.5 min-w-[20px] h-5 px-1.5 rounded-full bg-white/25 text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <StatChip
            icon={<Video className="w-4 h-4" />}
            label="Video"
            value={totalVideos}
            accent="bg-primary/10 text-primary"
          />
          <StatChip
            icon={<Users className="w-4 h-4" />}
            label="Creator"
            value={totalCreators}
            accent="bg-indigo-100 text-indigo-700"
          />
          <StatChip
            icon={<Heart className="w-4 h-4 fill-current" />}
            label="Likes"
            value={totalLikes}
            accent="bg-rose-100 text-rose-700"
          />
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