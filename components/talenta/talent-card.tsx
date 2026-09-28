// components/talenta/talent-card.tsx
import Link from 'next/link'
import {
  MapPin,
  GraduationCap,
  BadgeCheck,
  Play,
  Sparkles,
  Video,
} from 'lucide-react'
import type { PublicTalent } from '@/lib/talenta/queries'

type Props = {
  talent: PublicTalent
}

function Avatar({ talent }: { talent: PublicTalent }) {
  if (talent.avatarUrl) {
    return (
      <img
        src={talent.avatarUrl}
        alt={talent.name}
        className="w-full h-full object-cover"
      />
    )
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-display font-extrabold text-2xl">
      {talent.initials}
    </div>
  )
}

export function TalentCard({ talent }: Props) {
  const hasVideo = !!talent.featuredVideo
  const visibleSkills = talent.skills.slice(0, 3)
  const extraSkills = talent.skills.length - 3

  return (
    <Link
      href={`/talenta/${talent.id}`}
      className="group bg-surface-container-lowest rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.04)] hover:shadow-[0_16px_36px_-10px_rgba(220,38,38,0.12)] ring-1 ring-outline-variant/30 hover:ring-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Header — Video thumbnail atau avatar besar */}
      <div className="relative aspect-video bg-gradient-to-br from-surface-container to-surface-container-high overflow-hidden">
        {hasVideo && talent.featuredVideo?.thumbnailUrl ? (
          <>
            <img
              src={talent.featuredVideo.thumbnailUrl}
              alt={talent.featuredVideo.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />

            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 rounded-full bg-primary/95 text-white flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
            </div>

            {/* Duration */}
            {talent.featuredVideo.durationFormatted && (
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
                {talent.featuredVideo.durationFormatted}
              </span>
            )}

            {/* Video badge */}
            <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold uppercase tracking-wider">
              <Video className="w-3 h-3" />
              Showcase
            </span>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-fixed/40 to-tertiary-fixed/40">
            <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-white/50 shadow-lg">
              <Avatar talent={talent} />
            </div>
          </div>
        )}

        {/* Verified badge */}
        {talent.isVerified && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed/95 text-tertiary-container font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <BadgeCheck className="w-3 h-3 fill-current" />
              BNSP
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Name + Avatar kecil */}
        <div className="flex items-center gap-3">
          {hasVideo && (
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20 shrink-0">
              <Avatar talent={talent} />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h3 className="font-display text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                {talent.name}
              </h3>
              {talent.isVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              )}
            </div>
            {talent.headline && (
              <p className="text-[11px] text-primary font-semibold truncate">
                {talent.headline}
              </p>
            )}
          </div>
        </div>

        {/* School + Location */}
        <div className="flex flex-col gap-1 text-[11px] text-on-surface-variant">
          {talent.school && (
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3 h-3 shrink-0 text-secondary" />
              <span className="truncate">
                {talent.school}
                {talent.major && ` · ${talent.major}`}
              </span>
            </div>
          )}
          {talent.city && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{talent.city}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {visibleSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#fff1ec] text-[#ad5d00] text-[10px] font-semibold"
              >
                {skill}
              </span>
            ))}
            {extraSkills > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-semibold">
                +{extraSkills}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-outline-variant/20">
          <div className="flex items-center gap-2">
            {talent.isOpenToWork && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Open to Work
              </span>
            )}
            {talent.showcaseCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-on-surface-variant">
                <Video className="w-3 h-3" />
                {talent.showcaseCount}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-primary font-bold text-[11px] group-hover:translate-x-0.5 transition-transform">
            Lihat Profil
          </span>
        </div>
      </div>
    </Link>
  )
}