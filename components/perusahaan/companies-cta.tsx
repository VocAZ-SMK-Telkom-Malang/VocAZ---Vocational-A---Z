// components/perusahaan/companies-cta.tsx
import Link from 'next/link'
import { Sparkles, ArrowRight, Handshake, MessageCircle } from 'lucide-react'

type Props = {
  totalCompanies: number
}

export function CompaniesCta({ totalCompanies }: Props) {
  return (
    <>
      {/* Marketing teaser band */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-surface-container-low rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm ring-1 ring-outline-variant/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed/60 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-tertiary" />
            </div>
            <div>
              <h4 className="font-display text-base font-bold text-on-surface mb-1">
                {totalCompanies}+ Perusahaan Lainnya Sudah Terhubung di VocAZ
              </h4>
              <p className="text-xs text-on-surface-variant max-w-xl leading-relaxed">
                Daftar kemitraan industri diperbarui secara berkala melalui
                koordinasi terpadu jejaring BKK dan LSP mitra industri
                se-Indonesia.
              </p>
            </div>
          </div>
          <Link
            href="/register/company/1"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-display font-semibold text-sm shadow-md hover:bg-primary-container hover:-translate-y-0.5 transition-all whitespace-nowrap shrink-0"
          >
            <span>Join VocAZ untuk Lihat Semua Perusahaan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="w-full px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-r from-primary-container via-primary to-tertiary-container py-12 md:py-16 text-white overflow-hidden shadow-lg">
            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-white font-mono text-[10px] font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
                <Handshake className="w-3.5 h-3.5" />
                Untuk Rekruter &amp; Pemimpin Industri
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
                Ingin Merekrut Talenta SMK Terbaik?
              </h2>
              <p className="text-sm sm:text-base text-white/90 max-w-2xl mb-8 leading-relaxed">
                Bergabung sebagai perusahaan mitra resmi dan temukan talenta
                yang siap kerja, bersertifikat BNSP, serta teruji lewat video
                portfolio nyata tanpa repot.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                <Link
                  href="/register/company/1"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-primary font-display font-semibold shadow-xl hover:bg-white/90 transition-all"
                >
                  <span>Daftar sebagai Perusahaan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-transparent hover:bg-white/10 text-white font-display font-semibold transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konsultasi Kemitraan BKK</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}