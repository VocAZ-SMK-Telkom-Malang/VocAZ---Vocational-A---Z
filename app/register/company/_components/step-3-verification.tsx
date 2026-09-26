'use client'

import { useRouter } from 'next/navigation'
import { RegisterShell } from '@/components/register/register-shell'
import { StepNav } from '@/components/register/step-nav'
import { REGISTER_STEPS } from '@/lib/register/steps'

export function Step3Verification() {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    router.push('/register/company/4')
  }

  return (
    <RegisterShell
      role="company"
      steps={REGISTER_STEPS.company}
      currentStep={3}
      title="Verifikasi Perusahaan Anda"
      description="Bantu kami memverifikasi perusahaan Anda agar kandidat dapat mempercayai organisasi tempat mereka melamar."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-xl bg-surface-container-low text-center text-sm text-on-surface-variant">
          🚧 Form verifikasi (upload dokumen) akan diisi di step berikutnya
        </div>

        <StepNav
          prevHref="/register/company/2"
          onSubmit
          submitLabel="Kirim untuk Verifikasi"
          submitLoadingLabel="Mengirim..."
        />
      </form>
    </RegisterShell>
  )
}