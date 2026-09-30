// components/student/profile/profile-feedback.tsx
'use client'

import { useState, useTransition } from 'react'
import {
  Star,
  MessageSquare,
  BadgeCheck,
  Loader2,
  Send,
  X,
  Trash2,
} from 'lucide-react'
import { addFeedback, deleteFeedback } from '@/app/actions/social'
import type { ProfileFeedbackItem } from '@/lib/queries/social'

type Props = {
  studentProfileId: string
  feedbacks: ProfileFeedbackItem[]
  stats: { count: number; averageRating: number }
  canGiveFeedback: boolean
  currentUserId?: string | null
}

export function ProfileFeedback({
  studentProfileId,
  feedbacks,
  stats,
  canGiveFeedback,
  currentUserId,
}: Props) {
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [relationship, setRelationship] = useState('teman')
  const [isPending, startTransition] = useTransition()
  const [localFeedbacks, setLocalFeedbacks] = useState(feedbacks)
  const [localStats, setLocalStats] = useState(stats)

  function handleSubmit() {
    if (!message.trim()) return

    startTransition(async () => {
      const result = await addFeedback({
        studentProfileId,
        rating,
        message,
        relationship,
      })

      if (result.ok) {
        setShowForm(false)
        setMessage('')
        setRating(5)
        // Reload page biar data fresh
        window.location.reload()
      } else {
        alert(result.error)
      }
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Hapus feedback ini?')) return

    startTransition(async () => {
      const result = await deleteFeedback(id)
      if (result.ok) {
        setLocalFeedbacks((prev) => prev.filter((f) => f.id !== id))
        setLocalStats((s) => ({ ...s, count: s.count - 1 }))
      } else {
        alert(result.error)
      }
    })
  }

  return (
    <section className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-on-surface">
              Ulasan & Feedback
            </h2>
            <p className="text-xs text-on-surface-variant">
              {localStats.count} ulasan · ⭐{' '}
              {localStats.averageRating > 0
                ? localStats.averageRating.toFixed(1)
                : '-'}
            </p>
          </div>
        </div>

        {canGiveFeedback && (
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
          >
            {showForm ? (
              <>
                <X className="w-3.5 h-3.5" />
                Batal
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Beri Feedback
              </>
            )}
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-5 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-3">
          {/* Rating */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 ${
                      n <= rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-outline-variant'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Kamu adalah...
            </label>
            <div className="flex flex-wrap gap-2">
              {['teman', 'guru', 'recruiter', 'klien', 'lainnya'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRelationship(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors capitalize ${
                    relationship === r
                      ? 'bg-primary text-white'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Pesan
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Tulis feedback kamu tentang orang ini..."
              className="w-full px-3 py-2 rounded-lg border border-outline-variant/30 bg-surface-container-lowest text-sm focus:outline-none focus:border-primary/50 resize-none"
            />
            <p className="text-[10px] text-on-surface-variant mt-1">
              {message.length}/500 karakter
            </p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!message.trim() || isPending}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Kirim Feedback
          </button>
        </div>
      )}

      {/* List */}
      {localFeedbacks.length === 0 ? (
        <div className="py-8 text-center">
          <MessageSquare className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2" />
          <p className="text-sm text-on-surface-variant">
            Belum ada feedback
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {localFeedbacks.map((f) => (
            <div
              key={f.id}
              className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                  {f.giver.avatarUrl ? (
                    <img
                      src={f.giver.avatarUrl}
                      alt={f.giver.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    f.giver.name.slice(0, 2).toUpperCase()
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-on-surface">
                      {f.giver.name}
                    </p>
                    {f.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                    {f.relationship && (
                      <span className="text-[10px] font-bold text-on-surface-variant capitalize">
                        · {f.relationship}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={`w-3 h-3 ${
                            n <= f.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-outline-variant'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-on-surface-variant">
                      {new Date(f.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-on-surface mt-2 leading-relaxed">
                    {f.message}
                  </p>
                </div>

                {/* Delete (own) */}
                {currentUserId === f.giver.id && (
                  <button
                    type="button"
                    onClick={() => handleDelete(f.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                    aria-label="Hapus feedback"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}