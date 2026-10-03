// components/company/applicants/invite-ai-interview-modal.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react'
import { inviteAiInterviewAction } from '@/app/company/jobs/[id]/applicants/actions'
import { DEFAULT_AI_INTERVIEW_QUESTIONS } from '@/lib/ai-interview/constants'

type Props = {
  open: boolean
  onClose: () => void
  applicationId: string
  candidateName: string
}

export function InviteAiInterviewModal({
  open,
  onClose,
  applicationId,
  candidateName,
}: Props) {
  const router = useRouter()
  const [showCustom, setShowCustom] = useState(false)
  const [customQuestions, setCustomQuestions] = useState<string[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function addCustomQuestion() {
    if (newQuestion.trim().length < 5) return
    setCustomQuestions([...customQuestions, newQuestion.trim()])
    setNewQuestion('')
  }

  function removeCustomQuestion(idx: number) {
    setCustomQuestions(customQuestions.filter((_, i) => i !== idx))
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)

    try {
      const res = await inviteAiInterviewAction({
        applicationId,
        customQuestions,
      })

      console.log('[InviteAI] Result:', res)

      if (!res.success) {
        setError(res.error ?? 'Gagal invite')
        setSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error('[InviteAI] Error:', err)
      setError('Terjadi kesalahan')
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="bg-surface-container-lowest rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-6 border-b border-outline-variant/30 shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">
                Undang Interview Awal dengan AI
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {candidateName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant disabled:opacity-50 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Info */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm text-on-surface">
              Asisten AI kami akan mengajukan pertanyaan seputar pengalaman
              kerja pelamar. Anda akan menerima ringkasan jawaban interview
              dalam bentuk teks, bukan rekaman suara. Pelamar dapat meninjau
              dan mengedit ringkasannya sebelum dikirimkan ke Anda.
            </p>
          </div>

          {/* Default questions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-on-surface">
                Daftar Pertanyaan Interview dengan AI:
              </h3>
              <span className="text-[11px] text-on-surface-variant">
                {DEFAULT_AI_INTERVIEW_QUESTIONS.length} pertanyaan default
              </span>
            </div>
            <ol className="space-y-1.5 pl-1">
              {DEFAULT_AI_INTERVIEW_QUESTIONS.map((q, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-on-surface">
                  <span className="font-mono text-[10px] font-bold text-primary shrink-0 mt-0.5">
                    {idx + 1}.
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Toggle custom */}
          <button
            type="button"
            onClick={() => setShowCustom((v) => !v)}
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            {showCustom ? '− Sembunyikan' : '+ Tambah'} pertanyaan custom
          </button>

          {/* Custom questions */}
          {showCustom && (
            <div className="space-y-3 p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30">
              {customQuestions.map((q, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40"
                >
                  <span className="font-mono text-[10px] font-bold text-primary shrink-0 mt-1">
                    #{DEFAULT_AI_INTERVIEW_QUESTIONS.length + idx + 1}
                  </span>
                  <span className="flex-1 text-sm text-on-surface">{q}</span>
                  <button
                    type="button"
                    onClick={() => removeCustomQuestion(idx)}
                    className="text-on-surface-variant hover:text-error"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomQuestion()
                    }
                  }}
                  placeholder="Tulis pertanyaan custom (Enter)"
                  className="flex-1 px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={addCustomQuestion}
                  disabled={newQuestion.trim().length < 5}
                  className="p-2 rounded-lg bg-primary text-white disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-error/5 border border-error/20">
              <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
              <p className="text-xs text-error">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-xs font-semibold text-emerald-800">
                Undangan interview berhasil dikirim!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-outline-variant/30 bg-surface-container-low/30 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-full bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high disabled:opacity-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || success}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-container disabled:opacity-60 transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengirim...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Terkirim
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Undang Interview dengan AI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}