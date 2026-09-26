import Link from 'next/link'
import { GraduationCap, Building2, Landmark, BadgeCheck, LogIn } from 'lucide-react'
import { JoinShell } from '@/components/join/join-shell'
import { RoleCard } from '@/components/join/role-card'

const roles = [
  {
    href: '/register/student',
    title: 'Siswa & Alumni SMK',
    description:
      'Bangun profil, showcase kemampuan lewat video, dan temukan peluang karier terbaik.',
    icon: GraduationCap,
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
  },
  {
    href: '/register/company',
    title: 'Perusahaan & Recruiter',
    description:
      'Temukan talenta SMK terverifikasi dengan Smart Talent Match dan rekrut lebih cepat.',
    icon: Building2,
    iconBg: 'bg-tertiary-fixed',
    iconColor: 'text-tertiary',
  },
  {
    href: '/register/school',
    title: 'SMK & BKK',
    description:
      'Monitor siswa, hubungkan dengan industri, dan pantau penempatan kerja secara real-time.',
    icon: Landmark,
    iconBg: 'bg-[#FEF3C7]',
    iconColor: 'text-[#B45309]',
  },
  {
    href: '/register/certification',
    title: 'Lembaga Sertifikasi',
    description:
      'Verifikasi sertifikat siswa dan berikan badge resmi yang dipercaya industri.',
    icon: BadgeCheck,
    iconBg: 'bg-[#FCE7F3]',
    iconColor: 'text-[#9D174D]',
  },
]

export default function JoinPage() {
  return (
    <JoinShell>
      <div>
        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
            Selamat Datang di VocAZ
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Silakan pilih peran Anda untuk melanjutkan dan membuat akun baru.
          </p>
        </div>

        {/* Role cards */}
        <div className="space-y-3 mb-8">
          {roles.map((role) => (
            <RoleCard
              key={role.href}
              href={role.href}
              title={role.title}
              description={role.description}
              icon={role.icon}
              iconBg={role.iconBg}
              iconColor={role.iconColor}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/30" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-on-surface-variant font-mono uppercase tracking-wider">
              atau
            </span>
          </div>
        </div>

        {/* Login link */}
        <Link
          href="/auth/sign-in"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full ring-1 ring-outline-variant/50 text-on-surface font-display font-semibold hover:bg-surface-container-low transition-colors"
        >
          <LogIn className="w-4 h-4" />
          <span>Sudah punya akun? Masuk</span>
        </Link>

        {/* Terms */}
        <p className="text-center text-xs text-on-surface-variant mt-6 leading-relaxed">
          Dengan mendaftar, kamu menyetujui{' '}
          <Link href="#" className="text-primary hover:underline font-medium">
            Syarat & Ketentuan
          </Link>{' '}
          dan{' '}
          <Link href="#" className="text-primary hover:underline font-medium">
            Kebijakan Privasi
          </Link>{' '}
          VocAZ.
        </p>
      </div>
    </JoinShell>
  )
}