// components/company/applicants/applicant-notes-panel.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StickyNote, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { updateNotesAction } from '@/app/company/jobs/[id]/applicants/actions'

type Props = {
  applicationId: string
  initialNotes: string | null
}

export function ApplicantNotesPanel({ applicationId, initialNotes }: Props) {
  const router = useRouter()
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSave() {
    console.log('[NotesPanel] Saving:', { applicationId, notesLength: notes.length })

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await updateNotesAction({ applicationId, notes })

      console.log('[NotesPanel] Result:', res)

      if (!res.success) {
        setError(res.error ?? 'Gagal simpan')
        setSaving(false)
        return
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      router.refresh()
    } catch (err) {
      console.error('[NotesPanel] Error:', err)
      setError('Terjadi kesalahan. Cek console.')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = notes !== (initialNotes ?? '')

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
      <div className="flex items-center gap-2 mb-3">
        <StickyNote className="w-4 h-4 text-amber-600" />
        <h3 className="text-sm font-bold text-on-surface">Catatan Internal</h3>
      </div>
      <p className="text-[11px] text-on-surface-variant mb-3">
        Catatan ini hanya untuk tim kamu, tidak dilihat oleh kandidat.
      </p>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={5}
        placeholder="Tulis catatan tentang kandidat..."
        className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-transparent focus:border-amber-500/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 transition resize-y"
      />

      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-on-surface-variant">
          {notes.length} / 3000
        </span>
        {hasChanges && (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 disabled:opacity-60 transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-3 h-3" />
                Simpan
              </>
            )}
          </button>
        )}
        {success && !hasChanges && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <CheckCircle2 className="w-3 h-3" />
            Tersimpan
          </span>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-start gap-2 p-2 rounded-lg bg-error/5 border border-error/20">
          <AlertCircle className="w-3.5 h-3.5 text-error shrink-0 mt-0.5" />
          <p className="text-[11px] text-error">{error}</p>
        </div>
      )}
    </div>
  )
}