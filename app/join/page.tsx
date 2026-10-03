// app/join/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { getDashboardPath } from '@/lib/auth/redirects'
import {
  GraduationCap,
  Building2,
  Landmark,
  BadgeCheck,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'

export const metadata = {
  title: 'Pilih Role Pendaftaran - VocAZ',
  description:
    'Bergabung dengan ekosistem VocAZ. Pilih peran sebagai Siswa, Perusahaan, Sekolah, atau Lembaga Sertifikasi.',
}

const ROLES = [
  {
    id: 'student',
    title: 'Siswa & Alumni SMK',
    subtitle: 'Talenta Muda & Vokasi',
    description:
      'Pamerkan skill nyata, portofolio karya, video showcase, dan raih sertifikasi BNSP untuk dilirik perusahaan impian.',
    href: '/register/student/1',
    icon: GraduationCap,
    popular: true,
    accentColor: 'from-[#B70011] to-[#E03E3E]',
    badgeBg: 'bg-primary/10 text-primary border-primary/20',
    features: [
      'Portofolio digital & Video Showcase',
      'Verifikasi sertifikat BNSP',
      'Terhubung langsung dengan rekruter',
    ],
  },
  {
    id: 'company',
    title: 'Perusahaan & Industri',
    subtitle: 'Recruiter & DUDI',
    description:
      'Cari talenta vokasi terverifikasi tanpa menebak. Pasang lowongan kerja dan rekrut lulusan SMK sesuai kebutuhan industri.',
    href: '/register/company/1',
    icon: Building2,
    popular: false,
    accentColor: 'from-amber-600 to-amber-500',
    badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    features: [
      'Akses talent pool SMK terverifikasi',
      'Fitur Smart Match pelamar',
      'Posting lowongan & pipeline rekrutmen',
    ],
  },
  {
    id: 'school',
    title: 'Sekolah & BKK',
    subtitle: 'SMK Negeri & Swasta',
    description:
      'Kelola keterserapan alumni, pantau karier lulusan secara real-time, dan perluas jejaring kemitraan industri.',
    href: '/register/school/1',
    icon: Landmark,
    popular: false,
    accentColor: 'from-blue-600 to-cyan-600',
    badgeBg: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    features: [
      'Tracking keterserapan alumni',
      'Kemitraan industri terintegrasi',
      'Dashboard statistik BKK',
    ],
  },
  {
    id: 'certification',
    title: 'Lembaga Sertifikasi',
    subtitle: 'LSP / BNSP Partner',
    description:
      'Terbitkan dan verifikasi sertifikat kompetensi siswa secara resmi sehingga memiliki nilai validitas tinggi di mata industri.',
    href: '/register/certification/1',
    icon: BadgeCheck,
    popular: false,
    accentColor: 'from-emerald-600 to-teal-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    features: [
      'Validasi sertifikat digital',
      'Integrasi standar BNSP',
      'Rekap kompetensi siswa',
    ],
  },
]

export default async function JoinPage() {
  // Guard: Jika user sudah login, arahkan langsung ke dashboard sesuai role-nya
  const session = await getServerSession()
  if (session?.user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { neonAuthUserId: session.user.id },
      select: { role: true },
    })
    if (dbUser?.role) {
      redirect(getDashboardPath(dbUser.role))
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-on-surface flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -right-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link href="/" className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container to-[#B70011] flex items-center justify-center shadow-sm">
                <span className="text-white font-display font-extrabold text-sm leading-none">
                  V
                </span>
              </div>
              <span className="font-display text-lg font-extrabold tracking-tight">
                Voc<span className="text-primary">AZ</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-on-surface-variant">
              Sudah punya akun?
            </span>
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container-low hover:text-primary transition-all"
            >
              Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 w-full">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
              Pusat Pendaftaran VocAZ
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface mb-4">
            Bergabung dengan Ekosistem Vokasi Terbesar
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
            Pilih peran kamu di bawah ini untuk memulai pendaftaran akun dan mengakses fitur yang disesuaikan khusus untuk kebutuhanmu.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {ROLES.map((role) => {
            const Icon = role.icon
            return (
              <div
                key={role.id}
                className={`group relative bg-white rounded-3xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between ${
                  role.popular
                    ? 'border-primary/40 shadow-[0_12px_36px_rgba(183,0,17,0.12)] hover:shadow-[0_20px_48px_rgba(183,0,17,0.2)] hover:-translate-y-1'
                    : 'border-outline-variant/40 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-outline-variant'
                }`}
              >
                {role.popular && (
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#B70011] to-[#E03E3E] text-white font-mono text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Paling Populer
                  </div>
                )}

                <div>
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.accentColor} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span
                      className={`font-mono text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${role.badgeBg}`}
                    >
                      {role.subtitle}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="font-display text-xl sm:text-2xl font-bold text-on-surface mb-2">
                    {role.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6">
                    {role.description}
                  </p>

                  {/* Key Features */}
                  <ul className="space-y-2.5 mb-8">
                    {role.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-center gap-2 text-xs text-on-surface font-medium"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link
                  href={role.href}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-display text-xs sm:text-sm font-bold transition-all shadow-md group-hover:shadow-lg ${
                    role.popular
                      ? 'bg-gradient-to-r from-primary-container to-[#E03E3E] text-white hover:brightness-110 active:scale-98'
                      : 'bg-on-surface text-white hover:bg-primary active:scale-98'
                  }`}
                >
                  <span>Daftar Sekarang</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-white px-6 py-4 rounded-2xl border border-outline-variant/30 shadow-sm max-w-xl mx-auto">
            <span className="text-xs sm:text-sm text-on-surface-variant">
              Sudah memiliki akun terdaftar?
            </span>
            <Link
              href="/auth/sign-in"
              className="text-xs sm:text-sm font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Masuk Ke Akun Kamu</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-outline-variant/30 bg-white py-6 text-center text-xs text-on-surface-variant">
        <div className="max-w-[1240px] mx-auto px-4">
          © 2026 VocAZ. Ecosystem Karir & Talenta SMK Indonesia. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
