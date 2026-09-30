// app/student/talents/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {
  getTalentById,
  isFollowingTalent,
  getCurrentUserContext,
} from '@/lib/queries/talent-detail'
import { TalentDetailHero } from '@/components/student/talents/talent-detail-hero'
import { TalentDetailContent } from '@/components/student/talents/talent-detail-content'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function TalentDetailPage({ params }: Props) {
  const { id } = await params
  const talent = await getTalentById(id)

  if (!talent) {
    notFound()
  }

  const [initialFollowing, currentUser] = await Promise.all([
    isFollowingTalent(id),
    getCurrentUserContext(),
  ])

  const isOwnProfile = currentUser?.studentProfile?.id === id

  return (
    <div className="space-y-6">
      <Link
        href="/student/talents"
        className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar talent
      </Link>

      <TalentDetailHero
        talent={{
          id: talent.id,
          fullName: talent.fullName,
          email: talent.email,
          avatarUrl: talent.avatarUrl,
          headline: talent.headline,
          bio: talent.bio,
          city: talent.city,
          province: talent.province,
          isOpenToWork: talent.isOpenToWork,
          followerCount: talent.followerCount,
          followingCount: talent.followingCount,
          school: talent.school,
        }}
        initialFollowing={initialFollowing}
        isOwnProfile={isOwnProfile}
      />

      <TalentDetailContent talent={talent} />
    </div>
  )
}