// components/student/showcase/showcase-card.tsx
import Link from 'next/link'
import { Eye, Video, Upload, Edit3 } from 'lucide-react'
import { ShowcaseActions } from './showcase-actions'
import { ShowcaseVideoPlayer } from './showcase-video-player'

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

function formatDuration(sec: number | null) {
  if (!sec) return null
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function ShowcaseCard({ video }: Props) {
  const badge = STATUS_BADGE[video.status] || STATUS_BADGE.draft
  const duration = formatDuration(video.durationSec)
  const isExternal = video.videoSource !== 'upload'

  return (
    <div className="group bg-surface-container-lowest rounded-2xl ring-1 ring-outline-variant/30 overflow-hidden hover:ring-primary/30 hover:shadow-[0_8px_24px_rgba(183,0,17,0.06)] transition-all">
      {/* Video Player */}
      <div className="relative aspect-video bg-black overflow-hidden">
        <ShowcaseVideoPlayer
          videoUrl={video.videoUrl}
          videoSource={video.videoSource as any}
          thumbnailUrl={video.thumbnailUrl}
          className="absolute inset-0"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.className}`}
          >
            {badge.label}
          </span>
        </div>

        {/* Source Badge */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isExternal ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
            }`}
          >
            {isExternal ? (
              <Video className="w-3 h-3" />
            ) : (
              <Upload className="w-3 h-3" />
            )}
            {isExternal ? video.videoSource : 'Upload'}
          </span>
        </div>

        {/* Duration */}
        {duration && !isExternal && (
          <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono font-bold pointer-events-none">
            {duration}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-on-surface line-clamp-2 group-hover:text-primary transition-colors flex-1">
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
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {Number(video.viewCount)} views
          </span>
          <Link
            href={`/student/showcase/my/${video.id}/edit`}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
          >
            <Edit3 className="w-3 h-3" />
            Edit
          </Link>
        </div>
      </div>
    </div>
  )
}