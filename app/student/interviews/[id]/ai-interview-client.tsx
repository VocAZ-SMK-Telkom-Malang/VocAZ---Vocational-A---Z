// app/student/interviews/[id]/ai-interview-client.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { submitAiInterviewAnswersAction } from '../actions'

type Answer = {
  id: string
  questionIndex: number
  question: string
  answer: string | null
  answeredAt: string | null
}

type Props = {
  interview: {
    id: string
    status: string
    invitedAt: string
    completedAt: string | null
    expiresAt: string | null
    jobTitle: string
    companyName: string
    applicationId: string
    answers: Answer[]
  }
}

export function AiInterviewClient({ interview }: Props) {
  const router = useRouter()
  const isCompleted = interview.status === 'completed'
  const isExpired =
    interview.expiresAt && new Date(interview.expiresAt).getTime() < Date.now()

  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {}
    interview.answers.forEach((a) => {
      if (a.answer) initial[a.questionIndex] = a.answer
    })
    return initial
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const total = interview.answers.length
  const current = interview.answers[currentIdx]
  const answeredCount = Object.values(answers).filter((a) => a.trim().length > 0).length
  const progress = Math.round((answeredCount / total) * 100)

  function handleNext() {
    if (currentIdx < total - 1) setCurrentIdx(currentIdx + 1)
  }

  function handlePrev() {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  async function handleSubmit() {
    const answersArray = Object.entries(answers)
      .filter(([_, v]) => v.trim().length > 0)
      .map(([k, v]) => ({
        questionIndex: Number(k),
        answer: v.trim(),
      }))

    if (answersArray.length < total) {
      setError(`Harap jawab semua ${total} pertanyaan`)
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await submitAiInterviewAnswersAction({
        interviewId: interview.id,
        answers: answersArray,
      })

      console.log('[SubmitAI] Result:', res)

      if (!res.success) {
        setError(res.error ?? 'Gagal submit')
        setSubmitting(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.refresh()
        router.push('/student/interviews')
      }, 2000)
    } catch (err) {
      console.error('[SubmitAI] Error:', err)
      setError('Terjadi kesalahan')
      setSubmitting(false)
    }
  }

  // ============================================
  // STATE: COMPLETED
  // ============================================
  if (isCompleted) {
    return (
      <div className="max-w-[800px] mx-auto flex flex-col gap-6">
        <Link
          href="/student/interviews"
          className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-black text-on-surface mb-2">
            Interview Selesai
          </h1>
          <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
            Jawabanmu sudah dikirim ke {interview.companyName}. Recruiter akan
            meninjau jawabanmu dan menghubungimu jika lolos.
          </p>
          <Link
            href="/student/applications"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-container transition-colors"
          >
            Lihat Status Lamaran
          </Link>
        </div>

        {/* Show answers */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
          <h2 className="text-sm font-bold text-on-surface mb-4">
            Jawaban Kamu
          </h2>
          <div className="space-y-4">
            {interview.answers.map((a) => (
              <div key={a.id} className="border-l-2 border-primary/30 pl-4">
                <p className="text-xs font-bold text-on-surface mb-1">
                  #{a.questionIndex + 1}. {a.question}
                </p>
                <p className="text-sm text-on-surface-variant whitespace-pre-line">
                  {a.answer ?? '-'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ============================================
  // STATE: EXPIRED
  // ============================================
  if (isExpired) {
    return (
      <div className="max-w-[800px] mx-auto">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-8 text-center">
          <Clock className="w-12 h-12 text-error mx-auto mb-3" />
          <h1 className="text-xl font-black text-on-surface mb-2">
            Undangan Interview Kadaluarsa
          </h1>
          <p className="text-sm text-on-surface-variant">
            Waktu untuk mengisi interview sudah habis.
          </p>
        </div>
      </div>
    )
  }

  // ============================================
  // STATE: SUCCESS
  // ============================================
  if (success) {
    return (
      <div className="max-w-[600px] mx-auto">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-xl font-black text-on-surface mb-2">
            🎉 Jawaban Berhasil Dikirim!
          </h1>
          <p className="text-sm text-on-surface-variant">
            Recruiter akan meninjau jawabanmu.
          </p>
        </div>
      </div>
    )
  }

  // ============================================
  // STATE: PENDING — Interview form
  // ============================================
  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-4">
      {/* Back */}
      <Link
        href="/student/interviews"
        className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      {/* Header */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-on-surface">
              AI Interview — {interview.jobTitle}
            </h1>
            <p className="text-xs text-on-surface-variant">
              {interview.companyName}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-on-surface-variant">Progress</span>
            <span className="font-bold text-primary">
              {answeredCount} / {total} terjawab
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
        <div className="flex items-start gap-3 mb-4">
          <span className="font-mono text-xs font-bold text-primary shrink-0 mt-0.5">
            #{currentIdx + 1} / {total}
          </span>
          <p className="text-base font-semibold text-on-surface">
            {current.question}
          </p>
        </div>

        <textarea
          value={answers[current.questionIndex] ?? ''}
          onChange={(e) =>
            setAnswers({ ...answers, [current.questionIndex]: e.target.value })
          }
          rows={8}
          placeholder="Tulis jawabanmu di sini..."
          className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 transition resize-y"
        />

        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-on-surface-variant">
            Minimal 1 karakter
          </span>
          <span className="text-[11px] text-on-surface-variant">
            {(answers[current.questionIndex] ?? '').length} / 2000
          </span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-error/5 border border-error/20">
          <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
          <p className="text-xs text-error">{error}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIdx === 0 || submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant/40 font-bold text-sm hover:bg-surface-container disabled:opacity-40 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Sebelumnya
        </button>

        {currentIdx < total - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-all hover:scale-[1.02]"
          >
            Selanjutnya
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || answeredCount < total}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Kirim Jawaban
              </>
            )}
          </button>
        )}
      </div>

      {/* Info */}
      {answeredCount < total && (
        <p className="text-xs text-center text-on-surface-variant">
          Jawab semua {total} pertanyaan untuk mengirim
        </p>
      )}
    </div>
  )
}