// components/student/talents/talent-grid.tsx
'use client'

import { Users } from 'lucide-react'
import { TalentCard } from './talent-card'

type Talent = {
  id: string
  userId: string              // ← tambah
  fullName: string
  avatarUrl: string | null
  coverImageUrl: string | null
  headline: string | null
  city: string | null
  province: string | null
  isOpenToWork: boolean
  followerCount: number
  schoolName: string | null
  schoolYear: number | null   // ← tambah
  topSkills: string[]
  isFollowing: boolean
  hasVerifiedCert: boolean    // ← tambah
  bestVideo: {                // ← tambah
    id: string
    title: string
    thumbnailUrl: string | null
  } | null
  bestProject: {              // ← tambah
    id: string
    title: string
    thumbnailUrl: string | null
  } | null
}

type Props = {
  talents: Talent[]
  currentStudentProfileId: string | null
  onReset?: () => void
  hasFilter?: boolean
}

export function TalentGrid({
  talents,
  currentStudentProfileId,
  onReset,
  hasFilter,
}: Props) {
  if (talents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
          <Users className="w-7 h-7 text-on-surface-variant/60" />
        </div>
        <p className="text-base font-bold text-on-surface mb-1">
          {hasFilter ? 'Tidak ada talent yang cocok' : 'Belum ada talent'}
        </p>
        <p className="text-sm text-on-surface-variant mb-5">
          {hasFilter
            ? 'Coba ubah filter atau kata kunci'
            : 'Talent akan muncul di sini'}
        </p>
        {hasFilter && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Reset pencarian
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {talents.map((t) => (
        <TalentCard
          key={t.id}
          talent={t}
          isOwnProfile={t.id === currentStudentProfileId}
        />
      ))}
    </div>
  )
}