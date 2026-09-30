// components/talenta/talent-card.tsx
'use client'

import { useState } from 'react'
import { MapPin, BadgeCheck, Lock, Building2, ArrowRight } from 'lucide-react'
import { CertificationBadge } from '@/components/shared/certification-badge'
import type { PublicTalent } from '@/lib/talenta/queries'
import { TalentPreviewModal } from './talent-preview-modal'

type Props = {
  talent: PublicTalent
}

function Avatar({
  talent,
  size = 'md',
}: {
  talent: PublicTalent
  size?: 'sm' | 'md'
}) {
  const sizeClass = size === 'sm' ? 'w-9 h-9 text-sm' : 'w-11 h-11 text-lg'

  if (talent.avatarUrl) {
    return (
      <img
        src={talent.avatarUrl}
        alt={talent.name}
        className={`${sizeClass} rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-display font-extrabold shrink-0`}
    >
      {talent.initials}
    </div>
  )
}

function nameToGradient(name: string): string {
  const gradients = [
    'from-[#ff5757] via-[#ea580c] to-[#f59e0b]',
    'from-[#dc2626] via-[#b70011] to-[#894900]',
    'from-[#8fa7fe] via-[#4059aa] to-[#1d3989]',
    'from-[#ffdcc3] via-[#ffb77d] to-[#ad5d00]',
    'from-[#ffdad6] via-[#ffb4ab] to-[#dc2626]',
    'from-[#dce1ff] via-[#b6c4ff] to-[#4059aa]',
  ]
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
}

export function TalentCard({ talent }: Props) {
  const [showModal, setShowModal] = useState(false)

  const thumbnailUrl =
    talent.coverImageUrl || talent.featuredPortfolio?.thumbnailUrl || null
  const gradientClass = nameToGradient(talent.name)
  const hasThumbnail = !!thumbnailUrl
  const projectTitle =
    talent.featuredPortfolio?.title || talent.featuredVideo?.title || null
  const visibleSkills = talent.skills.slice(0, 3)
  const extraSkills = talent.skills.length - 3

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="group text-left bg-surface-container-lowest rounded-2xl shadow-[0_1px_3px_rgba(17,24,39,0.04)] hover:shadow-[0_16px_36px_-10px_rgba(220,38,38,0.12)] ring-1 ring-outline-variant/30 hover:ring-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden w-full"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          {hasThumbnail ? (
            <img
              src={thumbnailUrl}
              alt={talent.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center relative`}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="relative w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm ring-4 ring-white/40 flex items-center justify-center text-white font-display font-extrabold text-3xl shadow-xl">
                {talent.initials}
              </div>
            </div>
          )}

          {/* Top-left: major */}
          {talent.major && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-on-surface text-[10px] font-bold shadow-sm">
              {talent.major}
            </span>
          )}

          {/* Top-right: cert badge (DINAMIS) */}
          {talent.certTier && (
            <div className="absolute top-3 right-3">
              <CertificationBadge
                tier={talent.certTier === 'lsp_bnsp' ? 'lsp_bnsp' : 'industry'}
                size="sm"
                className="shadow-sm"
              />
            </div>
          )}

          {/* Hover label */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
              Lihat Profil
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col gap-4 flex-1">
          {/* Project title */}
          {projectTitle && (
            <p className="text-xs italic text-on-surface-variant line-clamp-1">
              Proyek Unggulan: {projectTitle}
            </p>
          )}

          {/* Avatar + Name + Headline */}
          <div className="flex items-center gap-3">
            <Avatar talent={talent} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-base font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                  {talent.name}
                </h3>
                {talent.certTier && (
                  <BadgeCheck className="w-4 h-4 text-primary fill-primary shrink-0" />
                )}
              </div>
              {talent.headline && (
                <p className="text-xs text-primary font-semibold truncate">
                  {talent.headline}
                </p>
              )}
            </div>
          </div>

          {/* School + Major + Year */}
          {talent.school && (
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
              <Building2 className="w-3.5 h-3.5 shrink-0 text-secondary" />
              <span className="truncate">
                {talent.school}
                {talent.major && ` · ${talent.major}`}
                {talent.graduationYear &&
                  ` '${String(talent.graduationYear).slice(-2)}`}
              </span>
            </div>
          )}

          {/* Cert badge + Location (DINAMIS) */}
          <div className="flex items-center justify-between gap-2">
            {talent.certTier ? (
              <CertificationBadge
                tier={talent.certTier === 'lsp_bnsp' ? 'lsp_bnsp' : 'industry'}
                size="md"
              />
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono text-[10px] font-bold uppercase tracking-wider">
                Belum Terverifikasi
              </span>
            )}

            {talent.city && (
              <span className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant shrink-0">
                <MapPin className="w-3 h-3" />
                {talent.city}
              </span>
            )}
          </div>

          {/* Skills */}
          {visibleSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {visibleSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-semibold"
                >
                  {skill}
                </span>
              ))}
              {extraSkills > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-semibold">
                  +{extraSkills}
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto pt-1">
            <div className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-container to-[#dc2626] text-white font-display font-bold text-sm shadow-sm group-hover:brightness-105 group-hover:shadow-md transition-all">
              <span>Lihat Selengkapnya</span>
              <Lock className="w-4 h-4" />
            </div>
          </div>
        </div>
      </button>

      {showModal && (
        <TalentPreviewModal
          talent={talent}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}