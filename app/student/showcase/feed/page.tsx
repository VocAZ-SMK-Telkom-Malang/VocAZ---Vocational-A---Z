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

export const dynamic = 'force-dynamic'

export default async function ShowcasePage() {
  const session = await getServerSession()
  if (!session?.user) redirect('/auth/sign-in')

  const user = await getCurrentUserContext(session.user.id)
  if (!user) redirect('/onboarding')

  const feed = await getShowcaseFeed({
    page: 1,
    limit: 15,
    excludeStudentId: user.studentProfile?.id || undefined,
    sort: 'terbaru',
  })

  let likedVideoIds: string[] = []
  let followingStudentIds: string[] = []

  if (feed.videos.length > 0) {
    const videoIds = feed.videos.map((v) => v.id)
    const studentProfileIds = [...new Set(feed.videos.map((v) => v.student.id))]

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
      followingStudentIds = follows.filter((id): id is string => id !== null)
    }
  }

  return (
    <ShowcaseFeed
      initialVideos={feed.videos as any}
      initialHasMore={feed.hasMore}
      currentUserId={user.id}
      currentUserRole={user.role}
      currentStudentProfileId={user.studentProfile?.id || null}
      likedVideoIds={likedVideoIds}
      followingStudentIds={followingStudentIds}
    />
  )
}