// components/student/talents/talent-detail-hero.tsx
'use client'

import { useState } from 'react'
import {
  MapPin,
  Mail,
  GraduationCap,
  CheckCircle2,
  Share2,
  Link2,
  Check,
} from 'lucide-react'
import { FollowButton } from '@/components/student/profile/follow-button'

type Props = {
  talent: {
    id: string
    fullName: string
    email: string
    avatarUrl: string | null
    headline: string | null
    bio: string | null
    city: string | null
    province: string | null
    isOpenToWork: boolean
    followerCount: number
    followingCount: number
    school: { name: string; city: string | null } | null
  }
  initialFollowing: boolean
  isOwnProfile: boolean
}

export function TalentDetailHero({
  talent,
  initialFollowing,
  isOwnProfile,
}: Props) {
  const [copied, setCopied] = useState(false)

  const initials = talent.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  async function handleShare() {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: talent.fullName, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
      {/* Cover gradient subtle */}
      <div className="h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Profile content */}
      <div className="px-6 pb-5 -mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-lg ring-4 ring-surface-container-lowest overflow-hidden">
            {talent.avatarUrl ? (
              <img
                src={talent.avatarUrl}
                alt={talent.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight">
                {talent.fullName}
              </h1>
              {talent.isOpenToWork && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Open to Work
                </span>
              )}
            </div>

            {talent.headline && (
              <p className="text-sm text-on-surface-variant mt-0.5">
                {talent.headline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-on-surface-variant">
              {talent.school && (
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {talent.school.name}
                </span>
              )}
              {talent.city && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {talent.city}
                  {talent.province ? `, ${talent.province}` : ''}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {!isOwnProfile && (
              <>
                <FollowButton
                  studentProfileId={talent.id}
                  initialFollowing={initialFollowing}
                  initialFollowerCount={talent.followerCount}
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
              </>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-outline-variant/20 text-xs text-on-surface-variant">
          <span>
            <span className="font-black text-on-surface text-sm">
              {talent.followerCount}
            </span>{' '}
            Followers
          </span>
          <span className="w-px h-3 bg-outline-variant/30" />
          <span>
            <span className="font-black text-on-surface text-sm">
              {talent.followingCount}
            </span>{' '}
            Following
          </span>
        </div>

        {/* Bio */}
        {talent.bio && (
          <p className="mt-4 text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
            {talent.bio}
          </p>
        )}
      </div>
    </div>
  )
}