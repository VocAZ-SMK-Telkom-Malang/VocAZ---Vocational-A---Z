// app/(public)/talenta/[id]/page.tsx
import { notFound } from 'next/navigation'
import { getStudentProfileDetail, getViewerContext } from '@/lib/queries/student-profile-detail'
import { StudentProfileView } from '@/components/shared/student-profile/student-profile-view'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ id: string }>
}

export default async function PublicTalentPage({ params }: Props) {
  const { id } = await params
  const [profile, viewer] = await Promise.all([
    getStudentProfileDetail(id),
    getViewerContext(id),
  ])

  if (!profile || !profile.isPublic) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <StudentProfileView profile={profile} viewer={viewer} />
    </div>
  )
}