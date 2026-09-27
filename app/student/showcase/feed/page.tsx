// app/student/showcase/feed/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import {
  getShowcaseFeed,
  getCurrentUserContext,
  checkUserLikedVideo,
  checkUserFollowsStudent,
} from '@/lib/student/queries'
import { ShowcaseFeed } from '@/components/showcase/feed/showcase-feed'

export default async function ShowcasePage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/auth/sign-in')

  const user = await getCurrentUserContext(session.user.id)
  if (!user) redirect('/onboarding')

  const feed = await getShowcaseFeed({
    page: 1,
    limit: 5,
    excludeStudentId: user.studentProfile?.id || undefined,
  })

  let likedVideoIds: string[] = []
  let followingStudentIds: string[] = []

  if (feed.videos.length > 0) {
    const videoIds = feed.videos.map((v) => v.id)
    const studentProfileIds = [
      ...new Set(feed.videos.map((v) => v.student.id)),
    ]

    if (user.role === 'student') {
      const likes = await Promise.all(
        videoIds.map(async (id) => {
          const liked = await checkUserLikedVideo(id, user.id)
          return liked ? id : null
        })
      )
      likedVideoIds = likes.filter((id): id is string => id !== null)

      const follows = await Promise.all(
        studentProfileIds.map(async (id) => {
          const following = await checkUserFollowsStudent(user.id, id)
          return following ? id : null
        })
      )
      followingStudentIds = follows.filter(
        (id): id is string => id !== null
      )
    }
  }

  return (
    <div className="lg:space-y-6">
      {/* Header — cuma tampil di desktop */}
      <div className="hidden lg:block">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-1">
          Jelajahi Video Showcase
        </h1>
        <p className="text-sm text-on-surface-variant">
          Tonton demonstrasi skill dari talenta SMK terverifikasi.
        </p>
      </div>

      {/* Feed — full screen di mobile, nested di desktop */}
      <div
        className="
          fixed inset-0 z-40 bg-black
          lg:relative lg:inset-auto lg:z-auto lg:rounded-2xl lg:overflow-hidden
        "
        style={{
          height: '100vh',
        }}
      >
        <div
          className="w-full h-full"
          style={{
            // Desktop: kurangi tinggi biar pas di dalam layout
            // 100vh - 64px (topbar) - padding
          }}
        >
          <ShowcaseFeed
            initialVideos={feed.videos}
            initialHasMore={feed.hasMore}
            currentUserId={user.id}
            currentUserRole={user.role}
            currentStudentProfileId={user.studentProfile?.id || null}
            likedVideoIds={likedVideoIds}
            followingStudentIds={followingStudentIds}
          />
        </div>
      </div>
    </div>
  )
}