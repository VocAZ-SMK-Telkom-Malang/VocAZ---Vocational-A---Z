// components/student/showcase/showcase-card.tsx
import Link from 'next/link'
import {
  Eye,
  Edit3,
  Upload,
  Heart,
  MessageCircle,
  Share2,
} from 'lucide-react'
import { ShowcaseActions } from './showcase-actions'
import { ShowcaseVideoPlayer } from './showcase-video-player'
import { FaYoutube, FaTiktok, FaGoogleDrive, FaInstagram } from 'react-icons/fa'

type Video = {
  id: string
  title: string
  description: string | null
  videoUrl: string
  videoKey: string | null
  videoSource: string
  thumbnailUrl: string | null
  durationSec: number | null
  category: string | null
  skillTags: string[]
  viewCount: bigint
  likeCount: number
  commentCount: number
  shareCount: number
  status: string
  publishedAt: Date | null
  createdAt: Date
}

type Props = {
  video: Video
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-amber-100 text-amber-700' },
  published: {
    label: 'Published',
    className: 'bg-emerald-100 text-emerald-700',
  },
  hidden: { label: 'Hidden', className: 'bg-gray-100 text-gray-700' },
  flagged: { label: 'Flagged', className: 'bg-red-100 text-red-700' },
}

const SOURCE_BADGE: Record<
  string,
  {
    label: string
    className: string
    icon: React.ComponentType<{ className?: string }>
  }
> = {
  upload: {
    label: 'Upload',
    className: 'bg-blue-600 text-white',
    icon: Upload,
  },
  youtube: {
    label: 'YouTube',
    className: 'bg-red-600 text-white',
    icon: FaYoutube,
  },
  tiktok: { label: 'TikTok', className: 'bg-black text-white', icon: FaTiktok },
  gdrive: {
    label: 'Drive',
    className: 'bg-emerald-600 text-white',
    icon: FaGoogleDrive,
  },
  instagram: {
    label: 'Instagram',
    className:
      'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white',
    icon: FaInstagram,
  },
}

function formatDuration(sec: number | null) {
  if (!sec) return null
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function ShowcaseCard({ video }: Props) {
  const statusBadge = STATUS_BADGE[video.status] || STATUS_BADGE.draft
  const sourceBadge = SOURCE_BADGE[video.videoSource] || SOURCE_BADGE.upload
  const SourceIcon = sourceBadge.icon
  const duration = formatDuration(video.durationSec)

  return (
    <div className="group bg-white rounded-2xl ring-1 ring-outline-variant/30 overflow-hidden hover:ring-primary/30 hover:shadow-[0_8px_24px_rgba(183,0,17,0.06)] transition-all">
      {/* Video Preview */}
      <div className="relative aspect-video bg-black overflow-hidden">
        <ShowcaseVideoPlayer
          videoUrl={video.videoUrl}
          videoSource={video.videoSource}
          thumbnailUrl={video.thumbnailUrl}
          className="absolute inset-0"
        />

        {/* Status badge */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusBadge.className}`}
          >
            {statusBadge.label}
          </span>
        </div>

        {/* Source badge */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${sourceBadge.className}`}
          >
            <SourceIcon className="w-3 h-3" />
            {sourceBadge.label}
          </span>
        </div>

        {/* Duration (upload only) */}
        {duration && video.videoSource === 'upload' && (
          <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono font-bold pointer-events-none">
            {duration}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display text-sm font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors flex-1">
            {video.title}
          </h3>
          <ShowcaseActions videoId={video.id} />
        </div>

        {video.description && (
          <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
            {video.description}
          </p>
        )}

        {video.skillTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {video.skillTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-semibold"
              >
                {tag}
              </span>
            ))}
            {video.skillTags.length > 3 && (
              <span className="text-[10px] text-on-surface-variant font-semibold">
                +{video.skillTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats + Edit */}
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
          {/* Stats — read only */}
          <div className="flex items-center gap-2.5">
            <span
              className="inline-flex items-center gap-1"
              title={`${video.likeCount} like`}
            >
              <Heart className="w-3 h-3" />
              {video.likeCount}
            </span>
            <span
              className="inline-flex items-center gap-1"
              title={`${video.commentCount} komentar`}
            >
              <MessageCircle className="w-3 h-3" />
              {video.commentCount}
            </span>
            <span
              className="inline-flex items-center gap-1"
              title={`${video.shareCount} dibagikan`}
            >
              <Share2 className="w-3 h-3" />
              {video.shareCount}
            </span>
            <span
              className="inline-flex items-center gap-1"
              title={`${Number(video.viewCount)} dilihat`}
            >
              <Eye className="w-3 h-3" />
              {Number(video.viewCount)}
            </span>
          </div>

          <Link
            href={`/student/showcase/my/${video.id}/edit`}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline shrink-0"
          >
            <Edit3 className="w-3 h-3" />
            Edit
          </Link>
        </div>
      </div>
    </div>
  )
}