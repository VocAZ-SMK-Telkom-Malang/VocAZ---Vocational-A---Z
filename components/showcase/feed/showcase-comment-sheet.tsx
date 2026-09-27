// components/showcase/feed/showcase-comment-sheet.tsx
'use client'

import { useEffect, useState, useTransition } from 'react'
import { X, Send, Loader2, Trash2, MessageCircle, Shield } from 'lucide-react'
import {
  fetchVideoComments,
  addShowcaseComment,
  deleteShowcaseComment,
} from '@/lib/student/actions'

type Comment = {
  id: string
  body: string
  createdAt: Date
  user: {
    id: string
    fullName: string | null
    avatarUrl: string | null
    role: string
  }
}

type Props = {
  videoId: string
  videoOwnerId: string
  currentUserId: string | null
  currentStudentProfileId: string | null
  currentUserRole: string | null
  isOpen: boolean
  onClose: () => void
}

function timeAgo(date: Date | string) {
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'baru saja'
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min} menit lalu`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} jam lalu`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day} hari lalu`
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

export function ShowcaseCommentSheet({
  videoId,
  videoOwnerId,
  currentUserId,
  currentStudentProfileId,
  currentUserRole,
  isOpen,
  onClose,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isStudent = currentUserRole === 'student'
  const isVideoOwner = currentStudentProfileId === videoOwnerId

  useEffect(() => {
    if (!isOpen) return
    let cancelled = false
    setLoading(true)

    fetchVideoComments(videoId, { limit: 50 })
      .then((res) => {
        if (!cancelled) {
          setComments(res.comments as Comment[])
          setLoading(false)
        }
      })
      .catch((err) => {
        console.error('Load comments error:', err)
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [videoId, isOpen])

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim() || !isStudent) return

    const tempBody = body.trim()
    setBody('')
    setError(null)

    startTransition(async () => {
      const result = await addShowcaseComment(videoId, tempBody)
      if (!result.ok) {
        setError(result.error || 'Gagal kirim komentar')
        setBody(tempBody)
        return
      }
      const res = await fetchVideoComments(videoId, { limit: 50 })
      setComments(res.comments as Comment[])
    })
  }

  function handleDelete(commentId: string) {
    const msg = isVideoOwner
      ? 'Hapus komentar ini dari videomu?'
      : 'Hapus komentar ini?'
    if (!confirm(msg)) return

    startTransition(async () => {
      const result = await deleteShowcaseComment(commentId)
      if (!result.ok) {
        setError(result.error || 'Gagal hapus')
        return
      }
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    })
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/30 shrink-0">
          <h3 className="font-display text-base font-bold text-on-surface flex items-center gap-2">
            Komentar
            {comments.length > 0 && (
              <span className="text-xs font-normal text-on-surface-variant">
                {comments.length}
              </span>
            )}
            {isVideoOwner && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                <Shield className="w-3 h-3" />
                Owner
              </span>
            )}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Owner tip */}
        {isVideoOwner && comments.length > 0 && (
          <div className="px-5 py-2 bg-primary/5 border-b border-primary/10 shrink-0">
            <p className="text-[11px] text-primary font-semibold">
              💡 Sebagai pemilik video, kamu bisa hapus komentar apapun.
            </p>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-surface-container mx-auto flex items-center justify-center mb-3">
                <MessageCircle className="w-6 h-6 text-on-surface-variant" />
              </div>
              <p className="text-sm font-semibold text-on-surface mb-1">
                Belum ada komentar
              </p>
              <p className="text-xs text-on-surface-variant">
                {isStudent
                  ? 'Jadi yang pertama berkomentar!'
                  : 'Login sebagai siswa untuk komentar.'}
              </p>
            </div>
          ) : (
            comments.map((comment) => {
              const isOwnComment = comment.user.id === currentUserId
              const canDelete = isOwnComment || isVideoOwner
              const name = comment.user.fullName || 'Anonim'
              const initials = name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)

              return (
                <div key={comment.id} className="flex items-start gap-3 group">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-primary flex items-center justify-center">
                    {comment.user.avatarUrl ? (
                      <img
                        src={comment.user.avatarUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-[10px] font-bold">
                        {initials}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-on-surface truncate">
                        {name}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        {timeAgo(comment.createdAt)}
                      </span>
                      {comment.user.id ===
                        (videoOwnerId ? undefined : undefined) &&
                        null}
                    </div>
                    <p className="text-sm text-on-surface leading-relaxed break-words whitespace-pre-wrap">
                      {comment.body}
                    </p>
                  </div>

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      aria-label="Hapus komentar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>

        <div className="border-t border-outline-variant/30 p-4 shrink-0 bg-white">
          {error && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {isStudent ? (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={
                  isVideoOwner
                    ? 'Balas komentar...'
                    : 'Tulis komentar...'
                }
                maxLength={500}
                disabled={isPending}
                className="flex-1 px-4 py-2.5 rounded-full border border-outline-variant/50 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!body.trim() || isPending}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:brightness-105 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Kirim"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          ) : (
            <div className="p-3 rounded-xl bg-surface-container-low text-center">
              <p className="text-xs text-on-surface-variant">
                Cuma siswa yang bisa komentar.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}