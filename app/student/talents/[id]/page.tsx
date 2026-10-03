// app/student/talents/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {
  getStudentProfileDetail,
  getViewerContext,
  isFollowingTalent,
} from '@/lib/queries/student-profile-detail'
import { StudentProfileView } from '@/components/shared/student-profile/student-profile-view'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function TalentDetailPage({ params }: Props) {
  const { id } = await params
  const [profile, viewer, initialFollowing] = await Promise.all([
    getStudentProfileDetail(id),
    getViewerContext(id),
    isFollowingTalent(id),
  ])

  if (!profile) notFound()

  return (
    <div className="space-y-6">
      <Link
        href="/student/talents"
        className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar talent
      </Link>

      <StudentProfileView
        profile={profile}
        viewer={viewer}
        initialFollowing={initialFollowing}
      />
    </div>
  )
}