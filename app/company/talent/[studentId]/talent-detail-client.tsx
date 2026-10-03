// app/company/talent/[studentId]/talent-detail-client.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Send, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react'
import { StudentProfileView } from '@/components/shared/student-profile/student-profile-view'
import { InviteToApplyModal } from '@/components/company/talent/invite-to-apply-modal'
import { contactTalentAction } from '@/app/company/talent/actions'
import { useRouter } from 'next/navigation'
import type {
  StudentProfileDetail,
  ViewerContext,
} from '@/lib/queries/student-profile-detail'

type Job = {
  id: string
  title: string
}

type Props = {
  profile: StudentProfileDetail
  viewer: ViewerContext
  jobs: Job[]
  hasBeenInvited: boolean
  hasApplied: boolean
  applicationJobTitle?: string
  invitedJobTitle?: string
}

export function TalentDetailClient({
  profile,
  viewer,
  jobs,
  hasBeenInvited,
  hasApplied,
  applicationJobTitle,
  invitedJobTitle,
}: Props) {
  const router = useRouter()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [contacting, setContacting] = useState(false)

  async function handleContact() {
    setContacting(true)
    try {
      const res = await contactTalentAction({
        studentUserId: profile.userId,
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
      setContacting(false)
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
      {/* Back */}
      <Link
        href="/company/talent"
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar talenta
      </Link>

      {/* Status banners */}
      {hasApplied && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-bold text-emerald-900">
              Kandidat sudah melamar ke lowongan kamu
            </div>
            {applicationJobTitle && (
              <div className="text-xs text-emerald-700">
                {applicationJobTitle}
              </div>
            )}
          </div>
        </div>
      )}

      {hasBeenInvited && !hasApplied && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <Send className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-bold text-amber-900">
              Kamu sudah mengundang kandidat ini
            </div>
            {invitedJobTitle && (
              <div className="text-xs text-amber-700">
                Untuk lowongan: {invitedJobTitle}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {!hasApplied && !hasBeenInvited && (
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-[0_4px_16px_rgba(183,0,17,0.20)] hover:bg-primary-container transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            Undang Melamar
          </button>
        )}

        <button
          type="button"
          onClick={handleContact}
          disabled={contacting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface font-bold text-sm hover:bg-surface-container disabled:opacity-50 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          {contacting ? 'Membuka...' : 'Kirim Pesan'}
        </button>
      </div>

      {/* Profile view */}
      <StudentProfileView profile={profile} viewer={viewer} />

      {/* Invite Modal */}
      <InviteToApplyModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        studentId={profile.id}
        studentName={profile.fullName}
        jobs={jobs}
      />
    </div>
  )
}