// app/showcase/showcase-client.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LandingHeader } from '@/components/landing/header'
import { LandingFooter } from '@/components/landing/footer'
import { ShowcaseHero } from '@/components/showcase/public/showcase-hero'
import { ShowcaseStage } from '@/components/showcase/public/showcase-stage'
import { ShowcaseCtaStrip } from '@/components/showcase/public/showcase-cta-strip'
import { ShowcaseFullscreenModal } from '@/components/showcase/public/showcase-fullscreen-modal'
import type { PublicShowcaseReel } from '@/lib/showcase-public'

type Props = {
  reels: PublicShowcaseReel[]
  stats: {
    totalReels: number
    totalStudents: number
    totalSchools: number
  }
  publicStats: {
    totalVideos: number
    totalStudents: number
    totalViews: number
  }
  categories: string[]
  initialFilters: {
    search: string
    category: string
    sort: string
  }
}

export function ShowcaseClient({
  reels,
  stats,
  publicStats,
  categories,
  initialFilters,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [fullscreenReel, setFullscreenReel] =
    useState<PublicShowcaseReel | null>(null)

  function updateURL(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    startTransition(() => {
      router.push(`/showcase?${params.toString()}`)
      router.refresh()
    })
  }

  return (
    <>
      <LandingHeader />

      <main className="w-full min-h-screen pt-24 bg-gradient-to-b from-[#FDFBF7] via-[#FFF8F5] to-[#FAF8F5]">
        <ShowcaseHero
          categories={categories}
          stats={publicStats}
          initialFilters={initialFilters}
          onSearch={(q) => updateURL({ search: q || undefined })}
          onCategoryChange={(cat) =>
            updateURL({ category: cat === 'all' ? undefined : cat })
          }
        />

        {reels.length > 0 ? (
          <ShowcaseStage reels={reels} onOpenFullscreen={setFullscreenReel} />
        ) : (
          <section className="w-full px-4 py-16">
            <div className="max-w-md mx-auto text-center">
              <p className="text-on-surface-variant mb-4">
                Tidak ada video yang cocok dengan pencarian kamu.
              </p>
              <button
                onClick={() => router.push('/showcase')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-surface font-display font-semibold shadow-md hover:bg-primary-container transition"
              >
                Reset Filter
              </button>
            </div>
          </section>
        )}

        <ShowcaseCtaStrip totalReels={stats.totalReels} />
      </main>

      <LandingFooter />

      {fullscreenReel && (
        <ShowcaseFullscreenModal
          initialReel={fullscreenReel}
          allReels={reels}
          onClose={() => setFullscreenReel(null)}
        />
      )}
    </>
  )
}