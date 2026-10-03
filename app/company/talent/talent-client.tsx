'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TalentDiscoveryHeader } from '@/components/company/talent/talent-discovery-header'
import { TalentFilters } from '@/components/company/talent/talent-filters'
import { TalentGrid } from '@/components/company/talent/talent-grid'
import { InviteToApplyModal } from '@/components/company/talent/invite-to-apply-modal'
import { contactTalentAction } from '@/app/company/talent/actions'
import type { TalentCard, TalentFilterOptions } from '@/lib/queries/company-talent'

type Props = {
  talents: TalentCard[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
  stats: {
    totalTalents: number
    openToWork: number
    withCertificates: number
    activeJobs: number
  }
  filterOptions: TalentFilterOptions
  initialFilters: {
    search: string
    jobId: string
    minScore: number
    city: string
    skill: string
    openToWorkOnly: boolean
    sortBy: string
  }
}

export function CompanyTalentClient({
  talents,
  pagination,
  stats,
  filterOptions,
  initialFilters,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [inviteTalent, setInviteTalent] = useState<TalentCard | null>(null)
  const [contactingId, setContactingId] = useState<string | null>(null)

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/company/talent?${params.toString()}`)
  }

  function handleReset() {
    router.push('/company/talent')
  }

  function handleInvite(talent: TalentCard) {
    if (!initialFilters.jobId) {
      alert('Pilih lowongan dulu untuk menghitung match score')
      return
    }
    setInviteTalent(talent)
  }

  async function handleContact(talent: TalentCard) {
    setContactingId(talent.id)
    try {
      const res = await contactTalentAction({
        studentUserId: talent.userId,
        contextType: 'talent_profile',
      })
      if (res.ok && res.conversationId) {
        router.push(`/company/messages?c=${res.conversationId}`)
      } else {
        alert(res.error ?? 'Gagal buka chat')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan')
    } finally {
      setContactingId(null)
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      <TalentDiscoveryHeader stats={stats} />

      <TalentFilters
        filterOptions={filterOptions}
        initialFilters={initialFilters}
      />

      <TalentGrid
        talents={talents}
        pagination={pagination}
        hasJobSelected={!!initialFilters.jobId}
        onPageChange={handlePageChange}
        onReset={handleReset}
        onInvite={handleInvite}
        onContact={handleContact}
      />

      {inviteTalent && (
        <InviteToApplyModal
          open={!!inviteTalent}
          onClose={() => setInviteTalent(null)}
          studentId={inviteTalent.id}
          studentName={inviteTalent.fullName}
          jobs={filterOptions.jobs}
          defaultJobId={initialFilters.jobId}
        />
      )}
    </div>
  )
}