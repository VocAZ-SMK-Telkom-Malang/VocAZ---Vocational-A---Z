import Link from 'next/link'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { RegisterShell } from '@/components/register/register-shell'
import { REGISTER_STEPS } from '@/lib/register/steps'

export function Step4Done() {
  return (
    <RegisterShell
      role="company"
      steps={REGISTER_STEPS.company}
      currentStep={4}
      title="Pendaftaran Berhasil Dikirim!"
      description="Akun perusahaan Anda telah berhasil dibuat dan permintaan verifikasi telah dikirimkan."
      backHref="/"
    >
      <div className="space-y-6">
        {/* Success icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />
          </div>
        </div>

        {/* Info box */}
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <span className="text-sm">⏳</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface mb-1">
                Under Review
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Tim verifikasi kami akan meninjau informasi perusahaan Anda
                dalam 1-2 hari kerja.
              </p>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div>
          <h3 className="font-display text-sm font-bold text-on-surface mb-3">
            Apa langkah selanjutnya?
          </h3>
          <ul className="space-y-2.5 text-xs text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                01
              </span>
              <span>Review — Tim VocAZ meninjau informasi perusahaan Anda</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                02
              </span>
              <span>Verification — Verifikasi dilakukan oleh tim resmi VocAZ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                03
              </span>
              <span>Start Recruiting — Anda bisa mulai posting lowongan</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/company/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-container to-[#E03E3E] text-white font-display text-sm font-semibold px-6 py-3 rounded-full shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:brightness-105 transition-all"
          >
            <span>Menuju Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-full ring-1 ring-outline-variant text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </RegisterShell>
  )
}