// components/shared/student-profile/role-actions/recruiter-actions.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  Bookmark,
  Star,
  Download,
  Mail,
} from 'lucide-react'
import type { StudentProfileDetail } from '@/lib/queries/student-profile-detail'

type Props = {
  profile: StudentProfileDetail
  applicationContext?: {
    applicationId: string
    jobId: string
    jobTitle: string
    status: string
    appliedAt: string
    coverLetter: string | null
    resumeUrl: string | null
    matchScore: number | null
  }
}

export function RecruiterActions({ profile, applicationContext }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleContact() {
    setLoading('contact')
    router.push(
      `/company/messages?to=${profile.userId}&context=talent_profile&contextId=${profile.id}`
    )
  }

  async function handleShortlist() {
    if (!applicationContext) {
      alert('Shortlist hanya tersedia untuk pelamar')
      return
    }
    setLoading('shortlist')
    // Call server action
    // ...
    setLoading(null)
  }

  async function handleDownloadCV() {
    if (!applicationContext?.resumeUrl) {
      alert('Pelamar belum upload CV')
      return
    }
    window.open(applicationContext.resumeUrl, '_blank')
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={handleContact}
        disabled={loading === 'contact'}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-container transition-colors disabled:opacity-50"
      >
        <MessageSquare className="w-4 h-4" />
        Kontak
      </button>

      {applicationContext && (
        <>
          <button
            type="button"
            onClick={handleShortlist}
            disabled={loading === 'shortlist'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high transition-colors disabled:opacity-50"
          >
            <Star className="w-4 h-4" />
            Shortlist
          </button>

          {applicationContext.resumeUrl && (
            <button
              type="button"
              onClick={handleDownloadCV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high transition-colors"
            >
              <Download className="w-4 h-4" />
              CV
            </button>
          )}
        </>
      )}
    </div>
  )
}