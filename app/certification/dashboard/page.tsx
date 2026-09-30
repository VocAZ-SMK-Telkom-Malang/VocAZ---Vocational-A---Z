// app/certification/dashboard/page.tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck,
  FileCheck,
  Users,
  Clock,
  ArrowRight,
  BadgeCheck,
  Award,
} from 'lucide-react'
import { getServerSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { LogoutButton } from '@/components/shared/logout-button'

export default async function CertificationDashboard() {
  const session = await getServerSession()
  if (!session?.user) redirect('/auth/sign-in')

  const user = await prisma.user.findUnique({
    where: { neonAuthUserId: session.user.id },
    include: {
      certInstitution: true,
    },
  })

  if (!user) redirect('/onboarding')
  if (user.role !== 'certification') redirect('/dashboard')

  const institution = user.certInstitution

  // Stats placeholder
  const [pendingCerts, verifiedCerts] = await Promise.all([
    institution
      ? prisma.verificationRequest.count({
        where: {
          institutionId: institution.id,
          status: 'pending',
        },
      })
      : 0,
    institution
      ? prisma.verificationRequest.count({
        where: {
          institutionId: institution.id,
          status: 'verified',
        },
      })
      : 0,
  ])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] via-[#FFF8F5] to-[#FAF8F5]">
      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-display font-extrabold text-sm">
                V
              </span>
            </div>
            <span className="font-display text-lg font-extrabold text-on-surface">
              Voc<span className="text-primary">AZ</span>
            </span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
              const validTypes = ['lsp_bnsp', 'industry']
            </span>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface mb-1">
            Selamat datang, {user.fullName} 👋
          </h1>
          <p className="text-sm text-on-surface-variant">
            Dashboard Lembaga Sertifikasi —{' '}
            <strong className="text-on-surface">
              {institution?.name || 'Nama lembaga'}
            </strong>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FileCheck}
            iconBg="bg-primary/10"
            iconColor="text-primary"
            value={String(pendingCerts)}
            label="Menunggu Verifikasi"
          />
          <StatCard
            icon={BadgeCheck}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-700"
            value={String(verifiedCerts)}
            label="Terverifikasi"
          />
          <StatCard
            icon={Users}
            iconBg="bg-blue-100"
            iconColor="text-blue-700"
            value="0"
            label="Talenta Terhubung"
          />
          <StatCard
            icon={Award}
            iconBg="bg-amber-100"
            iconColor="text-amber-700"
            value={institution?.licenseNumber ? '✓' : '—'}
            label="Lisensi Aktif"
          />
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Info lembaga */}
          <div className="bg-surface-container-lowest rounded-2xl ring-1 ring-outline-variant/30 p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-bold text-on-surface">
                Info Lembaga
              </h2>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Nama</dt>
                <dd className="font-semibold text-on-surface text-right">
                  {institution?.name || '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Tipe</dt>
                <dd className="font-semibold text-on-surface text-right">
                  {institution?.type === 'lsp_bnsp'
                    ? 'LSP BNSP'
                    : 'Industri & Pelatihan'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Nomor Lisensi</dt>
                <dd className="font-mono font-semibold text-on-surface text-right">
                  {institution?.licenseNumber || '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Status</dt>
                <dd>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                    <Clock className="w-3 h-3" />
                    Pending Review
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Next steps */}
          <div className="bg-surface-container-lowest rounded-2xl ring-1 ring-outline-variant/30 p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base font-bold text-on-surface">
                Langkah Selanjutnya
              </h2>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-on-surface">
                    Menunggu verifikasi admin
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Tim VocAZ akan meninjau lisensi Anda dalam 1-2 hari kerja.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-on-surface">
                    Mulai verifikasi sertifikat
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Setelah aktif, Anda bisa memverifikasi sertifikat siswa.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-semibold text-on-surface">
                    Terbitkan badge resmi
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Siswa akan mendapat badge {institution?.type === 'lsp_bnsp' ? '🏆 LSP-BNSP Verified' : '🔵 Industry Certified'}.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-primary-container via-primary to-tertiary-container p-6 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-bold mb-1">
                Verifikasi Sertifikat Siswa
              </h3>
              <p className="text-sm text-white/90">
                Fitur verifikasi akan aktif setelah akun Anda disetujui admin.
              </p>
            </div>
            <Link
              href="/certification/dashboard/verifications"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-display font-semibold text-sm shadow-md hover:bg-white/90 transition-all whitespace-nowrap"
            >
              <span>Lihat Verifikasi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
  value: string
  label: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl ring-1 ring-outline-variant/30 p-5">
      <div
        className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-3`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-display text-2xl font-extrabold text-on-surface mb-0.5">
        {value}
      </p>
      <p className="text-xs text-on-surface-variant">{label}</p>
    </div>
  )
}