import {
  Landmark,
  Network,
  BadgeCheck,
  Building2,
  CheckCircle2,
} from 'lucide-react'

const leftItems = [
  'Sinkronisasi Dapodik',
  'Kurikulum Teaching Factory',
  'Tracer study real-time',
]

const rightItems = [
  'Standar SKKNI Teruji',
  'Registrasi Asesor Resmi',
  'Digital micro-badge verified',
]

export function EcosystemSection() {
  return (
    <section className="w-full bg-[#FDFBF7] py-20 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-tertiary-container/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-8 relative">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary font-bold bg-[#FFEAE5] px-3 py-1 rounded-full">
            Infrastruktur Karir Terhubung
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-on-surface mt-3 mb-2">
            A Connected Career Journey
          </h2>
          <p className="text-on-surface-variant">
            Every student, school, company, and certifier moves together —
            inside one living ecosystem.
          </p>
        </div>

        {/* Diagram */}
        <div className="relative w-full max-w-5xl mx-auto">
          {/* SVG Connector — Desktop only */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden md:block"
            fill="none"
            viewBox="0 0 1000 500"
            preserveAspectRatio="none"
          >
            {/* Hub ke kiri atas */}
            <path
              d="M 500 250 C 380 250, 320 120, 220 120"
              opacity="0.5"
              stroke="#FF5757"
              strokeDasharray="6 4"
              strokeWidth="2"
            />
            {/* Hub ke kanan atas */}
            <path
              d="M 500 250 C 620 250, 680 120, 780 120"
              opacity="0.5"
              stroke="#F59E0B"
              strokeDasharray="6 4"
              strokeWidth="2"
            />
            {/* Hub ke bawah */}
            <path
              d="M 500 250 C 500 340, 500 380, 500 420"
              opacity="0.5"
              stroke="#E03E3E"
              strokeDasharray="6 4"
              strokeWidth="2"
            />

            {/* Animated dots di path */}
            <circle cx="360" cy="180" r="4" fill="#FF5757">
              <animate
                attributeName="opacity"
                dur="2s"
                repeatCount="indefinite"
                values="0.2;1;0.2"
              />
            </circle>
            <circle cx="640" cy="180" r="4" fill="#F59E0B">
              <animate
                attributeName="opacity"
                dur="2s"
                repeatCount="indefinite"
                values="1;0.2;1"
              />
            </circle>
            <circle cx="500" cy="340" r="4" fill="#E03E3E">
              <animate
                attributeName="opacity"
                dur="1.5s"
                repeatCount="indefinite"
                values="0.3;1;0.3"
              />
            </circle>
          </svg>

          {/* Grid Layout */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-center">
            {/* ====== LEFT NODE: SMK & BKK ====== */}
            <div className="bg-white p-5 rounded-2xl shadow-[0_8px_24px_rgba(183,0,17,0.08)] border-l-4 border-l-primary hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-lg bg-[#FFF0EB] flex items-center justify-center text-primary mb-3">
                <Landmark className="w-5 h-5" />
              </div>
              <h4 className="font-display text-base font-bold text-on-surface mb-2">
                SMK & BKK Mitra
              </h4>
              <ul className="text-xs text-on-surface-variant space-y-1.5">
                {leftItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ====== CENTER HUB ====== */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative group">
                {/* Pulse rings */}
                <span className="absolute -inset-6 rounded-3xl bg-primary-container/15 blur-2xl animate-pulse" />
                <span className="absolute -inset-2 rounded-3xl bg-primary-container/10 blur-lg" />

                {/* Main hub card */}
                <div className="relative bg-gradient-to-br from-primary-container to-[#B70011] text-white p-6 rounded-3xl shadow-[0_20px_50px_rgba(220,38,38,0.35)] text-center max-w-xs group-hover:scale-105 transition-transform">
                  <div className="w-14 h-14 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 text-white ring-4 ring-white/10">
                    <Network className="w-7 h-7" />
                  </div>
                  <h3 className="font-display text-lg font-extrabold mb-2 leading-tight">
                    Talenta Siswa & Alumni SMK
                  </h3>
                  <p className="text-xs text-white/90 leading-relaxed">
                    Pusat gravitasi ekosistem dengan e-Portofolio terotentikasi
                    & micro-credential terpadu.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FEF3C7] animate-pulse" />
                    <span>Live Connected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ====== RIGHT NODE: LSP & BNSP ====== */}
            <div className="bg-white p-5 rounded-2xl shadow-[0_8px_24px_rgba(183,0,17,0.08)] border-r-4 border-r-tertiary-container hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#B45309] mb-3">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display text-base font-bold text-on-surface mb-2">
                LSP & BNSP Partner
              </h4>
              <ul className="text-xs text-on-surface-variant space-y-1.5">
                {rightItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ====== BOTTOM NODE: MITRA INDUSTRI ====== */}
          <div className="mt-8 flex justify-center relative z-10">
            <div className="bg-white p-5 rounded-2xl shadow-[0_8px_24px_rgba(183,0,17,0.08)] border-b-4 border-b-primary-container max-w-md w-full hover:-translate-y-1 transition-transform">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-[#FFF0EB] flex items-center justify-center text-primary">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-bold text-on-surface mb-1">
                    Mitra Industri Terdaftar
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <span className="font-bold text-primary">1.250+</span>{' '}
                    perusahaan membuka rekrutmen langsung, program beasiswa, dan
                    kontrak kerja bergaransi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}