// app/company/showcase/showcase-client.tsx
'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShowcaseHeader } from '@/components/company/showcase/showcase-header'
import { ShowcaseFilters } from '@/components/company/showcase/showcase-filters'
import { ShowcaseGrid } from '@/components/company/showcase/showcase-grid'
import { ShowcaseModal } from '@/components/company/showcase/showcase-modal'
import { ShowcaseReels } from '@/components/company/showcase/showcase-reels'
import { InviteToApplyModal } from '@/components/company/talent/invite-to-apply-modal'
import { contactShowcaseTalentAction } from './actions'
import type {
  ShowcaseVideoItem,
  ShowcaseFilterOptions,
  ShowcaseStats,
} from '@/lib/queries/company-showcase'

type ViewMode = 'grid' | 'reels'

type Props = {
  videos: ShowcaseVideoItem[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
  stats: ShowcaseStats
  filterOptions: ShowcaseFilterOptions
  initialFilters: {
    search: string
    jobId: string
    minScore: number
    category: string
    durationFilter: string
    sortBy: string
  }
}

export function CompanyShowcaseClient({
  videos,
  pagination,
  stats,
  filterOptions,
  initialFilters,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [modalVideo, setModalVideo] = useState<ShowcaseVideoItem | null>(null)
  const [inviteVideo, setInviteVideo] = useState<ShowcaseVideoItem | null>(null)

  function handlePlay(video: ShowcaseVideoItem) {
    setModalVideo(video)
  }

  function handleSave(video: ShowcaseVideoItem) {
    console.log('Save:', video.id)
  }

  async function handleContact(video: ShowcaseVideoItem) {
    try {
      const res = await contactShowcaseTalentAction({
        studentUserId: video.student.userId,
      })
      if (res.ok && res.conversationId) {
        router.push(`/company/messages?c=${res.conversationId}`)
      } else {
        alert(res.error ?? 'Gagal buka chat')
      }
    } catch (err) {
      console.error('[Contact] Error:', err)
      alert('Terjadi kesalahan')
    }
  }

  function handleInvite(video: ShowcaseVideoItem) {
    if (!initialFilters.jobId) {
      alert('Pilih lowongan dulu untuk invite')
      return
    }
    setInviteVideo(video)
  }

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/company/showcase?${params.toString()}`)
  }

  function handleReset() {
    router.push('/company/showcase')
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <ShowcaseHeader stats={stats} />

      <ShowcaseFilters
        filterOptions={filterOptions}
        initialFilters={initialFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'grid' && (
        <ShowcaseGrid
          videos={videos}
          pagination={pagination}
          onPageChange={handlePageChange}
          onReset={handleReset}
          onPlay={handlePlay}
          onSave={handleSave}
          onContact={handleContact}
          onInvite={handleInvite}
        />
      )}

      {viewMode === 'reels' && (
        <ShowcaseReels
          videos={videos}
          onSave={handleSave}
          onContact={handleContact}
          onInvite={handleInvite}
        />
      )}

      {modalVideo && (
        <ShowcaseModal
          video={modalVideo}
          onClose={() => setModalVideo(null)}
          onSave={handleSave}
          onContact={handleContact}
          onInvite={handleInvite}
        />
      )}

      {inviteVideo && (
        <InviteToApplyModal
          open={!!inviteVideo}
          onClose={() => setInviteVideo(null)}
          studentId={inviteVideo.student.id}
          studentName={inviteVideo.student.fullName}
          jobs={filterOptions.jobs}
          defaultJobId={initialFilters.jobId}
        />
      )}
    </div>
  )
}