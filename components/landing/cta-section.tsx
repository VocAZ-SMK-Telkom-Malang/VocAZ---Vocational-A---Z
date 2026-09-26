import Link from 'next/link'
import { GraduationCap, ArrowRight, ArrowUpRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="w-full bg-gradient-to-r from-primary-container via-[#E03E3E] to-[#B70011] text-white py-20 relative overflow-hidden">
      {/* Ambient lights */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute left-10 -top-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-[1240px] mx-auto px-8 relative z-10 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/15 backdrop-blur-md mb-5 shadow-lg ring-1 ring-white/20">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>

        {/* Headline */}
        <h2 className="font-display text-3xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-[1.1]">
          Your Skills Deserve to Be Seen.
        </h2>

        {/* Subtext */}
        <p className="text-base lg:text-lg text-white/90 max-w-xl mx-auto mb-8 leading-relaxed">
          Build your profile. Showcase your talent. Connect with your future —
          starting today.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center gap-2 bg-white text-primary-container font-display font-semibold px-8 py-3 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.20)] hover:bg-[#FFF5F2] hover:scale-105 active:scale-95 transition-all"
          >
            <span>Join VocAZ</span>
            <ArrowRight className="w-[19px] h-[19px]" />
          </Link>

          <Link
            href="/talenta"
            className="inline-flex items-center gap-2 text-white font-display font-semibold px-8 py-3 rounded-full hover:bg-white/10 ring-1 ring-white/20 transition-colors"
          >
            <span>Explore Talents</span>
            <ArrowUpRight className="w-[19px] h-[19px]" />
          </Link>
        </div>
      </div>
    </section>
  )
}