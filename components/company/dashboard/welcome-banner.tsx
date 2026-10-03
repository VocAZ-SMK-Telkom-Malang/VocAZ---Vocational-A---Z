// components/company/dashboard/welcome-banner.tsx
import { Sparkles, Users } from 'lucide-react'

type Props = {
  userName: string
  companyName: string
  newApplicantsToday: number
  talentPool: number
  verificationStatus: string
}

export function WelcomeBanner({
  userName,
  companyName,
  newApplicantsToday,
  talentPool,
  verificationStatus,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary to-primary-container p-6 md:p-8 text-white shadow-[0_8px_32px_rgba(183,0,17,0.20)]">
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm font-mono text-[10px] uppercase tracking-wider font-bold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Selamat Datang Kembali
          </span>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Halo, {userName} 👋
          </h1>

          <p className="text-sm md:text-base text-white/90 max-w-2xl">
            {newApplicantsToday > 0
              ? `Ada ${newApplicantsToday} pelamar baru hari ini di ${companyName}. Saatnya review pipeline.`
              : `Belum ada pelamar baru hari ini di ${companyName}. Cek lowongan aktif & smart match.`}
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 min-w-[180px]">
            <div className="flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-white/70" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/70 font-bold">
                Total Talent Pool
              </span>
            </div>
            <div className="text-2xl font-extrabold">
              {talentPool.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-white/70 mt-0.5">
              kandidat {verificationStatus === 'verified' ? 'terverifikasi' : 'terdaftar'}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}