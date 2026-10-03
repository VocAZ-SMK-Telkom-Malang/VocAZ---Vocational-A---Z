// components/company/saved/saved-card.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  BadgeCheck,
  GraduationCap,
  MessageSquare,
  UserPlus,
  Trash2,
  Star,
  Users,
  StickyNote,
  Save,
  Loader2,
  X,
} from 'lucide-react'
import { contactShowcaseTalentAction } from '@/app/company/showcase/actions'
import {
  removeSavedTalentAction,
  updateSavedNoteAction,
} from '@/app/company/saved/actions'
import type { SavedTalentItem } from '@/lib/queries/company-saved'

type Props = {
  talent: SavedTalentItem
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function SavedCard({ talent }: Props) {
  const router = useRouter()
  const [contacting, setContacting] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState(talent.note ?? '')
  const [savingNote, setSavingNote] = useState(false)

  async function handleContact() {
    setContacting(true)
    try {
      const res = await contactShowcaseTalentAction({
        studentUserId: talent.userId,
      })
      if (res.ok && res.conversationId) {
        router.push(`/company/messages?c=${res.conversationId}`)
      } else {
        alert(res.error ?? 'Gagal buka chat')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan')
    } finally {
      setContacting(false)
    }
  }

  async function handleRemove() {
    if (!confirm(`Hapus ${talent.fullName} dari Talent Pool?`)) return

    setRemoving(true)
    try {
      const res = await removeSavedTalentAction(talent.id)
      if (!res.ok) {
        alert(res.error ?? 'Gagal hapus')
        return
      }
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan')
    } finally {
      setRemoving(false)
    }
  }

  async function handleSaveNote() {
    setSavingNote(true)
    try {
      const res = await updateSavedNoteAction({
        savedId: talent.id,
        note,
      })
      if (!res.ok) {
        alert(res.error ?? 'Gagal simpan catatan')
        return
      }
      setNoteOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan')
    } finally {
      setSavingNote(false)
    }
  }

  const hasCover = !!talent.coverImageUrl

  return (
    <div className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden hover:border-primary/40 hover:shadow-[0_20px_40px_-15px_rgba(183,0,17,0.15)] transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail Cover */}
      <Link href={`/company/talent/${talent.studentId}`} className="block relative">
        <div className="relative aspect-[16/9] overflow-hidden">
          {hasCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={talent.coverImageUrl!}
              alt={talent.fullName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-fixed via-primary-fixed/60 to-tertiary-fixed/40 flex items-center justify-center">
              <span className="text-5xl font-black text-primary/30 tracking-tight">
                {talent.initials}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1.5 items-start">
              {talent.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-md">
                  <BadgeCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
              {talent.isOpenToWork && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/95 backdrop-blur-sm text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Open to Work
                </span>
              )}
            </div>
          </div>

          {/* Source badge */}
          {talent.source && (
            <div className="absolute bottom-3 right-3">
              <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                {talent.source.replace('_', ' ')}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          {talent.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={talent.avatarUrl}
              alt={talent.fullName}
              className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-surface-container-lowest -mt-8 relative z-10 shadow-md"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center font-bold text-sm shrink-0 ring-2 ring-surface-container-lowest -mt-8 relative z-10 shadow-md">
              {talent.initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <Link
                href={`/company/talent/${talent.studentId}`}
                className="text-sm font-bold text-on-surface truncate hover:text-primary transition-colors"
              >
                {talent.fullName}
              </Link>
              {talent.isVerified && (
                <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
              )}
            </div>
            {talent.headline && (
              <p className="text-xs text-on-surface-variant truncate mt-0.5">
                {talent.headline}
              </p>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-on-surface-variant mb-3">
          {talent.city && (
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              {talent.city}
            </span>
          )}
          {talent.school && (
            <span className="inline-flex items-center gap-1 truncate">
              <GraduationCap className="w-3 h-3 shrink-0" />
              <span className="truncate">{talent.school.name}</span>
            </span>
          )}
        </div>

        {/* Skills */}
        {talent.topSkills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {talent.topSkills.slice(0, 3).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px] font-semibold"
              >
                {s}
              </span>
            ))}
            {talent.topSkills.length > 3 && (
              <span className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant font-mono text-[10px] font-semibold">
                +{talent.topSkills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Note */}
        {noteOpen ? (
          <div className="mb-3 p-2 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                Catatan
              </span>
              <button
                type="button"
                onClick={() => setNoteOpen(false)}
                className="text-amber-700 hover:text-amber-900"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="Catatan tentang kandidat ini..."
              className="w-full px-2 py-1 rounded-md bg-white border border-amber-200 focus:border-amber-400 focus:outline-none text-xs resize-none"
            />
            <div className="flex items-center justify-end gap-1 mt-1.5">
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={savingNote}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500 text-white text-[10px] font-bold hover:bg-amber-600 disabled:opacity-60 transition-colors"
              >
                {savingNote ? (
                  <Loader2 className="w-2.5 h-2.5 animate-spin" />
                ) : (
                  <Save className="w-2.5 h-2.5" />
                )}
                Simpan
              </button>
            </div>
          </div>
        ) : talent.note ? (
          <div className="mb-3 p-2 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <StickyNote className="w-2.5 h-2.5" />
              Catatan
            </p>
            <p className="text-[11px] text-amber-900 line-clamp-2">
              {talent.note}
            </p>
          </div>
        ) : null}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30 mb-3">
          <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
            <Users className="w-3 h-3" />
            <span>{talent.followerCount} followers</span>
          </div>
          <span className="text-[10px] text-on-surface-variant/60 font-mono">
            {talent.savedAtRelative}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleContact}
            disabled={contacting}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-full bg-surface-container text-on-surface text-xs font-bold hover:bg-surface-container-high disabled:opacity-60 transition-colors"
          >
            {contacting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5" />
            )}
            Chat
          </button>

          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            className="w-9 h-9 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary flex items-center justify-center transition-colors shrink-0"
            title="Catatan"
          >
            <StickyNote className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="w-9 h-9 rounded-full bg-surface-container text-on-surface-variant hover:bg-error/10 hover:text-error flex items-center justify-center transition-colors shrink-0 disabled:opacity-60"
            title="Hapus dari Talent Pool"
          >
            {removing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>

          <Link
            href={`/company/talent/${talent.studentId}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-white text-xs font-bold hover:brightness-110 transition-all shadow-sm shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Profil
          </Link>
        </div>
      </div>
    </div>
  )
}