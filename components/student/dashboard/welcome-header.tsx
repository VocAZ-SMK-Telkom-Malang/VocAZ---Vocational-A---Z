// components/student/dashboard/welcome-header.tsx
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

type Props = {
  fullName: string | null
  profileCompletion: number
}

export function WelcomeHeader({ fullName, profileCompletion }: Props) {
  const firstName = fullName?.split(' ')[0] || 'Siswa'
  const needCompletion = profileCompletion < 80

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-[#E03E3E] to-[#B70011] text-white p-6 sm:p-8">
      {/* Ambient */}
      <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20 mb-3">
            <Sparkles className="w-3 h-3" />
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">
              Selamat datang kembali
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight mb-1.5">
            Halo, {firstName} 👋
          </h1>

          <p className="text-sm text-white/85 leading-relaxed max-w-xl">
            {needCompletion
              ? 'Lengkapi profilmu untuk meningkatkan peluang direkrut hingga 5x lebih besar.'
              : 'Profilmu sudah lengkap. Saatnya cari lowongan yang cocok!'}
          </p>
        </div>

        {/* Profile completion */}
        <div className="bg-white/10 backdrop-blur-md ring-1 ring-white/20 rounded-xl p-4 sm:min-w-[200px]">
          <p className="font-mono text-[10px] uppercase tracking-wider font-bold text-white/80 mb-2">
            Kelengkapan Profil
          </p>
          <div className="flex items-end gap-2 mb-2">
            <span className="font-display text-3xl font-extrabold leading-none">
              {profileCompletion}
            </span>
            <span className="text-white/70 text-sm mb-0.5">%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
          {needCompletion && (
            <Link
              href="/student/profile/personal"
              className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-white hover:gap-2 transition-all"
            >
              <span>Lengkapi sekarang</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}