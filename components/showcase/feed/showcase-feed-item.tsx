// components/showcase/feed/showcase-feed-item.tsx
'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import {
  Heart,
  MessageCircle,
  Share2,
  BadgeCheck,
  Eye,
  Music,
  UserPlus,
  UserCheck,
  Play,
} from 'lucide-react'
import {
  toggleShowcaseLike,
  recordShowcaseShare,
  toggleFollowStudent,
  incrementShowcaseView,
} from '@/lib/student/actions'
import { ShowcaseVideoPlayer } from '@/components/student/showcase/showcase-video-player'

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
  video: Video
  currentUserId: string | null
  currentStudentProfileId: string | null
  initialLiked: boolean
  initialFollowing: boolean
  muted?: boolean
  onClose?: () => void
  isActive?: boolean
}

export function ShowcaseFeedItem({
  video,
  currentUserId,
  currentStudentProfileId,
  initialLiked,
  initialFollowing,
  muted = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(video.likeCount)
  const [following, setFollowing] = useState(initialFollowing)
  const [followerCount, setFollowerCount] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [showShareToast, setShowShareToast] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)

  const isOwn = currentStudentProfileId === video.student.id
  const isUploaded = video.videoSource === 'upload'

  // Increment view once
  useEffect(() => {
    incrementShowcaseView(video.id).catch(() => {})
  }, [video.id])

  function handleLike() {
    if (!currentUserId) {
      alert('Login dulu untuk menyukai video')
      return
    }

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

  function handleFollow() {
    if (!currentUserId) {
      alert('Login dulu untuk follow')
      return
    }

    const newFollowing = !following
    setFollowing(newFollowing)
    setFollowerCount((c) => c + (newFollowing ? 1 : -1))

    startTransition(async () => {
      const result = await toggleFollowStudent(video.student.id)
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

  async function handleShare() {
    const url = `${window.location.origin}/showcase/${video.id}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: video.description ?? '',
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        setShowShareToast(true)
        setTimeout(() => setShowShareToast(false), 2000)
      }
      recordShowcaseShare(video.id).catch(() => {})
    } catch {
      // canceled
    }
  }

  function handleTogglePlay() {
    if (!videoRef.current || !isUploaded) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden">
      {/* Video Player */}
      <div className="absolute inset-0" onClick={handleTogglePlay}>
        <ShowcaseVideoPlayer
          videoUrl={video.videoUrl}
          videoSource={video.videoSource as any}
          thumbnailUrl={video.thumbnailUrl}
          className="w-full h-full object-cover"
        />

        {/* Pause indicator */}
        {!isPlaying && isUploaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-9 h-9 text-white fill-current ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pr-20 space-y-2">
        {/* Creator */}
        <div className="flex items-center gap-2.5">
          <Link
            href={`/student/talents/${video.student.id}`}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold overflow-hidden ring-2 ring-white/30 shrink-0">
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
                <p className="text-sm font-bold text-white truncate group-hover:underline">
                  {video.student.fullName}
                </p>
                <BadgeCheck className="w-3.5 h-3.5 text-blue-400 fill-blue-400 shrink-0" />
              </div>
              {video.student.schoolName && (
                <p className="text-[10px] text-white/70 truncate">
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
              className={`ml-auto shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
                following
                  ? 'bg-white/20 text-white hover:bg-red-500/30'
                  : 'bg-white text-black hover:bg-white/90'
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
        <Link
          href={`/showcase/${video.id}`}
          className="block"
        >
          <h3 className="text-sm font-bold text-white line-clamp-2 hover:underline">
            {video.title}
          </h3>
        </Link>

        {/* Description */}
        {video.description && (
          <p className="text-xs text-white/80 line-clamp-2">
            {video.description}
          </p>
        )}

        {/* Skill tags */}
        {video.skillTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {video.skillTags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-[10px] font-semibold"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Audio indicator */}
        <div className="flex items-center gap-1.5 text-white/70 text-[10px]">
          <Music className="w-3 h-3" />
          <span className="truncate">
            {video.student.fullName} · Original audio
          </span>
        </div>
      </div>

      {/* Right actions */}
      <div className="absolute bottom-24 right-3 flex flex-col items-center gap-4">
        {/* Like */}
        <button
          type="button"
          onClick={handleLike}
          disabled={isPending}
          className="flex flex-col items-center gap-1 group"
          aria-label="Like"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              liked
                ? 'bg-red-500 text-white scale-110'
                : 'bg-white/15 backdrop-blur-sm text-white group-hover:bg-white/25'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${liked ? 'fill-current' : ''}`}
            />
          </div>
          <span className="text-[11px] font-bold text-white">
            {likeCount}
          </span>
        </button>

        {/* Comment */}
        <Link
          href={`/showcase/${video.id}`}
          className="flex flex-col items-center gap-1 group"
          aria-label="Komentar"
        >
          <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center group-hover:bg-white/25 transition-all">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-white">
            {video.commentCount}
          </span>
        </Link>

        {/* Share */}
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-col items-center gap-1 group"
          aria-label="Bagikan"
        >
          <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center group-hover:bg-white/25 transition-all">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-white">
            {video.shareCount}
          </span>
        </button>

        {/* Views */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-white">
            {video.viewCount}
          </span>
        </div>
      </div>

      {/* Share toast */}
      {showShareToast && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/80 backdrop-blur-sm text-white text-xs font-bold whitespace-nowrap">
          Link disalin!
        </div>
      )}
    </div>
  )
}