import Link from 'next/link'
import Image from 'next/image'

const footerColumns = [
  {
    title: 'Platform',
    items: [
      { label: 'Talenta SMK', href: '/talenta' },
      { label: 'Video Talent Showcase', href: '/showcase' },
      { label: 'Lowongan Kerja', href: '/lowongan' },
      { label: 'Perusahaan Mitra', href: '/perusahaan' },
    ],
  },
  {
    title: 'Untuk',
    items: [
      { label: 'Siswa & Alumni SMK', href: '/register/student/1' },
      { label: 'Perusahaan & Recruiter', href: '/register/company/1' },
      { label: 'Sekolah & BKK', href: '/register/school/1' },
      { label: 'Lembaga Sertifikasi', href: '/register/certification/1' },
    ],
  },
  {
    title: 'Legalitas',
    items: [
      { label: 'Kebijakan Privasi', href: '#' },
      { label: 'Syarat & Ketentuan', href: '#' },
      { label: 'Standar Verifikasi BNSP', href: '#' },
      { label: 'Integritas Data BKK', href: '#' },
    ],
  },
  {
    title: 'Kontak',
    items: [
      { label: 'vocaz@gmail.com', href: '#' },
      { label: 'Kota Malang, Jawa Timur', href: '#' },
      { label: '@VocationalA-Z', href: '#' },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="w-full bg-[#3D0C11] text-white">
      <div className="max-w-[1240px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 mb-12">
          <div className="lg:col-span-4 space-y-4 pr-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/vocaz.png"
                alt="VocAZ"
                width={120}
                height={28}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
            <p className="text-sm text-white/70 max-w-sm">
              Smart Career & Talent Ecosystem for SMK.
              Menghubungkan talenta SMK dengan industri melalui kompetensi yang dapat dilihat,ditemukan, dan dipercaya.

            </p>
            <div className="flex items-center gap-2 pt-2">
              <div className="px-3 py-1 rounded-full bg-white/10 text-tertiary-fixed font-mono text-[11px] font-bold uppercase tracking-wider">
                Talenta SMK
              </div>
              <div className="px-3 py-1 rounded-full bg-white/10 text-white/70 font-mono text-[11px] font-bold uppercase tracking-wider">
                Perusahaan & Recruiter
              </div>
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title} className="lg:col-span-2 space-y-3">
              <h4 className="font-display text-sm text-tertiary-fixed-dim uppercase tracking-wider font-semibold">
                {col.title}
              </h4>
              <ul className="space-y-2 text-sm text-white/70">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="hover:text-tertiary-fixed transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © 2026 VocAZ Ecosystem. Seluruh hak cipta dilindungi undang-undang.
          </p>
          <p className="text-xs text-tertiary-fixed-dim/80">
            Memberdayakan Generasi Emas SMK Indonesia
          </p>
        </div>
      </div>
    </footer>
  )
}