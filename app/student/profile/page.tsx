// app/student/profile/page.tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight, FolderGit2, Trophy, Video } from 'lucide-react'
import {
  getCurrentStudentProfile,
  getProfileStats,
} from '@/lib/queries/profile'
import { ProfileHero } from '@/components/student/profile/profile-hero'
import { ProfileStats } from '@/components/student/profile/profile-stats'
import { ProfileSkillsInline } from '@/components/student/profile/profile-skills-inline'
import { ProfileEducationInline } from '@/components/student/profile/profile-education-inline'
import { ProfileExperienceInline } from '@/components/student/profile/profile-experience-inline'
import { ProfileCertificationsSummary } from '@/components/student/profile/profile-certifications-summary'

export const dynamic = 'force-dynamic'

export default async function MyProfilePage() {
  const profile = await getCurrentStudentProfile()
  const stats = await getProfileStats()

  if (!profile || !stats) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      {/* HERO */}
      <ProfileHero
        profile={{
          id: profile.id,
          userId: profile.userId,
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          headline: profile.headline,
          bio: profile.bio,
          city: profile.city,
          province: profile.province,
          address: profile.address,
          gender: profile.gender,
          dateOfBirth: profile.dateOfBirth,
          coverImageUrl: profile.coverImageUrl,
          coverImageKey: profile.coverImageKey,
          avatarUrl: profile.avatarUrl,
          avatarKey: profile.avatarKey,
          isOpenToWork: profile.isOpenToWork,
          isPublic: profile.isPublic,
          followerCount: profile.followerCount,
          followingCount: profile.followingCount,
        }}
      />

      {/* STATS */}
      <ProfileStats
        stats={stats}
        profileCompletion={profile.profileCompletion}
      />

      {/* SKILLS — Inline CRUD */}
      <ProfileSkillsInline skills={profile.skills} />

      {/* PENDIDIKAN — Inline CRUD */}
      <ProfileEducationInline educations={profile.educations} />

      {/* PENGALAMAN — Inline CRUD */}
      <ProfileExperienceInline experiences={profile.experiences} />

      {/* SERTIFIKAT — Preview + Link */}
      <ProfileCertificationsSummary
        certificates={profile.certificates.map((c) => ({
          id: c.id,
          title: c.title,
          certificateNumber: c.certificateNumber,
          issuedDate: c.issuedDate,
          expiredDate: c.expiredDate,
          documentUrl: c.documentUrl,
          badgeType: c.badgeType,
          verificationStatus: c.verificationStatus,
          institutionName: c.institution?.name ?? null,
          institutionType: c.institution?.type ?? null,
        }))}
      />

      {/* PORTFOLIO & PRESTASI — Preview + Link */}
      <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black text-on-surface">
              Portfolio & Prestasi
            </h2>
          </div>
          <Link
            href="/student/profile/portfolio"
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-4"
          >
            Kelola
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/student/profile/portfolio"
            className="group flex items-center gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-black text-on-surface leading-none">
                {profile.portfolios.length}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">
                Project
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>

          <Link
            href="/student/profile/portfolio"
            className="group flex items-center gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-black text-on-surface leading-none">
                {profile.achievements.length}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">
                Prestasi
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </Link>
        </div>
      </section>

      {/* SHOWCASE — Preview */}
      {profile.showcaseVideos.length > 0 && (
        <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-on-surface">
                Showcase Video{' '}
                <span className="text-on-surface-variant font-bold">
                  ({profile.showcaseVideos.length})
                </span>
              </h2>
            </div>
            <Link
              href="/student/showcase/my"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline underline-offset-4"
            >
              Kelola
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {profile.showcaseVideos.map((v) => (
              <Link
                key={v.id}
                href={`/showcase/${v.id}`}
                className="group relative aspect-video rounded-xl overflow-hidden bg-surface-container border border-outline-variant/30"
              >
                {v.thumbnailUrl ? (
                  <img
                    src={v.thumbnailUrl}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                    <Video className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-xs font-bold text-white line-clamp-1">
                    {v.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}