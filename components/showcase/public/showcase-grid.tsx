// components/showcase/public/showcase-grid.tsx
'use client'

import { Grid3x3, SearchX, RotateCcw, Loader2 } from 'lucide-react'
import { ShowcaseCard } from './showcase-card'
import type { PublicShowcaseReel } from '@/lib/showcase-public'

type Props = {
  reels: PublicShowcaseReel[]
  loading?: boolean
  onPlay: (reel: PublicShowcaseReel) => void
  onReset?: () => void
}

export function ShowcaseGrid({ reels, loading, onPlay, onReset }: Props) {
  if (loading) {
    return (
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  if (reels.length === 0) {
    return (
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center">
            <SearchX className="w-10 h-10 text-on-surface-variant" />
          </div>
          <h3 className="font-display text-xl font-bold text-on-surface">
            Tidak ada video yang cocok
          </h3>
          <p className="text-sm text-on-surface-variant">
            Coba ubah filter atau kata kunci pencarian kamu.
          </p>
          {onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-display font-semibold shadow-md hover:bg-primary-container transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Filter
            </button>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Grid3x3 className="w-5 h-5 text-primary" />
          <h2 className="font-display text-lg font-bold text-on-surface">
            Explore Video Showcase
          </h2>
          <span className="font-mono text-[11px] text-on-surface-variant">
            · {reels.length} video
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reels.map((reel) => (
            <ShowcaseCard key={reel.id} reel={reel} onPlay={onPlay} />
          ))}
        </div>
      </div>
    </section>
  )
}