'use client'

import { useRouter } from 'next/navigation'
import { RegisterShell } from '@/components/register/register-shell'
import { StepNav } from '@/components/register/step-nav'
import { REGISTER_STEPS } from '@/lib/register/steps'

export function Step2Data() {
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    router.push('/register/company/3')
  }

  return (
    <RegisterShell
      role="company"
      steps={REGISTER_STEPS.company}
      currentStep={2}
      title="Beri Tahu Kami Tentang Perusahaan Anda"
      description="Berikan informasi perusahaan Anda agar kami dapat membuat profil perusahaan di VocAZ."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-xl bg-surface-container-low text-center text-sm text-on-surface-variant">
          🚧 Form data perusahaan akan diisi lengkap di step berikutnya
        </div>

        <StepNav
          prevHref="/register/company/1"
          onSubmit
          submitLabel="Simpan & Lanjutkan"
          submitLoadingLabel="Menyimpan..."
        />
      </form>
    </RegisterShell>
  )
}