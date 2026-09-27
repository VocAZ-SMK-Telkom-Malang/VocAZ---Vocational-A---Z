'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import {
  X,
  MapPin,
  CheckCircle2,
  Shield,
  GraduationCap,
  Lock,
  LogIn,
  Sparkles,
  Video,
} from 'lucide-react'

type Talent = {
  id: string
  name: string
  initials: string
  headline: string
  city: string | null
  province: string | null
  avatarUrl: string | null
  school: string
  major: string
  graduationYear: number | null
  isVerified: boolean
  skills: string[]
  video: {
    id: string
    title: string
    category: string | null
    duration: number | null
    durationFormatted: string
    thumbnailUrl: string | null
    videoUrl: string
  } | null
}

type Props = {
  talent: Talent | null
  onClose: () => void
}

export function TalentPreviewModal({ talent, onClose }: Props) {
  useEffect(() => {
    if (talent) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [talent])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!talent) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-surface-container shadow-md transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="p-6 md:p-8 border-b border-outline-variant/30">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="relative shrink-0">
              {talent.avatarUrl ? (
                <img
                  src={talent.avatarUrl}
                  alt={talent.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary-fixed"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-display font-extrabold text-2xl ring-4 ring-primary-fixed">
                  {talent.initials}
                </div>
              )}
              {talent.isVerified && (
                <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center border-4 border-white">
                  <CheckCircle2 className="w-4 h-4" strokeWidth={3} />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0 pr-8">
              <h2 className="font-display text-xl md:text-2xl font-extrabold text-on-surface mb-1">
                {talent.name}
              </h2>
              <p className="text-sm text-primary font-semibold mb-3">
                {talent.headline}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-on-surface-variant">
                {talent.school && (
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                    <span className="font-medium text-on-surface">
                      {talent.school}
                    </span>
                    {talent.major && (
                      <>
                        <span>•</span>
                        <span>
                          {talent.major}
                          {talent.graduationYear &&
                            ` '${String(talent.graduationYear).slice(-2)}`}
                        </span>
                      </>
                    )}
                  </span>
                )}
                {(talent.city || talent.province) && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {[talent.city, talent.province]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </span>
                )}
              </div>

              {talent.isVerified && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  LSP-BNSP Certified
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SKILLS */}
        {talent.skills.length > 0 && (
          <div className="p-6 md:p-8 border-b border-outline-variant/30">
            <h3 className="font-display text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
              Skills ({talent.skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {talent.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO PREVIEW */}
        {talent.video && (
          <div className="p-6 md:p-8 border-b border-outline-variant/30">
            <h3 className="font-display text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">
              Video Showcase
            </h3>
            <div className="bg-surface-container-low rounded-xl overflow-hidden">
              <div className="relative aspect-video bg-[#293040] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                  <Video className="w-7 h-7" />
                </div>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[11px]">
                  {talent.video.durationFormatted}
                </span>
                {talent.video.category && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-on-surface font-mono text-[10px] font-bold">
                    {talent.video.category}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-on-surface line-clamp-2">
                  {talent.video.title}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* LOCKED */}
        <div className="p-6 md:p-8">
          <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary-fixed/10 p-6 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-3">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="font-display text-lg font-extrabold text-on-surface mb-2">
              Konten Lengkap Terkunci
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-5 max-w-sm mx-auto">
              Untuk melihat portofolio lengkap, pengalaman kerja, kontak, dan
              mengunduh CV <strong>{talent.name}</strong>, silakan masuk atau
              daftar gratis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <Link
                href="/auth/sign-in"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 border-primary text-primary font-display text-sm font-bold hover:bg-primary hover:text-white transition-all"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </Link>
              <Link
                href="/join"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-primary text-white font-display text-sm font-bold shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:opacity-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Daftar Gratis
              </Link>
            </div>

            <p className="text-[11px] text-on-surface-variant mt-3">
              ✓ Gratis untuk siswa & alumni SMK
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}