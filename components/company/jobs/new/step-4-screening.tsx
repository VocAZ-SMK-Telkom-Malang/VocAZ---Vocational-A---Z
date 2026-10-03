// components/company/jobs/new/step-4-screening.tsx
'use client'

import { Plus, ListChecks, AlertCircle } from 'lucide-react'
import { ScreeningQuestionEditor } from './screening-question-editor'
import {
  ScreeningQuestionInput,
  MAX_QUESTIONS,
} from '@/lib/screening/types'

type Props = {
  questions: ScreeningQuestionInput[]
  onChange: (questions: ScreeningQuestionInput[]) => void
  errors: Record<string, string>
}

export function Step4Screening({ questions, onChange, errors }: Props) {
  function addQuestion() {
    if (questions.length >= MAX_QUESTIONS) return
    const newQ: ScreeningQuestionInput = {
      question: '',
      type: 'yes_no',
      isRequired: true,
      sortOrder: questions.length,
    }
    onChange([...questions, newQ])
  }

  function updateQuestion(
    idx: number,
    patch: Partial<ScreeningQuestionInput>
  ) {
    const updated = [...questions]
    updated[idx] = { ...updated[idx], ...patch }
    onChange(updated)
  }

  function deleteQuestion(idx: number) {
    const updated = questions
      .filter((_, i) => i !== idx)
      .map((q, i) => ({ ...q, sortOrder: i }))
    onChange(updated)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Info */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
        <ListChecks className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-on-surface">
            Screening Questions
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Tambah pertanyaan yang harus dijawab kandidat saat melamar. Pertanyaan
            ini membantu kamu memfilter kandidat yang sesuai.
          </p>
          <p className="text-xs text-primary font-semibold mt-2">
            {questions.length} / {MAX_QUESTIONS} pertanyaan
          </p>
        </div>
      </div>

      {/* Empty state */}
      {questions.length === 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border-2 border-dashed border-outline-variant/40 py-12 text-center">
          <ListChecks className="w-10 h-10 text-on-surface-variant/40 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-on-surface mb-1">
            Belum ada pertanyaan screening
          </h3>
          <p className="text-xs text-on-surface-variant mb-5 max-w-md mx-auto">
            Kandidat akan langsung apply tanpa pertanyaan tambahan. Klik tombol
            di bawah untuk menambah pertanyaan.
          </p>
          <button
            type="button"
            onClick={addQuestion}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-container transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Pertanyaan Pertama
          </button>
        </div>
      )}

      {/* Questions list */}
      {questions.length > 0 && (
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <ScreeningQuestionEditor
              key={idx}
              question={q}
              index={idx}
              onUpdate={(patch) => updateQuestion(idx, patch)}
              onDelete={() => deleteQuestion(idx)}
              canDelete={true}
            />
          ))}
        </div>
      )}

      {/* Add more */}
      {questions.length > 0 && questions.length < MAX_QUESTIONS && (
        <button
          type="button"
          onClick={addQuestion}
          className="w-full py-3 rounded-xl border-2 border-dashed border-outline-variant/40 text-on-surface-variant hover:border-primary/40 hover:text-primary transition-colors text-sm font-bold inline-flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Tambah Pertanyaan
        </button>
      )}

      {/* Max reached */}
      {questions.length >= MAX_QUESTIONS && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800">
            Maksimal {MAX_QUESTIONS} pertanyaan tercapai.
          </p>
        </div>
      )}

      {/* Errors */}
      {errors.screening && (
        <p className="text-xs text-error">{errors.screening}</p>
      )}
    </div>
  )
}