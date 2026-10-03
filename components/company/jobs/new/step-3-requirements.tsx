// components/company/jobs/new/step-3-requirements.tsx
'use client'

import { SkillMultiSelect } from './skill-multi-select'

type Skill = {
  id: string
  name: string
  category: string | null
}

type Data = {
  description: string
  requirements: string
  responsibilities: string | null
  benefits: string | null
  skillIds: string[]
}

type Props = {
  data: Data
  onChange: (patch: Partial<Data>) => void
  errors: Record<string, string>
  skills: Skill[]
}

export function Step3Requirements({ data, onChange, errors, skills }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Deskripsi Pekerjaan <span className="text-error">*</span>
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={6}
          placeholder="Jelaskan tentang posisi ini, tim yang akan bekerja sama, dan proyek yang akan dikerjakan..."
          className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 transition resize-y"
        />
        <div className="flex items-center justify-between mt-1">
          {errors.description ? (
            <p className="text-xs text-error">{errors.description}</p>
          ) : (
            <p className="text-xs text-on-surface-variant">
              Minimal 50 karakter
            </p>
          )}
          <span className="text-xs text-on-surface-variant">
            {data.description.length} / 5000
          </span>
        </div>
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Persyaratan <span className="text-error">*</span>
        </label>
        <textarea
          value={data.requirements}
          onChange={(e) => onChange({ requirements: e.target.value })}
          rows={5}
          placeholder="• Pendidikan minimal SMK/D3&#10;• Menguasai React & TypeScript&#10;• Komunikasi baik..."
          className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 transition resize-y font-mono text-[13px]"
        />
        {errors.requirements && (
          <p className="mt-1 text-xs text-error">{errors.requirements}</p>
        )}
      </div>

      {/* Responsibilities (Optional) */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Tanggung Jawab{' '}
          <span className="text-on-surface-variant font-normal">(opsional)</span>
        </label>
        <textarea
          value={data.responsibilities ?? ''}
          onChange={(e) =>
            onChange({ responsibilities: e.target.value || null })
          }
          rows={4}
          placeholder="• Mengembangkan fitur frontend&#10;• Berkolaborasi dengan tim designer..."
          className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 transition resize-y font-mono text-[13px]"
        />
      </div>

      {/* Benefits (Optional) */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Benefit{' '}
          <span className="text-on-surface-variant font-normal">(opsional)</span>
        </label>
        <textarea
          value={data.benefits ?? ''}
          onChange={(e) => onChange({ benefits: e.target.value || null })}
          rows={4}
          placeholder="• BPJS Kesehatan & Ketenagakerjaan&#10;• Laptop disediakan&#10;• Hybrid working..."
          className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 transition resize-y font-mono text-[13px]"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Skill yang Dibutuhkan <span className="text-error">*</span>
        </label>
        <p className="text-xs text-on-surface-variant mb-3">
          Pilih skill dari daftar master. Skill ini akan digunakan untuk Smart
          Talent Match.
        </p>
        <SkillMultiSelect
          skills={skills}
          selectedIds={data.skillIds}
          onChange={(ids) => onChange({ skillIds: ids })}
          max={20}
        />
        {errors.skillIds && (
          <p className="mt-1 text-xs text-error">{errors.skillIds}</p>
        )}
      </div>
    </div>
  )
}