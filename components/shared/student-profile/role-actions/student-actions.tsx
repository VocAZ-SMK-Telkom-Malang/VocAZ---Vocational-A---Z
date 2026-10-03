// components/shared/student-profile/role-actions/student-actions.tsx
'use client'

import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { FollowButton } from '@/components/student/profile/follow-button'
import { MessageButton } from '@/components/shared/messages'
import type { StudentProfileDetail } from '@/lib/queries/student-profile-detail'

type Props = {
  profile: StudentProfileDetail
  initialFollowing: boolean
}

export function StudentActions({ profile, initialFollowing }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: profile.fullName, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  return (
    <div className="flex items-center gap-2">
      <MessageButton
        userId={profile.userId}
        variant="outline"
        size="lg"
        label="Pesan"
      />

      <FollowButton
        studentProfileId={profile.id}
        initialFollowing={initialFollowing}
        initialFollowerCount={profile.followerCount}
      />

      <button
        type="button"
        onClick={handleShare}
        className="p-3 rounded-xl bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors"
        aria-label="Bagikan"
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-600" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}