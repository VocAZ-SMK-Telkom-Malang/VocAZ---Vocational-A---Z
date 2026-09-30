// components/student/profile/follow-button.tsx
'use client'

import { UserPlus, UserCheck, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toggleFollow } from '@/app/actions/social'

type Props = {
  studentProfileId: string
  initialFollowing: boolean
  initialFollowerCount: number
  variant?: 'button' | 'compact'
}

export function FollowButton({
  studentProfileId,
  initialFollowing,
  initialFollowerCount,
  variant = 'button',
}: Props) {
  const [following, setFollowing] = useState(initialFollowing)
  const [followerCount, setFollowerCount] = useState(initialFollowerCount)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (isPending) return

    const newFollowing = !following
    setFollowing(newFollowing)
    setFollowerCount((c) => c + (newFollowing ? 1 : -1))

    startTransition(async () => {
      const result = await toggleFollow(studentProfileId)
      if (result.ok) {
        setFollowing(result.following!)
        setFollowerCount(result.followerCount!)
      } else {
        setFollowing(!newFollowing)
        setFollowerCount((c) => c + (newFollowing ? -1 : 1))
        alert(result.error)
      }
    })
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-60 ${
          following
            ? 'bg-surface-container text-on-surface-variant hover:bg-rose-50 hover:text-rose-600'
            : 'bg-primary text-white hover:bg-primary/90'
        }`}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : following ? (
          <UserCheck className="w-3.5 h-3.5" />
        ) : (
          <UserPlus className="w-3.5 h-3.5" />
        )}
        {following ? 'Following' : 'Follow'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 ${
        following
          ? 'bg-surface-container text-on-surface hover:bg-rose-50 hover:text-rose-600'
          : 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20'
      }`}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : following ? (
        <UserCheck className="w-4 h-4" />
      ) : (
        <UserPlus className="w-4 h-4" />
      )}
      {following ? 'Following' : 'Follow'}
    </button>
  )
}