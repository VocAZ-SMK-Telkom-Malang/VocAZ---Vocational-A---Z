// components/landing/opportunity-section.tsx
import Link from 'next/link'
import {
  MapPin,
  Wallet,
  BadgeCheck,
  ArrowRight,
  Compass,
  Briefcase,
} from 'lucide-react'

type Job = {
  id: string               // ← TAMBAH INI
  title: string
  company: string
  deadline: string
  location: string
  salary: string
  requirement: string
  applicants: string
}

type Props = {
  jobs: Job[]
}

export function OpportunitySection({ jobs }: Props) {
  return (
    <section className="w-full bg-[#FAF8F5] py-20 relative">
      <div className="max-w-[1240px] mx-auto px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary font-bold bg-[#FFEAE5] px-3 py-1 rounded-full">
            Jalur Karier Industri
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-on-surface mt-3 mb-2 relative inline-block">
            Your Next Opportunity Starts Here
            <svg
              className="absolute -bottom-2 left-0 w-full h-2 text-primary-container/40"
              preserveAspectRatio="none"
              viewBox="0 0 100 10"
            >
              <path
                d="M0,5 Q50,0 100,5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          </h2>
          <p className="text-on-surface-variant mt-2">
            Internships and entry roles from companies actively looking for
            SMK-trained talent.
          </p>
        </div>

        {/* Empty state */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-outline-variant/30 py-16 text-center mb-12">
            <Briefcase className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
            <p className="text-on-surface-variant text-sm">
              Belum ada lowongan aktif.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {jobs.map((job, idx) => (
              <div
                key={job.id ?? `job-${idx}`}                 // ✅ FIX: pakai id
                className="bg-white rounded-2xl p-6 shadow-[0_8px_20px_rgba(183,0,17,0.06)] hover:shadow-[0_16px_36px_rgba(183,0,17,0.12)] hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] font-mono text-[10px] font-bold uppercase tracking-wider">
                      {job.deadline}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#FFF0EB] text-[#B91C1C] font-mono text-[10px] font-bold uppercase tracking-wider">
                      Mitra BKK
                    </span>
                  </div>

                  {/* Title + Company */}
                  <h3 className="font-display text-base font-bold text-on-surface mb-1">
                    {job.title}
                  </h3>
                  <p className="text-xs text-tertiary font-semibold mb-4">
                    {job.company}
                  </p>

                  {/* Meta rows */}
                  <div className="space-y-2 mb-4 text-xs text-on-surface-variant">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{job.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Wallet className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                      <span className="font-semibold text-on-surface leading-relaxed">
                        {job.salary}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <BadgeCheck className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{job.requirement}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-surface-container flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider truncate">
                    {job.applicants}
                  </span>
                  <Link
                    href="/lowongan"
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm hover:brightness-105 active:scale-95 transition-all shrink-0"
                  >
                    <span>Lamar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/lowongan"
            className="inline-flex items-center gap-2 bg-white text-primary font-display font-semibold px-8 py-3 rounded-full shadow-[0_4px_16px_rgba(183,0,17,0.10)] hover:bg-[#FFF5F2] transition-colors"
          >
            <span>Explore All Opportunities</span>
            <Compass className="w-[18px] h-[18px]" />
          </Link>
        </div>
      </div>
    </section>
  )
}