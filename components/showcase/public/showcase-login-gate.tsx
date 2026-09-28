// components/showcase/public/showcase-login-gate.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Props = {
  totalReels: number
}

export function ShowcaseLoginGate({ totalReels }: Props) {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-[1240px] mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-primary via-primary-container to-tertiary p-6 lg:p-8 text-on-primary shadow-[0_12px_32px_rgba(183,0,17,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 text-center md:text-left max-w-xl">
            <h3 className="font-display text-xl lg:text-2xl font-bold tracking-tight">
              Ini baru sebagian dari {totalReels.toLocaleString('id-ID')}+ video
              showcase talenta SMK.
            </h3>
            <p className="text-sm text-white/90">
              Akses ribuan demonstrasi keterampilan nyata langsung dari siswa
              berprestasi yang terverifikasi BNSP &amp; BKK.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-primary hover:bg-white/90 font-display font-semibold text-sm shadow-sm transition-transform hover:scale-[1.03]"
            >
              <span>Join VocAZ untuk Tonton Semua</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/sign-in"
              className="w-full sm:w-auto text-center font-display font-semibold text-sm text-white hover:underline px-4 py-2"
            >
              Masuk Akun Perusahaan
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}