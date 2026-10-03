// components/company/jobs/new/step-5-review.tsx
'use client'

import { Calendar, CheckCircle2, ListChecks } from 'lucide-react'
import { JobPreviewCard } from './job-preview-card'
import {
  ScreeningQuestionInput,
  QUESTION_TYPE_LABEL,
} from '@/lib/screening/types'

type Skill = { id: string; name: string; category: string | null }

type Data = {
  title: string
  employmentType: string
  workMode: string
  experienceLevel: string | null
  quota: number
  location: string | null
  city: string
  province: string
  isSalaryVisible: boolean
  salaryMin: number | null
  salaryMax: number | null
  description: string
  requirements: string
  responsibilities: string | null
  benefits: string | null
  skillIds: string[]
  questions: ScreeningQuestionInput[]   // ← TAMBAH
  expiredAt: string
  publishNow: boolean
}

type Props = {
  data: Data
  onChange: (patch: Partial<Data>) => void
  errors: Record<string, string>
  skills: Skill[]
  companyName: string
  companyLogo: string | null
  companyVerified: boolean
}

export function Step5Review({
  data,
  onChange,
  errors,
  skills,
  companyName,
  companyLogo,
  companyVerified,
}: Props) {
  const selectedSkills = skills.filter((s) => data.skillIds.includes(s.id))

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]

  return (
    <div className="flex flex-col gap-6">
      {/* Review Info */}
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-4 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-bold text-on-surface">
            Review sebelum publish
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Periksa kembali data lowongan Anda. Setelah dipublish, lowongan
            akan muncul di halaman publik, student, dan BKK.
          </p>
        </div>
      </div>

      {/* Preview Card */}
      <div>
        <div className="text-sm font-bold text-on-surface mb-3">
          Preview Card
        </div>
        <JobPreviewCard
          companyName={companyName}
          companyLogo={companyLogo}
          companyVerified={companyVerified}
          title={data.title}
          employmentType={data.employmentType}
          workMode={data.workMode}
          city={data.city}
          province={data.province}
          salaryMin={data.salaryMin}
          salaryMax={data.salaryMax}
          isSalaryVisible={data.isSalaryVisible}
          skills={selectedSkills}
        />
      </div>

      {/* Screening Questions Preview */}
      {data.questions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="w-4 h-4 text-primary" />
            <div className="text-sm font-bold text-on-surface">
              Pertanyaan Screening ({data.questions.length})
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 space-y-2">
            {data.questions.map((q, idx) => (
              <div key={idx} className="flex gap-2 text-sm">
                <span className="font-mono text-[10px] font-bold text-primary shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-on-surface font-medium">
                    {q.question}
                    {q.isRequired && (
                      <span className="text-error ml-1">*</span>
                    )}
                  </p>
                  <p className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider mt-0.5">
                    {QUESTION_TYPE_LABEL[q.type]}
                    {q.type === 'multiple_choice' && q.options && (
                      <> · {q.options.length} pilihan</>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deadline */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Batas Waktu Lamaran <span className="text-error">*</span>
        </label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input
            type="date"
            value={data.expiredAt}
            min={minDate}
            onChange={(e) => onChange({ expiredAt: e.target.value })}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface transition"
          />
        </div>
        {errors.expiredAt && (
          <p className="mt-1 text-xs text-error">{errors.expiredAt}</p>
        )}
      </div>

      {/* Publish toggle */}
      <div>
        <label
          className="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer select-none transition-all"
          style={{
            borderColor: data.publishNow
              ? 'rgb(183 0 17)'
              : 'rgba(230, 189, 184, 0.4)',
            backgroundColor: data.publishNow
              ? 'rgba(183 0 17, 0.05)'
              : 'transparent',
          }}
        >
          <input
            type="checkbox"
            checked={data.publishNow}
            onChange={(e) => onChange({ publishNow: e.target.checked })}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              data.publishNow
                ? 'bg-primary border-primary'
                : 'border-outline-variant'
            }`}
          >
            {data.publishNow && (
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-on-surface">
              Publish Sekarang
            </div>
            <div className="text-xs text-on-surface-variant mt-0.5">
              {data.publishNow
                ? 'Lowongan akan langsung tayang dan bisa dilamar.'
                : 'Lowongan disimpan sebagai draft. Anda bisa publish nanti.'}
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}