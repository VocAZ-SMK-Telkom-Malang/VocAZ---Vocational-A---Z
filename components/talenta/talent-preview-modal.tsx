// components/talenta/talent-preview-modal.tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  X,
  Lock,
  LogIn,
  Sparkles,
  MapPin,
  Building2,
  BadgeCheck,
} from 'lucide-react'
import { CertificationBadge } from '@/components/shared/certification-badge'
import type { PublicTalent } from '@/lib/talenta/queries'

type Props = {
  talent: PublicTalent
  onClose: () => void
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

export function TalentPreviewModal({ talent, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const thumbnailUrl =
    talent.coverImageUrl || talent.featuredPortfolio?.thumbnailUrl || null
  const gradientClass = nameToGradient(talent.name)
  const projectTitle =
    talent.featuredPortfolio?.title || talent.featuredVideo?.title || null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-surface-container shadow-md flex items-center justify-center transition-colors"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Thumbnail header */}
        <div className="relative aspect-video overflow-hidden rounded-t-3xl">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={talent.name}
              className="w-full h-full object-cover"
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
              <div className="relative w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm ring-4 ring-white/40 flex items-center justify-center text-white font-display font-extrabold text-4xl shadow-xl">
                {talent.initials}
              </div>
            </div>
          )}

          {/* Major badge top-left */}
          {talent.major && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-on-surface text-[10px] font-bold shadow-sm">
              {talent.major}
            </span>
          )}

          {/* Cert badge top-right (DINAMIS) */}
          {talent.certTier && (
            <div className="absolute top-4 right-14">
              <CertificationBadge
                tier={talent.certTier === 'lsp_bnsp' ? 'lsp_bnsp' : 'industry'}
                size="sm"
                className="shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Project title */}
        {projectTitle && (
          <div className="px-6 py-5 border-b border-outline-variant/30 bg-surface-container-low/50">
            <p className="text-xs italic text-on-surface-variant mb-1">
              Proyek Unggulan
            </p>
            <h2 className="font-display text-base font-bold text-on-surface line-clamp-2">
              {projectTitle}
            </h2>
          </div>
        )}

        {/* Talent info */}
        <div className="px-6 py-5 border-b border-outline-variant/30">
          <div className="flex items-center gap-3 mb-3">
            {talent.avatarUrl ? (
              <img
                src={talent.avatarUrl}
                alt={talent.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-display font-extrabold text-lg">
                {talent.initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-lg font-bold text-on-surface truncate">
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

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-on-surface-variant">
            {talent.school && (
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-secondary" />
                {talent.school}
                {talent.major && ` · ${talent.major}`}
                {talent.graduationYear &&
                  ` '${String(talent.graduationYear).slice(-2)}`}
              </span>
            )}
            {talent.city && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {talent.city}
              </span>
            )}
          </div>

          {talent.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {talent.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-semibold"
                >
                  {skill}
                </span>
              ))}
              {talent.skills.length > 5 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-[10px] font-semibold">
                  +{talent.skills.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Locked box */}
        <div className="p-6">
          <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary-fixed/10 p-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="font-display text-lg font-extrabold text-on-surface mb-2">
              Konten Lengkap Terkunci
            </h3>

            <p className="text-xs text-on-surface-variant leading-relaxed mb-6 max-w-sm mx-auto">
              Untuk melihat portofolio lengkap, pengalaman kerja, kontak, dan
              mengunduh CV{' '}
              <strong className="text-on-surface">{talent.name}</strong>,
              silakan masuk atau daftar gratis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
              <Link
                href="/auth/sign-in"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border-2 border-primary text-primary font-display text-sm font-bold hover:bg-primary hover:text-white transition-all"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </Link>
              <Link
                href="/join"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-[#dc2626] text-white font-display text-sm font-bold shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Daftar Gratis
              </Link>
            </div>

            <p className="text-[11px] text-on-surface-variant">
              ✓ Gratis untuk siswa &amp; alumni SMK
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}