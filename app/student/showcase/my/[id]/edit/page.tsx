// app/student/showcase/my/[id]/edit/page.tsx
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getServerSession } from '@/lib/auth/session'
import {
  getCurrentStudent,
  getShowcaseVideoById,
} from '@/lib/student/queries'
import { ShowcaseUploadForm } from '@/components/student/showcase/showcase-upload-form'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditShowcasePage({ params }: Props) {
  const { id } = await params

  const session = await getServerSession()
  if (!session?.user) redirect('/auth/sign-in')

  const user = await getCurrentStudent(session.user.id)
  if (!user?.studentProfile) redirect('/onboarding')

  const video = await getShowcaseVideoById(id, user.studentProfile.id)
  if (!video) notFound()

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/student/showcase/my"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Showcase Saya
      </Link>

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
          Edit Video Showcase
        </h1>
        <p className="text-sm text-on-surface-variant">
          Perbarui informasi video showcase kamu.
        </p>
      </div>

      {/* Form */}
      <ShowcaseUploadForm
        studentProfileId={user.studentProfile.id}
        existing={{
          id: video.id,
          title: video.title,
          description: video.description,
          videoUrl: video.videoUrl,
          videoKey: video.videoKey,
          videoSource: video.videoSource,
          thumbnailUrl: video.thumbnailUrl,
          thumbnailKey: video.thumbnailKey,
          category: video.category,
          skillTags: video.skillTags,
        }}
      />
    </div>
  )
}