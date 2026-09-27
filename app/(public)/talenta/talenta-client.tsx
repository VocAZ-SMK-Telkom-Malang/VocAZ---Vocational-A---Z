'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Search,
  Users,
  Terminal,
  Landmark,
  ShieldCheck,
} from 'lucide-react'
import { LandingHeader } from '@/components/landing/header'
import { LandingFooter } from '@/components/landing/footer'
import { TalentCard } from '@/components/talenta/talent-card'
import { TalentPreviewModal } from '@/components/talenta/talent-preview-modal'

type Talent = {
  id: string
  name: string
  initials: string
  headline: string
  city: string | null
  province: string | null
  avatarUrl: string | null
  school: string
  major: string
  graduationYear: number | null
  isVerified: boolean
  skills: string[]
  video: {
    id: string
    title: string
    category: string | null
    duration: number | null
    durationFormatted: string
    thumbnailUrl: string | null
    videoUrl: string
  } | null
}

type Props = {
  result: {
    talents: Talent[]
    pagination: {
      currentPage: number
      totalPages: number
      totalItems: number
      pageSize: number
    }
  }
  stats: {
    totalTalents: number
    totalSchools: number
    totalSkills: number
  }
}

const PROGRAMS = [
  { value: 'all', label: 'Semua Jurusan' },
  { value: 'RPL', label: 'Rekayasa Perangkat Lunak & AI' },
  { value: 'Mekatronika', label: 'Mekatronika & Robotika' },
  { value: 'TKJ', label: 'Teknik Komputer & Jaringan' },
  { value: 'DKV', label: 'Desain Komunikasi Visual & 3D' },
  { value: 'TKR/EV', label: 'Teknik Kendaraan Listrik (EV)' },
  { value: 'Animasi', label: 'Animasi' },
  { value: 'Teknik Mesin', label: 'Teknik Mesin' },
  { value: 'Elektronika', label: 'Elektronika' },
]

// ============================================
// COMPONENT
// ============================================

export function TalentaClient({ result, stats }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [activeProgram, setActiveProgram] = useState(
    searchParams.get('program') || 'all'
  )
  const [previewTalent, setPreviewTalent] = useState<Talent | null>(null)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateURL({ search })
  }

  function handleProgramChange(program: string) {
    setActiveProgram(program)
    updateURL({ program: program === 'all' ? '' : program })
  }

  function updateURL(overrides: {
    search?: string
    program?: string
    page?: string
  }) {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(overrides).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    params.delete('page')
    router.push(`/talenta?${params.toString()}`)
  }

  return (
    <>
      <LandingHeader />

      <main className="w-full pt-20 bg-surface min-h-screen">
        {/* HERO */}
        <section className="relative w-full py-16 md:py-24 overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FFF8F5] to-[#FAF8F5]">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -right-24 w-72 h-72 bg-tertiary-fixed/30 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm">
              <ShieldCheck className="w-4 h-4 text-primary-container" />
              <span className="font-mono text-[11px] tracking-wider uppercase font-bold text-on-surface">
                Etalase Talenta Vokasi Terverifikasi Nasional
              </span>
            </div>

            <h1 className="mt-6 font-display text-4xl md:text-6xl font-extrabold text-on-surface max-w-4xl tracking-tight leading-[1.08]">
              Real Skills. Real Students.{' '}
              <span className="bg-gradient-to-r from-primary-container via-primary to-tertiary-container bg-clip-text text-transparent">
                Real Proof.
              </span>
            </h1>

            <p className="mt-4 text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Setiap profil di sini didukung oleh rekaman proyek riil, validasi
              kompetensi BKK sekolah, dan sertifikasi BNSP resmi — bukan
              sekadar klaim resume.
            </p>

            <div className="mt-10 w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-3xl md:rounded-full px-6 py-4 shadow-md flex flex-wrap md:flex-nowrap items-center justify-between gap-y-4">
              <StatItem
                icon={Users}
                color="bg-primary-fixed/40 text-primary-container"
                value={`${stats.totalTalents.toLocaleString('id-ID')}+`}
                label="Verified Talents"
              />
              <Divider />
              <StatItem
                icon={Terminal}
                color="bg-tertiary-fixed/50 text-tertiary"
                value={`${stats.totalSkills}+`}
                label="Skill Categories"
              />
              <Divider />
              <StatItem
                icon={Landmark}
                color="bg-secondary-fixed/50 text-secondary"
                value={`${stats.totalSchools}+`}
                label="Mitra SMK & BKK"
              />
              <Divider />
              <StatItem
                icon={ShieldCheck}
                color="bg-primary-fixed/40 text-primary"
                value="100%"
                label="Validasi BNSP"
              />
            </div>
          </div>
        </section>

        {/* SEARCH & FILTER */}
        <section className="w-full pb-8">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-4">
            <form
              onSubmit={handleSearch}
              className="w-full max-w-3xl mx-auto bg-white rounded-full p-1 shadow-md flex items-center focus-within:shadow-[0_8px_24px_rgba(220,38,38,0.14)] transition-shadow"
            >
              <div className="pl-4 text-on-surface-variant shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari talenta, keahlian, atau nama SMK..."
                className="w-full bg-transparent px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 px-6 py-2 rounded-full bg-gradient-to-r from-primary-container to-primary text-white text-sm font-bold shadow-sm hover:opacity-95 transition-all active:scale-95"
              >
                Cari
              </button>
            </form>

            <div className="flex items-center gap-2 overflow-x-auto w-full pb-2">
              {PROGRAMS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handleProgramChange(p.value)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeProgram === p.value
                      ? 'bg-primary-container text-white font-semibold shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* TALENT GRID */}
        <section className="w-full pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {result.talents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-outline-variant/30 py-16 text-center">
                <Users className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
                <p className="text-on-surface-variant text-sm">
                  Tidak ada talenta ditemukan. Coba ubah filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.talents.map((talent) => (
                  <TalentCard
                    key={talent.id}
                    talent={talent}
                    onPreview={() => setPreviewTalent(talent)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4: GATE CTA */}
        <section className="w-full pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="relative bg-gradient-to-br from-surface-container-low via-white to-surface-container rounded-3xl p-8 md:p-12 shadow-lg overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl flex flex-col gap-2 text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 text-primary-container font-mono text-[10px] font-bold uppercase tracking-wider self-center md:self-start">
                  🔓 Akses Direktori Lengkap
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
                  Ini baru sebagian kecil.{' '}
                  <span className="text-primary-container">
                    3.500+ talenta lainnya
                  </span>{' '}
                  menunggu untuk ditemukan.
                </h2>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Dapatkan akses tanpa batas ke direktori lengkap, demonstrasi
                  video proyek riil beresolusi tinggi, hasil uji kompetensi
                  asesor, dan portofolio terverifikasi LSP-BNSP.
                </p>
              </div>

              <div className="relative z-10 flex flex-col items-center md:items-end gap-3 shrink-0 w-full md:w-auto">
                <Link
                  href="/join"
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary-container to-primary text-white font-display text-sm font-bold shadow-[0_8px_20px_rgba(220,38,38,0.25)] hover:opacity-95 transition-all"
                >
                  <span>Join VocAZ untuk Lihat Semua</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/auth/sign-in"
                  className="text-xs text-on-surface-variant hover:text-primary transition-colors"
                >
                  Sudah punya akun?{' '}
                  <span className="font-semibold underline decoration-primary-container decoration-2 underline-offset-4">
                    Masuk di sini
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: CLOSING CTA */}
        <section className="w-full py-12 bg-gradient-to-r from-primary-container to-primary text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="flex flex-col gap-2 max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
                Punya Bakat Seperti Mereka?
              </h2>
              <p className="text-base text-white/90 leading-relaxed">
                Buat profilmu dan jadi bagian dari talenta vokasi terpercaya
                yang diincar langsung oleh industri nasional terkemuka.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-2 text-xs text-white/80">
                <span>✓ Gratis untuk siswa & alumni SMK</span>
                <span>•</span>
                <span>✓ Terverifikasi sekolah BKK & BNSP</span>
              </div>
            </div>

            <Link
              href="/join"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-primary-container hover:bg-surface-bright font-display text-sm font-bold shadow-[0_8px_25px_rgba(0,0,0,0.15)] transition-all shrink-0"
            >
              <span>✨</span>
              <span>Buat Profil Sekarang</span>
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />

      {/* PREVIEW MODAL */}
      <TalentPreviewModal
        talent={previewTalent}
        onClose={() => setPreviewTalent(null)}
      />
    </>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatItem({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  color: string
  value: string
  label: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 flex-1 justify-center md:justify-start">
      <div
        className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shrink-0`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-left">
        <p className="font-display text-xl font-extrabold text-on-surface leading-tight">
          {value}
        </p>
        <p className="text-xs text-on-surface-variant">{label}</p>
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div className="hidden md:block w-px h-8 bg-surface-container-highest" />
  )
}