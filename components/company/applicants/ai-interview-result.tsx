// components/company/applicants/ai-interview-result.tsx
'use client'

import { useState } from 'react'
import {
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock as ClockIcon,
  Award,
} from 'lucide-react'
import {
  AI_INTERVIEW_STATUS_LABEL,
  AI_INTERVIEW_STATUS_STYLE,
} from '@/lib/ai-interview/constants'

type Answer = {
  id: string
  questionIndex: number
  question: string
  answer: string | null
  answeredAt: string | null
}

type Interview = {
  id: string
  status: string
  invitedAt: string
  completedAt: string | null
  expiresAt: string | null
  answers: Answer[]
}

export function AiInterviewResult({
  interview,
  onInvite,
  canInvite,
}: {
  interview: Interview | null
  onInvite: () => void
  canInvite: boolean
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  // Belum ada interview
  if (!interview) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-base font-bold text-on-surface mb-1">
          Belum ada AI Interview
        </h3>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto mb-5">
          Undang kandidat untuk interview awal dengan AI. Kandidat akan
          menjawab pertanyaan via teks, dan Anda akan menerima ringkasan
          jawaban.
        </p>
        {canInvite && (
          <button
            type="button"
            onClick={onInvite}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-container transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            Undang AI Interview
          </button>
        )}
      </div>
    )
  }

  const statusCfg = {
    label: AI_INTERVIEW_STATUS_LABEL[interview.status] ?? interview.status,
    style: AI_INTERVIEW_STATUS_STYLE[interview.status] ?? '',
  }

  const answeredCount = interview.answers.filter((a) => a.answer).length
  const totalCount = interview.answers.length

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">
              AI Interview
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md border font-mono text-[10px] font-bold ${statusCfg.style}`}
              >
                {statusCfg.label}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                {answeredCount} / {totalCount} pertanyaan terjawab
              </span>
            </div>
          </div>
        </div>

        {interview.status === 'completed' && (
          <div className="text-right">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              COMPLETED
            </div>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-on-surface-variant mb-5 pb-5 border-b border-outline-variant/30">
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Diundang:{' '}
          {new Date(interview.invitedAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        {interview.completedAt && (
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Selesai:{' '}
            {new Date(interview.completedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        )}
        {interview.expiresAt && interview.status === 'pending' && (
          <span className="inline-flex items-center gap-1 text-amber-600 font-semibold">
            <ClockIcon className="w-3 h-3" />
            Kadaluarsa:{' '}
            {new Date(interview.expiresAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        )}
      </div>

      {/* Answers accordion */}
      <div className="space-y-2">
        {interview.answers
          .sort((a, b) => a.questionIndex - b.questionIndex)
          .map((ans) => {
            const isExpanded = expandedIndex === ans.questionIndex
            const hasAnswer = !!ans.answer

            return (
              <div
                key={ans.id}
                className="border border-outline-variant/30 rounded-xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedIndex(isExpanded ? null : ans.questionIndex)
                  }
                  className="w-full flex items-start gap-3 p-3 text-left hover:bg-surface-container-low/50 transition-colors"
                >
                  <span
                    className={`font-mono text-[10px] font-bold shrink-0 mt-0.5 ${
                      hasAnswer ? 'text-primary' : 'text-on-surface-variant/50'
                    }`}
                  >
                    #{ans.questionIndex + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-on-surface">
                      {ans.question}
                    </p>
                    {!hasAnswer && (
                      <p className="text-[10px] text-on-surface-variant/60 mt-0.5 italic">
                        Belum dijawab
                      </p>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-on-surface-variant shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-on-surface-variant shrink-0 mt-0.5" />
                  )}
                </button>

                {isExpanded && hasAnswer && (
                  <div className="px-4 pb-4 pt-1 bg-surface-container-low/30 border-t border-outline-variant/20">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-primary">
                          A
                        </span>
                      </div>
                      <p className="text-sm text-on-surface whitespace-pre-line leading-relaxed">
                        {ans.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
      </div>

      {/* Re-invite */}
      {interview.status !== 'completed' && canInvite && (
        <div className="mt-5 pt-5 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={onInvite}
            className="w-full py-2.5 rounded-full bg-surface-container text-on-surface text-sm font-bold hover:bg-surface-container-high transition-colors"
          >
            Kirim Ulang Undangan
          </button>
        </div>
      )}
    </div>
  )
}