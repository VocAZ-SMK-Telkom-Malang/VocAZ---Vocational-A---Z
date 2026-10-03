// components/company/applicants/applicant-screening-answers.tsx
import { ListChecks, Check, X, Circle } from 'lucide-react'

type Answer = {
  id: string
  questionId: string
  question: {
    question: string
    type: string
    options: string[]
    isRequired: boolean
  }
  answerText: string | null
  answerBool: boolean | null
  answerNumber: number | null
  answerChoice: string | null
}

export function ApplicantScreeningAnswers({ answers }: { answers: Answer[] }) {
  if (answers.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
        <div className="flex items-center gap-2 mb-2">
          <ListChecks className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-on-surface">
            Jawaban Screening
          </h3>
        </div>
        <p className="text-xs text-on-surface-variant">
          Kandidat tidak menjawab pertanyaan screening.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-5">
      <div className="flex items-center gap-2 mb-4">
        <ListChecks className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold text-on-surface">
          Jawaban Screening ({answers.length})
        </h3>
      </div>

      <div className="space-y-3">
        {answers.map((a, idx) => (
          <div key={a.id} className="flex gap-2">
            <span className="font-mono text-[10px] font-bold text-primary shrink-0 mt-0.5">
              #{idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-on-surface">
                {a.question.question}
              </p>
              <div className="mt-1">
                {a.question.type === 'yes_no' && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                      a.answerBool
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {a.answerBool ? (
                      <>
                        <Check className="w-3 h-3" /> Ya
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" /> Tidak
                      </>
                    )}
                  </span>
                )}
                {a.question.type === 'text' && (
                  <p className="text-xs text-on-surface-variant whitespace-pre-line">
                    {a.answerText ?? '-'}
                  </p>
                )}
                {a.question.type === 'number' && (
                  <span className="font-mono text-sm font-bold text-on-surface">
                    {a.answerNumber ?? '-'}
                  </span>
                )}
                {a.question.type === 'multiple_choice' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-[10px] font-bold">
                    {a.answerChoice ?? '-'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}