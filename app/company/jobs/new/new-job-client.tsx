// app/company/jobs/new/new-job-client.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { JobFormStepper } from '@/components/company/jobs/new/job-form-stepper'
import { Step1BasicInfo } from '@/components/company/jobs/new/step-1-basic-info'
import { Step2Details } from '@/components/company/jobs/new/step-2-details'
import { Step3Requirements } from '@/components/company/jobs/new/step-3-requirements'
import { Step4Screening } from '@/components/company/jobs/new/step-4-screening'
import { Step5Review } from '@/components/company/jobs/new/step-5-review'
import { createJobAction } from './actions'
import type { ScreeningQuestionInput } from '@/lib/screening/types'

type Skill = { id: string; name: string; category: string | null }

type Props = {
  skills: Skill[]
  companyName: string
  companyLogo: string | null
  companyVerified: boolean
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
  questions: ScreeningQuestionInput[]
  expiredAt: string
  publishNow: boolean
}

const INITIAL: FormState = {
  title: '',
  employmentType: 'full_time',
  workMode: 'onsite',
  experienceLevel: null,
  quota: 1,
  location: null,
  city: '',
  province: '',
  isSalaryVisible: false,
  salaryMin: null,
  salaryMax: null,
  description: '',
  requirements: '',
  responsibilities: null,
  benefits: null,
  skillIds: [],
  questions: [],
  expiredAt: '',
  publishNow: true,
}

export function NewJobClient({
  skills,
  companyName,
  companyLogo,
  companyVerified,
}: Props) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const update = (patch: Partial<FormState>) => {
    setData((prev) => ({ ...prev, ...patch }))
    setErrors({})
    setSubmitError(null)
  }

  // ============================================
  // VALIDATION PER STEP
  // ============================================

  function validateStep1(): boolean {
    const e: Record<string, string> = {}
    if (!data.title || data.title.trim().length < 5)
      e.title = 'Judul minimal 5 karakter'
    if (data.title.length > 120) e.title = 'Judul maksimal 120 karakter'
    if (!data.employmentType) e.employmentType = 'Pilih tipe pekerjaan'
    if (!data.workMode) e.workMode = 'Pilih mode kerja'
    if (data.quota < 1) e.quota = 'Minimal 1 orang'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2(): boolean {
    const e: Record<string, string> = {}
    if (!data.city.trim()) e.city = 'Kota wajib diisi'
    if (!data.province.trim()) e.province = 'Provinsi wajib diisi'
    if (
      data.isSalaryVisible &&
      data.salaryMin &&
      data.salaryMax &&
      data.salaryMax < data.salaryMin
    ) {
      e.salaryMax = 'Gaji maksimum harus lebih besar dari minimum'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep3(): boolean {
    const e: Record<string, string> = {}
    if (data.description.trim().length < 50)
      e.description = 'Deskripsi minimal 50 karakter'
    if (data.requirements.trim().length < 20)
      e.requirements = 'Persyaratan minimal 20 karakter'
    if (data.skillIds.length === 0) e.skillIds = 'Pilih minimal 1 skill'
    if (data.skillIds.length > 20) e.skillIds = 'Maksimal 20 skill'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep4(): boolean {
    const e: Record<string, string> = {}
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i]
      if (!q.question || q.question.trim().length < 5) {
        e.screening = `Pertanyaan #${i + 1} minimal 5 karakter`
        setErrors(e)
        return false
      }
      if (
        q.type === 'multiple_choice' &&
        (!q.options || q.options.length < 2)
      ) {
        e.screening = `Pertanyaan #${i + 1} butuh minimal 2 pilihan`
        setErrors(e)
        return false
      }
    }
    setErrors({})
    return true
  }

  function validateStep5(): boolean {
    const e: Record<string, string> = {}
    if (!data.expiredAt) {
      e.expiredAt = 'Batas waktu wajib diisi'
    } else if (new Date(data.expiredAt).getTime() <= Date.now()) {
      e.expiredAt = 'Batas waktu harus di masa depan'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ============================================
  // NAVIGATION
  // ============================================

  const next = () => {
    const ok =
      step === 1
        ? validateStep1()
        : step === 2
        ? validateStep2()
        : step === 3
        ? validateStep3()
        : step === 4
        ? validateStep4()
        : true
    if (ok) setStep((s) => Math.min(5, s + 1))
  }

  const prev = () => {
    setStep((s) => Math.max(1, s - 1))
    setErrors({})
  }

  // ============================================
  // SUBMIT
  // ============================================

  async function handleSubmit() {
    // Validasi SEMUA step
    if (
      !validateStep1() ||
      !validateStep2() ||
      !validateStep3() ||
      !validateStep4() ||
      !validateStep5()
    ) {
      setSubmitError('Ada field yang belum diisi dengan benar')
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const result = await createJobAction(data)

      console.log('[NewJob] Result:', result)

      if (!result.success) {
        setSubmitError(result.error ?? 'Gagal menyimpan lowongan')
        setSubmitting(false)
        return
      }

      router.push('/company/jobs?created=1')
      router.refresh()
    } catch (err) {
      console.error('[NewJob] Error:', err)
      setSubmitError('Terjadi kesalahan. Coba lagi.')
      setSubmitting(false)
    }
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/company/jobs"
          className="w-10 h-10 rounded-full bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            Posting Lowongan Baru
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Isi detail lowongan dengan lengkap untuk menarik talenta terbaik.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <JobFormStepper currentStep={step} />

      {/* Form Content */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-6 md:p-8">
        {step === 1 && (
          <Step1BasicInfo data={data} onChange={update} errors={errors} />
        )}
        {step === 2 && (
          <Step2Details data={data} onChange={update} errors={errors} />
        )}
        {step === 3 && (
          <Step3Requirements
            data={data}
            onChange={update}
            errors={errors}
            skills={skills}
          />
        )}
        {step === 4 && (
          <Step4Screening
            questions={data.questions}
            onChange={(questions) => update({ questions })}
            errors={errors}
          />
        )}
        {step === 5 && (
          <Step5Review
            data={data}
            onChange={update}
            errors={errors}
            skills={skills}
            companyName={companyName}
            companyLogo={companyLogo}
            companyVerified={companyVerified}
          />
        )}
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="p-4 rounded-xl bg-error/5 border border-error/30 text-sm text-error">
          {submitError}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 pb-6">
        <button
          type="button"
          onClick={prev}
          disabled={step === 1 || submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-container-lowest text-on-surface border border-outline-variant/40 font-bold text-sm hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-[0_4px_16px_rgba(183,0,17,0.20)] hover:bg-primary-container transition-all hover:scale-[1.02]"
          >
            Lanjut
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-[0_4px_16px_rgba(183,0,17,0.20)] hover:bg-primary-container disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {data.publishNow ? 'Publish Lowongan' : 'Simpan sebagai Draft'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}