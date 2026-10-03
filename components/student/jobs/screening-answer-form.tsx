// components/student/jobs/screening-answer-form.tsx
'use client'

import { AlertCircle } from 'lucide-react'
import {
  ScreeningQuestionInput,
  ScreeningAnswerInput,
  QUESTION_TYPE_LABEL,
} from '@/lib/screening/types'

type Props = {
  questions: ScreeningQuestionInput[]
  answers: ScreeningAnswerInput[]
  onChange: (answers: ScreeningAnswerInput[]) => void
  errors: Record<string, string>
}

export function ScreeningAnswerForm({
  questions,
  answers,
  onChange,
  errors,
}: Props) {
  function getAnswer(questionId: string): ScreeningAnswerInput | undefined {
    return answers.find((a) => a.questionId === questionId)
  }

  function updateAnswer(
    questionId: string,
    patch: Partial<ScreeningAnswerInput>
  ) {
    const existing = getAnswer(questionId)
    if (existing) {
      onChange(
        answers.map((a) =>
          a.questionId === questionId ? { ...a, ...patch } : a
        )
      )
    } else {
      onChange([...answers, { questionId, ...patch }])
    }
  }

  if (questions.length === 0) return null

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-on-surface">
          Pertanyaan Screening <span className="text-error">*</span>
        </h3>
        <p className="text-[11px] text-on-surface-variant mt-0.5">
          Jawab pertanyaan dari recruiter untuk melengkapi lamaran kamu.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const answer = getAnswer(q.id ?? '')
          const errKey = `q_${q.id}`
          const hasError = errors[errKey]

          return (
            <div
              key={q.id ?? idx}
              className="p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/30"
            >
              <div className="flex items-start gap-2 mb-3">
                <span className="font-mono text-[10px] font-bold text-primary shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-on-surface">
                    {q.question}
                    {q.isRequired && <span className="text-error"> *</span>}
                  </p>
                  {q.description && (
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      {q.description}
                    </p>
                  )}
                  <p className="text-[10px] text-on-surface-variant mt-0.5 font-mono uppercase tracking-wider">
                    {QUESTION_TYPE_LABEL[q.type]}
                  </p>
                </div>
              </div>

              {/* Input by type */}
              {q.type === 'yes_no' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateAnswer(q.id ?? '', { answerBool: true })
                    }
                    className={`flex-1 py-2 rounded-lg border-2 font-bold text-sm transition-all ${
                      answer?.answerBool === true
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface hover:border-emerald-500/40'
                    }`}
                  >
                    Ya
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateAnswer(q.id ?? '', { answerBool: false })
                    }
                    className={`flex-1 py-2 rounded-lg border-2 font-bold text-sm transition-all ${
                      answer?.answerBool === false
                        ? 'bg-rose-500 border-rose-500 text-white'
                        : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface hover:border-rose-500/40'
                    }`}
                  >
                    Tidak
                  </button>
                </div>
              )}

              {q.type === 'text' && (
                <textarea
                  value={answer?.answerText ?? ''}
                  onChange={(e) =>
                    updateAnswer(q.id ?? '', { answerText: e.target.value })
                  }
                  rows={3}
                  placeholder="Tulis jawabanmu..."
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm resize-y"
                />
              )}

              {q.type === 'number' && (
                <input
                  type="number"
                  value={answer?.answerNumber ?? ''}
                  onChange={(e) =>
                    updateAnswer(q.id ?? '', {
                      answerNumber: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm"
                />
              )}

              {q.type === 'multiple_choice' && (
                <div className="space-y-1.5">
                  {(q.options ?? []).map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        answer?.answerChoice === opt
                          ? 'bg-primary/5 border-primary/40'
                          : 'bg-surface-container-lowest border-outline-variant/40 hover:border-primary/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        checked={answer?.answerChoice === opt}
                        onChange={() =>
                          updateAnswer(q.id ?? '', { answerChoice: opt })
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-on-surface">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {hasError && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-error">
                  <AlertCircle className="w-3 h-3" />
                  {hasError}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}