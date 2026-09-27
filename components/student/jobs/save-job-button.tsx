// components/student/jobs/save-job-button.tsx
'use client'

import { Bookmark, Loader2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toggleSaveJob } from '@/lib/student/actions'

type Props = {
  jobId: string
  initialSaved: boolean
  variant?: 'icon' | 'button'
}

export function SaveJobButton({
  jobId,
  initialSaved,
  variant = 'icon',
}: Props) {
  const router = useRouter()
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    startTransition(async () => {
      const result = await toggleSaveJob(jobId)
      if (result.ok) {
        setSaved(result.data.saved)
        router.refresh()
      }
    })
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all disabled:opacity-60 ${
          saved
            ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
            : 'ring-1 ring-outline-variant text-on-surface hover:bg-surface-container-low'
        }`}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        )}
        <span>{saved ? 'Tersimpan' : 'Simpan'}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2 rounded-lg transition-colors shrink-0 disabled:opacity-60 ${
        saved
          ? 'bg-primary/10 text-primary'
          : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
      }`}
      aria-label={saved ? 'Hapus dari simpanan' : 'Simpan lowongan'}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
      )}
    </button>
  )
}