// app/student/showcase/my/new/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getServerSession } from '@/lib/auth/session'
import { getCurrentStudent } from '@/lib/student/queries'
import { ShowcaseUploadForm } from '@/components/student/showcase/showcase-upload-form'

export default async function NewShowcasePage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/auth/sign-in')

  const user = await getCurrentStudent(session.user.id)
  if (!user?.studentProfile) redirect('/onboarding')

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
          Upload Video Showcase
        </h1>
        <p className="text-sm text-on-surface-variant">
          Upload video dari HP atau paste link dari platform video favoritmu.
        </p>
      </div>

      {/* Form */}
      <ShowcaseUploadForm studentProfileId={user.studentProfile.id} />
    </div>
  )
}