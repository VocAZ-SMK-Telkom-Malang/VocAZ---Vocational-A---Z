// app/student/profile/portfolio/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { getMyPortfolios, getMyAchievements } from '@/lib/queries/portfolio'
import { PortfolioAchievementClient } from '@/components/student/profile/portfolio-achievement-client'

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const [portfolios, achievements] = await Promise.all([
    getMyPortfolios(),
    getMyAchievements(),
  ])

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/student/profile"
        className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Profile
      </Link>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50/60 via-surface-container-lowest to-surface-container-lowest border border-outline-variant/30 p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" />
            Portfolio & Prestasi
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight leading-tight">
            Karya & Pencapaian
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
            Upload project yang pernah kamu buat dan prestasi yang pernah kamu
            raih. Recruiter bakal lihat ini di profile kamu.
          </p>
        </div>
      </div>

      {/* Client with Tabs */}
      <PortfolioAchievementClient
        portfolios={portfolios}
        achievements={achievements}
      />
    </div>
  )
}