// components/student/jobs/save-job-button.tsx
'use client'

import { Bookmark, Loader2 } from 'lucide-react'
import { useState, useTransition, useEffect } from 'react'
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

  useEffect(() => {
    setSaved(initialSaved)
  }, [initialSaved])

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (isPending) return

    startTransition(async () => {
      try {
        const result = await toggleSaveJob(jobId)

        if (result.ok) {
          setSaved(result.data.saved)
          router.refresh()
        } else {
          // Error message yang user-friendly
          console.warn('[SaveJob] failed:', result.error)
          // Silent fail atau toast singkat, jangan alert mentah
          // Contoh pakai toast (kalau ada):
          // toast.error('Gagal menyimpan. Coba lagi.')
        }
      } catch (err) {
        console.error('[SaveJob] error:', err)
        // Silent fail — UI tetap ke state lama
      }
    })
  }

  // ... JSX sama kayak sebelumnya
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
      className={`p-1.5 rounded-lg transition-colors shrink-0 disabled:opacity-60 ${
        saved
          ? 'text-primary bg-primary/10'
          : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
      }`}
      aria-label={saved ? 'Hapus dari tersimpan' : 'Simpan lowongan'}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
      )}
    </button>
  )
}