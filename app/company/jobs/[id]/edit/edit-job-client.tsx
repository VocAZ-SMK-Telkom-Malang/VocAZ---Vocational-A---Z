// app/company/jobs/[id]/edit/edit-job-client.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save, AlertCircle } from 'lucide-react'
import { Step1BasicInfo } from '@/components/company/jobs/new/step-1-basic-info'
import { Step2Details } from '@/components/company/jobs/new/step-2-details'
import { Step3Requirements } from '@/components/company/jobs/new/step-3-requirements'
import type { JobDetail } from '@/lib/queries/company-job-detail'

async function updateJobAction(
  _jobId: string,
  _data: FormState,
): Promise<{ success: boolean; error?: string | null }> {
  // Temporary local fallback until the server action file is available.
  console.warn('updateJobAction is not configured for this route.')
  return {
    success: false,
    error: 'Update action belum dikonfigurasi.',
  }
}

type Skill = { id: string; name: string; category: string | null }

type Props = {
  job: JobDetail
  skills: Skill[]
}

type FormState = {
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
}

export function EditJobClient({ job, skills }: Props) {
  const router = useRouter()
  const [data, setData] = useState<FormState>({
    title: job.title,
    employmentType: job.employmentType,
    workMode: job.workMode,
    experienceLevel: job.experienceLevel,
    quota: job.quota,
    location: job.location,
    city: job.city ?? '',
    province: job.province ?? '',
    isSalaryVisible: job.isSalaryVisible,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    description: job.description ?? '',
    requirements: job.requirements ?? '',
    responsibilities: job.responsibilities,
    benefits: job.benefits,
    skillIds: job.skills.map((s) => s.id),
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const update = (patch: Partial<FormState>) => {
    setData((prev) => ({ ...prev, ...patch }))
    setErrors({})
    setSubmitError(null)
  }

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (data.title.trim().length < 5) e.title = 'Judul minimal 5 karakter'
    if (!data.city.trim()) e.city = 'Kota wajib diisi'
    if (!data.province.trim()) e.province = 'Provinsi wajib diisi'
    if (data.description.trim().length < 50)
      e.description = 'Deskripsi minimal 50 karakter'
    if (data.requirements.trim().length < 20)
      e.requirements = 'Persyaratan minimal 20 karakter'
    if (data.skillIds.length === 0) e.skillIds = 'Pilih minimal 1 skill'
    if (
      data.isSalaryVisible &&
      data.salaryMin &&
      data.salaryMax &&
      data.salaryMax < data.salaryMin
    ) {
      e.salaryMax = 'Gaji maksimal harus lebih besar dari minimum'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const res = await updateJobAction(job.id, data)
      if (!res.success) {
        setSubmitError(res.error ?? 'Gagal update')
        setSubmitting(false)
        return
      }
      router.push(`/company/jobs/${job.id}`)
      router.refresh()
    } catch (err) {
      console.error(err)
      setSubmitError('Terjadi kesalahan')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/company/jobs/${job.id}`}
          className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            Edit Lowongan
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Perubahan akan disimpan langsung ke lowongan.
          </p>
        </div>
      </div>

      {job.status === 'active' && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-bold text-amber-900">
              Lowongan sedang Aktif
            </div>
            <p className="text-xs text-amber-700 mt-0.5">
              Perubahan akan langsung terlihat oleh pelamar. Pastikan data
              sudah benar.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8 flex flex-col gap-8">
        <div>
          <h2 className="text-base font-bold text-on-surface mb-4">
            1. Info Dasar
          </h2>
          <Step1BasicInfo data={data} onChange={update} errors={errors} />
        </div>

        <div className="border-t border-outline-variant/30 pt-8">
          <h2 className="text-base font-bold text-on-surface mb-4">
            2. Lokasi & Gaji
          </h2>
          <Step2Details data={data} onChange={update} errors={errors} />
        </div>

        <div className="border-t border-outline-variant/30 pt-8">
          <h2 className="text-base font-bold text-on-surface mb-4">
            3. Detail & Skill
          </h2>
          <Step3Requirements
            data={data}
            onChange={update}
            errors={errors}
            skills={skills}
          />
        </div>
      </div>

      {submitError && (
        <div className="p-4 rounded-xl bg-error/5 border border-error/30 text-sm text-error">
          {submitError}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pb-6">
        <Link
          href={`/company/jobs/${job.id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant/40 font-bold text-sm hover:bg-surface-container transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Batal
        </Link>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-[0_4px_16px_rgba(183,0,17,0.20)] hover:bg-primary-container disabled:opacity-60 transition-all hover:scale-[1.02]"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </>
          )}
        </button>
      </div>
    </div>
  )
}