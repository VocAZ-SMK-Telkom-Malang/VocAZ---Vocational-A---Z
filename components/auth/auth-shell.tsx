import Link from 'next/link'
import { GraduationCap, ShieldCheck, Sparkles } from 'lucide-react'

type Props = {
  children: React.ReactNode
  title: string
  subtitle?: string
  footer?: React.ReactNode
  side: 'sign-in' | 'sign-up'
}

export function AuthShell({ children, title, subtitle, footer, side }: Props) {
  const sideContent = {
    'sign-in': {
      badge: 'Selamat Datang Kembali',
      heading: (
        <>
          Lanjutkan <span className="text-white/95">perjalanan karier</span>{' '}
          kamu.
        </>
      ),
      description:
        'Masuk untuk mengakses dashboard, portofolio, dan peluang karier yang sudah menunggu.',
      features: [
        'Dashboard personal untuk setiap role',
        'Akses portofolio & sertifikat terverifikasi',
        'Notifikasi peluang karier terbaru',
      ],
    },
    'sign-up': {
      badge: 'Mulai Gratis Sekarang',
      heading: (
        <>
          Bangun <span className="text-white/95">masa depan vokasi</span>{' '}
          yang lebih baik.
        </>
      ),
      description:
        'Bergabung dengan ribuan talenta SMK, perusahaan, dan lembaga yang mempercayai VocAZ.',
      features: [
        'Gratis untuk semua role',
        'Profil & portofolio terverifikasi BNSP',
        'Terhubung langsung dengan industri',
      ],
    },
  }[side]

  return (
    <div className="min-h-screen flex bg-surface">
      {/* ============ LEFT — BRANDING ============ */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-container via-[#E03E3E] to-[#B70011] text-white">
        {/* Ambient lights */}
        <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 w-fit">
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center ring-1 ring-white/30">
              <span className="text-white font-display font-extrabold text-sm">
                V
              </span>
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Voc<span className="text-white/70">AZ</span>
            </span>
          </Link>

          {/* Middle content */}
          <div className="max-w-md">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
                {sideContent.badge}
              </span>
            </div>

            <h1 className="font-display text-3xl xl:text-4xl font-extrabold leading-[1.15] tracking-tight mb-4">
              {sideContent.heading}
            </h1>

            <p className="text-base text-white/85 leading-relaxed mb-8">
              {sideContent.description}
            </p>

            <ul className="space-y-3">
              {sideContent.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/15 ring-1 ring-white/25 flex items-center justify-center shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-white/90 leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom — trust badges */}
          <div className="flex items-center gap-3 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/15">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-mono font-bold uppercase tracking-wider text-[10px]">
                BNSP Verified
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 ring-1 ring-white/15">
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="font-mono font-bold uppercase tracking-wider text-[10px]">
                BKK Network
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============ RIGHT — FORM ============ */}
      <div className="w-full lg:w-[55%] xl:w-1/2 flex flex-col bg-white">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-6 border-b border-outline-variant/30">
          <Link href="/" className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-display font-extrabold text-sm">
                V
              </span>
            </div>
            <span className="font-display text-lg font-extrabold tracking-tight">
              Voc<span className="text-primary">AZ</span>
            </span>
          </Link>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-on-surface-variant">{subtitle}</p>
              )}
            </div>

            {/* Form */}
            {children}

            {/* Footer */}
            {footer && (
              <div className="mt-6 text-center text-sm text-on-surface-variant">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// SHARED FORM COMPONENTS
// ============================================

type FieldProps = {
  id: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  minLength?: number
  autoComplete?: string
}

export function FormField({
  id,
  label,
  type = 'text',
  placeholder,
  required,
  minLength,
  autoComplete,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 bg-white text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
      />
    </div>
  )
}

type AlertProps = {
  variant?: 'error' | 'success' | 'info'
  children: React.ReactNode
}

export function FormAlert({ variant = 'error', children }: AlertProps) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  }[variant]

  return (
    <div
      className={`px-4 py-3 rounded-xl border text-sm leading-relaxed ${styles}`}
    >
      {children}
    </div>
  )
}

type SubmitButtonProps = {
  isPending: boolean
  label: string
  loadingLabel: string
}

export function SubmitButton({
  isPending,
  label,
  loadingLabel,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display font-semibold py-3 px-6 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
    >
      {isPending && (
        <svg
          className="w-4 h-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      <span>{isPending ? loadingLabel : label}</span>
    </button>
  )
}