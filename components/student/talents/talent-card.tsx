// components/student/talents/talent-card.tsx
'use client'

import Link from 'next/link'
import { useState, useTransition, useEffect } from 'react'
import {
  MapPin,
  GraduationCap,
  BadgeCheck,
  MessageSquare,
  UserPlus,
  UserCheck,
  Loader2,
  CheckCircle2,
  Shield,
} from 'lucide-react'
import { toggleFollow } from '@/app/actions/social'

type Talent = {
  id: string
  userId: string
  fullName: string
  avatarUrl: string | null
  coverImageUrl: string | null
  headline: string | null
  city: string | null
  province: string | null
  isOpenToWork: boolean
  followerCount: number
  schoolName: string | null
  schoolYear: number | null
  topSkills: string[]
  isFollowing: boolean
  hasVerifiedCert: boolean
  bestVideo: {
    id: string
    title: string
    thumbnailUrl: string | null
  } | null
  bestProject: {
    id: string
    title: string
    thumbnailUrl: string | null
  } | null
}

type Props = {
  talent: Talent
  isOwnProfile: boolean
}

export function TalentCard({ talent, isOwnProfile }: Props) {
  const [following, setFollowing] = useState(talent.isFollowing)
  const [followerCount, setFollowerCount] = useState(talent.followerCount)
  const [isPending, startTransition] = useTransition()

  const initials = talent.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // ============================================
  // DEBUG LOG — buat cek apakah data sampe
  // ============================================
  useEffect(() => {
    console.log('🎴 [TalentCard]', {
      name: talent.fullName,
      coverImageUrl: talent.coverImageUrl,
      avatarUrl: talent.avatarUrl,
      bestProject: talent.bestProject?.thumbnailUrl,
      bestVideo: talent.bestVideo?.thumbnailUrl,
    })
  }, [talent])

  // ============================================
  // PRIORITAS COVER:
  // 1. coverImageUrl (upload profile)
  // 2. bestProject thumbnail
  // 3. bestVideo thumbnail
  // ============================================
  const coverUrl =
    talent.coverImageUrl ||
    talent.bestProject?.thumbnailUrl ||
    talent.bestVideo?.thumbnailUrl ||
    null

  const coverLabel = talent.coverImageUrl
    ? null
    : talent.bestProject
      ? 'Project'
      : talent.bestVideo
        ? 'Showcase'
        : null

  const coverTitle =
    (!talent.coverImageUrl &&
      (talent.bestProject?.title || talent.bestVideo?.title)) ||
    null

  function handleFollow(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const newFollowing = !following
    setFollowing(newFollowing)
    setFollowerCount((c) => c + (newFollowing ? 1 : -1))

    startTransition(async () => {
      const result = await toggleFollow(talent.id)
      if (result.ok) {
        setFollowing(result.following!)
        setFollowerCount(result.followerCount!)
      } else {
        setFollowing(!newFollowing)
        setFollowerCount((c) => c + (newFollowing ? -1 : 1))
        alert(result.error)
      }
    })
  }

  return (
    <div className="group relative flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant/30 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all overflow-hidden">
      {talent.hasVerifiedCert && (
        <div className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg ring-2 ring-white/30">
          <Shield className="w-3 h-3 fill-current" />
          Verified
        </div>
      )}

      {/* ============================================ */}
      {/* COVER — Prioritas coverImageUrl               */}
      {/* ============================================ */}
      <Link
        href={`/student/talents/${talent.id}`}
        className="relative block aspect-[16/9] bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden"
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={coverTitle ?? talent.fullName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              console.error('❌ Cover image failed:', coverUrl)
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl font-black text-primary/20">
              {initials}
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {talent.isOpenToWork && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
            <CheckCircle2 className="w-3 h-3" />
            Open to Work
          </div>
        )}

        {coverLabel && coverTitle && (
          <div className="absolute bottom-3 left-3 right-3">
            <p className="font-mono text-[9px] uppercase tracking-widest font-black text-white/70 mb-0.5">
              {coverLabel}
            </p>
            <p className="text-xs font-bold text-white line-clamp-1 drop-shadow-md">
              {coverTitle}
            </p>
          </div>
        )}
      </Link>

      {/* ============================================ */}
      {/* INFO — avatar + nama + headline                */}
      {/* ============================================ */}
      <div className="flex flex-col p-5">
        <Link href={`/student/talents/${talent.id}`} className="group/name mb-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black overflow-hidden shrink-0 ring-2 ring-surface-container">
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

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h3 className="text-sm font-black text-on-surface leading-tight line-clamp-1 group-hover/name:text-primary transition-colors">
                  {talent.fullName}
                </h3>
                {talent.hasVerifiedCert && (
                  <BadgeCheck className="w-4 h-4 text-primary shrink-0" />
                )}
              </div>
              {talent.headline && (
                <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5 leading-snug">
                  {talent.headline}
                </p>
              )}
            </div>
          </div>
        </Link>

        <div className="space-y-1.5 mb-3 text-[11px] text-on-surface-variant">
          {talent.schoolName && (
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {talent.schoolName}
                {talent.schoolYear
                  ? ` '${String(talent.schoolYear).slice(-2)}`
                  : ''}
              </span>
            </div>
          )}
          {talent.city && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {talent.city}
                {talent.province ? `, ${talent.province}` : ''}
              </span>
            </div>
          )}
        </div>

        {talent.topSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {talent.topSkills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-semibold"
              >
                {skill}
              </span>
            ))}
            {talent.topSkills.length > 4 && (
              <span className="px-2 py-0.5 rounded-md bg-surface-container text-[10px] font-semibold text-on-surface-variant">
                +{talent.topSkills.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-outline-variant/20 flex items-center gap-2">
          {isOwnProfile ? (
            <Link
              href="/student/profile"
              className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
            >
              Profil Saya
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={handleFollow}
                disabled={isPending}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  following
                    ? 'bg-surface-container text-on-surface-variant hover:bg-rose-50 hover:text-rose-600'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : following ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Follow
                  </>
                )}
              </button>

              <Link
                href={`/student/messages?to=${talent.userId}`}
                className="p-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
                aria-label="Kirim pesan"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}