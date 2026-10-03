import Link from 'next/link'
import {
  GraduationCap,
  Building2,
  Landmark,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react'

const stakeholders = [
  {
    icon: GraduationCap,
    title: 'Siswa & Alumni',
    desc: 'Build a profile that shows what you can actually do — then let opportunity find you.',
    cta: 'Join as Student',
    href: '/register/student/1',
    color: 'bg-primary-fixed text-primary',
  },
  {
    icon: Building2,
    title: 'Perusahaan',
    desc: 'Skip the guesswork. Discover SMK talent with verified skills and real portfolios.',
    cta: 'Join as Company',
    href: '/register/company/1',
    color: 'bg-tertiary-fixed text-tertiary',
  },
  {
    icon: Landmark,
    title: 'SMK & BKK',
    desc: 'See exactly where your students are headed, and strengthen the industry ties that get them there.',
    cta: 'Join as School',
    href: '/register/school/1',
    color: 'bg-[#FEF3C7] text-[#B45309]',
  },
  {
    icon: BadgeCheck,
    title: 'Lembaga Sertifikasi',
    desc: 'Turn every certificate you issue into a credential employers can actually trust.',
    cta: 'Join as Partner',
    href: '/register/certification/1',
    color: 'bg-[#FCE7F3] text-[#9D174D]',
  },
]

export function StakeholderSection() {
  return (
    <section className="w-full bg-[#FFF3F0] py-20 relative">
      <div className="max-w-[1240px] mx-auto px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary font-bold bg-[#FFE3DC] px-3 py-1 rounded-full">
            Peluang Kolaborasi Terbuka
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-on-surface mt-3 mb-2">
            Designed for Every Stakeholder in Vocational Growth
          </h2>
          <p className="text-on-surface-variant">
            Semua pihak saling terhubung dalam satu siklus yang transparan,
            terukur, dan berdampak nyata.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stakeholders.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 shadow-[0_8px_24px_rgba(183,0,17,0.06)] hover:shadow-[0_16px_32px_rgba(183,0,17,0.12)] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-on-surface mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <Link
                  href={item.href}
                  className="inline-flex items-center justify-between w-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-xs font-semibold px-4 py-2.5 rounded-full shadow-[0_4px_16px_rgba(220,38,38,0.22)] hover:shadow-[0_8px_20px_rgba(220,38,38,0.30)] hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <span className="whitespace-nowrap">{item.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}