// components/showcase/public/showcase-cta-strip.tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Props = {
  totalReels: number
}

export function ShowcaseCtaStrip({ totalReels }: Props) {
  const formatted = totalReels >= 1000
    ? `${(totalReels / 1000).toFixed(1).replace('.0', '')}rb`
    : totalReels.toLocaleString('id-ID')

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-primary via-primary-container to-tertiary p-6 lg:p-8 text-on-primary shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1 text-center md:text-left max-w-xl">
            <h3 className="font-display text-xl lg:text-2xl font-bold tracking-tight">
              Ini baru sebagian dari {formatted}+ video showcase talenta SMK.
            </h3>
            <p className="text-sm text-on-primary-container/90">
              Akses ribuan demonstrasi keterampilan nyata langsung dari siswa
              berprestasi yang terverifikasi BNSP &amp; BKK.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-surface-container-lowest text-primary hover:bg-surface-bright font-display font-semibold text-sm shadow-sm transition-transform hover:scale-[1.03]"
            >
              <span>Join VocAZ untuk Tonton Semua</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/sign-in"
              className="w-full sm:w-auto text-center font-display font-semibold text-sm text-on-primary hover:underline px-4 py-2"
            >
              Masuk Akun Perusahaan
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}