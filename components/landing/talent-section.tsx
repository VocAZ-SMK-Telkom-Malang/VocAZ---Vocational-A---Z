import Link from 'next/link'
import { Star, Award, ChevronRight, Users, ArrowRight } from 'lucide-react'

type Talent = {
  name: string
  school: string
  badge: string
  badgeType: 'bnsp' | 'bkk'
  skills: string[]
  footer: string
  initials: string
}

type Props = {
  talents: Talent[]
}

export function TalentSection({ talents }: Props) {
  // Empty state
  if (talents.length === 0) {
    return (
      <section className="w-full bg-[#FFF6F4] py-20 relative">
        <div className="max-w-[1240px] mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="font-mono text-[11px] uppercase tracking-wider text-primary font-bold bg-[#FFE8E3] px-3 py-1 rounded-full">
              Etalase Keahlian Teruji
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-on-surface mt-3 mb-2">
              Meet the Next Generation of{' '}
              <span className="bg-gradient-to-r from-primary-container to-tertiary-container bg-clip-text text-transparent">
                Skilled Talent
              </span>
            </h2>
            <p className="text-on-surface-variant">
              Real students. Real projects. Verified by the credentials that matter.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-outline-variant/30 py-16 text-center">
            <Users className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
            <p className="text-on-surface-variant text-sm">
              Belum ada talenta terdaftar.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-[#FFF6F4] py-20 relative">
      <div className="max-w-[1240px] mx-auto px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary font-bold bg-[#FFE8E3] px-3 py-1 rounded-full">
            Etalase Keahlian Teruji
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-on-surface mt-3 mb-2">
            Meet the Next Generation of{' '}
            <span className="bg-gradient-to-r from-primary-container to-tertiary-container bg-clip-text text-transparent">
              Skilled Talent
            </span>
          </h2>
          <p className="text-on-surface-variant">
            Real students. Real projects. Verified by the credentials that matter.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {talents.map((talent) => {
            const BadgeIcon = talent.badgeType === 'bnsp' ? Star : Award

            return (
              <div
                key={talent.name}
                className="bg-white rounded-2xl p-6 shadow-[0_8px_24px_rgba(183,0,17,0.06)] hover:shadow-[0_16px_36px_rgba(183,0,17,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Header: Avatar + Badge */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-fixed to-tertiary-fixed flex items-center justify-center text-primary font-bold shrink-0">
                      {talent.initials}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider ${
                        talent.badgeType === 'bnsp'
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : 'bg-[#FFE8E3] text-primary'
                      }`}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      {talent.badge}
                    </span>
                  </div>

                  {/* Name + School */}
                  <h3 className="font-display text-base font-bold text-on-surface">
                    {talent.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-3">
                    {talent.school}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {talent.skills.map((skill, i) => (
                      <span
                        key={skill}
                        className={`px-2 py-0.5 rounded-md font-mono text-[11px] ${
                          i === 0
                            ? 'bg-[#FFF0EB] text-[#B91C1C]'
                            : i === 1
                            ? 'bg-[#FEF3C7] text-[#B45309]'
                            : 'bg-[#FCE7F3] text-[#9D174D]'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Achievement + Link */}
                <div className="pt-3 flex items-center justify-between border-t border-surface-container">
                  <span className="font-display text-xs font-semibold text-[#B45309] truncate">
                    {talent.footer}
                  </span>
                  <Link
                    href="/talenta"
                    className="text-primary font-display text-xs font-semibold hover:underline flex items-center gap-0.5 shrink-0 ml-2"
                  >
                    <span>Lihat</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/talenta"
            className="inline-flex items-center gap-2 bg-primary-container text-white font-display font-semibold px-8 py-3 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:bg-[#c92a2a] transition-all"
          >
            <span>Explore All Talents</span>
            <ArrowRight className="w-[18px] h-[18px]" />
          </Link>
        </div>
      </div>
    </section>
  )
}