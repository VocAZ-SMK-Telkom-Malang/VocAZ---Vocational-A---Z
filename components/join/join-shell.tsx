import Link from 'next/link'
import { GraduationCap, ShieldCheck, Sparkles, Users } from 'lucide-react'

type Props = {
  children: React.ReactNode
}

export function JoinShell({ children }: Props) {
  return (
    <div className="min-h-screen flex bg-surface">
      {/* ============ LEFT — BRANDING ============ */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] relative overflow-hidden bg-gradient-to-br from-primary-container via-[#E03E3E] to-[#B70011] text-white">
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
                Bergabung dengan VocAZ
              </span>
            </div>

            <h1 className="font-display text-3xl xl:text-4xl font-extrabold leading-[1.15] tracking-tight mb-4">
              Pilih peran kamu dan mulai{' '}
              <span className="text-white/95">perjalanan karier</span> yang
              lebih baik.
            </h1>

            <p className="text-base text-white/85 leading-relaxed mb-8">
              Satu ekosistem untuk talenta SMK, perusahaan, sekolah, dan
              lembaga sertifikasi.
            </p>

            <ul className="space-y-3">
              {[
                'Profil & portofolio terverifikasi BNSP',
                'Terhubung langsung dengan industri',
                'Kontrol penuh atas data karier kamu',
              ].map((feature) => (
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

      {/* ============ RIGHT — CONTENT ============ */}
      <div className="w-full lg:w-[55%] xl:w-[52%] flex flex-col bg-white">
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

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </div>
    </div>
  )
}