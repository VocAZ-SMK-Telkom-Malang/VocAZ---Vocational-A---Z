// components/shared/messages/chat-header.tsx
'use client'

import Link from 'next/link'
import { BadgeCheck, ExternalLink, ArrowLeft, Building2 } from 'lucide-react'

type Props = {
  otherUser: {
    id: string
    fullName: string
    avatarUrl: string | null
    role: string
    headline: string | null
    companyName: string | null
    companyVerified: boolean
  }
  onCloseMobile?: () => void
}

export function ChatHeader({ otherUser, onCloseMobile }: Props) {
  const initials = otherUser.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Determine profile link
  const profileLink =
    otherUser.role === 'student'
      ? `/student/talents/${otherUser.id}`
      : null

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/30 bg-surface-container-lowest shrink-0">
      {/* Back button mobile */}
      {onCloseMobile && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black overflow-hidden shrink-0">
        {otherUser.avatarUrl ? (
          <img
            src={otherUser.avatarUrl}
            alt={otherUser.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-on-surface truncate">
            {otherUser.fullName}
          </p>
          {otherUser.companyVerified && (
            <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
          )}
        </div>
        {otherUser.role === 'company' && otherUser.companyName ? (
          <p className="text-[11px] text-on-surface-variant truncate inline-flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {otherUser.companyName}
          </p>
        ) : otherUser.headline ? (
          <p className="text-[11px] text-on-surface-variant truncate">
            {otherUser.headline}
          </p>
        ) : null}
      </div>

      {/* View profile */}
      {profileLink && (
        <Link
          href={profileLink}
          className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors shrink-0"
          aria-label="Lihat profil"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}