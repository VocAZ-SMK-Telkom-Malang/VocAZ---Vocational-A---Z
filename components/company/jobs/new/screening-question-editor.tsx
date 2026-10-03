// components/company/jobs/new/screening-question-editor.tsx
'use client'

import { useState } from 'react'
import {
  Trash2,
  GripVertical,
  Plus,
  X,
  AlertCircle,
} from 'lucide-react'
import {
  ScreeningQuestionInput,
  ScreeningQuestionType,
  QUESTION_TYPE_LABEL,
} from '@/lib/screening/types'

type Props = {
  question: ScreeningQuestionInput
  index: number
  onUpdate: (patch: Partial<ScreeningQuestionInput>) => void
  onDelete: () => void
  canDelete: boolean
}

export function ScreeningQuestionEditor({
  question,
  index,
  onUpdate,
  onDelete,
  canDelete,
}: Props) {
  const [newOption, setNewOption] = useState('')

  function addOption() {
    if (!newOption.trim()) return
    const options = [...(question.options ?? []), newOption.trim()]
    onUpdate({ options })
    setNewOption('')
  }

  function removeOption(optIdx: number) {
    const options = (question.options ?? []).filter((_, i) => i !== optIdx)
    onUpdate({ options })
  }

  return (
    <div className="bg-surface-container-low/50 rounded-xl border border-outline-variant/30 p-4">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <GripVertical className="w-4 h-4 text-on-surface-variant/40" />
          <span className="font-mono text-xs font-bold text-primary">
            #{index + 1}
          </span>
        </div>

        <div className="flex-1 min-w-0 space-y-3">
          {/* Question */}
          <div>
            <input
              type="text"
              value={question.question}
              onChange={(e) => onUpdate({ question: e.target.value })}
              placeholder="Contoh: Apakah kamu bersedia bekerja shift?"
              className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm font-semibold transition"
            />
          </div>

          {/* Type + Required */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
                Tipe Jawaban
              </label>
              <select
                value={question.type}
                onChange={(e) =>
                  onUpdate({
                    type: e.target.value as ScreeningQuestionType,
                    options:
                      e.target.value === 'multiple_choice'
                        ? question.options ?? []
                        : undefined,
                  })
                }
                className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm cursor-pointer"
              >
                {Object.entries(QUESTION_TYPE_LABEL).map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={question.isRequired}
                  onChange={(e) => onUpdate({ isRequired: e.target.checked })}
                  className="w-4 h-4 rounded border-outline-variant text-primary"
                />
                <span className="text-sm font-semibold text-on-surface">
                  Wajib dijawab
                </span>
              </label>
            </div>
          </div>

          {/* Options (kalau multiple choice) */}
          {question.type === 'multiple_choice' && (
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
                Pilihan Jawaban
              </label>
              <div className="space-y-1.5">
                {(question.options ?? []).map((opt, optIdx) => (
                  <div
                    key={optIdx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40"
                  >
                    <span className="text-xs text-on-surface-variant">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <span className="flex-1 text-sm text-on-surface truncate">
                      {opt}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeOption(optIdx)}
                      className="text-on-surface-variant hover:text-error transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addOption()
                      }
                    }}
                    placeholder="Tambah pilihan (Enter)"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/40 focus:border-primary/30 focus:outline-none text-sm transition"
                  />
                  <button
                    type="button"
                    onClick={addOption}
                    disabled={!newOption.trim()}
                    className="p-1.5 rounded-lg bg-primary text-white disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete */}
        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/5 transition-colors shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}