// components/showcase/feed/showcase-feed-grid.tsx
'use client'

import Link from 'next/link'
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  BadgeCheck,
  Play,
  UserPlus,
  UserCheck,
} from 'lucide-react'
import { useState, useTransition } from 'react'
import { ShowcaseVideoPlayer } from '@/components/student/showcase/showcase-video-player'
import {
  toggleShowcaseLike,
  toggleFollowStudent,
  recordShowcaseShare,
} from '@/lib/student/actions'

type Video = {
  id: string
  title: string
  description: string | null
  videoUrl: string
  videoSource: string
  thumbnailUrl: string | null
  skillTags: string[]
  likeCount: number
  commentCount: number
  shareCount: number
  viewCount: number
  durationSec: number | null
  publishedAt: string | Date | null
  createdAt: string | Date
  student: {
    id: string
    fullName: string
    avatarUrl: string | null
    schoolName: string | null
    headline: string | null
  }
}

type Props = {
  videos: Video[]
  currentUserId: string | null
  currentStudentProfileId: string | null
  likedVideoIds: string[]
  followingStudentIds: string[]
  onPlayVideo?: (video: Video) => void
}

export function ShowcaseFeedGrid({
  videos,
  currentUserId,
  currentStudentProfileId,
  likedVideoIds,
  followingStudentIds,
  onPlayVideo,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          currentUserId={currentUserId}
          currentStudentProfileId={currentStudentProfileId}
          initialLiked={likedVideoIds.includes(video.id)}
          initialFollowing={followingStudentIds.includes(video.student.id)}
          onPlay={() => onPlayVideo?.(video)}
        />
      ))}
    </div>
  )
}

// ============================================
// VIDEO CARD
// ============================================

function VideoCard({
  video,
  currentUserId,
  currentStudentProfileId,
  initialLiked,
  initialFollowing,
  onPlay,
}: {
  video: Video
  currentUserId: string | null
  currentStudentProfileId: string | null
  initialLiked: boolean
  initialFollowing: boolean
  onPlay: () => void
}) {
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(video.likeCount)
  const [following, setFollowing] = useState(initialFollowing)
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  const isOwn = currentStudentProfileId === video.student.id

  function handleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!currentUserId) return alert('Login dulu')

    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount((c) => c + (newLiked ? 1 : -1))

    startTransition(async () => {
      const result = await toggleShowcaseLike(video.id)
      if (!result.ok) {
        setLiked(!newLiked)
        setLikeCount((c) => c + (newLiked ? -1 : 1))
      }
    })
  }

  function handleFollow(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!currentUserId) return alert('Login dulu')

    const newFollowing = !following
    setFollowing(newFollowing)

    startTransition(async () => {
      const result = await toggleFollowStudent(video.student.id)
      if (result.ok) {
        setFollowing(result.following!)
      } else {
        setFollowing(!newFollowing)
      }
    })
  }

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    const url = `${window.location.origin}/showcase/${video.id}`
    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
      recordShowcaseShare(video.id).catch(() => {})
    } catch {}
  }

  function formatDuration(sec: number | null) {
    if (!sec) return null
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const duration = formatDuration(video.durationSec)

  return (
    <div className="group rounded-2xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
      {/* Video Player 16:9 */}
      <button
        type="button"
        onClick={onPlay}
        className="relative block w-full aspect-video bg-black overflow-hidden"
      >
        <ShowcaseVideoPlayer
          videoUrl={video.videoUrl}
          videoSource={video.videoSource as any}
          thumbnailUrl={video.thumbnailUrl}
          className="absolute inset-0"
        />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-primary fill-current ml-0.5" />
          </div>
        </div>

        {/* Duration */}
        {duration && (
          <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono font-bold pointer-events-none">
            {duration}
          </div>
        )}

        {/* Views */}
        <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1 pointer-events-none">
          <Eye className="w-3 h-3" />
          {video.viewCount}
        </div>
      </button>

      {/* Info */}
      <div className="p-4">
        {/* Creator */}
        <div className="flex items-center gap-2.5 mb-3">
          <Link
            href={`/student/talents/${video.student.id}`}
            className="flex items-center gap-2.5 min-w-0 flex-1 group/creator"
          >
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold overflow-hidden ring-1 ring-outline-variant/30 shrink-0">
              {video.student.avatarUrl ? (
                <img
                  src={video.student.avatarUrl}
                  alt={video.student.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                video.student.fullName.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-on-surface truncate group-hover/creator:text-primary transition-colors">
                  {video.student.fullName}
                </p>
                <BadgeCheck className="w-3 h-3 text-primary shrink-0" />
              </div>
              {video.student.schoolName && (
                <p className="text-[10px] text-on-surface-variant truncate">
                  {video.student.schoolName}
                </p>
              )}
            </div>
          </Link>

          {!isOwn && currentUserId && (
            <button
              type="button"
              onClick={handleFollow}
              disabled={isPending}
              className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                following
                  ? 'bg-surface-container text-on-surface-variant hover:bg-rose-50 hover:text-rose-600'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {following ? (
                <>
                  <UserCheck className="w-3 h-3" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-3 h-3" />
                  Follow
                </>
              )}
            </button>
          )}
        </div>

        {/* Title */}
        <Link href={`/showcase/${video.id}`} className="block">
          <h3 className="text-sm font-bold text-on-surface line-clamp-2 hover:text-primary transition-colors">
            {video.title}
          </h3>
        </Link>

        {/* Description */}
        {video.description && (
          <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
            {video.description}
          </p>
        )}

        {/* Skill tags */}
        {video.skillTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {video.skillTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-semibold"
              >
                #{tag}
              </span>
            ))}
            {video.skillTags.length > 3 && (
              <span className="text-[10px] text-on-surface-variant font-semibold">
                +{video.skillTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={handleLike}
            disabled={isPending}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
              liked
                ? 'text-rose-600 bg-rose-50'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            {likeCount}
          </button>

          <Link
            href={`/showcase/${video.id}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {video.commentCount}
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Disalin!' : video.shareCount}
          </button>
        </div>
      </div>
    </div>
  )
}