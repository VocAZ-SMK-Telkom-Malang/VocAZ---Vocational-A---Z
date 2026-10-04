'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef, useCallback } from 'react'
import {
  ArrowUpRight,
  Briefcase,
  BadgeCheck,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

type TalentCard = {
  profileId: string
  initials: string
  name: string
  headline: string
  school: string
  avatarUrl: string | null
  certTitle: string | null
  certBadgeType: string | null
  skills: string[]
  profileCompletion: number
  isVerified: boolean
  isOpenToWork: boolean
}

type Stat = {
  value: string
  label: string
  color: string
}

type Props = {
  stats: Stat[]
  talentCards: TalentCard[]
}

// ============================================
// HOOK
// ============================================

function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let start: number | null = null
    let raf: number

    function step(timestamp: number) {
      if (start === null) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

// ============================================
// FALLBACK
// ============================================

const FALLBACK_CARDS: TalentCard[] = [
  {
    profileId: 'demo-1',
    initials: 'MI',
    name: 'Muhammad Ilham',
    headline: 'Software Developer',
    school: 'SMK Telkom',
    avatarUrl: null,
    certTitle: 'LSP-BNSP Certified Level II',
    certBadgeType: 'lsp_bnsp',
    skills: ['Flutter Mobile', 'PostgreSQL', 'RESTful API'],
    profileCompletion: 98,
    isVerified: true,
    isOpenToWork: true,
  },
  {
    profileId: 'demo-2',
    initials: 'SN',
    name: 'Siti Nurhaliza',
    headline: 'Mechatronics Engineer',
    school: 'SMKN 1 Singosari',
    avatarUrl: null,
    certTitle: 'BNSP Automation Engineer',
    certBadgeType: 'lsp_bnsp',
    skills: ['PLC Omron', 'Robotic 6-Axis', 'SCADA'],
    profileCompletion: 96,
    isVerified: true,
    isOpenToWork: true,
  },
  {
    profileId: 'demo-3',
    initials: 'DR',
    name: 'Dimas Raditya',
    headline: 'Network Engineer',
    school: 'SMK Mitra Industri',
    avatarUrl: null,
    certTitle: 'Cisco CCNA Certified',
    certBadgeType: 'industry',
    skills: ['MikroTik MTCNA', 'Cisco CCNA', 'AWS Cloud'],
    profileCompletion: 94,
    isVerified: true,
    isOpenToWork: true,
  },
  {
    profileId: 'demo-4',
    initials: 'AP',
    name: 'Aisyah Putri',
    headline: 'UI/UX Designer',
    school: 'SMK Negeri 7 Jakarta',
    avatarUrl: null,
    certTitle: 'Google UX Design Certified',
    certBadgeType: 'industry',
    skills: ['Figma', 'Design System', 'Prototyping'],
    profileCompletion: 97,
    isVerified: true,
    isOpenToWork: true,
  },
  {
    profileId: 'demo-5',
    initials: 'RB',
    name: 'Rizky Bayu',
    headline: 'Data Analyst',
    school: 'SMK Telkom Malang',
    avatarUrl: null,
    certTitle: 'BNSP Data Analyst Level III',
    certBadgeType: 'lsp_bnsp',
    skills: ['Python', 'SQL', 'Tableau'],
    profileCompletion: 95,
    isVerified: true,
    isOpenToWork: true,
  },
  {
    profileId: 'demo-6',
    initials: 'NL',
    name: 'Nadia Larasati',
    headline: 'Digital Marketing',
    school: 'SMK Bina Nusantara',
    avatarUrl: null,
    certTitle: 'Meta Certified Digital Marketer',
    certBadgeType: 'industry',
    skills: ['SEO', 'Content Strategy', 'Meta Ads'],
    profileCompletion: 93,
    isVerified: true,
    isOpenToWork: true,
  },
]

const ROTATING_WORDS = [
  'Real Opportunity.',
  'Verified Skills.',
  'Industry Ready.',
  'Future Career.',
]

const SKILL_COLORS = [
  'bg-[#FFF0EB] text-[#B91C1C]',
  'bg-[#FEF3C7] text-[#B45309]',
  'bg-[#FCE7F3] text-[#9D174D]',
]

// ============================================
// MAIN
// ============================================

export function HeroSection({ stats, talentCards }: Props) {
  const [wordIndex, setWordIndex] = useState(0)
  const [cardIndex, setCardIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const cards =
    talentCards && talentCards.length > 0 ? talentCards : FALLBACK_CARDS

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % cards.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isPaused, cards.length])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = cardRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setTilt({ x: x * 8, y: y * -8 })
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setIsPaused(false)
  }, [])

  const current = cards[cardIndex]

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FFF8F5] to-[#FAF8F5] pt-12 pb-24">
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-tertiary-container/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
          {/* ============ LEFT ============ */}
          <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-4">
            <div className="inline-flex items-center gap-1 bg-white shadow-[0_2px_12px_rgba(220,38,38,0.06)] px-3 py-1 rounded-full mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
              <span className="font-mono text-[11px] uppercase text-primary font-bold tracking-wider">
                Platform Ekosistem Smart Career SMK
              </span>
            </div>

            <h1 className="font-display text-4xl lg:text-[56px] font-extrabold text-on-surface tracking-tight leading-[1.15] mb-6">
              Where SMK Talent Meets{' '}
              <span className="inline-grid align-top">
                {ROTATING_WORDS.map((word, i) => (
                  <span
                    key={word}
                    aria-hidden={i !== wordIndex}
                    className={`col-start-1 row-start-1 bg-gradient-to-r from-primary-container via-[#E03E3E] to-tertiary-container bg-clip-text text-transparent transition-all duration-700 ease-out pb-1 ${
                      i === wordIndex
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h1>

            <p className="text-lg text-on-surface-variant max-w-xl mb-8">
              VocAZ connects vocational high school students with verified
              portfolios, industry credentials, and career opportunities — all
              in one trusted ecosystem.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-12 w-full sm:w-auto">
              <Link
                href="/talenta"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display font-semibold px-8 py-3 rounded-full shadow-[0_8px_24px_rgba(220,38,38,0.30)] hover:brightness-105 hover:-translate-y-0.5 transition-all"
              >
                <span>Explore Talents</span>
                <ArrowUpRight className="w-[19px] h-[19px]" />
              </Link>
              <Link
                href="/lowongan"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-display font-semibold px-6 py-3 rounded-full shadow-[0_2px_10px_rgba(183,0,17,0.08)] hover:bg-[#FFF5F2] transition-all"
              >
                <span>Explore Opportunities</span>
                <Briefcase className="w-[19px] h-[19px]" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-transparent w-full">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/80 p-3 rounded-xl shadow-[0_4px_16px_rgba(183,0,17,0.04)]"
                >
                  <div
                    className={`font-display text-xl lg:text-2xl font-extrabold tracking-tight ${stat.color}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-on-surface-variant font-medium mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ============ RIGHT ============ */}
          <div
            className="lg:col-span-5 flex flex-col items-center gap-4 mt-12 lg:mt-0"
            style={{ perspective: '1200px' }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-[0_8px_24px_rgba(217,119,6,0.12)] ring-1 ring-[#FEF3C7]">
              <ShieldCheck className="w-[18px] h-[18px] text-[#B45309]" />
              <span className="font-mono text-[11px] font-bold text-[#B45309] uppercase tracking-wider">
                BNSP & BKK Verified
              </span>
            </div>

            {/* MAIN CARD — CLICKABLE */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-sm group"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className="relative w-full transition-transform duration-300 ease-out"
                style={{
                  transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(0)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div
                  className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/20 via-tertiary/10 to-transparent blur-2xl opacity-60"
                  style={{ transform: 'translateZ(-20px)' }}
                />

                {cards.map((c, i) => {
                  const isActive = i === cardIndex

                  return (
                    <div
                      key={c.profileId}
                      aria-hidden={!isActive}
                      className={`${
                        isActive
                          ? 'relative opacity-100 scale-100'
                          : 'absolute inset-0 opacity-0 scale-95 pointer-events-none'
                      }`}
                      style={{
                        transform: isActive
                          ? 'translateZ(20px)'
                          : 'translateZ(0)',
                      }}
                    >
                      {/* ✅ LINK WRAPPER — klik ke talent profile */}
                      <Link
                        href={`/talenta/${c.profileId}`}
                        className="block bg-white rounded-3xl p-6 shadow-[0_24px_60px_-20px_rgba(183,0,17,0.22)] ring-1 ring-outline-variant/20 transition-all duration-700 ease-out hover:shadow-[0_28px_70px_-16px_rgba(183,0,17,0.30)] hover:ring-primary/30 cursor-pointer"
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className="relative shrink-0">
                            {c.avatarUrl ? (
                              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/20">
                                <Image
                                  src={c.avatarUrl}
                                  alt={c.name}
                                  width={56}
                                  height={56}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold text-lg">
                                {c.initials}
                              </div>
                            )}

                            {c.isVerified && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center ring-2 ring-white">
                                <CheckCircle2 className="w-4 h-4 text-primary fill-primary-container" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-display text-base font-bold text-on-surface truncate">
                                {c.name}
                              </h3>
                              <BadgeCheck className="w-[18px] h-[18px] text-primary shrink-0" />
                            </div>
                            <p className="text-xs text-on-surface-variant truncate">
                              {c.headline} • {c.school}
                            </p>
                          </div>
                        </div>

                        {/* Cert badge */}
                        {c.certTitle && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/50 text-on-primary-fixed font-mono text-[11px] font-bold mb-4">
                            <Award className="w-[14px] h-[14px]" />
                            <span>{c.certTitle}</span>
                          </div>
                        )}

                        {/* Skills */}
                        {c.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {c.skills.slice(0, 3).map((skill, si) => (
                              <span
                                key={skill}
                                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-default ${
                                  SKILL_COLORS[si % SKILL_COLORS.length]
                                }`}
                                style={{
                                  animation: isActive
                                    ? `fadeInUp 0.5s ease-out ${0.3 + si * 0.08}s both`
                                    : 'none',
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Progress metric */}
                        <ProgressMetric
                          label="Kelengkapan Profil"
                          value={c.profileCompletion}
                          isActive={isActive}
                        />

                        {/* CTA hint */}
                        <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                          <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-on-surface-variant">
                            Lihat Profil
                          </span>
                          <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* FOOTER CARD — CLICKABLE */}
            <Link
              href={`/talenta/${current.profileId}`}
              className="relative w-full max-w-sm block group"
            >
              <div className="relative bg-white rounded-2xl px-4 py-3 shadow-[0_16px_36px_rgba(183,0,17,0.10)] ring-1 ring-outline-variant/30 overflow-hidden hover:ring-primary/30 hover:shadow-[0_20px_44px_rgba(183,0,17,0.15)] transition-all">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />

                <div className="flex items-center gap-3 pl-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Sparkles className="w-[20px] h-[20px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] text-on-surface-variant truncate">
                      Siap direkrut oleh industri
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display text-xs font-bold text-emerald-600 truncate">
                        Open to Work
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </div>
            </Link>

            {/* DOTS — ganti card, BUKAN redirect */}
            <div className="flex items-center gap-2 mt-1">
              {cards.map((c, i) => (
                <button
                  key={c.profileId}
                  onClick={() => setCardIndex(i)}
                  aria-label={`Tampilkan kartu ${c.name}`}
                  className="relative group/dot"
                >
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === cardIndex
                        ? 'w-10 bg-primary/20'
                        : 'w-2.5 bg-primary/20 group-hover/dot:bg-primary/40'
                    }`}
                  >
                    {i === cardIndex && !isPaused && (
                      <div
                        key={cardIndex}
                        className="h-full rounded-full bg-primary"
                        style={{
                          animation: 'progressFill 4s linear forwards',
                        }}
                      />
                    )}
                    {i === cardIndex && isPaused && (
                      <div className="h-full w-full rounded-full bg-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* CTA bawah — Lihat semua talent */}
            <Link
              href="/talenta"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline mt-1"
            >
              Lihat semua talenta
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes progressFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}

// ============================================
// PROGRESS METRIC
// ============================================

function ProgressMetric({
  label,
  value,
  isActive,
}: {
  label: string
  value: number
  isActive: boolean
}) {
  const animatedValue = useAnimatedNumber(isActive ? value : 0, 1200)

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-on-surface-variant font-medium">{label}</span>
        <span className="font-display font-bold text-primary tabular-nums">
          {animatedValue}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-container to-tertiary-container rounded-full transition-all duration-1000 ease-out"
          style={{ width: isActive ? `${value}%` : '0%' }}
        />
      </div>
    </div>
  )
}