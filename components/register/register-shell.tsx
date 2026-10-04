// components/register/register-shell.tsx
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, LifeBuoy } from 'lucide-react'
import { RegisterStepper } from './register-stepper'
import type { Role, Step } from '@/lib/register/steps'
import { ROLE_LABELS } from '@/lib/register/steps'

type Props = {
  role: Role
  steps: Step[]
  currentStep: number
  title: string
  description?: string
  children: React.ReactNode
  sidebar?: React.ReactNode
  backHref?: string
}

export function RegisterShell({
  role,
  steps,
  currentStep,
  title,
  description,
  children,
  sidebar,
  backHref = '/join',
}: Props) {
  const roleLabel = ROLE_LABELS[role]

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              aria-label="Kembali"
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/" className="flex items-center gap-1.5">
              <Image
                src="/vocaz.png"
                alt="VocAZ"
                width={120}
                height={32}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-on-surface-variant font-medium">
              Mendaftar sebagai
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary text-white font-mono text-[10px] font-bold uppercase tracking-wider">
              {roleLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="#"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Butuh bantuan?</span>
            </Link>
            <Link
              href="/auth/sign-in"
              className="text-xs font-semibold text-on-surface hover:text-primary transition-colors"
            >
              Masuk
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-10 sm:mb-14">
          <RegisterStepper steps={steps} currentStep={currentStep} />
        </div>

        <div
          className={
            sidebar
              ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10'
              : 'max-w-2xl mx-auto'
          }
        >
          <div className={sidebar ? 'lg:col-span-8' : ''}>
            <div className="mb-6">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">
                  {description}
                </p>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(183,0,17,0.04)] ring-1 ring-outline-variant/30 p-6 sm:p-8">
              {children}
            </div>

            <p className="text-center text-xs text-on-surface-variant mt-6">
              © 2026 VocAZ. Semua hak dilindungi.
            </p>
          </div>

          {sidebar && (
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 space-y-4">{sidebar}</div>
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}