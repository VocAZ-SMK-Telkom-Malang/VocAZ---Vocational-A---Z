'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  Briefcase,
  BadgeCheck,
  Award,
  ShieldCheck,
  Building2,
} from 'lucide-react'

// ============================================
// DATA
// ============================================

const ROTATING_WORDS = [
  'Real Opportunity.',
  'Verified Skills.',
  'Industry Ready.',
  'Future Career.',
]

const HERO_CARDS = [
  {
    initials: 'MI',
    name: 'Muhammad Ilham',
    headline: 'Software Developer',
    school: 'SMK Telkom',
    cert: 'LSP-BNSP Certified Level II',
    skills: ['Flutter Mobile', 'PostgreSQL', 'RESTful API'],
    score: 98,
    hire: {
      company: 'Astra Mechatronics Group',
      status: 'Offered Contract',
    },
  },
  {
    initials: 'SN',
    name: 'Siti Nurhaliza',
    headline: 'Mechatronics Engineer',
    school: 'SMKN 1 Singosari',
    cert: 'BKK Rekomendasi',
    skills: ['PLC Omron', 'Robotic 6-Axis', 'SCADA'],
    score: 96,
    hire: {
      company: 'PT Telkom Digital',
      status: 'Interview Scheduled',
    },
  },
  {
    initials: 'DR',
    name: 'Dimas Raditya',
    headline: 'Network Engineer',
    school: 'SMK Mitra Industri',
    cert: 'Cisco CCNA Certified',
    skills: ['MikroTik MTCNA', 'Cisco CCNA', 'AWS Cloud'],
    score: 94,
    hire: {
      company: 'PT Komatsu Indonesia',
      status: 'Hired',
    },
  },
]

type Stat = {
  value: string
  label: string
  color: string
}

type Props = {
  stats: Stat[]
}

export function HeroSection({ stats }: Props) {
  const [wordIndex, setWordIndex] = useState(0)
  const [cardIndex, setCardIndex] = useState(0)

  // Rotating text
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  // Rotating card
  useEffect(() => {
    const timer = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % HERO_CARDS.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

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
                Ekosistem Karier Vokasi Terpadu #1
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

          {/* ============ RIGHT — CARD STACK (PROFESIONAL) ============ */}
          <div className="lg:col-span-5 flex flex-col items-center gap-4 mt-12 lg:mt-0">
            {/* Badge — di atas kartu */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-[0_8px_24px_rgba(217,119,6,0.12)] ring-1 ring-[#FEF3C7]">
              <ShieldCheck className="w-[18px] h-[18px] text-[#B45309]" />
              <span className="font-mono text-[11px] font-bold text-[#B45309] uppercase tracking-wider">
                BNSP & BKK Verified
              </span>
            </div>

            {/* Main Card */}
            <div className="relative w-full max-w-sm">
              {HERO_CARDS.map((c, i) => (
                <div
                  key={c.name}
                  aria-hidden={i !== cardIndex}
                  className={`${
                    i === cardIndex ? 'relative opacity-100' : 'absolute inset-0 opacity-0 pointer-events-none'
                  } bg-white rounded-2xl p-6 shadow-[0_20px_40px_-15px_rgba(183,0,17,0.14)] transition-all duration-700 ease-out`}
                >
                  {/* Header: Avatar + Nama + Headline */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold text-lg shrink-0">
                      {c.initials}
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
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/50 text-on-primary-fixed font-mono text-[11px] font-bold mb-4">
                    <Award className="w-[14px] h-[14px]" />
                    <span>{c.cert}</span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {c.skills.map((skill, si) => (
                      <span
                        key={skill}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold ${
                          si === 0
                            ? 'bg-[#FFF0EB] text-[#B91C1C]'
                            : si === 1
                            ? 'bg-[#FEF3C7] text-[#B45309]'
                            : 'bg-[#FCE7F3] text-[#9D174D]'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Score bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant font-medium">
                        Skor Validasi Asesmen
                      </span>
                      <span className="font-display font-bold text-primary">
                        {c.score}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-container to-tertiary-container rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${c.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hire Card — di bawah kartu, tidak nabrak */}
            <div className="relative w-full max-w-sm bg-white rounded-2xl px-4 py-3 shadow-[0_16px_36px_rgba(183,0,17,0.10)] ring-1 ring-outline-variant/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                  <Building2 className="w-[20px] h-[20px]" />
                </div>
                <div className="min-w-0 flex-1 relative h-9">
                  {HERO_CARDS.map((c, i) => (
                    <div
                      key={c.name}
                      aria-hidden={i !== cardIndex}
                      className={`absolute inset-0 transition-all duration-700 ease-out ${
                        i === cardIndex
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 translate-y-2 pointer-events-none'
                      }`}
                    >
                      <span className="block text-[11px] text-on-surface-variant truncate">
                        {c.hire.company}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display text-xs font-bold text-primary truncate">
                          {c.hire.status}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-container shrink-0 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex items-center gap-2 mt-2">
              {HERO_CARDS.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setCardIndex(i)}
                  aria-label={`Tampilkan kartu ${c.name}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === cardIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-primary/25 hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}