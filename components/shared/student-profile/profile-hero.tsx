// components/shared/student-profile/profile-hero.tsx
'use client'

import {
  MapPin,
  GraduationCap,
  CheckCircle2,
  Eye,
} from 'lucide-react'
import type {
  StudentProfileDetail,
  ViewerContext,
} from '@/lib/queries/student-profile-detail'

type Props = {
  profile: StudentProfileDetail
  viewer: ViewerContext
  actionsSlot: React.ReactNode
}

export function ProfileHero({ profile, viewer, actionsSlot }: Props) {
  const initials = profile.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const hasVerifiedCert = profile.certificates.some(
    (c) => c.verificationStatus === 'verified'
  )

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest border border-outline-variant/30">
      {/* Cover */}
      <div className="h-24 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative">
        {profile.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.coverImageUrl}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      {/* Content */}
      <div className="px-6 pb-5 -mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-lg ring-4 ring-surface-container-lowest overflow-hidden">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
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
                {profile.fullName}
              </h1>
              {hasVerifiedCert && (
                <CheckCircle2 className="w-5 h-5 text-primary" />
              )}
              {profile.isOpenToWork && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Open to Work
                </span>
              )}
            </div>

            {profile.headline && (
              <p className="text-sm text-on-surface-variant mt-0.5">
                {profile.headline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-on-surface-variant">
              {profile.school && (
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {profile.school.name}
                </span>
              )}
              {profile.city && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.city}
                  {profile.province ? `, ${profile.province}` : ''}
                </span>
              )}
            </div>
          </div>

          {/* Actions slot — role-specific */}
          <div className="shrink-0">{actionsSlot}</div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-outline-variant/20 text-xs text-on-surface-variant">
          <span>
            <span className="font-black text-on-surface text-sm">
              {profile.followerCount}
            </span>{' '}
            Followers
          </span>
          <span className="w-px h-3 bg-outline-variant/30" />
          <span>
            <span className="font-black text-on-surface text-sm">
              {profile.followingCount}
            </span>{' '}
            Following
          </span>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-4 text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>
        )}
      </div>
    </div>
  )
}