// components/student/showcase/showcase-actions.tsx
'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  MoreVertical,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { deleteShowcaseVideo } from '@/lib/student/actions'

type Props = {
  videoId: string
}

export function ShowcaseActions({ videoId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteShowcaseVideo(videoId)
      if (!result.ok) {
        setError(result.error || 'Gagal menghapus')
        return
      }
      setConfirm(false)
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <>
      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          aria-label="Menu"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg ring-1 ring-outline-variant/30 overflow-hidden z-20">
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                router.push(`/student/showcase/my/${videoId}/edit`)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-on-surface-variant" />
              <span>Edit Video</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                setConfirm(true)
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Video</span>
            </button>
          </div>
        )}
      </div>

      {confirm && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !isPending && setConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="font-display text-base font-bold text-on-surface text-center mb-1">
              Hapus video ini?
            </h3>
            <p className="text-xs text-on-surface-variant text-center mb-5">
              Video akan dihapus permanen dari showcase kamu.
            </p>

            {error && (
              <div className="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirm(false)}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-full ring-1 ring-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-40"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}