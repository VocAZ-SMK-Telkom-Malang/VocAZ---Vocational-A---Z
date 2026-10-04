// app/page.tsx
import { LandingHeader } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/hero'
import { TalentSection } from '@/components/landing/talent-section'
import { VideoSection } from '@/components/landing/video-section'
import { OpportunitySection } from '@/components/landing/opportunity-section'
import { StakeholderSection } from '@/components/landing/stakeholder-section'
import { EcosystemSection } from '@/components/landing/ecosystem-section'
import { PartnersSection } from '@/components/landing/partners-section'
import { CTASection } from '@/components/landing/cta-section'
import { LandingFooter } from '@/components/landing/footer'
import {
  getPlatformStats,
  getFeaturedTalents,
  getFeaturedVideos,
  getFeaturedJobs,
  getFeaturedTalentCards,
} from '@/lib/queries/landing'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const session = await getServerSession()

  // ✅ TAMBAH talentCards di destructuring
  const [stats, talents, videos, jobs, dbUser, talentCards] =
    await Promise.all([
      getPlatformStats(),
      getFeaturedTalents(6),
      getFeaturedVideos(3),
      getFeaturedJobs(3),
      session?.user
        ? prisma.user.findUnique({
            where: { neonAuthUserId: session.user.id },
            select: { fullName: true, email: true, role: true },
          })
        : Promise.resolve(null),
      getFeaturedTalentCards(6), // ← panggil di sini
    ])

  return (
    <div className="w-full bg-surface min-h-screen font-body text-on-surface">
      <LandingHeader user={dbUser} />
      <main className="w-full pt-20 bg-surface min-h-screen">
        {/* ✅ PASS talentCards ke HeroSection */}
        <HeroSection stats={stats} talentCards={talentCards} />
        <TalentSection talents={talents} />
        <VideoSection videos={videos} />
        <OpportunitySection jobs={jobs as any} />
        <StakeholderSection />
        <EcosystemSection />
        <PartnersSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}