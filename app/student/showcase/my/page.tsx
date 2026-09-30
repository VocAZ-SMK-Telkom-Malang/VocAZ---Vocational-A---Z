// app/student/showcase/my/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Video, Plus, Upload } from 'lucide-react'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { ShowcaseCard } from '@/components/student/showcase/showcase-card'
import { ShowcaseEmpty } from '@/components/student/showcase/showcase-empty'

export const dynamic = 'force-dynamic'

export default async function MyShowcasePage() {
  const session = await getServerSession()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: { studentProfile: true },
  })

  if (!user?.studentProfile) redirect('/login')

  const videos = await prisma.showcaseVideo.findMany({
    where: { studentId: user.studentProfile.id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50/60 via-surface-container-lowest to-surface-container-lowest border border-outline-variant/30 p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-[11px] font-bold uppercase tracking-wider mb-3">
              <Video className="w-3 h-3" />
              Showcase Saya
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-on-surface tracking-tight leading-tight">
              Video Showcase
            </h1>
            <p className="text-sm text-on-surface-variant mt-2 max-w-xl">
              Tunjukkan skill kamu lewat video. Upload langsung atau paste link
              YouTube / TikTok.
            </p>
          </div>

          <Link
            href="/student/showcase/my/new"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 shrink-0 shadow-md shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Upload Video
          </Link>
        </div>
      </div>

      {/* List */}
      {videos.length === 0 ? (
        <ShowcaseEmpty />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <ShowcaseCard
              key={v.id}
              video={{
                id: v.id,
                title: v.title,
                description: v.description,
                videoUrl: v.videoUrl,
                videoKey: v.videoKey,
                videoSource: v.videoSource,
                thumbnailUrl: v.thumbnailUrl,
                durationSec: v.durationSec,
                category: v.category,
                skillTags: v.skillTags,
                viewCount: v.viewCount,
                status: v.status,
                publishedAt: v.publishedAt,
                createdAt: v.createdAt,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}