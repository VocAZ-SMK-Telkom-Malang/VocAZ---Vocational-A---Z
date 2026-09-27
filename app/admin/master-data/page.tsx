import Link from 'next/link'
import {
  GraduationCap,
  BookOpen,
  Building2,
  MapPin,
  ArrowRight,
} from 'lucide-react'
import { getMasterDataStats } from '@/lib/admin/queries'

export default async function MasterDataPage() {
  const stats = await getMasterDataStats()

  const cards = [
    {
      href: '/admin/master-data/skills',
      title: 'Skills',
      description: 'Daftar keahlian & kompetensi',
      count: stats.skills,
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      href: '/admin/master-data/school-programs',
      title: 'Program Keahlian SMK',
      description: 'RPL, TKJ, Multimedia, dll',
      count: stats.schoolPrograms,
      icon: BookOpen,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      href: '/admin/master-data/industries',
      title: 'Industri',
      description: 'Kategori industri perusahaan',
      count: stats.industries,
      icon: Building2,
      color: 'bg-amber-100 text-amber-700',
    },
    {
      href: '/admin/master-data/provinces',
      title: 'Provinsi',
      description: 'Data wilayah Indonesia',
      count: stats.provinces,
      icon: MapPin,
      color: 'bg-pink-100 text-pink-700',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Master Data
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Kelola data referensi yang digunakan di seluruh platform
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-2xl border border-outline-variant/30 p-6 hover:border-primary/30 hover:shadow-[0_12px_32px_-8px_rgba(183,0,17,0.15)] transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>

              <h3 className="font-display text-lg font-bold text-on-surface mb-1">
                {card.title}
              </h3>
              <p className="text-xs text-on-surface-variant mb-4">
                {card.description}
              </p>

              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-extrabold text-primary">
                  {card.count}
                </span>
                <span className="text-xs text-on-surface-variant">item</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}