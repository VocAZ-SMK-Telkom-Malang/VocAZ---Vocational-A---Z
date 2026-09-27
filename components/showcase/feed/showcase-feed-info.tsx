// components/showcase/feed/showcase-feed-info.tsx
'use client'

import Link from 'next/link'
import { BadgeCheck, MapPin, Eye, Clock } from 'lucide-react'

type Props = {
  video: {
    id: string
    title: string
    description: string | null
    skillTags: string[]
    viewCount: bigint
    publishedAt: Date | null
    createdAt: Date
    student: {
      id: string
      user: {
        id: string
        fullName: string | null
        avatarUrl: string | null
      }
      school: {
        id: string
        name: string
      } | null
    }
  }
}

function timeAgo(date: Date | string) {
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'baru saja'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} menit lalu`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} jam lalu`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day} hari lalu`
  if (day < 30) return `${Math.floor(day / 7)} minggu lalu`
  if (day < 365) return `${Math.floor(day / 30)} bulan lalu`
  return `${Math.floor(day / 365)} tahun lalu`
}

export function ShowcaseFeedInfo({ video }: Props) {
  const student = video.student
  const fullName = student.user.fullName || 'Anonim'

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 p-4 pb-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none">
      <div className="pointer-events-auto max-w-[calc(100%-80px)]">
        {/* Student */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/30 shrink-0 bg-primary flex items-center justify-center">
            {student.user.avatarUrl ? (
              <img
                src={student.user.avatarUrl}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-xs font-bold">
                {fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/student/talents/${student.id}`}
                className="font-display text-sm font-bold text-white hover:underline truncate"
              >
                {fullName}
              </Link>
              <BadgeCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            </div>
            {student.school && (
              <div className="flex items-center gap-1 text-[11px] text-white/80">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{student.school.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="font-display text-sm font-bold text-white mb-1 line-clamp-2">
          {video.title}
        </h2>

        {/* Description */}
        {video.description && (
          <p className="text-xs text-white/85 line-clamp-2 mb-2">
            {video.description}
          </p>
        )}

        {/* Skill Tags */}
        {video.skillTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {video.skillTags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold"
              >
                #{tag}
              </span>
            ))}
            {video.skillTags.length > 4 && (
              <span className="text-[10px] text-white/70 font-semibold">
                +{video.skillTags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Views + Time */}
        <div className="flex items-center gap-3 text-[11px] text-white/70 font-medium">
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {Number(video.viewCount).toLocaleString('id-ID')} views
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(video.publishedAt || video.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}