import Link from 'next/link'
import { PlayCircle, BadgeCheck, Play, Video, ArrowRight } from 'lucide-react'

type Video = {
  category: string
  title: string
  desc: string
  author: string
  duration: string
  score: string
  gradient: string
}

type Props = {
  videos: Video[]
}

export function VideoSection({ videos }: Props) {
  return (
    <section className="w-full bg-[#FDF2EB] py-20 relative">
      <div className="max-w-[1240px] mx-auto px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-primary font-bold bg-[#FFE3DC] px-3 py-1 rounded-full">
              Praktik Langsung Terotentikasi
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-[#3B1214] mt-3 mb-1">
              See What SMK Talent Can Do
            </h2>
            <p className="text-on-surface-variant max-w-xl">
              A profile tells you what they know. This shows you what they can build.
            </p>
          </div>
          <Link
            href="/showcase"
            className="inline-flex items-center gap-1.5 text-primary font-display font-semibold bg-white px-6 py-2.5 rounded-full shadow-[0_4px_14px_rgba(183,0,17,0.08)] hover:bg-[#FFF0EB] transition-colors"
          >
            <span>Explore Talent Showcase</span>
            <PlayCircle className="w-[18px] h-[18px]" />
          </Link>
        </div>

        {/* Empty state */}
        {videos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-outline-variant/30 py-16 text-center">
            <Video className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
            <p className="text-on-surface-variant text-sm">
              Belum ada video showcase.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.title}
                className="group bg-white rounded-2xl overflow-hidden shadow-[0_10px_28px_rgba(183,0,17,0.08)] hover:shadow-[0_20px_40px_rgba(183,0,17,0.15)] transition-all"
              >
                {/* Thumbnail */}
                <div
                  className={`relative h-56 w-full bg-gradient-to-br ${video.gradient} overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2F1500]/70 via-transparent to-transparent" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute inline-flex h-16 w-16 rounded-full bg-primary-container/40 animate-ping" />
                      <div className="relative w-14 h-14 rounded-full bg-primary-container text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-3 left-3 bg-[#2F1500]/80 backdrop-blur-sm text-[#FFDCC3] font-mono text-[11px] px-2 py-0.5 rounded">
                    {video.duration}
                  </div>

                  {/* Score badge */}
                  <div className="absolute top-3 right-3 bg-[#FEF3C7] text-[#B45309] font-mono text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <BadgeCheck className="w-[14px] h-[14px]" />
                    <span>{video.score}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <span className="text-tertiary font-mono text-[11px] font-bold uppercase tracking-wider block mb-1">
                    {video.category}
                  </span>
                  <h4 className="font-display text-base font-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mb-3">
                    {video.desc}
                  </p>
                  <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs">
                    <span className="text-on-surface-variant truncate">
                      Oleh: <span className="font-semibold text-on-surface">{video.author}</span>
                    </span>
                    <span className="text-[#B45309] font-mono font-bold text-[10px] uppercase tracking-wider shrink-0 ml-2">
                      Assessor Approved
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}