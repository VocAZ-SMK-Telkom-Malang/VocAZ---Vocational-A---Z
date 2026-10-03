// components/company/jobs/new/step-1-basic-info.tsx
'use client'

import { useState } from 'react'
import {
  EMPLOYMENT_OPTIONS,
  WORK_MODE_OPTIONS,
  EXPERIENCE_OPTIONS,
} from '@/lib/register/job-schemas'

type Data = {
  title: string
  employmentType: string
  workMode: string
  experienceLevel: string | null
  quota: number
}

type Props = {
  data: Data
  onChange: (patch: Partial<Data>) => void
  errors: Record<string, string>
}

export function Step1BasicInfo({ data, onChange, errors }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Judul Posisi <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Contoh: Frontend Developer (Junior React)"
          className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface placeholder:text-on-surface-variant/60 transition"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-error">{errors.title}</p>
        )}
      </div>

      {/* Employment Type */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Tipe Pekerjaan <span className="text-error">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {EMPLOYMENT_OPTIONS.map((opt) => {
            const isActive = data.employmentType === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ employmentType: opt.value })}
                className={`
                  p-3 rounded-xl border text-left transition-all
                  ${
                    isActive
                      ? 'bg-primary/5 border-primary shadow-[0_2px_8px_rgba(183,0,17,0.10)]'
                      : 'bg-surface-container-lowest border-outline-variant/40 hover:border-primary/30'
                  }
                `}
              >
                <div
                  className={`text-sm font-bold ${
                    isActive ? 'text-primary' : 'text-on-surface'
                  }`}
                >
                  {opt.label}
                </div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">
                  {opt.desc}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Mode Kerja <span className="text-error">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {WORK_MODE_OPTIONS.map((opt) => {
            const isActive = data.workMode === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ workMode: opt.value })}
                className={`
                  p-3 rounded-xl border text-left transition-all
                  ${
                    isActive
                      ? 'bg-primary/5 border-primary shadow-[0_2px_8px_rgba(183,0,17,0.10)]'
                      : 'bg-surface-container-lowest border-outline-variant/40 hover:border-primary/30'
                  }
                `}
              >
                <div
                  className={`text-sm font-bold ${
                    isActive ? 'text-primary' : 'text-on-surface'
                  }`}
                >
                  {opt.label}
                </div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">
                  {opt.desc}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Experience Level (Optional) */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Level Pengalaman <span className="text-on-surface-variant font-normal">(opsional)</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => onChange({ experienceLevel: null })}
            className={`
              p-3 rounded-xl border text-left transition-all
              ${
                data.experienceLevel === null
                  ? 'bg-primary/5 border-primary'
                  : 'bg-surface-container-lowest border-outline-variant/40 hover:border-primary/30'
              }
            `}
          >
            <div className="text-sm font-bold text-on-surface">Semua</div>
            <div className="text-[11px] text-on-surface-variant mt-0.5">
              Tidak ada filter
            </div>
          </button>

          {EXPERIENCE_OPTIONS.map((opt) => {
            const isActive = data.experienceLevel === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ experienceLevel: opt.value })}
                className={`
                  p-3 rounded-xl border text-left transition-all
                  ${
                    isActive
                      ? 'bg-primary/5 border-primary'
                      : 'bg-surface-container-lowest border-outline-variant/40 hover:border-primary/30'
                  }
                `}
              >
                <div
                  className={`text-sm font-bold ${
                    isActive ? 'text-primary' : 'text-on-surface'
                  }`}
                >
                  {opt.label}
                </div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">
                  {opt.desc}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Quota */}
      <div>
        <label className="block text-sm font-semibold text-on-surface mb-2">
          Jumlah Dibutuhkan <span className="text-error">*</span>
        </label>
        <input
          type="number"
          min={1}
          max={1000}
          value={data.quota}
          onChange={(e) => onChange({ quota: Number(e.target.value) || 1 })}
          className="w-full max-w-[200px] px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-surface-container-lowest focus:outline-none text-sm text-on-surface transition"
        />
        <p className="mt-1 text-[11px] text-on-surface-variant">
          Berapa orang yang Anda butuhkan untuk posisi ini?
        </p>
      </div>
    </div>
  )
}