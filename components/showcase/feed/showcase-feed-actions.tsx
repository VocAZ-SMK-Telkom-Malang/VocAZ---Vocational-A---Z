// components/showcase/feed/showcase-feed-actions.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  UserCheck,
  Loader2,
  Copy,
  Check,
} from 'lucide-react'
import {
  toggleShowcaseLike,
  toggleFollowStudent,
  recordShowcaseShare,
} from '@/lib/student/actions'

type Props = {
  videoId: string
  initialLiked: boolean
  initialLikeCount: number
  initialCommentCount: number
  initialShareCount: number
  studentProfileId: string
  studentName: string
  initialFollowing: boolean
  currentUserRole: string | null
  currentStudentProfileId: string | null
  onOpenComments: () => void
}

export function ShowcaseFeedActions({
  videoId,
  initialLiked,
  initialLikeCount,
  initialCommentCount,
  initialShareCount,
  studentProfileId,
  studentName,
  initialFollowing,
  currentUserRole,
  currentStudentProfileId,
  onOpenComments,
}: Props) {
  const router = useRouter()
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [following, setFollowing] = useState(initialFollowing)
  const [shareCount, setShareCount] = useState(initialShareCount)
  const [copied, setCopied] = useState(false)
  const [isPendingLike, startLike] = useTransition()
  const [isPendingFollow, startFollow] = useTransition()

  const isOwnVideo = currentStudentProfileId === studentProfileId
  const isStudent = currentUserRole === 'student'
  const canInteract = isStudent && !isOwnVideo

  // ============================================
  // LIKE
  // ============================================

  function handleLike() {
    if (!canInteract) return

    // Optimistic
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount((c) => c + (newLiked ? 1 : -1))

    startLike(async () => {
      const result = await toggleShowcaseLike(videoId)
      if (!result.ok) {
        // Rollback
        setLiked(!newLiked)
        setLikeCount((c) => c + (newLiked ? -1 : 1))
      } else {
        setLiked(result.liked ?? false)
        if (result.likeCount !== undefined) setLikeCount(result.likeCount)
      }
    })
  }

  // ============================================
  // FOLLOW
  // ============================================

  function handleFollow() {
    if (!canInteract) return

    const newFollowing = !following
    setFollowing(newFollowing)

    startFollow(async () => {
      const result = await toggleFollowStudent(studentProfileId)
      if (!result.ok) {
        setFollowing(!newFollowing)
      } else {
        setFollowing(result.following ?? false)
      }
    })
  }

  // ============================================
  // SHARE
  // ============================================

  async function handleShare() {
    const url = `${window.location.origin}/showcase/${videoId}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Video oleh ${studentName}`,
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
      setShareCount((c) => c + 1)
      await recordShowcaseShare(videoId)
    } catch (err) {
      // User cancel atau error lain
      console.log('Share cancelled/error:', err)
    }
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-5">
      {/* LIKE */}
      <ActionButton
        onClick={handleLike}
        disabled={!canInteract || isPendingLike}
        title={!isStudent ? 'Login sebagai siswa untuk like' : isOwnVideo ? 'Tidak bisa like video sendiri' : ''}
      >
        {isPendingLike ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <Heart
            className={`w-6 h-6 transition-all ${
              liked ? 'text-red-500 fill-current scale-110' : 'text-white'
            }`}
          />
        )}
        <span className="text-[11px] font-semibold text-white">
          {likeCount}
        </span>
      </ActionButton>

      {/* COMMENT */}
      <ActionButton
        onClick={onOpenComments}
        disabled={!isStudent}
        title={!isStudent ? 'Login sebagai siswa untuk komentar' : ''}
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="text-[11px] font-semibold text-white">
          {initialCommentCount}
        </span>
      </ActionButton>

      {/* SHARE (semua role bisa) */}
      <ActionButton onClick={handleShare}>
        {copied ? (
          <Check className="w-6 h-6 text-emerald-400" />
        ) : (
          <Share2 className="w-6 h-6 text-white" />
        )}
        <span className="text-[11px] font-semibold text-white">
          {shareCount}
        </span>
      </ActionButton>

      {/* FOLLOW (student only, bukan diri sendiri) */}
      {!isOwnVideo && (
        <ActionButton
          onClick={handleFollow}
          disabled={!canInteract || isPendingFollow}
          title={!isStudent ? 'Login sebagai siswa untuk follow' : ''}
        >
          {isPendingFollow ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : following ? (
            <UserCheck className="w-6 h-6 text-emerald-400" />
          ) : (
            <UserPlus className="w-6 h-6 text-white" />
          )}
          <span className="text-[10px] font-semibold text-white">
            {following ? 'Following' : 'Follow'}
          </span>
        </ActionButton>
      )}

      {/* PROFIL */}
      <Link
        href={`/student/talents/${studentProfileId}`}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/40 group-hover:ring-primary transition-all shrink-0">
          <div className="w-full h-full bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {studentName[0]?.toUpperCase() || '?'}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-white">Profil</span>
      </Link>
    </div>
  )
}

function ActionButton({
  children,
  onClick,
  disabled,
  title,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex flex-col items-center gap-1 transition-transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}