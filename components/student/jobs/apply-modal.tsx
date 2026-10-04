// components/student/jobs/apply-modal.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  X,
  Loader2,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ListChecks,
} from 'lucide-react'
import { applyToJobAction } from '@/app/student/jobs/actions'
import { uploadFile } from '@/lib/storage/upload-client'
import { ScreeningAnswerForm } from './screening-answer-form'
import {
  ScreeningQuestionInput,
  ScreeningAnswerInput,
} from '@/lib/screening/types'

type Props = {
  open: boolean
  onClose: () => void
  jobId: string
  jobTitle: string
  companyName: string
  defaultCvUrl: string | null
  defaultCvKey: string | null
  screeningQuestions?: ScreeningQuestionInput[]
}

export function ApplyModal({
  open,
  onClose,
  jobId,
  jobTitle,
  companyName,
  defaultCvUrl,
  defaultCvKey,
  screeningQuestions = [],
}: Props) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cover letter
  const [coverLetter, setCoverLetter] = useState<string>('')

  // CV
  const [useDefaultCv, setUseDefaultCv] = useState<boolean>(
    Boolean(defaultCvUrl)
  )
  const [uploadedCv, setUploadedCv] = useState<{
    url: string
    key: string
    name: string
  } | null>(null)
  const [saveAsDefault, setSaveAsDefault] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)

  // Screening
  const [screeningAnswers, setScreeningAnswers] = useState<
    ScreeningAnswerInput[]
  >([])
  const [screeningErrors, setScreeningErrors] = useState<
    Record<string, string>
  >({})

  // UI
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // ============================================
  // RESET saat close
  // ============================================

  useEffect(() => {
    if (!open) {
      setCoverLetter('')
      setUploadedCv(null)
      setSaveAsDefault(false)
      setError(null)
      setUseDefaultCv(Boolean(defaultCvUrl))
      setScreeningAnswers([])
      setScreeningErrors({})
    }
  }, [open, defaultCvUrl])

  // ============================================
  // BODY SCROLL LOCK
  // ============================================

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // ============================================
  // UPLOAD CV
  // ============================================

  async function handleFileSelect(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    setError('File maksimal 5MB')
    return
  }

  // ✅ FIX: cek extension DULU, MIME type sebagai fallback
  const name = file.name.toLowerCase()
  const isPdfByName = name.endsWith('.pdf')
  const isPdfByMime = [
    'application/pdf',
    'application/x-pdf',
    'application/octet-stream',  // ← INI (browser sering kirim ini)
    'application/acrobat',
    'applications/vnd.pdf',
    'text/pdf',
    'text/x-pdf',
  ].includes(file.type)

  if (!isPdfByName && !isPdfByMime) {
    setError('File harus PDF')
    return
  }

  setError(null)
  setUploading(true)

    try {
      const result = await uploadFile(
        file,
        'cv' as Parameters<typeof uploadFile>[1],
        'applications'
      )

      if (!result.ok) {
        setError(result.error || 'Gagal upload CV')
        return
      }

      setUploadedCv({
        url: result.url,
        key: result.key,
        name: file.name,
      })
      setUseDefaultCv(false)
    } catch (err) {
      console.error(err)
      setError('Gagal upload CV')
    } finally {
      setUploading(false)
    }
  }

  // ============================================
  // VALIDATE SCREENING
  // ============================================

  function validateScreening(): boolean {
    const e: Record<string, string> = {}
    for (const q of screeningQuestions) {
      if (!q.id) continue
      const ans = screeningAnswers.find((a) => a.questionId === q.id)

      if (q.isRequired) {
        if (q.type === 'yes_no' && ans?.answerBool === undefined) {
          e[`q_${q.id}`] = 'Wajib dijawab'
        }
        if (
          q.type === 'text' &&
          (!ans?.answerText || ans.answerText.trim() === '')
        ) {
          e[`q_${q.id}`] = 'Wajib dijawab'
        }
        if (q.type === 'number' && ans?.answerNumber === undefined) {
          e[`q_${q.id}`] = 'Wajib dijawab'
        }
        if (q.type === 'multiple_choice' && !ans?.answerChoice) {
          e[`q_${q.id}`] = 'Wajib dijawab'
        }
      }
    }
    setScreeningErrors(e)
    return Object.keys(e).length === 0
  }

  // ============================================
  // SUBMIT
  // ============================================

  async function handleSubmit() {
    if (coverLetter.trim().length < 20) {
      setError('Surat lamaran minimal 20 karakter')
      return
    }
    if (!validateScreening()) {
      setError('Lengkapi pertanyaan screening')
      return
    }

    const resumeUrl = useDefaultCv ? defaultCvUrl : uploadedCv?.url ?? null
    const resumeKey = useDefaultCv ? defaultCvKey : uploadedCv?.key ?? null

    setSubmitting(true)
    setError(null)

    const res = await applyToJobAction({
      jobId,
      coverLetter: coverLetter.trim(),
      resumeUrl,
      resumeKey,
      saveAsDefault: saveAsDefault && !!uploadedCv,
      screeningAnswers,
    })

    setSubmitting(false)

    if (!res.success) {
      setError(res.error ?? 'Gagal mengirim lamaran')
      return
    }

    router.refresh()
    onClose()
    router.push('/student/applications?applied=1')
  }

  if (!open) return null

  const canSubmit: boolean =
    !submitting &&
    !uploading &&
    coverLetter.trim().length >= 20 &&
    (useDefaultCv ? Boolean(defaultCvUrl) : Boolean(uploadedCv))

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
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-wider font-bold text-primary mb-1">
              Lamaran
            </div>
            <h2 className="text-lg font-bold text-on-surface truncate">
              {jobTitle}
            </h2>
            <p className="text-sm text-on-surface-variant truncate">
              {companyName}
            </p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ============================================ */}
          {/* 1. SURAT LAMARAN */}
          {/* ============================================ */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Surat Lamaran <span className="text-error">*</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder="Ceritakan kenapa kamu cocok untuk posisi ini, motivasi, dan apa yang bisa kamu kontribusikan..."
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 transition resize-y"
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] text-on-surface-variant">
                Minimal 20 karakter
              </span>
              <span className="text-[11px] text-on-surface-variant">
                {coverLetter.length} / 3000
              </span>
            </div>
          </div>

          {/* ============================================ */}
          {/* 2. CV / RESUME */}
          {/* ============================================ */}
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              CV / Resume
            </label>
            <p className="text-[11px] text-on-surface-variant mb-3">
              Pilih pakai CV default dari profil, atau upload CV baru.
            </p>

            <div className="space-y-3">
              {/* Default CV */}
              {defaultCvUrl && (
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    useDefaultCv
                      ? 'border-primary bg-primary/5'
                      : 'border-outline-variant/40 hover:border-primary/40'
                  }`}
                >
                  <input
                    type="radio"
                    checked={useDefaultCv}
                    onChange={() => setUseDefaultCv(true)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-on-surface">
                        Pakai CV dari Profil
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      CV default yang tersimpan di profil kamu
                    </p>
                  </div>
                  {useDefaultCv && (
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  )}
                </label>
              )}

              {/* Upload new */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  !useDefaultCv
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/40 hover:border-primary/40'
                }`}
              >
                <input
                  type="radio"
                  checked={!useDefaultCv}
                  onChange={() => setUseDefaultCv(false)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-on-surface">
                      Upload CV Baru
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Upload PDF, maksimal 5MB
                  </p>

                  {!useDefaultCv && (
                    <div className="mt-3">
                      {uploadedCv ? (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-semibold text-emerald-800 truncate flex-1">
                            {uploadedCv.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              setUploadedCv(null)
                            }}
                            className="text-emerald-700 hover:text-emerald-900"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            fileInputRef.current?.click()
                          }}
                          disabled={uploading}
                          className="w-full py-3 rounded-lg border-2 border-dashed border-outline-variant/60 hover:border-primary/40 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
                        >
                          {uploading ? (
                            <span className="inline-flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Uploading...
                            </span>
                          ) : (
                            'Pilih File PDF'
                          )}
                        </button>
                      )}

                      {uploadedCv && (
                        <label className="flex items-center gap-2 mt-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saveAsDefault}
                            onChange={(e) =>
                              setSaveAsDefault(e.target.checked)
                            }
                            className="w-4 h-4 rounded border-outline-variant text-primary"
                          />
                          <span className="text-[11px] text-on-surface-variant">
                            Simpan sebagai CV default di profil saya
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                </div>
                {!useDefaultCv && (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                )}
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                  e.target.value = ''
                }}
                className="hidden"
              />
            </div>
          </div>

          {/* ============================================ */}
          {/* 3. SCREENING QUESTIONS — DI SINI! */}
          {/* ============================================ */}
          {screeningQuestions.length > 0 && (
            <div className="pt-2 border-t border-outline-variant/30">
              <div className="flex items-center gap-2 mb-4 pt-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ListChecks className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    Pertanyaan dari Recruiter
                  </h3>
                  <p className="text-[11px] text-on-surface-variant">
                    {screeningQuestions.length} pertanyaan
                  </p>
                </div>
              </div>
              <ScreeningAnswerForm
                questions={screeningQuestions}
                answers={screeningAnswers}
                onChange={setScreeningAnswers}
                errors={screeningErrors}
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-error/5 border border-error/20">
              <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
              <p className="text-xs text-error">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-outline-variant/30 bg-surface-container-low/30 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 rounded-full bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high disabled:opacity-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              'Kirim Lamaran'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}