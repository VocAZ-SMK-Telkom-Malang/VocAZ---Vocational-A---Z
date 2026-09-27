// app/student/showcase/my/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Video, Eye, Upload as UploadIcon } from 'lucide-react'
import { getServerSession } from '@/lib/auth/session'
import {
  getCurrentStudent,
  getMyShowcaseVideos,
  getMyShowcaseCount,
} from '@/lib/student/queries'
import { ShowcaseCard } from '@/components/student/showcase/showcase-card'
import { ShowcaseEmpty } from '@/components/student/showcase/showcase-empty'

export default async function MyShowcasePage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/auth/sign-in')

  const user = await getCurrentStudent(session.user.id)
  if (!user?.studentProfile) redirect('/onboarding')

  const profileId = user.studentProfile.id

  const [videos, counts] = await Promise.all([
    getMyShowcaseVideos(profileId),
    getMyShowcaseCount(profileId),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
            Showcase Saya
          </h1>
          <p className="text-sm text-on-surface-variant">
            {counts.total > 0
              ? `${counts.total} video · ${counts.published} published · ${counts.drafts} draft`
              : 'Tunjukkan skill kamu lewat video showcase'}
          </p>
        </div>

        {videos.length > 0 && (
          <Link
            href="/student/showcase/my/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-sm font-semibold shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            Upload Video Baru
          </Link>
        )}
      </div>

      {/* Stats (kalau ada video) */}
      {videos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Total
              </span>
            </div>
            <p className="font-display text-2xl font-extrabold text-on-surface">
              {counts.total}
            </p>
          </div>

          <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Published
              </span>
            </div>
            <p className="font-display text-2xl font-extrabold text-on-surface">
              {counts.published}
            </p>
          </div>

          <div className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-4">
            <div className="flex items-center gap-2 mb-2">
              <UploadIcon className="w-4 h-4 text-amber-600" />
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Draft
              </span>
            </div>
            <p className="font-display text-2xl font-extrabold text-on-surface">
              {counts.drafts}
            </p>
          </div>
        </div>
      )}

      {/* Video List / Empty */}
      {videos.length === 0 ? (
        <ShowcaseEmpty />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <ShowcaseCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}